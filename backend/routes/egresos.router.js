const express = require('express');
const router = express.Router();
const egresosController = require('../controllers/egresos.controller');

router.get('/', egresosController.getEgresos);
router.get('/:id', egresosController.getEgresoById);
router.post('/', egresosController.createEgreso);
router.get('/fecha/:fecha', egresosController.getEgresosByFecha);
router.put('/:id', egresosController.updateEgreso);
router.delete('/:id', egresosController.deleteEgreso);

module.exports = router;
