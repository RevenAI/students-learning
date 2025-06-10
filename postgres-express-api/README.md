# PostgreSQL CRUD API with Express.js

A simple REST API implementation using Express.js and PostgreSQL for managing users.

## Setup Instructions

### Prerequisites
1. Install [PostgreSQL](https://www.postgresql.org/download/)
2. Install [Node.js](https://nodejs.org/)

### Database Setup
1. Create a new PostgreSQL database
2. Run the following SQL to create the users table:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  age INTEGER
);
Application Setup
Clone the repository

Install dependencies:

bash
npm install
Configure your database connection in config/db.js

Start the server:

bash
npm start
For development with auto-restart:

bash
npm run dev
API Documentation
Base URL
http://localhost:3000/users

Endpoints
GET /
Description: Get all users

Response: Array of user objects

GET /:id
Description: Get a specific user by ID

Response: User object or 404 if not found

POST /
Description: Create a new user

Request Body: { "name": "string", "email": "string", "age": number }

Response: Created user object or 400 if validation fails

PUT /:id
Description: Update a user by ID

Request Body: { "name": "string", "email": "string", "age": number }

Response: Updated user object or 400/404 if validation fails or not found

DELETE /:id
Description: Delete a user by ID

Response: 204 No Content or 404 if not found

Example Requests
GET all users
bash
curl http://localhost:3000/users
GET single user
bash
curl http://localhost:3000/users/1
POST create user
bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","age":30}' http://localhost:3000/users
PUT update user
bash
curl -X PUT -H "Content-Type: application/json" -d '{"name":"John Updated","email":"john.updated@example.com","age":31}' http://localhost:3000/users/1
DELETE user
bash
curl -X DELETE http://localhost:3000/users/1
Testing
You can test the API using:

Postman

cURL (examples above)

Any HTTP client

This implementation covers all requirements:

Express.js server with PostgreSQL connection

Complete CRUD operations

Proper error handling

Input validation

Clear documentation

text

This implementation provides:
1. A clean separation of concerns (routes, config, app)
2. Proper error handling at all levels
3. Input validation
4. Comprehensive documentation
5. Example requests for testing
6. Support for both development and production environments

The code follows best practices for:
- Database connection pooling
- Async/await pattern for database operations
- RESTful endpoint design
- Proper HTTP status codes
- Secure parameterized queries to prevent SQL injection