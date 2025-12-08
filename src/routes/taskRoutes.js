// src/routes/taskRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { Task, ESTADOS_VALIDOS } = require('../models/taskModel');

const router = express.Router();

router.use(authMiddleware);

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, estado, fecha_vencimiento } = req.body;

    if (!titulo) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }

    if (estado && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    let fechaVenc = null;
    if (fecha_vencimiento) {
      const fecha = new Date(fecha_vencimiento);
      if (isNaN(fecha.getTime())) {
        return res.status(400).json({ message: 'fecha_vencimiento inválida' });
      }
      fechaVenc = fecha;
    }

    const tarea = await Task.create({
      usuario: req.user.id,
      titulo,
      descripcion: descripcion || '',
      estado: estado || 'pendiente',
      fecha_vencimiento: fechaVenc
    });

    res.status(201).json(tarea);
  } catch (error) {
    console.error('Error creando tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tareas = await Task.find({ usuario: req.user.id }).sort({ fecha_creacion: -1 });
    res.json(tareas);
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const tarea = await Task.findOne({ _id: req.params.id, usuario: req.user.id });
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(tarea);
  } catch (error) {
    console.error('Error obteniendo tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { titulo, descripcion, estado, fecha_vencimiento } = req.body;

    if (!titulo || !estado) {
      return res.status(400).json({ message: 'titulo y estado son obligatorios' });
    }
    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    let fechaVenc = null;
    if (fecha_vencimiento) {
      const fecha = new Date(fecha_vencimiento);
      if (isNaN(fecha.getTime())) {
        return res.status(400).json({ message: 'fecha_vencimiento inválida' });
      }
      fechaVenc = fecha;
    }

    const tarea = await Task.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user.id },
      {
        titulo,
        descripcion: descripcion || '',
        estado,
        fecha_vencimiento: fechaVenc
      },
      { new: true }
    );

    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(tarea);
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const tarea = await Task.findOneAndDelete({ _id: req.params.id, usuario: req.user.id });
    if (!tarea) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
