# Splitwise API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### Login

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
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### Get Current User

```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "friends": [],
  "groups": []
}
```

## Users

### Get All Users

```http
GET /users
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string"
  }
]
```

### Get User by ID

```http
GET /users/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "friends": [],
  "groups": []
}
```

### Update User

```http
PUT /users/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string"
}
```

## Groups

### Create Group

```http
POST /groups
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",
  "members": ["userId1", "userId2"]
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "members": [
    {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  ],
  "createdBy": {
    "id": "string",
    "name": "string"
  }
}
```

### Get All Groups

```http
GET /groups
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "members": [],
    "expenses": []
  }
]
```

### Get Group by ID

```http
GET /groups/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "members": [],
  "expenses": [],
  "createdBy": {
    "id": "string",
    "name": "string"
  }
}
```

## Expenses

### Create Expense

```http
POST /expenses
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "string",
  "amount": "number",
  "groupId": "string",
  "splitBetween": [
    {
      "userId": "string",
      "amount": "number"
    }
  ]
}
```

**Response:**
```json
{
  "id": "string",
  "description": "string",
  "amount": "number",
  "paidBy": {
    "id": "string",
    "name": "string"
  },
  "splitBetween": [
    {
      "user": {
        "id": "string",
        "name": "string"
      },
      "amount": "number"
    }
  ],
  "group": {
    "id": "string",
    "name": "string"
  },
  "date": "string"
}
```

### Get All Expenses

```http
GET /expenses
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `groupId` (optional): Filter by group
- `userId` (optional): Filter by user
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

**Response:**
```json
[
  {
    "id": "string",
    "description": "string",
    "amount": "number",
    "paidBy": {},
    "splitBetween": [],
    "group": {},
    "date": "string"
  }
]
```

### Get Expense by ID

```http
GET /expenses/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "description": "string",
  "amount": "number",
  "paidBy": {},
  "splitBetween": [],
  "group": {},
  "date": "string"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

The API implements rate limiting with the following defaults:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## Pagination

List endpoints support pagination using the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Example:
```http
GET /api/expenses?page=2&limit=20
```

## Sorting

List endpoints support sorting using the following query parameters:
- `sort`: Field to sort by
- `order`: Sort order (asc/desc)

Example:
```http
GET /api/expenses?sort=date&order=desc
``` 