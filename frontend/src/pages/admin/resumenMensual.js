import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import { resumenService } from '../../services/resumenService';

const Inicio = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [alquiler, setAlquiler] = useState('');
  const [expensas, setExpensas] = useState('');
  const [editingAlquiler, setEditingAlquiler] = useState(true);
  const [editingExpensas, setEditingExpensas] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const mesActual = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  useEffect(() => {
    fetchData();
    fetchGastosFijos();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await resumenService.getResumenCompleto();
      setEstadisticas(data);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGastosFijos = async () => {
    try {
      const gastos = await resumenService.getGastosFijosPorMes(mesActual);
      setAlquiler(gastos.alquiler !== undefined ? gastos.alquiler.toString() : '');
      setExpensas(gastos.expensas !== undefined ? gastos.expensas.toString() : '');

      // Si hay valores, inicialmente los mostramos en modo texto (no editables)
      setEditingAlquiler(gastos.alquiler === undefined);
      setEditingExpensas(gastos.expensas === undefined);
    } catch (error) {
      console.error('Error al cargar gastos fijos:', error);
    }
  };

  const handleSaveGastos = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await resumenService.upsertGastosFijos({
        mes: mesActual,
        alquiler: parseFloat(alquiler) || 0,
        expensas: parseFloat(expensas) || 0,
      });
      setSaveSuccess(true);
    setEditingAlquiler(true);
    setEditingExpensas(true);

    } catch (error) {
      setSaveError('Error al guardar los gastos fijos');
    } finally {
      setSaving(false);
    }
  };

  // Al hacer click sobre el texto, se activa modo edición
  const handleEditAlquiler = () => setEditingAlquiler(true);
  const handleEditExpensas = () => setEditingExpensas(true);

  const formatMoney = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(numericAmount);
  };

  const getMonthName = () => {
    const date = new Date();
    return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <TablasLayout title="Panel de Administración">
        <LoadingContainer>Cargando datos...</LoadingContainer>
      </TablasLayout>
    );
  }

  if (error) {
    return (
      <TablasLayout title="Panel de Administración">
        <ErrorContainer>{error}</ErrorContainer>
      </TablasLayout>
    );
  }

  // Suma de gastos actualizada incluyendo alquiler y expensas
  const totalGastosActualizados =
    (parseFloat(estadisticas.totalGastos?.egresos) || 0) +
    (parseFloat(estadisticas.totalGastos?.comisiones) || 0) +
    (parseFloat(alquiler) || 0) +
    (parseFloat(expensas) || 0);

const gananciaNeta = parseFloat(estadisticas.ganancias || 0);
const gananciaMensual = gananciaNeta - totalGastosActualizados;

  return (
    <TablasLayout title="">
      <Container>
        <WelcomeContainer>
          <WelcomeTitle>Bienvenido a tu Resumen Mensual</WelcomeTitle>
          <WelcomeText>
            Aquí podrás ver un resumen de las finanzas de tu negocio, incluyendo los retiros de caja,
            comisiones totales del personal, productos y tratamientos más vendidos.
          </WelcomeText>
        </WelcomeContainer>

        <MesActual>{`Resumen de ${getMonthName()}`}</MesActual>

        <GridResumen>
          <TablaContainer>
            <StatCard>
              <StatTitle>Ganancia Neta del Mes</StatTitle>
              <StatAmount>{formatMoney(parseFloat(estadisticas.ganancias || 0))}</StatAmount>
            </StatCard>
            <TablaTitulo>Ventas por Forma de Pago</TablaTitulo>
            <StyledTable>
              <thead>
                <tr>
                  <th>Forma de Pago</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(estadisticas.ventasPorForma || {}).map(([forma, total]) => (
                  <tr key={forma}>
                    <td>{forma}</td>
                    <td>{formatMoney(parseFloat(total || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>

            <StatTitle>Total retirado de Caja: {formatMoney(parseFloat(estadisticas.cierres || 0))}</StatTitle>
          </TablaContainer>

          <GastosContainer>
            <StatCard>
              <StatTitle>Total Gastos del Mes</StatTitle>
              <StatAmount>{formatMoney(totalGastosActualizados)}</StatAmount>
            </StatCard>

            <StatCard>
              <StatTitle>Gastos de Egresos</StatTitle>
              <StatAmount>{formatMoney(estadisticas.totalGastos?.egresos)}</StatAmount>
            </StatCard>

            <StatCard>
              <StatTitle>Gastos de Comisiones</StatTitle>
              <StatAmount>{formatMoney(estadisticas.totalGastos?.comisiones)}</StatAmount>
            </StatCard>

            <StatCard>
              <StatTitle>Expensas de Local</StatTitle>
              {editingExpensas ? (
                <Input
                  type="number"
                  value={expensas}
                  onChange={e => setExpensas(e.target.value)}
                  placeholder="Ingrese expensas"
                  step="0.01"
                  min="0"
                />
              ) : (
                <TextoEditable onClick={handleEditExpensas}>{formatMoney(expensas)}</TextoEditable>
              )}
            </StatCard>

            <StatCard>
              <StatTitle>Alquiler de Local</StatTitle>
              {editingAlquiler ? (
                <Input
                  type="number"
                  value={alquiler}
                  onChange={e => setAlquiler(e.target.value)}
                  placeholder="Ingrese alquiler"
                  step="0.01"
                  min="0"
                />
              ) : (
                <TextoEditable onClick={handleEditAlquiler}>{formatMoney(alquiler)}</TextoEditable>
              )}
            </StatCard>

            {(editingAlquiler || editingExpensas) && (
              <GuardarBtn onClick={handleSaveGastos} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar gastos fijos'}
              </GuardarBtn>
            )}

            {saveError && <ErrorMsg>{saveError}</ErrorMsg>}
            {saveSuccess && <SuccessMsg>Guardado con éxito!</SuccessMsg>}
          </GastosContainer>
        </GridResumen>
                   <StatCard>
            <StatTitle>Ganancia Mensual Final</StatTitle>
            <StatAmount>{formatMoney(gananciaMensual)}</StatAmount>
          </StatCard>
      </Container>
    </TablasLayout>
  );
};

export default Inicio;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

const WelcomeContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
  color: white;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const WelcomeTitle = styled.h2`
  color: white;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;

  &:before {
    content: '🌟';
    margin-right: 1rem;
    font-size: 2rem;
  }
`;

const WelcomeText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background: #ffebee;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
  color: #c62828;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
`;

const StatTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  position: relative;

  &:before {
    content: '📊';
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const StatAmount = styled.p`
  color: #666;
  font-size: 1.3rem;
  font-weight: 500;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-top: 1rem;
  display: inline-block;
`;

const MesActual = styled.h2`
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
`;

const TablaContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
  margin-bottom: 2rem;
`;

const TablaTitulo = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #444;
  text-align: center;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #555;
  }

  td {
    color: #333;
  }
`;

const GridResumen = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const GastosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 1.1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-top: 0.5rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 5px #4caf50;
  }
`;

const GuardarBtn = styled.button`
  margin-top: 1rem;
  background-color: #4caf50;
  color: white;
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #388e3c;
  }
`;

const ErrorMsg = styled.p`
  color: #c62828;
  margin-top: 0.5rem;
  font-weight: 600;
`;

const SuccessMsg = styled.p`
  color: #2e7d32;
  margin-top: 0.5rem;
  font-weight: 600;
`;

const TextoEditable = styled.p`
  cursor: pointer;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  background-color: #f0f0f0;
  border: 1px dashed #ccc;
  text-align: center;
  font-size: 1.1rem;
  color: #333;
  margin-top: 0.5rem;

  &:hover {
    background-color: #e0e0e0;
  }
`;
