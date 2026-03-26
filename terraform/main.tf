locals {
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ── VPC ───────────────────────────────────────────────────────────────────────
module "vpc" {
  source = "./modules/vpc"

  project     = var.project
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  tags        = local.common_tags
}

# ── EKS ───────────────────────────────────────────────────────────────────────
module "eks" {
  source = "./modules/eks"

  project               = var.project
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  node_instance_type    = var.eks_node_instance_type
  desired_nodes         = var.eks_desired_nodes
  min_nodes             = var.eks_min_nodes
  max_nodes             = var.eks_max_nodes
  tags                  = local.common_tags
}

# ── RDS (PostgreSQL) ──────────────────────────────────────────────────────────
module "rds" {
  source = "./modules/rds"

  project            = var.project
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  eks_sg_id          = module.eks.node_security_group_id
  db_instance_class  = var.db_instance_class
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
  tags               = local.common_tags
}

# ── ElastiCache (Redis) ───────────────────────────────────────────────────────
module "elasticache" {
  source = "./modules/elasticache"

  project            = var.project
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  eks_sg_id          = module.eks.node_security_group_id
  redis_node_type    = var.redis_node_type
  tags               = local.common_tags
}

# ── Secrets Manager ───────────────────────────────────────────────────────────
# Store the DATABASE_URL and REDIS_URL so External Secrets can pull them.
resource "aws_secretsmanager_secret" "app" {
  name                    = "${var.project}/production"
  description             = "Runtime secrets for ${var.project}"
  recovery_window_in_days = 7
  tags                    = local.common_tags
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id = aws_secretsmanager_secret.app.id
  secret_string = jsonencode({
    DATABASE_URL    = "postgresql://${var.db_username}:${var.db_password}@${module.rds.endpoint}:5432/${var.db_name}"
    REDIS_URL       = "redis://${module.elasticache.primary_endpoint}:6379"
    JWT_SECRET      = "REPLACE_WITH_STRONG_SECRET"
    NEXTAUTH_SECRET = "REPLACE_WITH_STRONG_SECRET"
    NEXTAUTH_URL    = "https://grocery-tracker.yourdomain.com"
  })
}
