variable "aws_region" {
  description = "AWS region"
  type = string
  default = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type = string
  default = "prod"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type = string
  default = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type = list(string)
  default = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "db_name" {
  description = "Database name"
  type = string
  default = "memegag"
}

variable "db_username" {
  description = "Database username"
  type = string
  default = "admin"
}

variable "db_password" {
  description = "Database password"
  type = string
  sensitive = true
}

variable "cluster_name" {
  description = "EKS cluster name"
  type = string
  default = "memegag-prod"
}
