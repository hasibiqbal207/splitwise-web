# Testing Plan

## Overview
The Splitwise Backend Service testing strategy encompasses multiple testing levels to ensure code quality, functionality, performance, and security. The testing plan follows industry best practices and covers unit, integration, API, and end-to-end testing.

## Testing Strategy

### 1. Testing Pyramid
```
                    /\
                   /  \
                  / E2E \
                 /______\
                /        \
               / Integration \
              /______________\
             /                \
            /     Unit Tests    \
           /____________________\
```

- **Unit Tests**: 70% of test coverage
- **Integration Tests**: 20% of test coverage  
- **End-to-End Tests**: 10% of test coverage

### 2. Testing Tools
- **Unit Testing**: Jest with TypeScript support
- **API Testing**: Supertest for Express.js testing
- **Database Testing**: MongoDB Memory Server
- **Code Coverage**: Istanbul/nyc
- **Mocking**: Jest mocks and manual mocks
- **Test Data**: Factory functions and fixtures

## Unit Testing

### 1. Service Layer Testing

**Authentication Service Tests**:
```typescript
describe('AuthenticationService', () => {
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      // Test user registration
    });
    
    it('should throw error for duplicate email', async () => {
      // Test duplicate email handling
    });
    
    it('should hash password before saving', async () => {
      // Test password hashing
    });
  });
  
  describe('loginUser', () => {
    it('should login with valid credentials', async () => {
      // Test successful login
    });
    
    it('should reject invalid credentials', async () => {
      // Test invalid login
    });
  });
});
```

**Expense Service Tests**:
```typescript
describe('ExpenseService', () => {
  describe('createExpense', () => {
    it('should create expense and update group balances', async () => {
      // Test expense creation
    });
    
    it('should calculate expense per member correctly', async () => {
      // Test expense splitting
    });
  });
  
  describe('getGroupExpenses', () => {
    it('should return expenses for specific group', async () => {
      // Test group expense retrieval
    });
  });
});
```

**Debt Settlement Algorithm Tests**:
```typescript
describe('DebtSettlement', () => {
  describe('simplifyDebts', () => {
    it('should minimize number of transactions', () => {
      // Test debt simplification
    });
    
    it('should handle zero balances correctly', () => {
      // Test edge cases
    });
    
    it('should maintain balance consistency', () => {
      // Test balance validation
    });
  });
});
```

### 2. Utility Function Testing

**Validation Utils**:
```typescript
describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    
    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });
  
  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('StrongPass123')).toBe(true);
    });
    
    it('should reject weak passwords', () => {
      expect(validatePassword('123')).toBe(false);
    });
  });
});
```

**Split Algorithm Testing**:
```typescript
describe('Split Utils', () => {
  describe('splitNewExpense', () => {
    it('should correctly split expense among members', async () => {
      // Test expense splitting logic
    });
    
    it('should handle decimal precision correctly', async () => {
      // Test floating point precision
    });
  });
  
  describe('revertSplit', () => {
    it('should correctly revert expense split', async () => {
      // Test split reversion
    });
  });
});
```

## Integration Testing

### 1. API Endpoint Testing

**Authentication Endpoints**:
```typescript
describe('Authentication API', () => {
  describe('POST /auth/register', () => {
    it('should register new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('john@example.com');
    });
  });
  
  describe('POST /auth/login', () => {
    it('should login existing user', async () => {
      // Test login endpoint
    });
  });
});
```

**Group Management Endpoints**:
```typescript
describe('Group API', () => {
  let authToken: string;
  
  beforeEach(async () => {
    // Setup authenticated user
    authToken = await getAuthToken();
  });
  
  describe('POST /group', () => {
    it('should create new group', async () => {
      const response = await request(app)
        .post('/api/v1/group')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          groupName: 'Test Group',
          groupCurrency: 'EUR',
          groupMembers: ['user1@example.com', 'user2@example.com']
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data.groupName).toBe('Test Group');
    });
  });
});
```

**Expense Management Endpoints**:
```typescript
describe('Expense API', () => {
  describe('POST /expense', () => {
    it('should create expense and update balances', async () => {
      // Test expense creation with balance updates
    });
  });
  
  describe('GET /expense/group/:groupId', () => {
    it('should return group expenses', async () => {
      // Test group expense retrieval
    });
  });
});
```

### 2. Database Integration Testing

**MongoDB Connection Testing**:
```typescript
describe('Database Integration', () => {
  beforeAll(async () => {
    await connectDB();
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    await clearDatabase();
  });
  
  it('should connect to database successfully', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
```

**Model Testing**:
```typescript
describe('User Model', () => {
  it('should create user with valid data', async () => {
    const userData = {
      firstName: 'John',
      email: 'john@example.com',
      password: 'hashedPassword'
    };
    
    const user = await UserModel.create(userData);
    expect(user.firstName).toBe('John');
    expect(user.email).toBe('john@example.com');
  });
  
  it('should enforce unique email constraint', async () => {
    // Test unique email validation
  });
});
```

## API Testing

### 1. Request/Response Testing

**Status Code Validation**:
```typescript
describe('API Status Codes', () => {
  it('should return 200 for successful GET requests', async () => {
    const response = await request(app).get('/api/v1/user/profile');
    expect(response.status).toBe(200);
  });
  
  it('should return 401 for unauthorized requests', async () => {
    const response = await request(app).get('/api/v1/group');
    expect(response.status).toBe(401);
  });
  
  it('should return 400 for invalid requests', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ invalid: 'data' });
    expect(response.status).toBe(400);
  });
});
```

**Response Format Testing**:
```typescript
describe('API Response Format', () => {
  it('should return consistent response structure', async () => {
    const response = await request(app).get('/api/v1/user/profile');
    
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('data');
    expect(typeof response.body.success).toBe('boolean');
  });
});
```

### 2. Error Handling Testing

**Validation Error Testing**:
```typescript
describe('Validation Errors', () => {
  it('should return validation errors for invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        firstName: 'John',
        email: 'invalid-email',
        password: 'password123'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
```

**Authentication Error Testing**:
```typescript
describe('Authentication Errors', () => {
  it('should return 401 for invalid token', async () => {
    const response = await request(app)
      .get('/api/v1/group')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(401);
  });
});
```

## Performance Testing

### 1. Load Testing

**API Performance Tests**:
```typescript
describe('Performance Tests', () => {
  it('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill().map(() => 
      request(app).get('/api/v1/user/profile')
    );
    
    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(5000); // 5 seconds
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });
});
```

**Database Performance Tests**:
```typescript
describe('Database Performance', () => {
  it('should retrieve 1000 expenses within 1 second', async () => {
    // Test database query performance
  });
  
  it('should handle large group operations efficiently', async () => {
    // Test group operations with many members
  });
});
```

### 2. Memory Usage Testing

**Memory Leak Detection**:
```typescript
describe('Memory Usage', () => {
  it('should not have memory leaks during operations', async () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Perform operations
    for (let i = 0; i < 100; i++) {
      await createTestExpense();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
  });
});
```

## Security Testing

### 1. Authentication Security

**Password Security Tests**:
```typescript
describe('Password Security', () => {
  it('should hash passwords before storage', async () => {
    const plainPassword = 'password123';
    const user = await createUser({ password: plainPassword });
    
    expect(user.password).not.toBe(plainPassword);
    expect(user.password).toMatch(/^\$2[aby]\$\d{1,2}\$/);
  });
  
  it('should validate password strength', async () => {
    const weakPassword = '123';
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ password: weakPassword });
    
    expect(response.status).toBe(400);
  });
});
```

**JWT Security Tests**:
```typescript
describe('JWT Security', () => {
  it('should reject expired tokens', async () => {
    const expiredToken = generateExpiredToken();
    const response = await request(app)
      .get('/api/v1/group')
      .set('Authorization', `Bearer ${expiredToken}`);
    
    expect(response.status).toBe(401);
  });
  
  it('should reject malformed tokens', async () => {
    const response = await request(app)
      .get('/api/v1/group')
      .set('Authorization', 'Bearer malformed-token');
    
    expect(response.status).toBe(401);
  });
});
```

### 2. Input Validation Security

**SQL Injection Prevention**:
```typescript
describe('SQL Injection Prevention', () => {
  it('should handle malicious input safely', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: maliciousInput });
    
    // Should not crash and should return validation error
    expect(response.status).toBe(400);
  });
});
```

**XSS Prevention**:
```typescript
describe('XSS Prevention', () => {
  it('should sanitize user input', async () => {
    const xssInput = '<script>alert("xss")</script>';
    const response = await request(app)
      .post('/api/v1/group')
      .send({ groupName: xssInput });
    
    // Should not execute script and should be sanitized
    expect(response.body.data.groupName).not.toContain('<script>');
  });
});
```

## Test Data Management

### 1. Test Fixtures

**User Fixtures**:
```typescript
export const testUsers = {
  validUser: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  invalidUser: {
    firstName: '',
    email: 'invalid-email',
    password: '123'
  }
};
```

**Group Fixtures**:
```typescript
export const testGroups = {
  validGroup: {
    groupName: 'Test Group',
    groupCurrency: 'EUR',
    groupMembers: ['user1@example.com', 'user2@example.com']
  }
};
```

### 2. Test Database Setup

**Database Cleanup**:
```typescript
export const clearDatabase = async () => {
  await UserModel.deleteMany({});
  await GroupModel.deleteMany({});
  await ExpenseModel.deleteMany({});
  await SettlementModel.deleteMany({});
};
```

**Test Data Seeding**:
```typescript
export const seedTestData = async () => {
  const users = await UserModel.insertMany(testUsers);
  const groups = await GroupModel.insertMany(testGroups);
  return { users, groups };
};
```

## Continuous Integration Testing

### 1. CI/CD Pipeline

**GitHub Actions Workflow**:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:coverage
```

### 2. Test Scripts

**Package.json Scripts**:
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Test Coverage Goals

### 1. Coverage Targets
- **Overall Coverage**: 80% minimum
- **Unit Tests**: 90% minimum
- **Integration Tests**: 70% minimum
- **Critical Paths**: 100% coverage

### 2. Coverage Reports
- **Line Coverage**: Track line-by-line coverage
- **Branch Coverage**: Track conditional branch coverage
- **Function Coverage**: Track function execution coverage
- **Statement Coverage**: Track statement execution coverage

## Testing Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### 2. Test Data Management
- Use factories for test data creation
- Clean up test data after each test
- Use meaningful test data
- Avoid hardcoded values

### 3. Mocking Strategy
- Mock external dependencies
- Mock database operations in unit tests
- Use real database in integration tests
- Mock time-dependent operations

### 4. Error Testing
- Test both success and failure scenarios
- Test edge cases and boundary conditions
- Test error handling and recovery
- Test validation and security measures
