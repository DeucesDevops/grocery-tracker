variable "aws_region" {
  description = "AWS region where all resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "grocery-tracker-cluster"
}

variable "cluster_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.29"
}

# ── VPC ───────────────────────────────────────────────────────────────────

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnets" {
  description = "CIDR blocks for private subnets (worker nodes)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnets" {
  description = "CIDR blocks for public subnets (load balancers)"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

# ── EKS node group ────────────────────────────────────────────────────────

variable "node_instance_types" {
  description = "EC2 instance types for the EKS managed node group"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_group_min_size" {
  description = "Minimum number of nodes"
  type        = number
  default     = 1
}

variable "node_group_max_size" {
  description = "Maximum number of nodes"
  type        = number
  default     = 5
}

variable "node_group_desired_size" {
  description = "Desired number of nodes"
  type        = number
  default     = 2
}

# ── ECR ───────────────────────────────────────────────────────────────────

variable "ecr_api_repo_name" {
  description = "ECR repository name for the API image"
  type        = string
  default     = "grocery-tracker-api"
}

variable "ecr_web_repo_name" {
  description = "ECR repository name for the web image"
  type        = string
  default     = "grocery-tracker-web"
}

variable "ecr_images_to_keep" {
  description = "Number of images to retain per ECR repository"
  type        = number
  default     = 10
}

# ── IAM ───────────────────────────────────────────────────────────────────

variable "github_repositories" {
  description = "GitHub repos allowed to assume the CI IAM role (format: ORG/REPO)"
  type        = list(string)
  default     = ["YOUR_ORG/grocery-tracker"]
}

# ── Common ────────────────────────────────────────────────────────────────

variable "tags" {
  description = "Common tags applied to all resources via the AWS provider default_tags"
  type        = map(string)
  default = {
    Project   = "grocery-tracker"
    ManagedBy = "terraform"
  }
}
