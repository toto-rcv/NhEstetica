const express = require('express');
const cors = require('cors');
const path = require('path');
const { fullSetup } = require('./config/database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use('/images-de-productos', express.static(path.join(__dirname, 'public/images-de-productos')));
app.use('/images-de-clientes', express.static(path.join(__dirname, 'public/images-de-clientes')));
app.use('/images-de-tratamientos', express.static(path.join(__dirname, 'public/images-de-tratamientos')));
app.use('/images-de-personal', express.static(path.join(__dirname, 'public/images-de-personal')));

// Rutas
app.use('/api', require('./routes/auth.router'));
app.use('/api/inicio', require('./routes/inicio.router'));
app.use('/api/clientes', require('./routes/clientes.router'));
app.use('/api/personal', require('./routes/personal.router'));
app.use('/api/ventas/tratamientos', require('./routes/ventas.tratamientos.router'));
app.use('/api/ventas/productos', require('./routes/ventas.productos.router'));
app.use('/api/productos', require('./routes/productos.router'));
app.use('/api/tratamientos', require('./routes/tratamientos.router'));
app.use('/api/upload', require('./routes/upload.router'));
app.use('/api/caja/apertura', require('./routes/caja.apertura.router'));
app.use('/api/egresos', require('./routes/egresos.router'));
app.use('/api/ingresos', require('./routes/ingresos.router'));

async function startServer() {
  await fullSetup();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
