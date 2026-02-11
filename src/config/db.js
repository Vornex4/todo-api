// src/config/db.js
require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  console.log("✅ URI que se usará:", uri); // solo para debug (luego lo quitas)

  if (!uri || !uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error(`MONGO_URI inválida: ${uri}`);
  }

  await mongoose.connect(uri);
  console.log("✅ Conectado a MongoDB");
}

module.exports = connectDB;
