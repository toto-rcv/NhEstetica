const express = require('express');
const cors = require('cors');
const path = require('path');
const { fullSetup } = require('./config/database');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use('/images-de-productos', express.static(path.join(__dirname, 'public/images-de-productos')));
app.use('/images-de-clientes', express.static(path.join(__dirname, 'public/images-de-clientes')));
app.use('/images-de-tratamientos', express.static(path.join(__dirname, 'public/images-de-tratamientos')));
app.use('/images-de-personal', express.static(path.join(__dirname, 'public/images-de-personal')));

// Rutas públicas (sin autenticación)
app.use('/api/auth', require('./routes/auth.router'));
app.use('/api/productos', require('./routes/productos.router'));
app.use('/api/tratamientos/public', require('./routes/tratamientos.router'));
app.use('/api/turnos/public', require('./routes/turnos.public.router'));
app.use('/api/clientes/public', require('./routes/clientes.public.router'));

// Rutas protegidas con autenticación
app.use('/api/inicio', authenticateToken, require('./routes/inicio.router'));
app.use('/api/resumen', authenticateToken, require('./routes/resumen.router'));
app.use('/api/clientes', authenticateToken, require('./routes/clientes.router'));
app.use('/api/personal', authenticateToken, require('./routes/personal.router'));
app.use('/api/ventas/tratamientos', authenticateToken, require('./routes/ventas.tratamientos.router'));
app.use('/api/ventas/productos', authenticateToken, require('./routes/ventas.productos.router'));
app.use('/api/tratamientos', authenticateToken, require('./routes/tratamientos.router'));
app.use('/api/caja/apertura', authenticateToken, require('./routes/caja.apertura.router'));
app.use('/api/egresos', authenticateToken, require('./routes/egresos.router'));
app.use('/api/ingresos', authenticateToken, require('./routes/ingresos.router'));
app.use('/api/turnos', authenticateToken, require('./routes/turnos.router'));
app.use('/api/gastos-fijos', authenticateToken, require('./routes/gastos.fijos.router'));
app.use('/api/gerentes', authenticateToken, require('./routes/gerentes.router'));
app.use('/api/email', require('./routes/email.router'));

// Rutas de upload con autenticación solo para POST (subir), pero GET (servir imágenes) es público
app.use('/api/upload', require('./routes/upload.router'));

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err);
  res.status(500).json({ 
    message: 'Error interno del servidor', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

async function startServer() {
  await fullSetup();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
