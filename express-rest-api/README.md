# Simple REST API with Express.js

A simple REST API implementation using Express.js for managing items.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   For development with auto-restart:
   ```bash
   npm run dev
   ```

## API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

#### GET /
- Description: Root endpoint
- Response: "Hello, World"

#### GET /items
- Description: Get all items
- Response: Array of item objects

#### GET /items/:id
- Description: Get a single item by ID
- Response: Item object or 404 if not found

#### POST /items
- Description: Create a new item
- Request Body: { "name": "string", "description": "string" }
- Response: Created item object or 400 if validation fails

#### PUT /items/:id
- Description: Update an item by ID
- Request Body: { "name": "string", "description": "string" }
- Response: Updated item object or 400/404 if validation fails or not found

#### DELETE /items/:id
- Description: Delete an item by ID
- Response: 204 No Content or 404 if not found

## Example Requests

### GET all items
```
GET http://localhost:3000/items
```

Response:
```json
[
    { "id": 1, "name": "Item 1", "description": "This is item 1" },
    { "id": 2, "name": "Item 2", "description": "This is item 2" },
    { "id": 3, "name": "Item 3", "description": "This is item 3" }
]
```

### GET single item
```
GET http://localhost:3000/items/1
```

Response:
```json
{ "id": 1, "name": "Item 1", "description": "This is item 1" }
```

### POST create item
```
POST http://localhost:3000/items
Content-Type: application/json

{
    "name": "New Item",
    "description": "This is a new item"
}
```

Response:
```json
{
    "id": 4,
    "name": "New Item",
    "description": "This is a new item"
}
```

### PUT update item
```
PUT http://localhost:3000/items/1
Content-Type: application/json

{
    "name": "Updated Item",
    "description": "This item has been updated"
}
```

Response:
```json
{
    "id": 1,
    "name": "Updated Item",
    "description": "This item has been updated"
}
```

### DELETE item
```
DELETE http://localhost:3000/items/1
```

Response:
204 No Content

## Testing the API

You can test the API using tools like Postman, cURL, or any HTTP client. Here are some example cURL commands:

1. Get all items:
```bash
curl http://localhost:3000/items
```

2. Get a specific item:
```bash
curl http://localhost:3000/items/1
```

3. Create a new item:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"New Item","description":"New description"}' 
http://localhost:3000/items
```

4. Update an item:
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name":"Updated Item","description":"Updated description"}' 
http://localhost:3000/items/1
```

5. Delete an item:
```bash
curl -X DELETE http://localhost:3000/items/1
```

This implementation covers all the requirements:
- Basic Express setup with middleware
- CRUD operations for items
- In-memory data store
- Proper error handling (400, 404, 500)
- Request validation
- Example requests for testing
```
