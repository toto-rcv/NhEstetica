const express = require('express');
const router = express.Router();
const resumenController = require('../controllers/resumen.controller');

router.get('/ganancias-mensuales', resumenController.gananciasMensuales);

module.exports = router;
