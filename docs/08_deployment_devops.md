# Deployment and DevOps

## Overview
The Splitwise Backend Service deployment strategy encompasses containerization with Docker, CI/CD pipelines, environment management, and infrastructure automation. The deployment process ensures consistent, reliable, and scalable application delivery across different environments.

## Containerization

### 1. Docker Configuration

**Development Dockerfile** (`docker/Dockerfile.dev`):
```dockerfile
# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

**Production Dockerfile** (`docker/Dockerfile.prod`):
```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/server.js"]
```

### 2. Docker Compose Configuration

**Development Environment** (`compose.yaml`):
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - MONGODB_URI=mongodb://mongo:27017/splitwise_dev
      - JWT_SECRET=dev-secret-key
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - mongo
    networks:
      - splitwise-network

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=splitwise_dev
    volumes:
      - mongo_data:/data/db
    networks:
      - splitwise-network

  mongo-express:
    image: mongo-express:latest
    ports:
      - "8081:8081"
    environment:
      - ME_CONFIG_MONGODB_SERVER=mongo
      - ME_CONFIG_MONGODB_PORT=27017
      - ME_CONFIG_BASICAUTH_USERNAME=admin
      - ME_CONFIG_BASICAUTH_PASSWORD=password
    depends_on:
      - mongo
    networks:
      - splitwise-network

volumes:
  mongo_data:

networks:
  splitwise-network:
    driver: bridge
```

**Production Environment** (`compose.prod.yaml`):
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    restart: unless-stopped
    depends_on:
      - mongo
    networks:
      - splitwise-network

  mongo:
    image: mongo:6.0
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
      - MONGO_INITDB_DATABASE=splitwise_prod
    volumes:
      - mongo_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    restart: unless-stopped
    networks:
      - splitwise-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - splitwise-network

volumes:
  mongo_data:

networks:
  splitwise-network:
    driver: bridge
```

## Environment Management

### 1. Environment Variables

**Development Environment** (`.env.development`):
```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/splitwise_dev

# JWT Configuration
JWT_SECRET=dev-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging Configuration
LOG_LEVEL=debug

# Swagger Configuration
SWAGGER_ENABLED=true
```

**Production Environment** (`.env.production`):
```bash
# Server Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://username:password@host:port/splitwise_prod

# JWT Configuration
JWT_SECRET=super-secure-jwt-secret-key-production-only
JWT_EXPIRES_IN=24h

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Logging Configuration
LOG_LEVEL=info

# Swagger Configuration
SWAGGER_ENABLED=false

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Environment-Specific Configurations

**Configuration Management**:
```typescript
// config/environment.config.ts
export const config = {
  development: {
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/splitwise_dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'dev-secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    },
    logging: {
      level: process.env.LOG_LEVEL || 'debug'
    }
  },
  production: {
    database: {
      uri: process.env.MONGODB_URI!,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        sslValidate: true
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
      credentials: true
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info'
    }
  }
};
```

## CI/CD Pipeline

### 1. GitHub Actions Workflow

**Main Workflow** (`.github/workflows/main.yml`):
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.runCommand(\"ping\").ok'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm run test:ci
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          JWT_SECRET: test-secret

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./docker/Dockerfile.prod
          push: true
          tags: |
            yourusername/splitwise-backend:latest
            yourusername/splitwise-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add staging deployment commands

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add production deployment commands
```

### 2. Deployment Scripts

**Deployment Script** (`scripts/deploy.sh`):
```bash
#!/bin/bash

# Deployment script for Splitwise Backend

set -e

# Configuration
ENVIRONMENT=$1
DOCKER_IMAGE="yourusername/splitwise-backend:latest"
COMPOSE_FILE="compose.${ENVIRONMENT}.yaml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is provided
if [ -z "$ENVIRONMENT" ]; then
    log_error "Environment not specified. Usage: ./deploy.sh [development|staging|production]"
    exit 1
fi

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    log_error "Invalid environment. Must be development, staging, or production"
    exit 1
fi

log_info "Starting deployment to $ENVIRONMENT environment"

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    log_info "Loading environment variables from .env.${ENVIRONMENT}"
    export $(cat .env.${ENVIRONMENT} | grep -v '^#' | xargs)
else
    log_warn "No .env.${ENVIRONMENT} file found"
fi

# Pull latest image
log_info "Pulling latest Docker image"
docker pull $DOCKER_IMAGE

# Deploy using Docker Compose
log_info "Deploying with Docker Compose"
docker-compose -f $COMPOSE_FILE down
docker-compose -f $COMPOSE_FILE up -d

# Health check
log_info "Performing health check"
sleep 30

HEALTH_CHECK_URL="http://localhost:3000/health"
if curl -f $HEALTH_CHECK_URL > /dev/null 2>&1; then
    log_info "Health check passed"
else
    log_error "Health check failed"
    exit 1
fi

log_info "Deployment to $ENVIRONMENT completed successfully"
```

## Infrastructure as Code

### 1. Kubernetes Configuration

**Deployment** (`k8s/deployment.yaml`):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: splitwise-backend
  labels:
    app: splitwise-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: splitwise-backend
  template:
    metadata:
      labels:
        app: splitwise-backend
    spec:
      containers:
      - name: splitwise-backend
        image: yourusername/splitwise-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: splitwise-secrets
              key: mongodb-uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: splitwise-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

**Service** (`k8s/service.yaml`):
```yaml
apiVersion: v1
kind: Service
metadata:
  name: splitwise-backend-service
spec:
  selector:
    app: splitwise-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

**Ingress** (`k8s/ingress.yaml`):
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: splitwise-backend-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.yourdomain.com
    secretName: splitwise-tls
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: splitwise-backend-service
            port:
              number: 80
```

### 2. Terraform Configuration

**Main Configuration** (`terraform/main.tf`):
```hcl
# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "splitwise_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "splitwise-vpc"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "splitwise_cluster" {
  name = "splitwise-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "splitwise_task" {
  family                   = "splitwise-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512

  container_definitions = jsonencode([
    {
      name  = "splitwise-backend"
      image = "yourusername/splitwise-backend:latest"
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]
      secrets = [
        {
          name      = "MONGODB_URI"
          valueFrom = aws_secretsmanager_secret.mongodb_uri.arn
        },
        {
          name      = "JWT_SECRET"
          valueFrom = aws_secretsmanager_secret.jwt_secret.arn
        }
      ]
    }
  ])
}

# Application Load Balancer
resource "aws_lb" "splitwise_alb" {
  name               = "splitwise-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = aws_subnet.public[*].id
}

# ECS Service
resource "aws_ecs_service" "splitwise_service" {
  name            = "splitwise-service"
  cluster         = aws_ecs_cluster.splitwise_cluster.id
  task_definition = aws_ecs_task_definition.splitwise_task.arn
  desired_count   = 3
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.splitwise_tg.arn
    container_name   = "splitwise-backend"
    container_port   = 3000
  }
}
```

## Monitoring and Logging

### 1. Application Monitoring

**Health Check Endpoint**:
```typescript
// Add to server.ts
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});
```

**Prometheus Metrics**:
```typescript
// Add prometheus metrics
import prometheus from 'prom-client';

const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

### 2. Logging Configuration

**Structured Logging**:
```typescript
// Enhanced logging configuration
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'splitwise-backend' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## Backup and Recovery

### 1. Database Backup

**Automated Backup Script**:
```bash
#!/bin/bash
# Database backup script

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="splitwise_prod"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create MongoDB backup
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"

# Remove uncompressed backup
rm -rf "$BACKUP_DIR/$DATE"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$DATE.tar.gz"
```

### 2. Disaster Recovery

**Recovery Procedures**:
1. **Database Recovery**: Restore from latest backup
2. **Application Recovery**: Redeploy from Docker image
3. **Configuration Recovery**: Restore environment variables
4. **Data Validation**: Verify data integrity post-recovery

## Security Considerations

### 1. Container Security

**Security Best Practices**:
- Use non-root user in containers
- Scan images for vulnerabilities
- Keep base images updated
- Implement resource limits
- Use secrets management

### 2. Network Security

**Security Groups and Firewalls**:
- Restrict database access
- Use HTTPS for all communications
- Implement proper CORS policies
- Use VPN for internal communications

## Performance Optimization

### 1. Application Optimization

**Performance Tuning**:
- Enable compression
- Implement caching strategies
- Optimize database queries
- Use connection pooling
- Implement rate limiting

### 2. Infrastructure Optimization

**Scaling Strategies**:
- Horizontal scaling with load balancers
- Auto-scaling based on metrics
- Database read replicas
- CDN for static assets
- Caching layers (Redis)
