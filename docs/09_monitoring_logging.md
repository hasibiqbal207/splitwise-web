# Monitoring and Logging

## Overview
The Splitwise Backend Service implements comprehensive monitoring and logging strategies to ensure application health, performance tracking, error detection, and operational visibility. The monitoring system provides real-time insights into application behavior and helps maintain high availability and performance.

## Logging Strategy

### 1. Logging Architecture

**Multi-Level Logging**:
```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Request       │  │   Business      │  │   Error      │ │
│  │   Logging       │  │   Logic         │  │   Logging    │ │
│  │   (Morgan)      │  │   Logging       │  │   (Winston)  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Log Aggregation                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   File          │  │   Console       │  │   External   │ │
│  │   Logs          │  │   Output        │  │   Services   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Log Analysis                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Log           │  │   Error         │  │   Performance│ │
│  │   Parsing       │  │   Tracking      │  │   Analysis   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2. Winston Logger Configuration

**Enhanced Logger Setup**:
```typescript
// config/logger.config.ts
import winston from 'winston';
import path from 'path';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'splitwise-backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Combined logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Access logs
    new winston.transports.File({
      filename: path.join('logs', 'access.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join('logs', 'exceptions.log')
  })
);

// Handle unhandled promise rejections
logger.rejections.handle(
  new winston.transports.File({
    filename: path.join('logs', 'rejections.log')
  })
);

export default logger;
```

### 3. Morgan HTTP Logging

**Request Logging Middleware**:
```typescript
// middlewares/logger.middleware.ts
import morgan from 'morgan';
import logger from '../config/logger.config.js';

// Custom token for request ID
morgan.token('id', (req: any) => req.id);

// Custom token for response time
morgan.token('response-time', (req: any, res: any) => {
  const responseTime = morgan['response-time'](req, res);
  return responseTime ? `${responseTime}ms` : '';
});

// Custom token for user agent
morgan.token('user-agent', (req: any) => req.get('User-Agent'));

// Custom token for request body size
morgan.token('req-body-size', (req: any) => {
  const contentLength = req.get('Content-Length');
  return contentLength ? `${contentLength} bytes` : '0 bytes';
});

// Development format
const devFormat = ':method :url :status :response-time - :req-body-size';

// Production format (JSON)
const prodFormat = JSON.stringify({
  method: ':method',
  url: ':url',
  status: ':status',
  responseTime: ':response-time',
  userAgent: ':user-agent',
  ip: ':remote-addr',
  timestamp: ':date[iso]'
});

// Create morgan middleware
const morganMiddleware = morgan(
  process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      }
    },
    skip: (req: any) => {
      // Skip health check and metrics endpoints
      return req.url === '/health' || req.url === '/metrics';
    }
  }
);

export default morganMiddleware;
```

### 4. Structured Logging Examples

**Authentication Logging**:
```typescript
// services/authentication.service.ts
import logger from '../config/logger.config.js';

export const registerUser = async (userData: any) => {
  try {
    logger.info('User registration attempt', {
      email: userData.email,
      action: 'register',
      timestamp: new Date().toISOString()
    });

    // Registration logic...

    logger.info('User registered successfully', {
      userId: user._id,
      email: userData.email,
      action: 'register_success'
    });

    return user;
  } catch (error) {
    logger.error('User registration failed', {
      email: userData.email,
      error: error.message,
      stack: error.stack,
      action: 'register_failed'
    });
    throw error;
  }
};
```

**Expense Operation Logging**:
```typescript
// services/expense.service.ts
import logger from '../config/logger.config.js';

export const createExpense = async (expenseData: any) => {
  try {
    logger.info('Expense creation started', {
      expenseName: expenseData.expenseName,
      amount: expenseData.expenseAmount,
      groupId: expenseData.groupId,
      owner: expenseData.expenseOwner,
      action: 'create_expense'
    });

    // Expense creation logic...

    logger.info('Expense created successfully', {
      expenseId: expense._id,
      expenseName: expenseData.expenseName,
      amount: expenseData.expenseAmount,
      groupId: expenseData.groupId,
      action: 'create_expense_success'
    });

    return expense;
  } catch (error) {
    logger.error('Expense creation failed', {
      expenseName: expenseData.expenseName,
      groupId: expenseData.groupId,
      error: error.message,
      stack: error.stack,
      action: 'create_expense_failed'
    });
    throw error;
  }
};
```

## Application Monitoring

### 1. Health Check Endpoints

**Comprehensive Health Check**:
```typescript
// routes/health.route.ts
import express from 'express';
import mongoose from 'mongoose';
import logger from '../config/logger.config.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: 'unknown',
      memory: 'unknown',
      disk: 'unknown'
    }
  };

  try {
    // Database health check
    if (mongoose.connection.readyState === 1) {
      healthCheck.checks.database = 'healthy';
    } else {
      healthCheck.checks.database = 'unhealthy';
      healthCheck.status = 'unhealthy';
    }

    // Memory health check
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    if (memoryUsagePercent < 90) {
      healthCheck.checks.memory = 'healthy';
    } else {
      healthCheck.checks.memory = 'unhealthy';
      healthCheck.status = 'unhealthy';
    }

    // Disk space check (if applicable)
    healthCheck.checks.disk = 'healthy'; // Implement disk check if needed

    // Log health check
    logger.info('Health check performed', {
      status: healthCheck.status,
      checks: healthCheck.checks,
      uptime: healthCheck.uptime
    });

    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthCheck);

  } catch (error) {
    logger.error('Health check failed', {
      error: error.message,
      stack: error.stack
    });

    healthCheck.status = 'unhealthy';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});

export default router;
```

### 2. Prometheus Metrics

**Metrics Configuration**:
```typescript
// config/metrics.config.ts
import prometheus from 'prom-client';

// Enable default metrics collection
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics();

// Custom metrics
export const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

export const expenseCreationTotal = new prometheus.Counter({
  name: 'expense_creation_total',
  help: 'Total number of expenses created',
  labelNames: ['group_id', 'currency']
});

export const userRegistrationTotal = new prometheus.Counter({
  name: 'user_registration_total',
  help: 'Total number of user registrations'
});

export const databaseOperationDuration = new prometheus.Histogram({
  name: 'database_operation_duration_seconds',
  help: 'Duration of database operations in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1]
});
```

**Metrics Middleware**:
```typescript
// middlewares/metrics.middleware.ts
import { httpRequestDuration, httpRequestTotal } from '../config/metrics.config.js';

export const metricsMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    };

    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
  });

  next();
};
```

**Metrics Endpoint**:
```typescript
// routes/metrics.route.ts
import express from 'express';
import prometheus from 'prom-client';

const router = express.Router();

router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

export default router;
```

## Performance Monitoring

### 1. Response Time Monitoring

**Response Time Tracking**:
```typescript
// middlewares/performance.middleware.ts
import logger from '../config/logger.config.js';

export const performanceMiddleware = (req: any, res: any, next: any) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

    // Log slow requests
    if (duration > 1000) { // Log requests taking more than 1 second
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    }

    // Log all requests in production
    if (process.env.NODE_ENV === 'production') {
      logger.info('Request completed', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode
      });
    }
  });

  next();
};
```

### 2. Database Performance Monitoring

**Database Query Monitoring**:
```typescript
// config/database.config.ts
import mongoose from 'mongoose';
import logger from './logger.config.js';
import { databaseOperationDuration } from './metrics.config.js';

// Monitor database operations
mongoose.set('debug', process.env.NODE_ENV === 'development');

// Add query monitoring
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully');
});

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error', {
    error: error.message,
    stack: error.stack
  });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Monitor query performance
const originalExec = mongoose.Query.prototype.exec;
mongoose.Query.prototype.exec = async function(...args) {
  const start = process.hrtime();
  
  try {
    const result = await originalExec.apply(this, args);
    
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    // Log slow queries
    if (duration > 100) { // Log queries taking more than 100ms
      logger.warn('Slow database query detected', {
        collection: this.mongooseCollection.name,
        operation: this.op,
        duration: `${duration.toFixed(2)}ms`,
        query: this.getQuery()
      });
    }
    
    // Update metrics
    databaseOperationDuration.observe({
      operation: this.op,
      collection: this.mongooseCollection.name
    }, duration / 1000); // Convert to seconds for Prometheus
    
    return result;
  } catch (error) {
    logger.error('Database query failed', {
      collection: this.mongooseCollection.name,
      operation: this.op,
      error: error.message,
      query: this.getQuery()
    });
    throw error;
  }
};
```

## Error Tracking and Alerting

### 1. Error Monitoring

**Global Error Handler**:
```typescript
// middlewares/error.middleware.ts
import logger from '../config/logger.config.js';

export const errorHandler = (error: any, req: any, res: any, next: any) => {
  // Log error details
  logger.error('Unhandled error occurred', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id || 'anonymous'
  });

  // Send error response
  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
```

**Validation Error Handler**:
```typescript
// middlewares/validation.middleware.ts
import logger from '../config/logger.config.js';

export const validationErrorHandler = (error: any, req: any, res: any, next: any) => {
  if (error.name === 'ValidationError') {
    logger.warn('Validation error occurred', {
      error: error.message,
      method: req.method,
      url: req.url,
      body: req.body,
      userId: req.user?.id || 'anonymous'
    });

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }))
    });
  }

  next(error);
};
```

### 2. Alerting Configuration

**Alert Rules** (Prometheus):
```yaml
# prometheus/alerts.yml
groups:
  - name: splitwise-backend
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: DatabaseConnectionDown
        expr: up{job="splitwise-backend"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database connection down"
          description: "Splitwise backend is down"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"
```

## Log Analysis and Visualization

### 1. Log Aggregation

**ELK Stack Configuration**:
```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.8.0
    ports:
      - "5044:5044"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
      - ./logs:/var/log/splitwise

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

### 2. Log Parsing Patterns

**Logstash Configuration**:
```ruby
# logstash/pipeline/splitwise.conf
input {
  file {
    path => "/var/log/splitwise/*.log"
    type => "splitwise-logs"
    start_position => "beginning"
  }
}

filter {
  if [type] == "splitwise-logs" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} \[%{LOGLEVEL:level}\]: %{GREEDYDATA:log_message}" }
    }
    
    date {
      match => [ "timestamp", "yyyy-MM-dd HH:mm:ss" ]
      target => "@timestamp"
    }
    
    if [log_message] =~ /^Request completed/ {
      grok {
        match => { "log_message" => "Request completed method=%{WORD:method} url=%{DATA:url} duration=%{DATA:duration} statusCode=%{NUMBER:status_code}" }
      }
    }
    
    if [log_message] =~ /^User registration/ {
      grok {
        match => { "log_message" => "User registration attempt email=%{DATA:email} action=%{WORD:action}" }
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "splitwise-logs-%{+YYYY.MM.dd}"
  }
}
```

## Dashboard and Reporting

### 1. Grafana Dashboards

**Application Metrics Dashboard**:
```json
{
  "dashboard": {
    "title": "Splitwise Backend Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds)",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      },
      {
        "title": "Database Operations",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(database_operation_duration_seconds_count[5m])",
            "legendFormat": "{{operation}} {{collection}}"
          }
        ]
      }
    ]
  }
}
```

### 2. Custom Reports

**Performance Report Generator**:
```typescript
// utils/reportGenerator.ts
import logger from '../config/logger.config.js';

export const generatePerformanceReport = async () => {
  const report = {
    timestamp: new Date().toISOString(),
    period: '24h',
    metrics: {
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
      topEndpoints: [],
      slowQueries: []
    }
  };

  // Generate report logic here
  logger.info('Performance report generated', report);
  
  return report;
};
```

## Best Practices

### 1. Logging Best Practices
- Use structured logging with consistent format
- Include relevant context in log messages
- Avoid logging sensitive information
- Use appropriate log levels
- Implement log rotation and retention policies

### 2. Monitoring Best Practices
- Monitor key business metrics
- Set up proactive alerting
- Use distributed tracing for complex requests
- Implement circuit breakers for external dependencies
- Regular review and optimization of monitoring rules

### 3. Performance Best Practices
- Monitor application performance continuously
- Set up performance budgets
- Use caching strategies effectively
- Optimize database queries
- Implement proper error handling and recovery
