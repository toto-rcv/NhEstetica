const { pool } = require('../config/database');

exports.gananciasMensuales = async (req, res) => {
  try {
    const [ventasTratamientos] = await pool.query(`
      SELECT vt.*, p.comision_venta, p.comision_fija
      FROM ventas_tratamientos vt
      LEFT JOIN personal p ON vt.personal_id = p.id
      WHERE MONTH(vt.fecha) = MONTH(CURRENT_DATE()) AND YEAR(vt.fecha) = YEAR(CURRENT_DATE())
    `);

    const [ventasProductos] = await pool.query(`
      SELECT forma_de_pago, SUM(precio * cantidad) AS total
      FROM ventas_productos
      WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE())
      GROUP BY forma_de_pago
    `);

    const [egresos] = await pool.query(`
      SELECT SUM(importe) AS total_egresos
      FROM egresos
      WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE())
    `);

    const [cajaEgresos] = await pool.query(`
      SELECT SUM(importe) AS total_caja
      FROM caja
      WHERE tipo = 'EGRESO' AND MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE())
    `);

    const [cierresCaja] = await pool.query(`
      SELECT SUM(monto_cierre) AS total_cierres
      FROM caja_aperturas_cierres
      WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE())
    `);

    const [ingresosExtras] = await pool.query(`
      SELECT SUM(importe) AS total_ingresos
      FROM ingresos
      WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE())
    `);

    // Agrupar ventas por forma de pago (productos + tratamientos)
    const ventasPorForma = {};

    // Ventas tratamientos
    ventasTratamientos.forEach((v) => {
      const forma = v.forma_de_pago || 'Otros';
      const total = Number(v.precio) * Number(v.sesiones);
      ventasPorForma[forma] = (ventasPorForma[forma] || 0) + total;
    });

    // Ventas productos
    ventasProductos.forEach((v) => {
      const forma = v.forma_de_pago || 'Otros';
      ventasPorForma[forma] = (ventasPorForma[forma] || 0) + Number(v.total);
    });

    const totalVentas = Object.values(ventasPorForma).reduce((acc, val) => acc + val, 0);

    // Calcular comisiones desde ventasTratamientos
    let totalComisiones = 0;

    ventasTratamientos.forEach((venta) => {
      const sesiones = Number(venta.sesiones);
      const precio = Number(venta.precio);
      const comisionPorcentaje = Number(venta.comision_venta || 0);
      const comisionFija = Number(venta.comision_fija || 0);

      const totalVenta = precio * sesiones;
      const comisionPorcentual = (totalVenta * comisionPorcentaje) / 100;
      const totalComision = comisionPorcentual + (comisionFija * sesiones);

      totalComisiones += totalComision;
    });

    const totalGastos = 
      (egresos[0].total_egresos || 0) +
      (cajaEgresos[0].total_caja || 0) +
      (ingresosExtras[0].total_ingresos || 0) +
      totalComisiones;

    const ganancias = totalVentas - totalGastos;

    res.json({
      totalVentas,
      ventasPorForma,
      totalGastos: {
        egresos: egresos[0].total_egresos || 0,
        caja: cajaEgresos[0].total_caja || 0,
        ingresos: ingresosExtras[0].total_ingresos || 0,
        comisiones: totalComisiones,
      },
      cierres: cierresCaja[0].total_cierres || 0,
      ganancias,
    });
  } catch (error) {
    console.error('Error al calcular ganancias:', error);
    res.status(500).json({ message: 'Error al obtener ganancias', error });
  }
};
