const express = require('express');
const cors = require('cors');
const { testConnection, initializeDatabase } = require('./config/database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', require('./routes/auth.router'));
app.use('/api/clientes', require('./routes/clientes.router'));
app.use('/api/personal', require('./routes/personal.router'));
app.use('/api/ventas/tratamientos', require('./routes/ventas.tratamientos.router'));
app.use('/api/ventas/productos', require('./routes/ventas.productos.router'));
app.use('/api/productos', require('./routes/productos.router'));

async function startServer() {
  await testConnection();
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
