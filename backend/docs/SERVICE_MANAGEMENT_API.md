# Service Management API - Complete Documentation

## Overview

The Service Management API provides full CRUD operations for managing services in the ReservaFácil booking system. All endpoints are protected and require authentication via JWT token.

**Base URL:** `/api/services`

**Authentication:** All routes require `Authorization: Bearer <token>` header

---

## API Endpoints

### 1. Create Service
**POST** `/api/services`

Creates a new service for the authenticated user.

**Request Body:**
```json
{
  "name": "Haircut",
  "description": "Professional haircut service",
  "durationMinutes": 60,
  "price": 25.00,
  "bufferTimeMinutes": 15,
  "category": "Hair Services",
  "depositRequired": true,
  "depositAmount": 10.00,
  "depositPercentage": 40,
  "maxAdvanceDays": 90,
  "minAdvanceHours": 2,
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true
}
```

**Required Fields:**
- `name` (string, 2-255 chars)
- `durationMinutes` (number, min 1)
- `price` (number, min 0)

**Optional Fields:**
- `description` (string)
- `bufferTimeMinutes` (number, default: 0)
- `category` (string)
- `depositRequired` (boolean, default: false)
- `depositAmount` (number)
- `depositPercentage` (number, 0-100)
- `maxAdvanceDays` (number, default: 90)
- `minAdvanceHours` (number, default: 2)
- `imageUrl` (valid URI string)
- `isActive` (boolean, default: true)

**Success Response (201):**
```json
{
  "message": "Service created successfully",
  "service": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Haircut",
    "description": "Professional haircut service",
    "durationMinutes": 60,
    "price": "25.00",
    "bufferTimeMinutes": 15,
    "category": "Hair Services",
    "depositRequired": true,
    "depositAmount": "10.00",
    "depositPercentage": 40,
    "maxAdvanceDays": 90,
    "minAdvanceHours": 2,
    "imageUrl": "https://example.com/image.jpg",
    "isActive": true,
    "displayOrder": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error or duplicate service name
- `401` - Unauthorized (missing/invalid token)
- `500` - Server error

**Implementation:** `backend/src/controllers/services.controller.js:11-90`

---

### 2. Get All Services
**GET** `/api/services`

Retrieves all services for the authenticated user, sorted by display order.

**Query Parameters:**
- `includeInactive` (boolean) - Set to `true` to include inactive services. Default: only active services

**Example Request:**
```
GET /api/services
GET /api/services?includeInactive=true
```

**Success Response (200):**
```json
{
  "services": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "Haircut",
      "description": "Professional haircut service",
      "durationMinutes": 60,
      "price": "25.00",
      "bufferTimeMinutes": 15,
      "category": "Hair Services",
      "depositRequired": true,
      "depositAmount": "10.00",
      "depositPercentage": 40,
      "maxAdvanceDays": 90,
      "minAdvanceHours": 2,
      "imageUrl": "https://example.com/image.jpg",
      "isActive": true,
      "displayOrder": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "bookings": 5
      }
    }
  ],
  "count": 1
}
```

**Features:**
- Filters by authenticated user's ID
- Orders by `displayOrder` (ascending), then `createdAt` (descending)
- Includes booking count for each service
- Only returns active services by default

**Error Responses:**
- `401` - Unauthorized
- `500` - Server error

**Implementation:** `backend/src/controllers/services.controller.js:96-132`

---

### 3. Get Service by ID
**GET** `/api/services/:id`

Retrieves a single service by ID. Only returns services owned by the authenticated user.

**URL Parameters:**
- `id` (UUID) - Service ID

**Example Request:**
```
GET /api/services/123e4567-e89b-12d3-a456-426614174000
```

**Success Response (200):**
```json
{
  "service": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Haircut",
    "durationMinutes": 60,
    "price": "25.00",
    "isActive": true,
    "_count": {
      "bookings": 5
    }
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Service not found or not owned by user
- `500` - Server error

**Implementation:** `backend/src/controllers/services.controller.js:138-169`

---

### 4. Update Service
**PUT** `/api/services/:id`

Updates an existing service. Only the service owner can update.

**URL Parameters:**
- `id` (UUID) - Service ID

**Request Body:**
Same as Create Service. All fields from the create endpoint are supported. The service will be updated with the provided values, maintaining existing values for omitted optional fields.

**Example Request:**
```json
{
  "name": "Premium Haircut",
  "price": 35.00,
  "durationMinutes": 75
}
```

**Success Response (200):**
```json
{
  "message": "Service updated successfully",
  "service": {
    "id": "uuid",
    "name": "Premium Haircut",
    "price": "35.00",
    "durationMinutes": 75,
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Features:**
- Validates input with Joi schema
- Verifies ownership before updating
- Supports partial updates (only specified fields are updated)
- Returns updated service data

**Error Responses:**
- `400` - Validation error or duplicate service name
- `401` - Unauthorized
- `404` - Service not found or not owned by user
- `500` - Server error

**Implementation:** `backend/src/controllers/services.controller.js:175-264`

---

### 5. Delete Service
**DELETE** `/api/services/:id`

Deletes a service. Only the service owner can delete.

**URL Parameters:**
- `id` (UUID) - Service ID

**Business Logic Protection:**
- Services with existing bookings **cannot be deleted**
- If service has bookings, returns 400 error suggesting deactivation instead
- This prevents data integrity issues and maintains booking history

**Success Response (200):**
```json
{
  "message": "Service deleted successfully"
}
```

**Error Responses:**
- `400` - Service has existing bookings (cannot delete)
  ```json
  {
    "error": "Cannot delete service with existing bookings. Consider deactivating it instead."
  }
  ```
- `401` - Unauthorized
- `404` - Service not found or not owned by user
- `500` - Server error

**Alternative:** Use Update endpoint to set `isActive: false` to deactivate instead of deleting.

**Implementation:** `backend/src/controllers/services.controller.js:270-322`

---

### 6. Reorder Services
**PATCH** `/api/services/reorder`

Bulk updates the display order of services.

**Request Body:**
```json
{
  "serviceOrders": [
    { "id": "uuid-1", "displayOrder": 0 },
    { "id": "uuid-2", "displayOrder": 1 },
    { "id": "uuid-3", "displayOrder": 2 }
  ]
}
```

**Success Response (200):**
```json
{
  "message": "Services reordered successfully"
}
```

**Features:**
- Validates all services belong to the authenticated user
- Updates multiple services in a single transaction
- Returns 403 if any service is not found or unauthorized

**Error Responses:**
- `400` - Invalid input (must be non-empty array)
- `401` - Unauthorized
- `403` - One or more services not found or unauthorized
- `500` - Server error

**Implementation:** `backend/src/controllers/services.controller.js:328-377`

---

## Authentication

All endpoints require JWT authentication:

```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The token is verified by the `authenticate` middleware which:
1. Extracts the Bearer token from the Authorization header
2. Verifies the JWT signature with `JWT_SECRET`
3. Checks if the user still exists in the database
4. Attaches `req.userId` and `req.user` to the request

**Middleware:** `backend/src/middleware/auth.middleware.js`

---

## Data Validation

Input validation is performed using Joi schemas before any database operations.

**Service Validation Rules:**

```javascript
{
  name: string (2-255 chars) - required
  description: string - optional
  durationMinutes: number (min 1) - required
  price: number (min 0) - required
  bufferTimeMinutes: number (min 0) - optional, default 0
  category: string - optional
  depositRequired: boolean - optional, default false
  depositAmount: number (min 0) - optional
  depositPercentage: number (0-100) - optional
  maxAdvanceDays: number (min 1) - optional, default 90
  minAdvanceHours: number (min 0) - optional, default 2
  imageUrl: valid URI - optional
  isActive: boolean - optional, default true
}
```

**Validator:** `backend/src/utils/validators.js:68-136`

---

## Database Schema

**Table:** `services`

```prisma
model Service {
  id                 String   @id @default(uuid())
  userId             String   @map("user_id")
  name               String
  description        String?  @db.Text
  durationMinutes    Int      @map("duration_minutes")
  price              Decimal  @db.Decimal(10, 2)
  bufferTimeMinutes  Int      @default(0) @map("buffer_time_minutes")
  category           String?
  depositRequired    Boolean  @default(false) @map("deposit_required")
  depositAmount      Decimal? @db.Decimal(10, 2) @map("deposit_amount")
  depositPercentage  Int?     @map("deposit_percentage")
  maxAdvanceDays     Int      @default(90) @map("max_advance_days")
  minAdvanceHours    Int      @default(2) @map("min_advance_hours")
  imageUrl           String?  @map("image_url") @db.Text
  isActive           Boolean  @default(true) @map("is_active")
  displayOrder       Int      @default(0) @map("display_order")
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookings Booking[]
}
```

**Key Features:**
- UUID primary keys
- Cascade delete with User (deleting user removes all services)
- Decimal precision for currency (10,2)
- Automatic timestamps
- Foreign key constraints

**Schema:** `backend/prisma/schema.prisma:52-77`

---

## Error Handling

The API uses a centralized error handler that processes Prisma errors and standard HTTP errors.

**Prisma Error Codes:**
- `P2002` - Unique constraint violation (duplicate name) → 400 Bad Request
- `P2025` - Record not found → 404 Not Found

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, business logic violation)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Detailed error message"
}
```

**Error Handler:** `backend/src/middleware/errorHandler.js`

---

## Logging

All service operations are logged using Winston logger:

- Service creation: `Service created: {id} by user: {userId}`
- Service updates: `Service updated: {id} by user: {userId}`
- Service deletion: `Service deleted: {id} by user: {userId}`
- Service reordering: `Services reordered by user: {userId}`
- Errors are logged with full stack traces

**Logger:** `backend/src/utils/logger.js`

---

## Security Features

1. **Authentication Required:** All endpoints protected by JWT middleware
2. **Ownership Verification:** Users can only access/modify their own services
3. **Input Validation:** Joi schemas validate all inputs before processing
4. **Rate Limiting:** General API limit (100 req/15min)
5. **CORS Protection:** Restricted to configured frontend URL
6. **Helmet.js:** Security headers for Express
7. **SQL Injection Prevention:** Prisma ORM with parameterized queries

**Security Middleware:** `backend/src/server.js:29-58`

---

## Setup Instructions

### 1. Environment Configuration

Create `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/reservafacil"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates database tables)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

---

## Testing the API

### Example: Create and Manage a Service

```bash
# 1. Register/Login to get JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response: { "token": "eyJhbG...", "user": {...} }

# 2. Create a service
curl -X POST http://localhost:5000/api/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Haircut",
    "description": "Professional haircut",
    "durationMinutes": 60,
    "price": 25.00,
    "category": "Hair Services"
  }'

# 3. Get all services
curl http://localhost:5000/api/services \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Update a service
curl -X PUT http://localhost:5000/api/services/SERVICE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Premium Haircut",
    "price": 35.00
  }'

# 5. Delete a service
curl -X DELETE http://localhost:5000/api/services/SERVICE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Frontend Integration

The frontend is configured to consume this API using the `serviceService` utility:

**Frontend Service:** `frontend/src/services/serviceService.js`

**Usage Example:**
```javascript
import serviceService from '@/services/serviceService';

// Create service
const newService = await serviceService.createService({
  name: 'Haircut',
  durationMinutes: 60,
  price: 25.00
});

// Get all services
const services = await serviceService.getServices();

// Update service
await serviceService.updateService(serviceId, {
  price: 35.00
});

// Delete service
await serviceService.deleteService(serviceId);
```

The frontend automatically:
- Includes JWT token from localStorage
- Handles errors and displays user-friendly messages
- Refreshes the UI after operations

---

## Architecture Summary

```
┌─────────────────────────────────────────────────┐
│                  Client Request                 │
│         Authorization: Bearer <token>            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              Express Middleware                  │
│  • Helmet (Security Headers)                     │
│  • CORS (Origin Validation)                      │
│  • Rate Limiting                                 │
│  • Body Parsing                                  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         Authentication Middleware                │
│  • Verify JWT Token                              │
│  • Check User Exists                             │
│  • Attach req.userId                             │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│            Service Routes                        │
│  • POST /api/services                            │
│  • GET /api/services                             │
│  • GET /api/services/:id                         │
│  • PUT /api/services/:id                         │
│  • DELETE /api/services/:id                      │
│  • PATCH /api/services/reorder                   │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         Services Controller                      │
│  • Validate Input (Joi)                          │
│  • Check Ownership                               │
│  • Perform Database Operations (Prisma)          │
│  • Handle Business Logic                         │
│  • Log Operations                                │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│           PostgreSQL Database                    │
│  • Prisma ORM                                    │
│  • UUID Primary Keys                             │
│  • Foreign Key Constraints                       │
│  • Cascade Deletes                               │
└─────────────────────────────────────────────────┘
```

---

## Next Steps

The Service Management API is complete and production-ready. Consider:

1. **Testing:** Write unit and integration tests
2. **Documentation:** API docs are now available in this file
3. **Monitoring:** Add APM tools for production monitoring
4. **Backup:** Configure database backup strategy
5. **Deployment:** Deploy to production environment (Heroku, AWS, etc.)

---

## Support

- **Repository:** https://github.com/yourusername/reservafacil
- **Issues:** Report bugs via GitHub Issues
- **Documentation:** Full docs at `/backend/docs/`

---

**Status:** ✅ Production Ready

**Last Updated:** 2024-01-01

**Version:** 1.0.0
