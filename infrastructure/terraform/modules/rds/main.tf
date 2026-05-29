resource "aws_security_group" "rds" {
  name = "memegag-rds"
  ingress {
    from_port = 5432
    to_port = 5432
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

resource "aws_db_instance" "main" {
  identifier = "${var.environment}-memegag-db"
  engine = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.medium"
  allocated_storage = 100
  storage_type = "gp3"
  db_name = var.db_name
  username = var.db_username
  password = var.db_password
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot = false
  final_snapshot_identifier = "${var.environment}-memegag-db-final-snapshot"
  backup_retention_period = 30
  multi_az = true
  tags = { Name = "${var.environment}-rds" }
}

output "endpoint" { value = aws_db_instance.main.endpoint }
output "port" { value = aws_db_instance.main.port }
