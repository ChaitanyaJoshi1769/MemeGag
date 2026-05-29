# MemeGag Deployment Guide

## Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Quick Start

```bash
# Clone repository
git clone https://github.com/ChaitanyaJoshi1769/MemeGag.git
cd MemeGag

# Install dependencies
npm install

# Start local stack
docker-compose up -d

# Setup database
npm run db:push

# Start development services
npm run dev
```

### Development URLs
- API: http://localhost:3000
- Feed Service: http://localhost:3001
- Moderation Service: http://localhost:3002
- Search Service: http://localhost:3003
- Notification Service: http://localhost:3004
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090
- Kibana: http://localhost:5601

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (1.27+)
- kubectl configured
- Docker registry access
- Helm 3+

### Build and Push Images

```bash
# Build all services
npm run docker:build

# Tag images
docker tag memegag-api-gateway:latest your-registry/memegag-api-gateway:v1.0.0
docker tag memegag-feed-service:latest your-registry/memegag-feed-service:v1.0.0
docker tag memegag-moderation-service:latest your-registry/memegag-moderation-service:v1.0.0
docker tag memegag-search-service:latest your-registry/memegag-search-service:v1.0.0
docker tag memegag-notification-service:latest your-registry/memegag-notification-service:v1.0.0

# Push to registry
docker push your-registry/memegag-api-gateway:v1.0.0
docker push your-registry/memegag-feed-service:v1.0.0
docker push your-registry/memegag-moderation-service:v1.0.0
docker push your-registry/memegag-search-service:v1.0.0
docker push your-registry/memegag-notification-service:v1.0.0
```

### Deploy to Kubernetes

```bash
# Create namespace and secrets
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl create secret generic memegag-secrets \
  --from-literal=database-url=$DATABASE_URL \
  --from-literal=redis-url=$REDIS_URL \
  --from-literal=jwt-secret=$JWT_SECRET \
  --from-literal=elasticsearch-host=$ELASTICSEARCH_HOST \
  -n memegag

# Apply configurations
kubectl apply -f infrastructure/kubernetes/configmap.yaml

# Deploy services
kubectl apply -f infrastructure/kubernetes/api-gateway.yaml
kubectl apply -f infrastructure/kubernetes/feed-service.yaml
kubectl apply -f infrastructure/kubernetes/moderation-service.yaml
kubectl apply -f infrastructure/kubernetes/search-service.yaml
kubectl apply -f infrastructure/kubernetes/notification-service.yaml

# Setup Ingress
kubectl apply -f infrastructure/kubernetes/ingress.yaml

# Verify deployment
kubectl get pods -n memegag
kubectl get svc -n memegag
```

### Monitor Deployment

```bash
# Watch pod status
kubectl get pods -n memegag -w

# View logs
kubectl logs -n memegag deployment/api-gateway -f

# Port forward for debugging
kubectl port-forward -n memegag svc/api-gateway 3000:80
```

## AWS Deployment (ECS/EKS)

### Using Terraform

```bash
cd infrastructure/terraform
terraform init
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars
```

### ECS Deployment

```bash
# Build and push image
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker build -t memegag-api-gateway .
docker tag memegag-api-gateway:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/memegag-api-gateway:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/memegag-api-gateway:latest

# Create/update ECS task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Update service
aws ecs update-service \
  --cluster memegag-prod \
  --service api-gateway \
  --force-new-deployment
```

## CI/CD Pipeline

### GitHub Actions

Automated deployment on push to main:

```bash
git push origin main  # Triggers CI/CD pipeline
```

Pipeline stages:
1. **Lint & Test**: Run ESLint, TypeScript, and Jest
2. **Build**: Build Docker images
3. **Push**: Push to Docker registry
4. **Deploy**: Update Kubernetes cluster
5. **Smoke Tests**: Run basic health checks

View pipeline: `.github/workflows/deploy.yml`

## Scaling

### Horizontal Scaling

```bash
# Scale API Gateway to 5 replicas
kubectl scale deployment api-gateway -n memegag --replicas=5

# Scale Feed Service to 3 replicas
kubectl scale deployment feed-service -n memegag --replicas=3
```

### Auto-scaling with HPA

```bash
kubectl apply -f infrastructure/kubernetes/hpa.yaml
```

## Monitoring & Logging

### Prometheus

Access at: http://your-cluster:9090

Key metrics:
- API response time
- Error rate
- Pod CPU/Memory usage
- Database connections

### Grafana

Access at: http://your-cluster:3000

Pre-built dashboards:
- API Gateway Metrics
- Service Health
- Database Performance
- Resource Usage

### Centralized Logging

Logs are aggregated via ELK stack:
- Elasticsearch: http://your-cluster:9200
- Kibana: http://your-cluster:5601
- Logstash: Processes logs from containers

## Database Migrations

### Apply Migrations

```bash
# Local
npm run db:migrate

# Kubernetes
kubectl exec -n memegag deployment/api-gateway -- npm run db:migrate
```

### Backup Database

```bash
# Create backup
pg_dump memegag > memegag-backup.sql

# Restore backup
psql memegag < memegag-backup.sql
```

## Rollback

### Rollback Latest Deployment

```bash
# Kubernetes
kubectl rollout undo deployment/api-gateway -n memegag

# ECS
aws ecs update-service \
  --cluster memegag-prod \
  --service api-gateway \
  --force-new-deployment \
  --task-definition api-gateway:1  # Previous task definition version
```

## Troubleshooting

### Pod Won't Start

```bash
# Check pod status
kubectl describe pod POD_NAME -n memegag

# View logs
kubectl logs POD_NAME -n memegag

# Check resource constraints
kubectl top pods -n memegag
```

### Database Connection Issues

```bash
# Test connection
kubectl run -it --rm debug --image=postgres:15 \
  --restart=Never -- \
  psql -h postgres-host -U postgres -d memegag
```

### High Memory Usage

```bash
# Check memory usage
kubectl top nodes
kubectl top pods -n memegag --sort-by=memory

# Adjust resource limits in deployment
kubectl set resources deployment api-gateway \
  -n memegag \
  --limits=memory=1Gi,cpu=1000m \
  --requests=memory=512Mi,cpu=500m
```

## Cost Optimization

### Right-sizing

- API Gateway: 256Mi memory, 250m CPU (burstable)
- Feed Service: 512Mi memory, 500m CPU
- Moderation: 256Mi memory, 250m CPU
- Search: 256Mi memory, 250m CPU
- Notification: 256Mi memory, 250m CPU

### Spot Instances

Use AWS Spot Instances for non-critical workloads:

```bash
# Enable in Terraform
enable_spot_instances = true
spot_price           = "0.05"
```

---

For production deployments, ensure proper monitoring, logging, and backup strategies are in place.
