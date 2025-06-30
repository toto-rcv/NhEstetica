const express = require('express');
const router = express.Router();
const {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  searchClientes
} = require('../controllers/clientes.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para clientes
const storageClientes = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/images-de-clientes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'cliente-' + uniqueSuffix + ext);
  }
});

const fileFilterClientes = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const uploadCliente = multer({
  storage: storageClientes,
  fileFilter: fileFilterClientes,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Obtener todos los clientes
router.get('/', getClientes);

// Buscar clientes por término (opcional)
router.get('/search', searchClientes);

// Obtener cliente por ID
router.get('/:id', getClienteById);

// Crear nuevo cliente
router.post('/', uploadCliente.single('imagen'), createCliente);

// Actualizar cliente
router.put('/:id', uploadCliente.single('imagen'), updateCliente);

// Eliminar cliente
router.delete('/:id', deleteCliente);

module.exports = router;
