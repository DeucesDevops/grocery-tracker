#!/usr/bin/env bash
# Install Prometheus + Grafana on the EKS cluster
# Prerequisites: helm, kubectl configured for the EKS cluster

set -euo pipefail

NAMESPACE="monitoring"

echo "==> Adding Helm repositories..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

echo "==> Installing kube-prometheus-stack (Prometheus + Alertmanager + node-exporter)..."
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace "${NAMESPACE}" \
  --create-namespace \
  --values "$(dirname "$0")/prometheus-values.yaml" \
  --wait \
  --timeout 5m

echo "==> Installing Grafana..."
helm upgrade --install grafana grafana/grafana \
  --namespace "${NAMESPACE}" \
  --values "$(dirname "$0")/grafana-values.yaml" \
  --wait \
  --timeout 3m

echo ""
echo "==> Done!"
echo ""
echo "==> Get the Grafana URL:"
echo "    kubectl get svc grafana -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'"
echo ""
echo "==> Get the Grafana admin password:"
echo "    kubectl get secret grafana -n ${NAMESPACE} -o jsonpath='{.data.admin-password}' | base64 -d"
