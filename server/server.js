const express = require('express');
const cors = require('cors');
const { InventoryItem, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDb();

// Routes
// Get all inventory items
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await InventoryItem.findAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});

// Get a single inventory item by ID
app.get('/api/inventory/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
});

// Create a new inventory item
app.post('/api/inventory', async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    
    if (!name || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'Name, quantity, and price are required' });
    }
    
    const newItem = await InventoryItem.create({
      name,
      description,
      quantity,
      price
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// Update an inventory item
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    const item = await InventoryItem.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    await item.update({
      name: name || item.name,
      description: description !== undefined ? description : item.description,
      quantity: quantity !== undefined ? quantity : item.quantity,
      price: price !== undefined ? price : item.price
    });
    
    res.json(item);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// Delete an inventory item
app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    await item.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});