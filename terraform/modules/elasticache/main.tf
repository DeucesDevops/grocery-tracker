resource "aws_security_group" "redis" {
  name        = "${var.project}-redis-sg"
  description = "Allow Redis traffic from EKS nodes"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.eks_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, { Name = "${var.project}-redis-sg" })
}

resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project}-redis-subnet-group"
  subnet_ids = var.private_subnet_ids
  tags       = var.tags
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = "${var.project}-redis"
  engine               = "redis"
  engine_version       = "7.2"
  node_type            = var.redis_node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  tags = var.tags
}
