import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import { resumenService } from '../../services/resumenService';
import ResumenFinanciero from '../../components/tablas/resumen/ResumenFInanciero';
import TablaDeVentas from '../../components/tablas/resumen/TablaDeVentas';
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

  const mesActual = new Date().toISOString().slice(0, 7);

  const [ventasMensuales, setVentasMensuales] = useState({ productos: [], tratamientos: [] });

  
const fetchVentasMensuales = async () => {
  try {
    const data = await resumenService.getVentasMensualesPorTipo(mesActual);
    setVentasMensuales(data);
    console.log('Ventas mensuales cargadas:', data);
  } catch (err) {
    console.error('Error al cargar ventas mensuales:', err);
  }
};

  useEffect(() => {
    fetchData();
    fetchGastosFijos();
    fetchVentasMensuales();
  }, []);

  const fetchData = async () => {
    try {
      const data = await resumenService.getResumenCompleto();
      setEstadisticas(data);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchGastosFijos = async () => {
    try {
      const gastos = await resumenService.getGastosFijosPorMes(mesActual);
      setAlquiler(gastos.alquiler?.toString() || '');
      setExpensas(gastos.expensas?.toString() || '');
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
    } catch {
      setSaveError('Error al guardar los gastos fijos');
    } finally {
      setSaving(false);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(parseFloat(amount) || 0);
  };

  const getMonthName = () =>
    new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <TablasLayout title="Panel de Administración">
        <CenteredText>Cargando datos...</CenteredText>
      </TablasLayout>
    );
  }

  if (error) {
    return (
      <TablasLayout title="Panel de Administración">
        <ErrorText>{error}</ErrorText>
      </TablasLayout>
    );
  }

const totalIngresos = Object.values(estadisticas.ventasPorForma || {}).reduce(
  (acc, val) => acc + (parseFloat(val) || 0),
  0
);

const totalGastos =
  (parseFloat(estadisticas.totalGastos?.egresos) || 0) +
  (parseFloat(estadisticas.totalGastos?.comisiones) || 0) +
  (parseFloat(alquiler) || 0) +
  (parseFloat(expensas) || 0);

const gananciaMensual = totalIngresos - totalGastos;

  return (
    <TablasLayout>
      <Container>
        <Hero>
          <h2>🌟 Bienvenido a tu Resumen Mensual</h2>
          <p>
            Aquí podrás ver un resumen de las finanzas de tu negocio, incluyendo los retiros de caja,
            comisiones totales del personal, productos y tratamientos más vendidos.
          </p>
        </Hero>

        <MesActual>{`Resumen de ${getMonthName()}`}</MesActual>

        <ResumenFinanciero
          estadisticas={estadisticas}
          alquiler={alquiler}
          expensas={expensas}
          editingAlquiler={editingAlquiler}
          editingExpensas={editingExpensas}
          handleEditAlquiler={() => setEditingAlquiler(true)}
          handleEditExpensas={() => setEditingExpensas(true)}
          handleSaveGastos={handleSaveGastos}
          saving={saving}
          saveError={saveError}
          saveSuccess={saveSuccess}
          setAlquiler={setAlquiler}
          setExpensas={setExpensas}
          formatMoney={formatMoney}
          gananciaMensual={gananciaMensual}
        />

        <TablaDeVentas
        ventas={ventasMensuales}
        />
      </Container>
    </TablasLayout>
  );
};

export default Inicio;

// ESTILOS

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const Hero = styled.div`
  text-align: center;
  padding: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
  }
`;

const MesActual = styled.h2`
  text-align: center;
  font-size: 1.6rem;
  color: #333;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.4rem;
    font-weight: bold;
    color: #2e7d32;
  }
`;

const CenteredText = styled.div`
  padding: 3rem;
  text-align: center;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorText = styled(CenteredText)`
  background: #ffebee;
  color: #c62828;
`;
