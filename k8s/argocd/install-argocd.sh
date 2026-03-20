#!/usr/bin/env bash
# Install ArgoCD on the EKS cluster and configure it for grocery-tracker
# Run this once after the cluster is provisioned with Terraform
# Prerequisites: kubectl configured to connect to the EKS cluster

set -euo pipefail

ARGOCD_VERSION="v2.10.0"
NAMESPACE="argocd"

echo "==> Creating ArgoCD namespace..."
kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

echo "==> Installing ArgoCD ${ARGOCD_VERSION}..."
kubectl apply -n "${NAMESPACE}" \
  -f "https://raw.githubusercontent.com/argoproj/argo-cd/${ARGOCD_VERSION}/manifests/install.yaml"

echo "==> Waiting for ArgoCD pods to be ready..."
kubectl wait --for=condition=available deployment/argocd-server \
  -n "${NAMESPACE}" --timeout=180s

echo "==> Patching argocd-server to use LoadBalancer (for external access)..."
kubectl patch svc argocd-server -n "${NAMESPACE}" \
  -p '{"spec": {"type": "LoadBalancer"}}'

echo "==> Registering grocery-tracker Application..."
kubectl apply -f "$(dirname "$0")/application.yaml"

echo ""
echo "==> Done! Retrieve the initial admin password with:"
echo "    kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d"
echo ""
echo "==> Get the ArgoCD UI URL with:"
echo "    kubectl get svc argocd-server -n argocd -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'"
