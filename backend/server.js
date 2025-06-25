const express = require('express');
const cors = require('cors');
const { testConnection, initializeDatabase } = require('./config/database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', require('./routes/auth.router'));
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/personal', require('./routes/personal.routes'));
app.use('/api/ventas', require('./routes/ventas.router'));

async function startServer() {
  await testConnection();
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
