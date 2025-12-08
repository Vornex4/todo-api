// src/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true // crea createdAt y updatedAt
  }
);

const User = mongoose.model('Usuario', userSchema);

module.exports = User;
