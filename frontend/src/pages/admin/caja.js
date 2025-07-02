import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import Ingresos from '../../components/tablas/caja/Ingresos';
import Egresos from '../../components/tablas/caja/Egresos';
import FormasDePago from '../../components/tablas/caja/FormasDePago';
import ModalCaja from '../../components/tablas/caja/ModalCaja';

const Caja = () => {
  const hoy = new Date();
  const hoyISO = hoy.toISOString().slice(0, 10);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [montoApertura, setMontoApertura] = useState(null); 
  const [fechaCaja, setFechaCaja] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoyISO);
  const [egresosEfectivo, setEgresosEfectivo] = useState(0);

  const [year, month, day] = fechaSeleccionada.split('-');
  const fechaLegible = new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const esHoy = fechaSeleccionada === hoyISO;

  const cambiarDia = (dias) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha.toISOString().slice(0, 10));
  };

  const handleGuardarMonto = async (monto) => {
    try {
      const res = await fetch('http://localhost:5000/api/caja/apertura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: fechaSeleccionada,
          monto_apertura: monto,
          monto_cierre: 0
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMontoApertura(monto);
        setFechaCaja(fechaSeleccionada);
        setModalAbierto(false);
      } else {
        alert(data.message || 'Error al guardar la caja');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
      console.error(error);
    }
  };

  const fetchCaja = async () => {
    setCargando(true);
    try {
      const res = await fetch(`http://localhost:5000/api/caja/apertura/fecha/${fechaSeleccionada}`);
      if (res.ok) {
        const data = await res.json();
        setMontoApertura(data.monto_apertura);
        setFechaCaja(data.fecha);
      } else {
        setMontoApertura(null);
        setFechaCaja(null);
      }
    } catch (error) {
      console.error('Error al cargar caja del día:', error);
      setMontoApertura(null);
      setFechaCaja(null);
    } finally {
      setCargando(false);
    }
  };

  const fetchEgresosEfectivo = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/egresos/fecha/${fechaSeleccionada}`);
      if (res.ok) {
        const data = await res.json();
        const totalEfectivo = data
          .filter(e => e.forma_pago === 'Efectivo')
          .reduce((acc, cur) => acc + parseFloat(cur.importe || 0), 0);
        setEgresosEfectivo(totalEfectivo);
      } else {
        setEgresosEfectivo(0);
      }
    } catch (err) {
      setEgresosEfectivo(0);
    }
  };

  useEffect(() => {
    fetchCaja();
    fetchEgresosEfectivo();
  }, [fechaSeleccionada]);

  return (
    <TablasLayout title="Gestión de Caja">
      <Container>
        <HeaderContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ChevronButton onClick={() => cambiarDia(-1)}>←</ChevronButton>
            <Title>{montoApertura !== null ? `Día ${fechaLegible}` : `Sin caja registrada (${fechaLegible})`}</Title>
            <ChevronButton onClick={() => cambiarDia(1)}>→</ChevronButton>
            <DateInput
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              max={hoyISO}
            />
          </div>

          {!cargando && montoApertura !== null && !isNaN(montoApertura) ? (
            <CajaTable>
              <thead>
                <tr>
                  <th>Apertura</th>
                  <th>Egresos Efectivo</th>
                  <th>Cierre</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${parseFloat(montoApertura).toFixed(0)}</td>
                  <td>${egresosEfectivo.toFixed(0)}</td>
                  <td>${(parseFloat(montoApertura) - egresosEfectivo).toFixed(0)}</td>
                </tr>
              </tbody>
            </CajaTable>
          ) : (
            <AddCajaButton onClick={() => setModalAbierto(true)}>
              Agregar Caja del día
            </AddCajaButton>
          )}
        </HeaderContainer>

        <Ingresos fechaSeleccionada={fechaSeleccionada} />
        <Egresos
          fechaSeleccionada={fechaSeleccionada}
          onActualizar={() => {
            fetchCaja();
            fetchEgresosEfectivo();
          }}
        />
        <FormasDePago />

        <ModalCaja
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onGuardar={handleGuardarMonto}
        />
      </Container>
    </TablasLayout>
  );
};

export default Caja;

// Styled Components
const Container = styled.div`
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  color: #333;
  margin: 0;
  font-size: 2rem;
`;

const AddCajaButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
`;

const CajaTable = styled.table`
  border-collapse: collapse;
  background: #f9f9f9;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  min-width: 20vw;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  th, td {
    padding: 12px 18px;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #667eea;
    color: white;
    font-size: 1.5rem;
  }

  td {
    font-weight: bold;
    color: #333;
    font-size: 1.5rem;
  }
`;

const ChevronButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #333;

  &:hover {
    color: #667eea;
    transform: scale(1.2);
  }
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;
