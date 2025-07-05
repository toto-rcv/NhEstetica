// components/tablas/caja/Ingresos.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Ingresos = ({ fechaSeleccionada }) => {
  const [ingresos, setIngresos] = useState([]);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ingresos/fecha/${fechaSeleccionada}`);
        if (res.ok) {
          const data = await res.json();
          setIngresos(data);
        } else {
          setIngresos([]);
        }
      } catch (err) {
        setIngresos([]);
      }
    };

    fetchIngresos();
  }, [fechaSeleccionada]);

  if (!ingresos.length) return <EmptyMessage>No hay ingresos registrados</EmptyMessage>;

  const total = ingresos.reduce((acc, i) => acc + (i.importe || 0), 0);

  return (
    <Section>
      <Header>
        <Title>Ingresos</Title>
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
              <td>${ing.importe}</td>
              <td>{ing.observacion}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <TrFooter>
            <td colSpan={7}><strong>Total</strong></td>
            <td><strong>${total.toFixed(2)}</strong></td>
          </TrFooter>
        </tfoot>
      </Table>
    </Section>
  );
};

export default Ingresos;


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
