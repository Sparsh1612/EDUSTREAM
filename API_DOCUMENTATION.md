# EduStream API - Authentication & Users

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints except registration, login, and health check require a JWT bearer token in the Authorization header:

```bash
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### 1. Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

**Error Responses:**
- `409 Conflict`: User with email already exists
- `400 Bad Request`: Invalid input

---

### 2. Login User
**POST** `/auth/login`

Authenticates user and returns access/refresh tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid email or password
- `400 Bad Request`: Invalid input

---

### 3. Refresh Token
**POST** `/auth/refresh`

Generates new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired refresh token

---

### 4. Logout
**POST** `/auth/logout`

Invalidates refresh token. Requires authentication.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Get Current User
**POST** `/auth/me`

Returns authenticated user info. Requires authentication.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "isActive": true,
  "emailVerified": false,
  "subscriptionTier": "free",
  "createdAt": "2024-01-23T10:00:00Z",
  "updatedAt": "2024-01-23T10:00:00Z"
}
```

---

## Users Endpoints

### 1. Get Current User Profile
**GET** `/users/profile`

Returns authenticated user's profile. Requires authentication.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "avatar": "https://...",
  "bio": "Student at EduStream",
  "subscriptionTier": "free",
  "createdAt": "2024-01-23T10:00:00Z",
  "updatedAt": "2024-01-23T10:00:00Z"
}
```

---

### 2. Update User Profile
**PUT** `/users/profile`

Updates authenticated user's profile. Requires authentication.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://...",
  "bio": "Updated bio"
}
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "avatar": "https://...",
  "bio": "Updated bio",
  "subscriptionTier": "free",
  "createdAt": "2024-01-23T10:00:00Z",
  "updatedAt": "2024-01-23T12:00:00Z"
}
```

---

### 3. Get User by ID (Admin Only)
**GET** `/users/:id`

Retrieves user by ID. Requires authentication and admin role.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  ...
}
```

**Error Responses:**
- `403 Forbidden`: Insufficient permissions (not admin)
- `404 Not Found`: User not found

---

### 4. List All Users (Admin Only)
**GET** `/users?skip=0&limit=10`

Lists all users with pagination. Requires authentication and admin role.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `skip` (optional): Number of users to skip (default: 0)
- `limit` (optional): Number of users to return (default: 10)

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    ...
  },
  ...
]
```

---

### 5. Change User Role (Admin Only)
**PATCH** `/users/:id/role`

Changes user's role. Requires authentication and admin role.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "role": "instructor"
}
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "instructor",
  ...
}
```

**Allowed Roles:** `student`, `instructor`, `admin`

---

### 6. Deactivate User (Admin Only)
**DELETE** `/users/:id`

Deactivates a user (sets isActive to false). Requires authentication and admin role.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": false,
  ...
}
```

---

## Health Check

### Health Status
**GET** `/health`

Returns service health status. Does not require authentication.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-23T10:00:00Z",
  "uptime": 123.45,
  "environment": "development",
  "services": {
    "database": "connected",
    "redis": "connected",
    "rabbitmq": "connected"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "SecurePassword123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "firstName": "John",
    "bio": "Updated bio"
  }'
```

### Health Check
```bash
curl http://localhost:3000/health
```

---

## Token Details

### JWT Structure
Both access and refresh tokens follow JWT (JSON Web Token) standard:

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "student",
  "iat": 1705993200,
  "exp": 1706598000
}
```

**Signature:**
```
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Token Expiration
- Access Token: 7 days (configurable via `JWT_EXPIRATION`)
- Refresh Token: 30 days (configurable via `REFRESH_TOKEN_EXPIRATION`)

---

## Authentication Flow

1. **Register/Login**: Send credentials → Receive `accessToken` + `refreshToken`
2. **Protected Request**: Include `accessToken` in Authorization header
3. **Token Expires**: Use `refreshToken` to get new `accessToken`
4. **Logout**: Server clears `refreshToken`

---

## Rate Limiting

API enforces rate limiting: **100 requests per 15 minutes** per IP address.

Response header when rate limited:
```
Retry-After: 600
```

---

**Interactive API documentation available at:** `http://localhost:3000/api/docs`
