module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  cluster_endpoint_public_access = true

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  # Enable IRSA (IAM Roles for Service Accounts) — required for pods to access AWS APIs
  enable_irsa = true

  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  eks_managed_node_groups = {
    default = {
      name = "${var.cluster_name}-nodes"

      instance_types = var.node_instance_types

      min_size     = var.node_group_min_size
      max_size     = var.node_group_max_size
      desired_size = var.node_group_desired_size

      # Use AL2023 for latest security patches
      ami_type = "AL2023_x86_64_STANDARD"

      # Disk size for container images
      disk_size = 50

      labels = {
        role = "worker"
      }
    }
  }

  # Allow cluster admin access from the current caller
  enable_cluster_creator_admin_permissions = true
}

# ECR repositories for storing Docker images
resource "aws_ecr_repository" "api" {
  name                 = var.ecr_api_repo_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_ecr_repository" "web" {
  name                 = var.ecr_web_repo_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}

# ECR lifecycle policy — keep last 10 images to control storage costs
resource "aws_ecr_lifecycle_policy" "api" {
  repository = aws_ecr_repository.api.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = {
        type = "expire"
      }
    }]
  })
}

resource "aws_ecr_lifecycle_policy" "web" {
  repository = aws_ecr_repository.web.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = {
        type = "expire"
      }
    }]
  })
}

# IAM role for GitHub Actions OIDC — allows CI to push to ECR without static credentials
module "github_actions_oidc_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-github-actions"
  version = "~> 5.0"

  role_name = "grocery-tracker-github-actions"

  github_repositories = ["YOUR_ORG/grocery-tracker"]

  attach_admin_policy = false

  inline_policy_statements = [
    {
      sid = "ECRAccess"
      actions = [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage",
      ]
      resources = [
        aws_ecr_repository.api.arn,
        aws_ecr_repository.web.arn,
        "arn:aws:ecr:${var.aws_region}:*:authorizationToken",
      ]
    },
    {
      sid       = "EKSAccess"
      actions   = ["eks:DescribeCluster"]
      resources = [module.eks.cluster_arn]
    },
  ]
}
