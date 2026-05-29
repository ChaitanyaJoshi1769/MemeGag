resource "aws_security_group" "redis" {
  name = "memegag-redis"
  ingress {
    from_port = 6379
    to_port = 6379
    protocol = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id = "${var.environment}-memegag-redis"
  engine = "redis"
  engine_version = "7.0"
  node_type = "cache.t3.medium"
  num_cache_nodes = 3
  parameter_group_name = "default.redis7"
  port = 6379
  security_group_ids = [aws_security_group.redis.id]
  automatic_failover_enabled = true
}

output "endpoint" { value = aws_elasticache_cluster.redis.cache_nodes[0].address }
output "port" { value = aws_elasticache_cluster.redis.port }
