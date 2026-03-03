# Book Management Backend (TypeScript)

A TypeScript-based RESTful API for managing books, users, orders, and borrowing in a library management system.

## Features

- **User Management**: Registration, authentication, profiles, favorites
- **Book Catalog**: CRUD operations, search, filtering, categories, authors
- **Borrowing System**: Request, approve/reject, return, late fee calculation
- **Order System**: Cart, checkout, order tracking, payment status
- **Admin Dashboard**: Statistics, inventory alerts, user management

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Express 5.x
- **Database**: MongoDB with Mongoose 8.x
- **Validation**: Zod 3.x
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer

## Project Structure

```
src/
├── handlers/       # Request handlers (controllers)
├── middlewares/    # Express middlewares
├── models/         # Mongoose models
├── routers/        # Express routers
├── services/       # Business services (db, email, upload)
├── types/          # TypeScript type definitions
│   └── models/     # Model interfaces
├── utils/          # Utility functions
├── validation/     # Zod validation schemas
├── app.ts          # Express app configuration
└── index.ts        # Server entry point
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# Clone the repository
cd book-management-back-ts

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=book_management

# Authentication
AUTH_SECRET=your-jwt-secret-key

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (optional)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email
EMAIL_PASSWORD=your-password
```

### Development

```bash
# Start development server with hot reload
npm dev

# Type check without emitting
npm typecheck

# Build for production
npm build

# Start production server
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/login`    | User login           |
| POST   | `/api/auth/register` | User registration    |
| GET    | `/api/auth/check`    | Check authentication |

### Books

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/books`          | List all books      |
| GET    | `/api/books/:id`      | Get book by ID      |
| POST   | `/api/books`          | Create book (Admin) |
| PUT    | `/api/books/:id`      | Update book (Admin) |
| DELETE | `/api/books/:id`      | Delete book (Admin) |
| POST   | `/api/books/:id/rate` | Rate a book         |

### Users

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/api/users/me`                   | Get current user profile |
| PUT    | `/api/users/me`                   | Update profile           |
| PUT    | `/api/users/me/password`          | Change password          |
| GET    | `/api/users/me/favorites`         | Get favorites            |
| POST   | `/api/users/me/favorites/:bookId` | Add to favorites         |

### Borrowing

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| GET    | `/api/borrows/my`          | Get user's borrows |
| POST   | `/api/borrows`             | Request to borrow  |
| PUT    | `/api/borrows/:id/return`  | Return book        |
| DELETE | `/api/borrows/:id`         | Cancel request     |
| PUT    | `/api/borrows/:id/approve` | Approve (Admin)    |
| PUT    | `/api/borrows/:id/reject`  | Reject (Admin)     |

### Orders

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | `/api/orders/my`         | Get user's orders     |
| POST   | `/api/orders`            | Create order          |
| GET    | `/api/orders/:id`        | Get order details     |
| PUT    | `/api/orders/:id/cancel` | Cancel order          |
| PUT    | `/api/orders/:id/status` | Update status (Admin) |

### Admin

| Method | Endpoint                      | Description          |
| ------ | ----------------------------- | -------------------- |
| GET    | `/api/admin/dashboard`        | Dashboard statistics |
| GET    | `/api/admin/users`            | List all users       |
| GET    | `/api/admin/inventory-alerts` | Low stock alerts     |

## Validation

All request bodies are validated using Zod schemas. Example:

```typescript
import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid author ID"),
  price: z.object({
    current: z.number().min(0),
    original: z.number().min(0).optional(),
  }),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
});
```

## Error Handling

All errors are returned in a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Models

### User

- `firstName`, `lastName`, `email`, `password`
- `role`: "admin" | "user"
- `borrowLimit`, `fines`
- `books`: { borrowed, read, favorites }

### Book

- `title`, `author`, `serialNumber`
- `price`: { original, current }
- `rentalPrice`, `lateFeePerDay`
- `totalStock`, `availableStock`
- `status`: "in-shelf" | "out-of-stock"

### Borrow

- `user`, `book`, `borrowDate`, `dueDate`
- `status`: pending | rejected | active | returned | overdue | cancelled
- Virtual: `lateFee`, `daysOverdue`

### Order

- `userId`, `books[]`, `subtotal`, `shippingFee`, `totalPrice`
- `status`: pending | processing | shipped | delivered | cancelled | completed
- `paymentStatus`: pending | paid | failed | refunded
