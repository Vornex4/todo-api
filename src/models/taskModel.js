// src/models/taskModel.js
const mongoose = require('mongoose');

const ESTADOS_VALIDOS = ['pendiente', 'en_progreso', 'completada'];

const taskSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      default: ''
    },
    estado: {
      type: String,
      enum: ESTADOS_VALIDOS,
      default: 'pendiente'
    },
    fecha_vencimiento: {
      type: Date
    }
  },
  {
    timestamps: { createdAt: 'fecha_creacion', updatedAt: 'updated_at' }
  }
);

const Task = mongoose.model('Tarea', taskSchema);

module.exports = { Task, ESTADOS_VALIDOS };
