const express = require('express');
const router = express.Router();
const gastosFijosController = require('../controllers/gastos.fijos.controller');

router.get('/:mes', gastosFijosController.getGastosFijosPorMes);

router.post('/', gastosFijosController.upsertGastosFijos);

module.exports = router;
