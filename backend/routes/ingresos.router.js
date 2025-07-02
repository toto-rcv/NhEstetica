// routes/ingresosRoutes.js
const express = require('express');
const router = express.Router();
const { getIngresosPorFecha } = require('../controllers/ingresos.controller');

router.get('/fecha/:fecha', getIngresosPorFecha);

module.exports = router;
