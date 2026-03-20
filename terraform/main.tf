terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
  }

  # Remote state in S3 with DynamoDB locking
  backend "s3" {
    bucket         = "grocery-tracker-tfstate"
    key            = "eks/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "grocery-tracker-tfstate-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

# Retrieve EKS auth token so the kubernetes/helm providers can connect
data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_name
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

# ── Modules ────────────────────────────────────────────────────────────────

module "vpc" {
  source = "./modules/vpc"

  cluster_name    = var.cluster_name
  aws_region      = var.aws_region
  vpc_cidr        = var.vpc_cidr
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets
}

module "eks" {
  source = "./modules/eks"

  cluster_name            = var.cluster_name
  cluster_version         = var.cluster_version
  vpc_id                  = module.vpc.vpc_id
  private_subnets         = module.vpc.private_subnets
  node_instance_types     = var.node_instance_types
  node_group_min_size     = var.node_group_min_size
  node_group_max_size     = var.node_group_max_size
  node_group_desired_size = var.node_group_desired_size
}

module "ecr" {
  source = "./modules/ecr"

  repository_names = [var.ecr_api_repo_name, var.ecr_web_repo_name]
  images_to_keep   = var.ecr_images_to_keep
}

module "iam" {
  source = "./modules/iam"

  role_name           = "${var.cluster_name}-github-actions"
  github_repositories = var.github_repositories
  ecr_repository_arns = values(module.ecr.repository_arns)
  cluster_arn         = module.eks.cluster_arn
  aws_region          = var.aws_region
}
