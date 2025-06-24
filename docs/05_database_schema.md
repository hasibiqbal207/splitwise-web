# Database Schema

## Overview
The Splitwise Backend Service uses MongoDB as the primary database with Mongoose ODM for schema definition and validation. The database consists of four main collections: `users`, `groups`, `expenses`, and `settlements`.

## Database Configuration
- **Database Type**: MongoDB (NoSQL Document Database)
- **ODM**: Mongoose
- **Connection**: MongoDB Atlas or local MongoDB instance
- **Collections**: 4 main collections with proper indexing

## Collections

### 1. Users Collection

**Collection Name**: `users`

**Schema Definition**:
```typescript
interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}
```

**Mongoose Schema**:
```javascript
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  collection: "users",
  timestamps: true,
});
```

**Indexes**:
- `email` (unique index)
- `createdAt` (for sorting)
- `updatedAt` (for tracking changes)

**Sample Document**:
```json
{
  "_id": "ObjectId('...')",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "$2b$10$hashedPassword...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Groups Collection

**Collection Name**: `groups`

**Schema Definition**:
```typescript
interface IGroup {
  groupName: string;
  groupDescription?: string;
  groupCurrency: string;
  groupOwner: string;
  groupMembers: string[];
  groupCategory: string;
  groupTotal: number;
  split: Record<string, number>;
}
```

**Mongoose Schema**:
```javascript
const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  groupDescription: {
    type: String,
  },
  groupCurrency: {
    type: String,
    default: "EUR",
  },
  groupOwner: {
    type: String,
    required: true,
  },
  groupMembers: {
    type: [String],
    required: true,
  },
  groupCategory: {
    type: String,
    default: "Others",
  },
  groupTotal: {
    type: Number,
    default: 0,
  },
  split: {
    type: Object,
    of: Number,
    required: true,
  },
}, {
  collection: "groups",
  timestamps: true,
});
```

**Indexes**:
- `groupOwner` (for user's groups)
- `groupMembers` (for member lookup)
- `createdAt` (for sorting)

**Sample Document**:
```json
{
  "_id": "ObjectId('...')",
  "groupName": "Trip to Paris",
  "groupDescription": "Vacation expenses for Paris trip",
  "groupCurrency": "EUR",
  "groupOwner": "john.doe@example.com",
  "groupMembers": [
    "john.doe@example.com",
    "jane.smith@example.com",
    "bob.wilson@example.com"
  ],
  "groupCategory": "Travel",
  "groupTotal": 1250.75,
  "split": {
    "john.doe@example.com": 450.25,
    "jane.smith@example.com": -200.00,
    "bob.wilson@example.com": -250.25
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 3. Expenses Collection

**Collection Name**: `expenses`

**Schema Definition**:
```typescript
enum Currency {
  EUR = "EUR",
  USD = "USD",
  BDT = "BDT",
}

enum ExpenseType {
  Cash = "Cash",
  Card = "Card",
}

interface IExpense {
  groupId: string;
  expenseName: string;
  expenseDescription?: string;
  expenseAmount: number;
  expenseCategory?: string;
  expenseCurrency?: Currency;
  expenseDate: Date;
  expenseOwner: string;
  expenseMembers: string[];
  expensePerMember: number;
  expenseType?: ExpenseType;
}
```

**Mongoose Schema**:
```javascript
const expenseSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
  },
  expenseName: {
    type: String,
    required: true,
  },
  expenseDescription: {
    type: String,
  },
  expenseAmount: {
    type: Number,
    required: true,
  },
  expenseCategory: {
    type: String,
    default: "Others",
  },
  expenseCurrency: {
    type: String,
    enum: ["EUR", "USD", "BDT"],
    default: "EUR",
  },
  expenseDate: {
    type: Date,
    default: Date.now,
  },
  expenseOwner: {
    type: String,
    required: true,
  },
  expenseMembers: {
    type: [String],
    required: true,
  },
  expensePerMember: {
    type: Number,
    required: true,
  },
  expenseType: {
    type: String,
    enum: ["Cash", "Card"],
    default: "Cash",
  },
}, {
  collection: "expenses",
  timestamps: true,
});
```

**Indexes**:
- `groupId` (for group expenses)
- `expenseOwner` (for user's expenses)
- `expenseMembers` (for member's expenses)
- `expenseDate` (for date-based queries)
- `expenseCategory` (for category-based queries)

**Sample Document**:
```json
{
  "_id": "ObjectId('...')",
  "groupId": "ObjectId('...')",
  "expenseName": "Dinner at Restaurant",
  "expenseDescription": "Group dinner at Le Petit Bistro",
  "expenseAmount": 150.50,
  "expenseCategory": "Food",
  "expenseCurrency": "EUR",
  "expenseDate": "2024-01-15T19:30:00.000Z",
  "expenseOwner": "john.doe@example.com",
  "expenseMembers": [
    "john.doe@example.com",
    "jane.smith@example.com",
    "bob.wilson@example.com"
  ],
  "expensePerMember": 50.17,
  "expenseType": "Card",
  "createdAt": "2024-01-15T19:30:00.000Z",
  "updatedAt": "2024-01-15T19:30:00.000Z"
}
```

### 4. Settlements Collection

**Collection Name**: `settlements`

**Schema Definition**:
```typescript
interface ISettlement {
  groupId: string;
  settleTo: string;
  settleFrom: string;
  settleDate: string;
  settleAmount: number;
}
```

**Mongoose Schema**:
```javascript
const settlementSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
  },
  settleTo: {
    type: String,
    required: true,
  },
  settleFrom: {
    type: String,
    required: true,
  },
  settleDate: {
    type: String,
    required: true,
  },
  settleAmount: {
    type: Number,
    required: true,
  },
}, {
  collection: "settlements",
  timestamps: true,
});
```

**Indexes**:
- `groupId` (for group settlements)
- `settleTo` (for user's received settlements)
- `settleFrom` (for user's sent settlements)
- `settleDate` (for date-based queries)

**Sample Document**:
```json
{
  "_id": "ObjectId('...')",
  "groupId": "ObjectId('...')",
  "settleTo": "john.doe@example.com",
  "settleFrom": "jane.smith@example.com",
  "settleDate": "2024-01-16",
  "settleAmount": 200.00,
  "createdAt": "2024-01-16T10:00:00.000Z",
  "updatedAt": "2024-01-16T10:00:00.000Z"
}
```

## Relationships

### 1. User-Group Relationship
- **One-to-Many**: A user can be a member of multiple groups
- **Many-to-Many**: Groups can have multiple members
- **Reference**: Group members are stored as email strings in the `groupMembers` array

### 2. Group-Expense Relationship
- **One-to-Many**: A group can have multiple expenses
- **Reference**: Expenses reference groups via `groupId` field

### 3. User-Expense Relationship
- **Many-to-Many**: Users can be involved in multiple expenses
- **Reference**: Expense participants are stored in `expenseMembers` array

### 4. Group-Settlement Relationship
- **One-to-Many**: A group can have multiple settlements
- **Reference**: Settlements reference groups via `groupId` field

## Data Validation

### 1. User Validation
- Email must be unique across all users
- Password is hashed using bcrypt before storage
- First name is required, last name is optional

### 2. Group Validation
- Group name is required
- Group owner must be a valid user email
- Group members must be valid user emails
- Group currency must be one of: EUR, USD, BDT

### 3. Expense Validation
- Expense amount must be positive
- Expense owner must be in expense members list
- Expense currency must match group currency
- Expense type must be either "Cash" or "Card"

### 4. Settlement Validation
- Settlement amount must be positive
- SettleTo and settleFrom must be different users
- Both users must be group members

## Indexing Strategy

### Primary Indexes
- `_id`: Default MongoDB ObjectId index
- `email` (users): Unique index for user lookup
- `groupId` (expenses): For group expense queries
- `expenseOwner` (expenses): For user's expenses
- `expenseMembers` (expenses): For member's expenses

### Secondary Indexes
- `createdAt` (all collections): For sorting and date-based queries
- `expenseDate` (expenses): For date-based expense queries
- `expenseCategory` (expenses): For category-based queries
- `groupOwner` (groups): For user's owned groups
- `groupMembers` (groups): For user's group memberships

## Data Consistency

### 1. Referential Integrity
- Group members must exist as users
- Expense owners must be group members
- Settlement participants must be group members

### 2. Balance Consistency
- Group total must equal sum of all expense amounts
- Individual balances must sum to zero within each group
- Settlement amounts must be positive

### 3. Currency Consistency
- All expenses in a group must use the same currency
- Settlements inherit group currency

## Backup and Recovery

### 1. Backup Strategy
- **Automated Backups**: Daily automated backups
- **Point-in-Time Recovery**: Support for point-in-time recovery
- **Geographic Distribution**: Backups stored in multiple locations

### 2. Recovery Procedures
- **Full Database Recovery**: Complete database restoration
- **Collection Recovery**: Individual collection restoration
- **Data Validation**: Post-recovery data integrity checks

## Performance Considerations

### 1. Query Optimization
- Proper indexing on frequently queried fields
- Aggregation pipeline optimization for analytics
- Compound indexes for complex queries

### 2. Storage Optimization
- Efficient data types for numeric values
- Proper use of embedded documents vs. references
- Regular cleanup of old data

### 3. Connection Management
- Connection pooling for efficient database connections
- Proper connection timeout and retry logic
- Monitoring of connection health
