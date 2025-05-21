const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'inventory.sqlite'),
  logging: false
});

// Define Inventory Item model
const InventoryItem = sequelize.define('InventoryItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
});

// Sync the model with the database
const initDb = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
    
    // Check if we have any items, if not add some sample data
    const count = await InventoryItem.count();
    if (count === 0) {
      await InventoryItem.bulkCreate([
        { name: 'Laptop', description: 'High-performance laptop', quantity: 10, price: 1200 },
        { name: 'Smartphone', description: 'Latest model smartphone', quantity: 15, price: 800 },
        { name: 'Headphones', description: 'Noise-cancelling headphones', quantity: 20, price: 150 }
      ]);
      console.log('Sample data added to database');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  sequelize,
  InventoryItem,
  initDb
};