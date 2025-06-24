# API Documentation

## Base URL
```
http://localhost:4004/api/v1
```

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication Routes (`/auth`)

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string (optional)",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "createdAt": "date",
      "updatedAt": "date"
    },
    "token": "jwt-token-string"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    },
    "token": "jwt-token-string"
  }
}
```

### User Routes (`/user`)

#### Get User Profile
```http
GET /user/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### Update User Profile
```http
PUT /user/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "updatedAt": "date"
  }
}
```

### Group Routes (`/group`)

#### Create Group
```http
POST /group
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "groupName": "string",
  "groupDescription": "string (optional)",
  "groupCurrency": "EUR|USD|BDT",
  "groupMembers": ["email1@example.com", "email2@example.com"],
  "groupCategory": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Group created successfully",
  "data": {
    "_id": "string",
    "groupName": "string",
    "groupDescription": "string",
    "groupCurrency": "string",
    "groupOwner": "string",
    "groupMembers": ["string"],
    "groupCategory": "string",
    "groupTotal": 0,
    "split": {
      "email1@example.com": 0,
      "email2@example.com": 0
    },
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### Get All Groups
```http
GET /group
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "groupName": "string",
      "groupDescription": "string",
      "groupCurrency": "string",
      "groupOwner": "string",
      "groupMembers": ["string"],
      "groupCategory": "string",
      "groupTotal": 0,
      "split": {
        "email1@example.com": 0,
        "email2@example.com": 0
      }
    }
  ]
}
```

#### Get Group by ID
```http
GET /group/:groupId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "groupName": "string",
    "groupDescription": "string",
    "groupCurrency": "string",
    "groupOwner": "string",
    "groupMembers": ["string"],
    "groupCategory": "string",
    "groupTotal": 0,
    "split": {
      "email1@example.com": 0,
      "email2@example.com": 0
    }
  }
}
```

#### Update Group
```http
PUT /group/:groupId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "groupName": "string",
  "groupDescription": "string",
  "groupCurrency": "string",
  "groupCategory": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Group updated successfully",
  "data": {
    "_id": "string",
    "groupName": "string",
    "groupDescription": "string",
    "groupCurrency": "string",
    "groupOwner": "string",
    "groupMembers": ["string"],
    "groupCategory": "string",
    "groupTotal": 0,
    "split": {
      "email1@example.com": 0,
      "email2@example.com": 0
    }
  }
}
```

#### Delete Group
```http
DELETE /group/:groupId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Group deleted successfully"
}
```

#### Add Member to Group
```http
POST /group/:groupId/members
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member added successfully",
  "data": {
    "groupMembers": ["string"],
    "split": {
      "email1@example.com": 0,
      "email2@example.com": 0,
      "newemail@example.com": 0
    }
  }
}
```

#### Remove Member from Group
```http
DELETE /group/:groupId/members/:email
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

#### Get Group Settlements
```http
GET /group/:groupId/settlements
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "groupId": "string",
      "settleTo": "string",
      "settleFrom": "string",
      "settleDate": "string",
      "settleAmount": 0
    }
  ]
}
```

### Expense Routes (`/expense`)

#### Create Expense
```http
POST /expense
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "groupId": "string",
  "expenseName": "string",
  "expenseDescription": "string (optional)",
  "expenseAmount": 0,
  "expenseCategory": "string (optional)",
  "expenseCurrency": "EUR|USD|BDT",
  "expenseDate": "date",
  "expenseOwner": "string",
  "expenseMembers": ["email1@example.com", "email2@example.com"],
  "expenseType": "Cash|Card"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "_id": "string",
    "groupId": "string",
    "expenseName": "string",
    "expenseDescription": "string",
    "expenseAmount": 0,
    "expenseCategory": "string",
    "expenseCurrency": "string",
    "expenseDate": "date",
    "expenseOwner": "string",
    "expenseMembers": ["string"],
    "expensePerMember": 0,
    "expenseType": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### Get All Expenses
```http
GET /expense
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "groupId": "string",
      "expenseName": "string",
      "expenseDescription": "string",
      "expenseAmount": 0,
      "expenseCategory": "string",
      "expenseCurrency": "string",
      "expenseDate": "date",
      "expenseOwner": "string",
      "expenseMembers": ["string"],
      "expensePerMember": 0,
      "expenseType": "string"
    }
  ]
}
```

#### Get Expense by ID
```http
GET /expense/:expenseId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "groupId": "string",
    "expenseName": "string",
    "expenseDescription": "string",
    "expenseAmount": 0,
    "expenseCategory": "string",
    "expenseCurrency": "string",
    "expenseDate": "date",
    "expenseOwner": "string",
    "expenseMembers": ["string"],
    "expensePerMember": 0,
    "expenseType": "string"
  }
}
```

#### Update Expense
```http
PUT /expense/:expenseId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "groupId": "string",
  "expenseName": "string",
  "expenseDescription": "string",
  "expenseAmount": 0,
  "expenseCategory": "string",
  "expenseCurrency": "string",
  "expenseDate": "date",
  "expenseOwner": "string",
  "expenseMembers": ["string"],
  "expenseType": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "_id": "string",
    "groupId": "string",
    "expenseName": "string",
    "expenseDescription": "string",
    "expenseAmount": 0,
    "expenseCategory": "string",
    "expenseCurrency": "string",
    "expenseDate": "date",
    "expenseOwner": "string",
    "expenseMembers": ["string"],
    "expensePerMember": 0,
    "expenseType": "string"
  }
}
```

#### Delete Expense
```http
DELETE /expense/:expenseId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

### Group Expense Routes (`/expense/group`)

#### Get Group Expenses
```http
GET /expense/group/:groupId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "groupId": "string",
      "expenseName": "string",
      "expenseDescription": "string",
      "expenseAmount": 0,
      "expenseCategory": "string",
      "expenseCurrency": "string",
      "expenseDate": "date",
      "expenseOwner": "string",
      "expenseMembers": ["string"],
      "expensePerMember": 0,
      "expenseType": "string"
    }
  ]
}
```

#### Get Group Daily Expenses
```http
GET /expense/group/:groupId/daily
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "date": 15,
        "month": 12,
        "year": 2024
      },
      "amount": 150.50
    }
  ]
}
```

#### Get Group Monthly Expenses
```http
GET /expense/group/:groupId/monthly
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "month": 12,
        "year": 2024
      },
      "amount": 1250.75
    }
  ]
}
```

#### Get Group Expenses by Category
```http
GET /expense/group/:groupId/category
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "Food",
      "amount": 450.25
    },
    {
      "_id": "Transport",
      "amount": 200.00
    }
  ]
}
```

### User Expense Routes (`/expense/user`)

#### Get User Expenses
```http
GET /expense/user
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "groupId": "string",
      "expenseName": "string",
      "expenseDescription": "string",
      "expenseAmount": 0,
      "expenseCategory": "string",
      "expenseCurrency": "string",
      "expenseDate": "date",
      "expenseOwner": "string",
      "expenseMembers": ["string"],
      "expensePerMember": 0,
      "expenseType": "string"
    }
  ]
}
```

#### Get User Daily Expenses
```http
GET /expense/user/daily
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "date": 15,
        "month": 12,
        "year": 2024
      },
      "amount": 75.25
    }
  ]
}
```

#### Get User Monthly Expenses
```http
GET /expense/user/monthly
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "month": 12,
        "year": 2024
      },
      "amount": 625.50
    }
  ]
}
```

#### Get User Expenses by Category
```http
GET /expense/user/category
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "Food",
      "amount": 225.15
    },
    {
      "_id": "Transport",
      "amount": 100.00
    }
  ]
}
```

#### Get Recent User Expenses
```http
GET /expense/user/recent
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "groupId": "string",
      "expenseName": "string",
      "expenseDescription": "string",
      "expenseAmount": 0,
      "expenseCategory": "string",
      "expenseCurrency": "string",
      "expenseDate": "date",
      "expenseOwner": "string",
      "expenseMembers": ["string"],
      "expensePerMember": 0,
      "expenseType": "string"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token or token expired"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Data Types

### Currency Enum
- `EUR` - Euro
- `USD` - US Dollar
- `BDT` - Bangladeshi Taka

### Expense Type Enum
- `Cash` - Cash payment
- `Card` - Card payment

### Date Format
All dates are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

## Rate Limiting
Currently, no rate limiting is implemented. Future versions will include rate limiting for API protection.

## Pagination
Currently, no pagination is implemented. All endpoints return all available data. Future versions will include pagination for large datasets.
