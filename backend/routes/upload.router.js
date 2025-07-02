const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const path = require('path');

// Ruta para subir imagen
router.post('/image', uploadController.uploadImage);

// Ruta para servir imágenes
router.get('/image/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  
  let folderName;
  switch (type) {
    case 'personal':
      folderName = 'images-de-personal';
      break;
    case 'tratamiento':
      folderName = 'images-de-tratamientos';
      break;
    case 'cliente':
      folderName = 'images-de-clientes';
      break;
    case 'producto':
    default:
      folderName = 'images-de-productos';
      break;
  }
  
  const imagePath = path.join(__dirname, `../public/${folderName}`, filename);
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ message: 'Imagen no encontrada' });
    }
  });
});

module.exports = router; 