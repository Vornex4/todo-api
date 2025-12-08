// src/docs/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'To-Do API',
    version: '1.0.0',
    description: 'API REST para gestionar tareas personales (Proyecto To-Do).'
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Servidor local'
    }
    // Cuando lo despliegues, agregas aquí la URL pública
    // { url: 'https://tu-api.onrender.com', description: 'Producción' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      UsuarioRegister: {
        type: 'object',
        required: ['nombre', 'email', 'password'],
        properties: {
          nombre: { type: 'string', example: 'Erick Velasquez' },
          email: { type: 'string', example: 'erick@example.com' },
          password: { type: 'string', example: '123456' }
        }
      },
      UsuarioLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'erick@example.com' },
          password: { type: 'string', example: '123456' }
        }
      },
      UsuarioResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '671234abcd...' },
          nombre: { type: 'string' },
          email: { type: 'string' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Login exitoso' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
        }
      },
      Tarea: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '671234abcd...' },
          usuario: { type: 'string', example: '671234abcd...' },
          titulo: { type: 'string', example: 'Estudiar APIs REST' },
          descripcion: { type: 'string', example: 'Revisar proyecto To-Do' },
          estado: {
            type: 'string',
            enum: ['pendiente', 'en_progreso', 'completada'],
            example: 'pendiente'
          },
          fecha_creacion: { type: 'string', format: 'date-time' },
          fecha_vencimiento: { type: 'string', format: 'date-time', nullable: true }
        }
      },
      TareaCreate: {
        type: 'object',
        required: ['titulo'],
        properties: {
          titulo: { type: 'string', example: 'Estudiar APIs REST' },
          descripcion: { type: 'string', example: 'Revisar proyecto To-Do' },
          estado: {
            type: 'string',
            enum: ['pendiente', 'en_progreso', 'completada'],
            example: 'pendiente'
          },
          fecha_vencimiento: {
            type: 'string',
            format: 'date-time',
            example: '2025-12-31T23:59:59.000Z'
          }
        }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar un nuevo usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UsuarioRegister' }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuario creado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { $ref: '#/components/schemas/UsuarioResponse' }
                  }
                }
              }
            }
          },
          400: { description: 'Datos incompletos' },
          409: { description: 'Email ya registrado' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UsuarioLogin' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login exitoso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          400: { description: 'Datos incompletos' },
          401: { description: 'Credenciales inválidas' }
        }
      }
    },
    '/api/tasks': {
      get: {
        tags: ['Tareas'],
        summary: 'Listar tareas del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Listado de tareas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Tarea' }
                }
              }
            }
          },
          401: { description: 'No autorizado' }
        }
      },
      post: {
        tags: ['Tareas'],
        summary: 'Crear nueva tarea',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TareaCreate' }
            }
          }
        },
        responses: {
          201: {
            description: 'Tarea creada',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Tarea' } }
            }
          },
          400: { description: 'Datos inválidos' },
          401: { description: 'No autorizado' }
        }
      }
    },
    '/api/tasks/{id}': {
      get: {
        tags: ['Tareas'],
        summary: 'Obtener una tarea por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID de la tarea'
          }
        ],
        responses: {
          200: {
            description: 'Tarea encontrada',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Tarea' } }
            }
          },
          401: { description: 'No autorizado' },
          404: { description: 'Tarea no encontrada' }
        }
      },
      put: {
        tags: ['Tareas'],
        summary: 'Actualizar una tarea por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TareaCreate' }
            }
          }
        },
        responses: {
          200: {
            description: 'Tarea actualizada',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Tarea' } }
            }
          },
          400: { description: 'Datos inválidos' },
          401: { description: 'No autorizado' },
          404: { description: 'Tarea no encontrada' }
        }
      },
      delete: {
        tags: ['Tareas'],
        summary: 'Eliminar una tarea por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: { description: 'Tarea eliminada' },
          401: { description: 'No autorizado' },
          404: { description: 'Tarea no encontrada' }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: [] // si luego usas JSDoc, aquí pondrías rutas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
