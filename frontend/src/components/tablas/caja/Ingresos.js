import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ingresosService } from '../../../services/ingresosService';

const Ingresos = ({ fechaSeleccionada, cajaCerrada }) => {
  const [ingresos, setIngresos] = useState([]);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const data = await ingresosService.getIngresosByFecha(fechaSeleccionada);
        setIngresos(data);
      } catch (err) {
        setIngresos([]);
      }
    };

    fetchIngresos();
  }, [fechaSeleccionada]);

  if (!ingresos.length) return <EmptyMessage>No hay ingresos registrados</EmptyMessage>;

const calcularTotalFila = (ing) => {
  // Asegurar que el importe sea un número válido
  let importe = 0;
  if (ing.importe !== null && ing.importe !== undefined && ing.importe !== '') {
    importe = parseFloat(ing.importe);
    if (isNaN(importe)) {
      importe = 0;
    }
  }

  const sesiones = !isNaN(Number(ing.sesiones)) ? Number(ing.sesiones) : 0;

  // Verificar si es un tratamiento (tiene nombre de tratamiento y no es '-')
  if (ing.tratamiento_nombre && ing.tratamiento_nombre !== '-' && ing.tratamiento_nombre !== '') {
    return importe * sesiones;
  } 
  // Verificar si es un producto (tiene nombre de producto y no es '-')
  else if (ing.producto_nombre && ing.producto_nombre !== '-' && ing.producto_nombre !== '') {
    return importe; // El backend ya calcula precio * cantidad
  }

  return importe;
};


  const total = ingresos.reduce((acc, i) => acc + calcularTotalFila(i), 0);

  return (
    <Section>
      <Header>
        <Title>Ingresos</Title>
        {cajaCerrada && (
          <StatusMessage>
            🔒 Caja cerrada - No se pueden agregar más ingresos
          </StatusMessage>
        )}
      </Header>
      <Table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Tratamiento</th>
            <th>Sesiones</th>
            <th>Producto Comprado</th>
            <th>Cantidad</th>
            <th>Forma de Pago</th>
            <th>Importe</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ing, i) => (
            <tr key={i}>
              <td>{ing.cliente_nombre} {ing.cliente_apellido}</td>
              <td>{ing.tratamiento_nombre}</td>
              <td>{ing.sesiones}</td>
              <td>{ing.producto_nombre}</td>
              <td>{ing.cantidad}</td>
              <td>{ing.forma_de_pago}</td>
              <td>${calcularTotalFila(ing).toFixed(2)}</td>
              <td>{ing.observacion}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <TrFooter>
            <td colSpan={7}><strong>Total</strong></td>
            <TotalCell>${total.toLocaleString('es-AR')}</TotalCell>
          </TrFooter>
        </tfoot>
      </Table>
    </Section>
  );
};

export default Ingresos;

// Styled Components
const Title = styled.h3`
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 700;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #667eea;
    color: white;
  }

  input, select {
    width: 100%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const TrFooter = styled.tr`
  background-color: #ecf0f1;
  font-weight: 700;
  color: #2c3e50;
`;

const EmptyMessage = styled.p`
  color: #7f8c8d;
  font-style: italic;
  margin-top: 1rem;
`;

const Section = styled.div`
  margin-top: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 1.5rem;
  }
`;

const StatusMessage = styled.div`
  background: #e67e22;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
`;

const TotalCell = styled.td`
  color: green;
  font-weight: bold;
`;
