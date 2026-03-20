output "role_arn" {
  description = "IAM role ARN for GitHub Actions OIDC — use as AWS_ROLE_ARN secret"
  value       = module.github_actions_oidc_role.iam_role_arn
}

output "role_name" {
  description = "IAM role name"
  value       = module.github_actions_oidc_role.iam_role_name
}
