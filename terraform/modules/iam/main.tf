module "github_actions_oidc_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-github-actions"
  version = "~> 5.0"

  role_name = var.role_name

  github_repositories = var.github_repositories

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
      resources = concat(
        var.ecr_repository_arns,
        ["arn:aws:ecr:${var.aws_region}:*:authorizationToken"]
      )
    },
    {
      sid       = "EKSAccess"
      actions   = ["eks:DescribeCluster"]
      resources = [var.cluster_arn]
    },
  ]
}
