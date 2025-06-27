const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Crear la carpeta si no existe
    const uploadDir = path.join(__dirname, '../public/images-de-productos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'producto-' + uniqueSuffix + ext);
  }
});

// Filtrar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Controlador para subir imagen
exports.uploadImage = (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      return res.status(400).json({ 
        message: 'Error al subir archivo', 
        error: err.message 
      });
    } else if (err) {
      // Otro tipo de error
      return res.status(400).json({ 
        message: 'Error al procesar archivo', 
        error: err.message 
      });
    }

    // Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No se seleccionó ningún archivo' 
      });
    }

    // Devolver la ruta del archivo
    const imagePath = `/images-de-productos/${req.file.filename}`;
    res.json({ 
      message: 'Imagen subida correctamente',
      imagePath: imagePath,
      filename: req.file.filename
    });
  });
}; 