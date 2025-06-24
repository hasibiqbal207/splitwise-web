# Postman Collection for Splitwise Backend

## Overview
This collection contains all API endpoints for the Splitwise Backend service, organized by functionality and ready for testing across different environments.

## 📁 Collection Structure

### Authentication
- **Register User** - Create new user account
- **Login User** - Authenticate and get JWT token
- **Get User Profile** - Retrieve current user information
- **Update User Profile** - Modify user profile data

### Groups
- **Create Group** - Create new expense group
- **Get All Groups** - Retrieve user's groups
- **Get Group by ID** - Get specific group details
- **Update Group** - Modify group settings
- **Delete Group** - Remove group
- **Add Member to Group** - Add user to group
- **Remove Member from Group** - Remove user from group
- **Get Group Settlements** - View group debt settlements

### Expenses
- **Create Expense** - Add new expense to group
- **Get All Expenses** - Retrieve all user expenses
- **Get Expense by ID** - Get specific expense details
- **Update Expense** - Modify expense details
- **Delete Expense** - Remove expense

### Group Expenses
- **Get Group Expenses** - Retrieve expenses for specific group
- **Get Group Daily Expenses** - Daily expense analytics
- **Get Group Monthly Expenses** - Monthly expense analytics
- **Get Group Expenses by Category** - Category-based analytics

### User Expenses
- **Get User Expenses** - Retrieve user's personal expenses
- **Get User Daily Expenses** - Daily personal expense analytics
- **Get User Monthly Expenses** - Monthly personal expense analytics
- **Get User Expenses by Category** - Personal category analytics
- **Get Recent User Expenses** - Latest user expenses

## �� Setup Instructions

### 1. Import Collection
1. Open Postman
2. Click "Import" button (top left)
3. Select `Splitwise-API.postman_collection.json`
4. Click "Import"

### 2. Import Environment
1. Click "Import" again
2. Select the appropriate environment file:
   - `Splitwise-Development.postman_environment.json` (for local development)
   - `Splitwise-Staging.postman_environment.json` (for staging)
   - `Splitwise-Production.postman_environment.json` (for production)
3. Click "Import"

### 3. Select Environment
1. In the top-right corner of Postman, select your imported environment
2. Verify the environment variables are loaded

### 4. Configure Environment Variables
The environment files include these variables:
- `base_url`: API base URL (e.g., http://localhost:4004/api/v1)
- `auth_token`: JWT authentication token (auto-set after login)
- `user_email`: Test user email
- `user_password`: Test user password
- `group_id`: Test group ID (auto-set after group creation)
- `expense_id`: Test expense ID (auto-set after expense creation)

## 🔐 Authentication Flow

### Step 1: Register a User
1. Use the "Register User" request
2. Set the request body with your test data:
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Step 2: Login
1. Use the "Login User" request
2. Set the request body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
3. The response will contain a JWT token
4. The token is automatically saved to the `auth_token` variable

### Step 3: Use Protected Endpoints
- All subsequent requests will automatically include the Authorization header
- The token is valid for 24 hours by default

## 📊 Testing Workflows

### Complete Expense Workflow
1. **Register User** → Create test account
2. **Login User** → Get authentication token
3. **Create Group** → Create expense group
4. **Add Member to Group** → Add another user
5. **Create Expense** → Add expense to group
6. **Get Group Expenses** → Verify expense creation
7. **Get Group Analytics** → View expense analytics

### User Analytics Workflow
1. **Login User** → Authenticate
2. **Get User Daily Expenses** → View daily spending
3. **Get User Monthly Expenses** → View monthly trends
4. **Get User Expenses by Category** → View spending categories

### Group Management Workflow
1. **Login User** → Authenticate
2. **Create Group** → Create new group
3. **Get All Groups** → Verify group creation
4. **Update Group** → Modify group settings
5. **Get Group Settlements** → View debt settlements

## �� Environment Configurations

### Development Environment
- **Base URL**: `http://localhost:4004/api/v1`
- **Database**: Local MongoDB
- **Logging**: Debug level
- **CORS**: Localhost origins

### Staging Environment
- **Base URL**: `https://staging-api.splitwise.com/api/v1`
- **Database**: Staging MongoDB cluster
- **Logging**: Info level
- **CORS**: Staging domain origins

### Production Environment
- **Base URL**: `https://api.splitwise.com/api/v1`
- **Database**: Production MongoDB cluster
- **Logging**: Error level only
- **CORS**: Production domain origins

## �� Request Examples

### User Registration
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

### Group Creation
```json
{
  "groupName": "Trip to Paris",
  "groupDescription": "Vacation expenses for Paris trip",
  "groupCurrency": "EUR",
  "groupMembers": ["jane@example.com", "bob@example.com"],
  "groupCategory": "Travel"
}
```

### Expense Creation
```json
{
  "groupId": "{{group_id}}",
  "expenseName": "Dinner at Restaurant",
  "expenseDescription": "Group dinner at Le Petit Bistro",
  "expenseAmount": 150.50,
  "expenseCategory": "Food",
  "expenseCurrency": "EUR",
  "expenseDate": "2024-01-15T19:30:00.000Z",
  "expenseOwner": "{{user_email}}",
  "expenseMembers": ["{{user_email}}", "jane@example.com", "bob@example.com"],
  "expenseType": "Card"
}
```

## 🔍 Response Examples

### Successful Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response
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

## 🧪 Testing Tips

### Pre-request Scripts
Some requests include pre-request scripts to:
- Generate dynamic timestamps
- Create unique test data
- Set up required variables

### Tests
Requests include tests to:
- Verify response status codes
- Validate response structure
- Extract and save variables for subsequent requests
- Check authentication token validity

### Data-Driven Testing
Use the `examples/` folder for:
- Sample request bodies
- Test data variations
- Edge case scenarios

## 🔄 Automation

### Newman CLI
Run the collection via command line:
```bash
# Install Newman
npm install -g newman

# Run collection
newman run postman/Splitwise-API.postman_collection.json -e postman/Splitwise-Development.postman_environment.json

# Run with reporting
newman run postman/Splitwise-API.postman_collection.json -e postman/Splitwise-Development.postman_environment.json --reporters cli,html
```

### CI/CD Integration
Add to your GitHub Actions workflow:
```yaml
- name: Run API Tests
  run: |
    newman run postman/Splitwise-API.postman_collection.json \
      -e postman/Splitwise-Development.postman_environment.json \
      --reporters cli,junit \
      --reporter-junit-export results.xml
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Token Expired**
   - Re-run the "Login User" request
   - Token expires after 24 hours

2. **Invalid Request Body**
   - Check the examples in the `examples/` folder
   - Verify required fields are included

3. **Environment Variables Not Set**
   - Ensure environment is selected
   - Check variable names match exactly

4. **CORS Errors**
   - Verify the base URL is correct
   - Check CORS configuration in the backend

### Debug Mode
Enable debug logging in Postman:
1. Go to Settings (gear icon)
2. Enable "Show response headers"
3. Enable "Show response size"
4. Enable "Show response time"

## 📚 Related Documentation

- [API Documentation](../docs/04_api_documentation.md) - Complete API reference
- [Authentication Guide](../docs/06_auth_and_authz.md) - Security implementation
- [Database Schema](../docs/05_database_schema.md) - Data structure details
- [Testing Plan](../docs/07_testing_plan.md) - Testing strategy

## �� Contributing

When updating the collection:
1. Test all endpoints before committing
2. Update environment variables if needed
3. Add new examples to the `examples/` folder
4. Update this README with any changes
5. Verify the collection works in all environments

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Compatible with**: Splitwise Backend v1.0.0+
