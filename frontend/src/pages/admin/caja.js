import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import Ingresos from '../../components/tablas/caja/Ingresos';
import Egresos from '../../components/tablas/caja/Egresos';
import CajaResumen from '../../components/tablas/caja/FormasDePago';

import ModalCaja from '../../components/tablas/caja/ModalCaja';
import ModalCerrarCaja from '../../components/tablas/caja/ModalCerrarCaja';
import { cajaService } from '../../services/cajaService';
import { egresosService } from '../../services/egresosService';
import { ingresosService } from '../../services/ingresosService';

const Caja = () => {
  const hoy = new Date();
  const hoyISO = hoy.toISOString().slice(0, 10);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalCerrarAbierto, setModalCerrarAbierto] = useState(false);
  const [montoApertura, setMontoApertura] = useState(null); 
  const [fechaCaja, setFechaCaja] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoyISO);
  const [egresosEfectivo, setEgresosEfectivo] = useState(0);
  const [ingresosEfectivo, setIngresosEfectivo] = useState(0);
  const [contadorActualizacion, setContadorActualizacion] = useState(0);
  const [cajaCerrada, setCajaCerrada] = useState(false);
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
      const data = await cajaService.createAperturaCaja({
        fecha: fechaSeleccionada,
        monto_apertura: monto,
        monto_cierre: 0
      });

      setMontoApertura(monto);
      setFechaCaja(fechaSeleccionada);
      setModalAbierto(false);
    } catch (error) {
      alert(error.message || 'Error al guardar la caja');
      console.error(error);
    }
  };

  const handleCerrarCaja = async () => {
    const montoCierre = parseFloat(montoApertura) + ingresosEfectivo - egresosEfectivo;
    
    try {
      await cajaService.cerrarCaja(fechaSeleccionada, montoCierre);
      
      alert('Caja cerrada exitosamente');
      setModalCerrarAbierto(false);
      fetchCaja(); // Recargar los datos de la caja
    } catch (error) {
      alert(error.message || 'Error al cerrar caja');
      console.error(error);
    }
  };

  const fetchCaja = async () => {
    setCargando(true);
    try {
      const data = await cajaService.getCajaByFecha(fechaSeleccionada);
      
      if (data) {
        setMontoApertura(data.monto_apertura);
        setFechaCaja(data.fecha);
        // Verificar si la caja está cerrada (monto_cierre mayor que 0)
        const montoCierre = parseFloat(data.monto_cierre);
        const isCajaCerrada = montoCierre > 0;
        setCajaCerrada(isCajaCerrada);
      } else {
        setMontoApertura(null);
        setFechaCaja(null);
        setCajaCerrada(false);
      }
    } catch (error) {
      console.error('Error al cargar caja del día:', error);
      setMontoApertura(null);
      setFechaCaja(null);
      setCajaCerrada(false);
    } finally {
      setCargando(false);
    }
  };

  const fetchEgresosEfectivo = async () => {
    try {
      const data = await egresosService.getEgresosByFecha(fechaSeleccionada);
      const totalEfectivo = data
        .filter(e => e.forma_pago === 'Efectivo')
        .reduce((acc, cur) => acc + parseFloat(cur.importe || 0), 0);
      setEgresosEfectivo(totalEfectivo);
    } catch (err) {
      setEgresosEfectivo(0);
    }
  };

  const fetchIngresosEfectivo = async () => {
    try {
      const data = await ingresosService.getIngresosByFecha(fechaSeleccionada);
      const totalEfectivo = data
        .filter(i => i.forma_de_pago === 'Efectivo')
        .reduce((acc, cur) => acc + parseFloat(cur.importe || 0), 0);
      setIngresosEfectivo(totalEfectivo);
    } catch (err) {
      setIngresosEfectivo(0);
    }
  };

  useEffect(() => {
    fetchCaja();
    fetchEgresosEfectivo();
    fetchIngresosEfectivo();
  }, [fechaSeleccionada]);

  return (
    <TablasLayout title="Gestión de Caja">
      <Container>
        <HeaderContainer>
          <FechaNavegacion>
            <ChevronButton onClick={() => cambiarDia(-1)}>←</ChevronButton>
            <Title>{montoApertura !== null ? `Día ${fechaLegible}` : `Sin caja registrada (${fechaLegible})`}</Title>
            <ChevronButton onClick={() => cambiarDia(1)}>→</ChevronButton>
            <DateInput
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              max={hoyISO}
            />
          </FechaNavegacion>

          <CajaSection>
            {!cargando && montoApertura !== null && !isNaN(montoApertura) ? (
              <CajaContainer>
                <CajaTable>
                  <thead>
                    <tr>
                      <th>Apertura</th>
                      <th>Ingresos Efectivo</th>
                      <th>Egresos Efectivo</th>
                      <th>Cierre</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${parseFloat(montoApertura).toFixed(0)}</td>
                      <td>${ingresosEfectivo.toFixed(0)}</td>
                      <td>${egresosEfectivo.toFixed(0)}</td>
                      <td>${(parseFloat(montoApertura) + ingresosEfectivo - egresosEfectivo).toFixed(0)}</td>
                    </tr>
                  </tbody>
                </CajaTable>
                {esHoy && !cajaCerrada && (
                  <CerrarCajaButton onClick={() => setModalCerrarAbierto(true)}>
                    Cerrar Caja
                  </CerrarCajaButton>
                )}
                {cajaCerrada && (
                  <CajaCerradaMessage>
                    ✅ Caja cerrada - No se pueden realizar más operaciones
                  </CajaCerradaMessage>
                )}
              </CajaContainer>
            ) : (
              <AddCajaButton onClick={() => setModalAbierto(true)}>
                Agregar Caja del día
              </AddCajaButton>
            )}
          </CajaSection>
        </HeaderContainer>

        <Egresos
          fechaSeleccionada={fechaSeleccionada}
          cajaCerrada={cajaCerrada}
          onActualizar={() => {
            fetchCaja();
            fetchEgresosEfectivo();
            fetchIngresosEfectivo();
            setContadorActualizacion(prev => prev + 1); // <-- NUEVO
          }}
        />

        <Ingresos
          fechaSeleccionada={fechaSeleccionada}
          cajaCerrada={cajaCerrada}
          onActualizar={() => {
            fetchCaja();
            fetchEgresosEfectivo();
            fetchIngresosEfectivo();
            setContadorActualizacion(prev => prev + 1); // <-- NUEVO
          }}
        />
        

        <CajaResumen 
          fechaSeleccionada={fechaSeleccionada}
          actualizarTrigger={contadorActualizacion}
        />


        <ModalCaja
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onGuardar={handleGuardarMonto}
        />

        <ModalCerrarCaja
          isOpen={modalCerrarAbierto}
          onClose={() => setModalCerrarAbierto(false)}
          onConfirmar={handleCerrarCaja}
          montoCierre={(parseFloat(montoApertura || 0) + ingresosEfectivo - egresosEfectivo).toFixed(0)}
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
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FechaNavegacion = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
`;

const CajaSection = styled.div`
  display: flex;
  justify-content: center;
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

const CajaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const CerrarCajaButton = styled.button`
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CajaCerradaMessage = styled.div`
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
`;
