variable "role_name" {
  description = "Name of the IAM role for GitHub Actions"
  type        = string
  default     = "grocery-tracker-github-actions"
}

variable "github_repositories" {
  description = "GitHub repos allowed to assume this role (format: ORG/REPO)"
  type        = list(string)
}

variable "ecr_repository_arns" {
  description = "ECR repository ARNs the role is allowed to push images to"
  type        = list(string)
}

variable "cluster_arn" {
  description = "EKS cluster ARN the role is allowed to describe"
  type        = string
}

variable "aws_region" {
  description = "AWS region (used to construct the ECR authorization token ARN)"
  type        = string
}
