# TenantBase API Documentation

## Overview

TenantBase is a multi-tenant project management system built with Node.js, Express, TypeScript, and Prisma. The API provides authentication, tenant management, project management, and task management functionality.

## Base URL

```
http://localhost:3000
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### User
```typescript
{
  id: string (cuid)
  name: string
  email: string (unique)
  password: string (hashed)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Tenant
```typescript
{
  id: string (cuid)
  name: string
  domain?: string
  plan: "FREE" | "PREMIUM" | "ENTERPRISE"
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Project
```typescript
{
  id: string (cuid)
  name: string
  tenantId: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Task
```typescript
{
  id: string (cuid)
  title: string
  description: string
  status: string (default: "todo")
  projectId: string
  assigneeId?: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Membership
```typescript
{
  id: string (cuid)
  role: "ADMIN" | "MEMBER"
  tenantId: string
  userId: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

## API Endpoints

### Authentication Routes (`/auth`)

#### Register User
**POST** `/auth/register`

Creates a new user account.

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
  "message": "User created sucessfully"
}
```

**Error Responses:**
- `400` - Email already exists
- `500` - Registration failed

---

#### Login User
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

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
  "message": "User login sucesfully",
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

**Error Responses:**
- `400` - Email does not exist or wrong password
- `500` - Login failed

---

### Tenant Routes (`/tenant`)

#### Get User's Tenants
**GET** `/tenant/my`

Returns all tenants that the authenticated user is a member of.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Your tenants",
  "tenants": [
    {
      "id": "string",
      "name": "string",
      "domain": "string",
      "plan": "FREE" | "PREMIUM" | "ENTERPRISE",
      "role": "ADMIN" | "MEMBER"
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Failed to fetch tenants

---

#### Create Tenant
**POST** `/tenant/`

Creates a new tenant and makes the authenticated user an ADMIN.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",
  "domain": "string (optional)",
  "plan": "FREE" | "PREMIUM" | "ENTERPRISE (optional, defaults to FREE)"
}
```

**Response:**
```json
{
  "message": "Tenant created successfully. You are now ADMIN.",
  "tenantId": "string",
  "tenant": {
    "id": "string",
    "name": "string",
    "domain": "string",
    "plan": "FREE" | "PREMIUM" | "ENTERPRISE",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}
```

**Error Responses:**
- `400` - Tenant name is required
- `401` - Unauthorized
- `500` - Failed to create tenant

---

#### Join Tenant
**POST** `/tenant/join`

Allows the authenticated user to join an existing tenant as a MEMBER.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "tenantId": "string"
}
```

**Response:**
```json
{
  "message": "Successfully joined tenant: <tenant-name>",
  "tenantId": "string",
  "membership": {
    "id": "string",
    "role": "MEMBER",
    "tenantId": "string",
    "userId": "string",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}
```

**Error Responses:**
- `400` - Tenant ID is required or already a member
- `401` - Unauthorized
- `404` - Tenant not found
- `500` - Failed to join tenant

---

### Project Routes (`/project`)

#### Create Project
**POST** `/project/`

Creates a new project within a tenant. Only ADMIN users can create projects.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",
  "tenantId": "string"
}
```

**Response:**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "string",
    "name": "string",
    "tenantId": "string",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}
```

**Error Responses:**
- `400` - Tenant ID and Project name are required
- `401` - Unauthorized
- `403` - Not a member of tenant or not an admin
- `500` - Failed to create project

---

#### Get Projects by Tenant
**GET** `/project/list/:tenantId`

Returns all projects within a specific tenant.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `tenantId` (string) - The ID of the tenant

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "tenantId": "string",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
]
```

**Error Responses:**
- `400` - Tenant ID is required
- `401` - Unauthorized
- `403` - Not a member of this tenant
- `500` - Failed to fetch projects

---

### Task Routes (`/task`)

#### Create Task
**POST** `/task/`

Creates a new task within a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "projectId": "string",
  "title": "string",
  "description": "string (optional)",
  "assigneeId": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "todo",
    "projectId": "string",
    "assigneeId": "string",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}
```

**Error Responses:**
- `400` - Project ID and title are required
- `401` - Unauthorized
- `403` - Not a member of this tenant
- `404` - Project not found
- `500` - Failed to create task

---

#### Get Tasks by Project
**GET** `/task/:projectId`

Returns all tasks within a specific project.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `projectId` (string) - The ID of the project

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "string",
    "projectId": "string",
    "assigneeId": "string",
    "createdAt": "DateTime",
    "updatedAt": "DateTime",
    "assignee": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
]
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Not a member of this tenant
- `404` - Project not found
- `500` - Failed to fetch tasks

---

#### Update Task
**PUT** `/task/:taskId`

Updates an existing task.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `taskId` (string) - The ID of the task

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "string (optional)",
  "assigneeId": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Task updated successfully",
  "updatedTask": {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "string",
    "projectId": "string",
    "assigneeId": "string",
    "createdAt": "DateTime",
    "updatedAt": "DateTime"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Not a member of this tenant
- `404` - Task not found
- `500` - Failed to update task

---

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

All error responses follow this format:
```json
{
  "message": "Error description"
}
```

## Authentication Flow

1. **Register** a new user using `POST /auth/register`
2. **Login** using `POST /auth/login` to get a JWT token
3. **Include the token** in the Authorization header for all protected routes
4. **Token expires** after 3 hours

## Multi-Tenant Architecture

The system implements a multi-tenant architecture where:

- Users can be members of multiple tenants
- Each tenant can have multiple projects
- Each project can have multiple tasks
- Users have roles (ADMIN/MEMBER) within each tenant
- Only ADMIN users can create projects
- All tenant members can create and manage tasks

## Database Schema

The system uses PostgreSQL with Prisma ORM. Key relationships:

- `User` ↔ `Membership` ↔ `Tenant` (many-to-many)
- `Tenant` → `Project` (one-to-many)
- `Project` → `Task` (one-to-many)
- `User` → `Task` (one-to-many, as assignee)

## Environment Variables

Required environment variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-secret-key
```

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Run database migrations: `npx prisma migrate dev`
4. Start the server: `npm start`
5. The server will run on `http://localhost:3000`

## Example Usage

### Complete Workflow

1. **Register a user:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

3. **Create a tenant:**
```bash
curl -X POST http://localhost:3000/tenant/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"name":"My Company","domain":"mycompany.com","plan":"PREMIUM"}'
```

4. **Create a project:**
```bash
curl -X POST http://localhost:3000/project/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"name":"Website Redesign","tenantId":"<tenant-id>"}'
```

5. **Create a task:**
```bash
curl -X POST http://localhost:3000/task/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"projectId":"<project-id>","title":"Design homepage","description":"Create new homepage design"}'
```

This documentation covers all the available endpoints and their usage in the TenantBase API.
