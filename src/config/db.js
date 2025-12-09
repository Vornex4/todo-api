// src/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  try {
    console.log('👉 MONGO_URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
