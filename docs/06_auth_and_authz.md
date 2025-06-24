# Authentication and Authorization

## Overview
The Splitwise Backend Service implements a comprehensive authentication and authorization system using JSON Web Tokens (JWT) for stateless authentication, bcrypt for password hashing, and middleware-based route protection.

## Authentication System

### 1. JWT (JSON Web Token) Authentication

**Token Structure**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user_id",
    "email": "user@example.com",
    "iat": 1642234567,
    "exp": 1642320967
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
}
```

**Token Configuration**:
- **Algorithm**: HS256 (HMAC SHA-256)
- **Secret Key**: Environment variable `JWT_SECRET`
- **Expiration**: 24 hours (configurable)
- **Issuer**: Splitwise Backend Service

### 2. Password Security

**Hashing Algorithm**: bcrypt
- **Salt Rounds**: 10 (configurable)
- **Algorithm**: bcrypt with salt
- **Storage**: Hashed passwords only, never plain text

**Password Requirements**:
- Minimum 6 characters
- Must contain at least one letter and one number
- Special characters allowed but not required

**Example Password Hashing**:
```javascript
// Before storage
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// During login verification
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

## Authentication Flow

### 1. User Registration
```
1. User submits registration data
2. Validate input data (email, password, name)
3. Check if email already exists
4. Hash password using bcrypt
5. Create user in database
6. Generate JWT token
7. Return user data and token
```

### 2. User Login
```
1. User submits email and password
2. Find user by email in database
3. Compare password with hashed password
4. If valid, generate JWT token
5. Return user data and token
6. If invalid, return error
```

### 3. Token Validation
```
1. Extract token from Authorization header
2. Verify token signature and expiration
3. Decode token payload
4. Attach user data to request object
5. Continue to protected route
```

## Authorization System

### 1. Route Protection

**Protected Routes**:
- All group operations (`/group/*`)
- All expense operations (`/expense/*`)
- User profile operations (`/user/*`)

**Public Routes**:
- User registration (`/auth/register`)
- User login (`/auth/login`)
- Health check (`/`)

### 2. Middleware Implementation

**JWT Validation Middleware**:
```typescript
export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
```

### 3. Resource Ownership

**Group Ownership**:
- Only group owners can modify group settings
- Only group owners can add/remove members
- All group members can view group data

**Expense Ownership**:
- Expense owners can modify their expenses
- Group members can view all group expenses
- Expense deletion requires owner permission

**User Data**:
- Users can only access their own profile data
- Users can only modify their own information

## Security Features

### 1. Token Security

**Token Storage**:
- Tokens are stored client-side (localStorage/sessionStorage)
- Server does not store tokens
- Tokens are stateless

**Token Refresh**:
- Current implementation uses fixed expiration
- Future enhancement: Refresh token mechanism
- Automatic token renewal for long sessions

### 2. Password Security

**Password Hashing**:
```javascript
// Registration
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Login verification
const isPasswordValid = await bcrypt.compare(password, hashedPassword);
```

**Password Validation**:
- Minimum length validation
- Complexity requirements
- Common password prevention

### 3. Input Validation

**Request Validation**:
- Email format validation
- Password strength validation
- Required field validation
- Data type validation

**SQL Injection Prevention**:
- Mongoose ODM provides built-in protection
- Parameterized queries
- Input sanitization

### 4. CORS Configuration

**Cross-Origin Resource Sharing**:
```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Error Handling

### 1. Authentication Errors

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid token or token expired"
}
```

**400 Bad Request**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 2. Authorization Errors

**403 Forbidden**:
```json
{
  "success": false,
  "message": "Access denied. You don't have permission to perform this action"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Resource not found or you don't have access"
}
```

## API Security Headers

### 1. Helmet Configuration

**Security Headers**:
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

**Headers Applied**:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

## Session Management

### 1. Stateless Sessions

**No Server-Side Sessions**:
- JWT tokens contain all necessary user information
- No session storage on server
- Scalable across multiple server instances

**Token Expiration**:
- Default: 24 hours
- Configurable via environment variables
- Automatic logout on token expiration

### 2. Logout Strategy

**Client-Side Logout**:
- Remove token from client storage
- Clear user state
- Redirect to login page

**Server-Side Considerations**:
- No token blacklisting (stateless design)
- Future enhancement: Token blacklist for immediate logout

## Rate Limiting

### 1. Current Implementation
- No rate limiting currently implemented
- Future enhancement: Express-rate-limit integration

### 2. Planned Rate Limiting
```javascript
// Future implementation
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts'
});

app.use('/auth', authLimiter);
```

## Environment Variables

### 1. Required Environment Variables
```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/splitwise

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 2. Security Best Practices
- Use strong, unique JWT secrets
- Store secrets in environment variables
- Never commit secrets to version control
- Use different secrets for different environments

## Future Enhancements

### 1. Multi-Factor Authentication (MFA)
- SMS-based verification
- Email-based verification
- TOTP (Time-based One-Time Password)

### 2. OAuth Integration
- Google OAuth
- Facebook OAuth
- GitHub OAuth

### 3. Role-Based Access Control (RBAC)
- Admin roles
- Moderator roles
- User roles

### 4. Advanced Security Features
- IP-based access control
- Device fingerprinting
- Suspicious activity detection
- Account lockout mechanisms
