## BACKEND

This is an Express.js REST API server for managing user accounts and movie reviews. The server uses MariaDB for data persistence and follows a modular architecture with separate routes and controllers.

---

## **Server Setup**

### **Installation**

1. Install dependencies:
```bash
npm install
```

### **Running the Server**

Start the development server with nodemon (auto-restarts on file changes):
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### **Project Structure**

```
backend/
├── controllers/          # Business logic
│   ├── userController.js
│   └── reviewController.js
├── routes/              # API route definitions
│   ├── userRoutes.js
│   └── reviewRoutes.js
├── db.js                # Database connection pool
├── server.js            # Main server file
└── package.json
```

### **Dependencies**

- **express**: Web framework
- **mysql2**: MySQL/MariaDB client with promise support
- **bcrypt**: Password hashing
- **body-parser**: Request body parsing middleware
- **nodemon**: Development server with auto-restart
- **dotenv**: Environment variable management

### **Database Configuration**

The server connects to MariaDB Cloud. Database credentials are stored in a `.env` file for security. The connection uses SSL for secure communication.

**Environment Variables Setup:**

1. Create a `.env` file in the root of the `backend` directory:
```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DB_HOST=your-database-host
DB_PORT=4040
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

**Note:** The `.env` file is already included in `.gitignore` and will not be committed to the repository.

---

## **API Endpoints**

Base URL: `http://localhost:3000/api`

---

### **User Endpoints**

#### **1. Register a New User**

**POST** `/api/users/register`

Creates a new user account with hashed password.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Error Responses:**
- `400`: Missing required fields (username, email, or password)
- `409`: Username or email already exists
- `500`: Server error

---

#### **2. Login User**

**POST** `/api/users/login`

Authenticates a user and returns user information.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid email or password
- `500`: Server error

---

#### **3. Get User by ID**

**GET** `/api/users/:id`

Retrieves user information by user ID (password is excluded).

**URL Parameters:**
- `id`: User ID (integer)

**Success Response (200):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404`: User not found
- `500`: Server error

---

### **Review Endpoints**

#### **1. Get All Reviews**

**GET** `/api/reviews`

Retrieves all reviews ordered by creation date (newest first).

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "movie_id": 550,
    "rating": 8,
    "comment": "Great movie!",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "user_id": 2,
    "movie_id": 550,
    "rating": 9,
    "comment": "Amazing film!",
    "created_at": "2024-01-14T15:20:00.000Z",
    "updated_at": "2024-01-14T15:20:00.000Z"
  }
]
```

**Error Response:**
- `500`: Server error

---

#### **2. Create a New Review**

**POST** `/api/reviews`

Creates a new movie review. Each user can only have one review per movie (enforced by database constraint).

**Request Body:**
```json
{
  "user_id": 1,
  "movie_id": 550,
  "rating": 8,
  "comment": "Great movie with excellent acting!"
}
```

**Fields:**
- `user_id` (required): ID of the user creating the review
- `movie_id` (required): TMDB movie ID
- `rating` (required): Rating from 0 to 10
- `comment` (optional): Review text (max 200 characters)

**Success Response (201):**
```json
{
  "id": 1
}
```

**Error Responses:**
- `500`: Server error (may include duplicate review constraint violation)

---

#### **3. Get Reviews by Movie ID**

**GET** `/api/reviews/:id`

Retrieves all reviews for a specific movie, ordered by creation date (newest first).

**URL Parameters:**
- `id`: Movie ID (TMDB movie ID)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "movie_id": 550,
    "rating": 8,
    "comment": "Great movie!",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Response:**
- `500`: Server error

---

## **Database Setup**

This project uses MariaDB to manage user accounts and movie reviews. The database schema consists of two tables: `users` and `reviews`. The following SQL commands were used to create the database and tables.

---

### **1. Create `users` table**

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

* `id`: Unique identifier for each user.
* `username` & `email`: Must be unique.
* `password`: Stored as a hashed string.
* `created_at` & `updated_at`: Automatically track creation and update timestamps.

---

### **2. Create `reviews` table**

```sql
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 0 AND 10),
    comment VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY user_movie_unique (user_id, movie_id)
);
```

* `user_id`: References the user who wrote the review.
* `movie_id`: TMDB movie ID (no separate movie table required).
* `rating`: Numeric value from 0 to 10.
* `comment`: Text review, max 200 characters.
* `FOREIGN KEY`: Ensures a review is linked to a valid user.
* `UNIQUE KEY`: Prevents a user from submitting multiple reviews for the same movie.

---

### **3. Indexes for performance**

```sql
-- Quickly fetch all reviews for a specific user
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Quickly fetch all reviews for a specific movie
CREATE INDEX idx_reviews_movie ON reviews(movie_id);
```

Indexes improve query performance for user profile pages and movie review pages.

---