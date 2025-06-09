const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// In-memory data store
let items = [
    { id: 1, name: 'Item 1', description: 'This is item 1' },
    { id: 2, name: 'Item 2', description: 'This is item 2' },
    { id: 3, name: 'Item 3', description: 'This is item 3' }
];

// Root route
app.get('/', (req, res) => {
    res.send('Hello, World');
});

// GET all items
app.get('/items', (req, res) => {
    res.json(items);
});

// GET single item by ID
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
});

// POST create new item
app.post('/items', (req, res) => {
    if (!req.body.name || !req.body.description) {
        return res.status(400).json({ error: 'Name and description are required' });
    }
    
    const newItem = {
        id: items.length + 1,
        name: req.body.name,
        description: req.body.description
    };
    
    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT update item by ID
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    
    if (!req.body.name || !req.body.description) {
        return res.status(400).json({ error: 'Name and description are required' });
    }
    
    const updatedItem = {
        id: id,
        name: req.body.name,
        description: req.body.description
    };
    
    items[itemIndex] = updatedItem;
    res.json(updatedItem);
});

// DELETE item by ID
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    
    items.splice(itemIndex, 1);
    res.status(204).end();
});

// 404 handler for invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});