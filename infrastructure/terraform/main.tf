terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  backend "s3" {
    bucket = "memegag-terraform-state"
    key = "prod/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project = "MemeGag"
      Environment = var.environment
      ManagedBy = "Terraform"
    }
  }
}

module "vpc" {
  source = "./modules/vpc"
  environment = var.environment
  vpc_cidr = var.vpc_cidr
  availability_zones = var.availability_zones
}

module "rds" {
  source = "./modules/rds"
  environment = var.environment
  db_name = var.db_name
  db_username = var.db_username
  db_password = var.db_password
  vpc_id = module.vpc.vpc_id
  depends_on = [module.vpc]
}

module "redis" {
  source = "./modules/redis"
  environment = var.environment
  vpc_id = module.vpc.vpc_id
  depends_on = [module.vpc]
}

module "eks" {
  source = "./modules/eks"
  environment = var.environment
  cluster_name = var.cluster_name
  vpc_id = module.vpc.vpc_id
  depends_on = [module.vpc]
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "redis_endpoint" {
  value = module.redis.endpoint
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}
