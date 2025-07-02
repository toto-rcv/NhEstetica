const express = require('express');
const router = express.Router();
const {
  getCajas,
  getCajaById,
  createCaja,
  updateCaja,
  deleteCaja,
  getCajaByFecha
} = require('../controllers/caja.apertura.controller');

router.get('/', getCajas);

router.get('/fecha/:fecha', getCajaByFecha);

router.get('/:id', getCajaById);

router.post('/', createCaja);

router.put('/:id', updateCaja);

router.delete('/:id', deleteCaja);

module.exports = router;
