import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ingresosService } from '../../../services/ingresosService';
import { egresosService } from '../../../services/egresosService';

const CajaResumen = ({ fechaSeleccionada, actualizarTrigger }) => {
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataIng, dataEgr] = await Promise.all([
          ingresosService.getIngresosByFecha(fechaSeleccionada),
          egresosService.getEgresosByFecha(fechaSeleccionada),
        ]);

        setIngresos(dataIng);
        setEgresos(dataEgr);
      } catch (err) {
        setIngresos([]);
        setEgresos([]);
      }
    };

    fetchData();
  }, [fechaSeleccionada, actualizarTrigger]);

const calcularTotalFila = (ing) => {
  console.log('Datos del ingreso:', ing); // Debug
  
  // Asegurar que el importe sea un número válido
  let importe = 0;
  if (ing.importe !== null && ing.importe !== undefined && ing.importe !== '') {
    importe = parseFloat(ing.importe);
    if (isNaN(importe)) {
      importe = 0;
    }
  }
  console.log('Importe parseado:', importe); // Debug

  const sesiones = !isNaN(Number(ing.sesiones)) ? Number(ing.sesiones) : 0;

  // Verificar si es un tratamiento (tiene nombre de tratamiento y no es '-')
  if (ing.tratamiento_nombre && ing.tratamiento_nombre !== '-' && ing.tratamiento_nombre !== '') {
    console.log('Es tratamiento, multiplicando por sesiones:', importe * sesiones); // Debug
    return importe * sesiones;
  } 
  // Verificar si es un producto (tiene nombre de producto y no es '-')
  else if (ing.producto_nombre && ing.producto_nombre !== '-' && ing.producto_nombre !== '') {
    console.log('Es producto, retornando importe:', importe); // Debug
    return importe; // El backend ya calcula precio * cantidad
  }

  console.log('No es ni tratamiento ni producto, retornando importe:', importe); // Debug
  return importe;
};

  const formasPago = Array.from(
    new Set([
      ...ingresos.map(i => i.forma_de_pago || 'Sin especificar'),
      ...egresos.map(e => e.forma_pago || 'Sin especificar'),
    ])
  );

  const totalIngresos = ingresos.reduce((acc, i) => acc + calcularTotalFila(i), 0);
  const totalEgresos = egresos.reduce((acc, e) => acc + parseFloat(e.importe || 0), 0);
  const saldoFinal = totalIngresos - totalEgresos;

  return (
    <Section>
      <Header>
        <Title>Resumen por formas de pago</Title>
      </Header>

      <TablaResumen>
        <thead>
          <tr>
            <th>Forma de Pago</th>
            <th>Ingresos</th>
            <th>Egresos</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {formasPago.map(fp => {
            const ingFiltrados = ingresos.filter(i => (i.forma_de_pago || 'Sin especificar') === fp);
            const egrFiltrados = egresos.filter(e => (e.forma_pago || 'Sin especificar') === fp);

            const subtotalIng = ingFiltrados.reduce((acc, i) => acc + calcularTotalFila(i), 0);
            const subtotalEgr = egrFiltrados.reduce((acc, e) => acc + parseFloat(e.importe || 0), 0);
            const total = subtotalIng - subtotalEgr;

            return (
              <tr key={fp}>
                <td>{fp}</td>
                <td>${subtotalIng.toLocaleString('es-AR')}</td>
                <td>${subtotalEgr.toLocaleString('es-AR')}</td>
                <td>
                  <span style={{ color: total < 0 ? 'red' : 'green' }}>
                    ${total.toLocaleString('es-AR')}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <td><strong>Total</strong></td>
            <td>${totalIngresos.toLocaleString('es-AR')}</td>
            <td>${totalEgresos.toLocaleString('es-AR')}</td>
            <td>
              <span style={{ color: saldoFinal < 0 ? 'red' : 'green' }}>
                ${saldoFinal.toLocaleString('es-AR')}
              </span>
            </td>
          </tr>
        </tfoot>
      </TablaResumen>
    </Section>
  );
};

export default CajaResumen;

// --- Estilos ---
const Section = styled.div`
  margin-top: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 700;
`;

const TablaResumen = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    padding: 12px;
    border: 1px solid #cbd6e2;
    text-align: left;
  }

  th {
    background-color: #667eea;
    color: white;
    font-weight: bold;
  }

  td {
    font-weight: 500;
  }

  tfoot td {
    background-color: #f2f4f8;
    font-weight: bold;
    color: #2c3e50;
  }
`;
