// routes/AddressRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Create Address Schema
const AddressSchema = new mongoose.Schema({
  userId: String,
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address1: {
    type: String,
    required: true
  },
  address2: String,
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  saveAddress: Boolean,
  products: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Address = mongoose.model('Address', AddressSchema);

// POST endpoint to save a new address
router.post('/', async (req, res) => {
  try {
    const addressData = req.body;
    
    // Validate required fields
    if (!addressData.firstName || !addressData.lastName || !addressData.address1 || 
        !addressData.state || !addressData.zip || !addressData.phone) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Create and save the new address
    const newAddress = new Address(addressData);
    const savedAddress = await newAddress.save();
    
    res.status(201).json(savedAddress);
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET endpoint to retrieve all addresses (sorted by most recent first)
router.get('/', async (req, res) => {
  try {
    const addresses = await Address.find().sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET endpoint to retrieve addresses for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;