import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import { personalService } from '../../services/personalService';
import { ventasTratamientosService } from '../../services/ventasTratamientosService';

const ITEMS_PER_PAGE = 10;

function ComisionesCalculadas() {
  const [ventas, setVentas] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener personal y ventas usando los servicios con autenticación
      const [personalData, ventasData] = await Promise.all([
        personalService.getPersonal(),
        ventasTratamientosService.getVentasTratamientos()
      ]);

      setPersonal(personalData);
      setVentas(ventasData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const calcularComisiones = () => {
    return ventas
      .map((venta) => {
        const persona = personal.find((p) => p.id === venta.personal_id);
        if (!persona) return null;

        const comisionPorcentaje = Number(persona.comision_venta || 0);
        const comisionFija = Number(persona.comision_fija || 0);
        const totalVenta = venta.precio * venta.sesiones;
        const comisionPorcentualCalculada = (totalVenta * comisionPorcentaje) / 100;
        const totalComision = comisionPorcentualCalculada + (comisionFija * venta.sesiones);

      return {
        id: venta.id,
        fecha: venta.fecha,
        personal: `${persona.nombre} ${persona.apellido}`,
        tratamiento: venta.tratamiento_nombre,
        sesiones: venta.sesiones,
        precio: totalVenta,
        comision_pct: persona.comision_venta,
        comision_porcentual: comisionPorcentualCalculada,
        comision_fija: comisionFija * venta.sesiones,
        total_comision: totalComision
      };

      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  // Aplicar filtro por fecha
  const comisionesFiltradas = calcularComisiones().filter(c => {
    if (!fechaFiltro) return true;

    // Normalizamos la fecha de la venta para comparar solo yyyy-mm-dd
    const fechaVenta = new Date(c.fecha).toISOString().split('T')[0];

    return fechaVenta === fechaFiltro;
  });

  // Calcular totales para el resumen
  const calcularTotales = () => {
    const totalVentas = comisionesFiltradas.reduce((sum, c) => sum + c.precio, 0);
    const totalComisiones = comisionesFiltradas.reduce((sum, c) => sum + c.total_comision, 0);
    const totalOperaciones = comisionesFiltradas.length;
    
    return { totalVentas, totalComisiones, totalOperaciones };
  };

  const { totalVentas, totalComisiones, totalOperaciones } = calcularTotales();

  // Calcular páginas
  const totalPaginas = Math.ceil(comisionesFiltradas.length / ITEMS_PER_PAGE);

  // Paginación: obtener ítems de la página actual
  const comisionesPaginadas = comisionesFiltradas.slice(
    (pagina - 1) * ITEMS_PER_PAGE,
    pagina * ITEMS_PER_PAGE
  );

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPaginas) return;
    setPagina(newPage);
  };

  // Manejar cambio de filtro fecha (reset paginado)
  const handleFechaChange = (e) => {
    setFechaFiltro(e.target.value);
    setPagina(1);
  };

  if (loading) return (
    <TablasLayout title="Comisiones del Personal">
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Cargando comisiones...</LoadingText>
      </LoadingContainer>
    </TablasLayout>
  );

  if (error) return (
    <TablasLayout title="Comisiones del Personal">
      <ErrorContainer>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorTitle>Error al cargar datos</ErrorTitle>
        <ErrorMessage>{error}</ErrorMessage>
        <RetryButton onClick={fetchData}>Reintentar</RetryButton>
      </ErrorContainer>
    </TablasLayout>
  );

  return (
    <TablasLayout title="Comisiones del Personal">
      <Container>
        <Header>
          <TitleContainer>
            <TitleIcon>💰</TitleIcon>
            <Title>Historial de Comisiones</Title>
          </TitleContainer>
          <Subtitle>Seguimiento detallado de comisiones del personal por ventas de tratamientos</Subtitle>
        </Header>

        <StatsContainer>
          <StatCard>
            <StatIcon>📊</StatIcon>
            <StatValue>${Math.round(totalVentas).toLocaleString()}</StatValue>
            <StatLabel>Total en Ventas</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>💵</StatIcon>
            <StatValue>${Math.round(totalComisiones).toLocaleString()}</StatValue>
            <StatLabel>Total en Comisiones</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>📋</StatIcon>
            <StatValue>{totalOperaciones}</StatValue>
            <StatLabel>Operaciones</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>📈</StatIcon>
            <StatValue>{totalVentas > 0 ? Math.round((totalComisiones / totalVentas) * 100) : 0}%</StatValue>
            <StatLabel>% Promedio Comisión</StatLabel>
          </StatCard>
        </StatsContainer>

        <FilterSection>
          <FilterCard>
            <FilterLabel>
              <FilterIcon>📅</FilterIcon>
              Filtrar por fecha
            </FilterLabel>
            <FilterInput
              type="date"
              value={fechaFiltro}
              onChange={handleFechaChange}
            />
            {fechaFiltro && (
              <ClearFilterButton onClick={() => setFechaFiltro('')}>
                ✕ Limpiar filtro
              </ClearFilterButton>
            )}
          </FilterCard>
        </FilterSection>

        <TableSection>
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <th>📅 Fecha</th>
                  <th>👤 Personal</th>
                  <th>💆 Tratamiento</th>
                  <th>📊 Sesiones</th>
                  <th>💰 Precio Total</th>
                  <th>📈 Comisión %</th>
                  <th>💵 Comisión Fija</th>
                  <th>🎯 Total Comisión</th>
                </tr>
              </TableHeader>
              <tbody>
                {comisionesPaginadas.length > 0 ? (
                  comisionesPaginadas.map((c, index) => (
                    <TableRow key={c.id} index={index}>
                      <td>
                        <DateCell>{new Date(c.fecha).toLocaleDateString('es-ES')}</DateCell>
                      </td>
                      <td>
                        <PersonCell>{c.personal}</PersonCell>
                      </td>
                      <td>
                        <TreatmentCell>{c.tratamiento}</TreatmentCell>
                      </td>
                      <td>
                        <SessionsCell>{c.sesiones}</SessionsCell>
                      </td>
                      <td>
                        <PriceCell>${Math.round(c.precio).toLocaleString()}</PriceCell>
                      </td>
                      <td>
                        <CommissionCell>
                          <CommissionAmount>${Math.round(c.comision_porcentual).toLocaleString()}</CommissionAmount>
                          <CommissionPercent>({c.comision_pct}%)</CommissionPercent>
                        </CommissionCell>
                      </td>
                      <td>
                        <FixedCommissionCell>${Math.round(c.comision_fija).toLocaleString()}</FixedCommissionCell>
                      </td>
                      <td>
                        <TotalCommissionCell>
                          ${Math.round(c.total_comision).toLocaleString()}
                        </TotalCommissionCell>
                      </td>
                    </TableRow>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      <EmptyState>
                        <EmptyIcon>📊</EmptyIcon>
                        <EmptyTitle>No hay datos disponibles</EmptyTitle>
                        <EmptySubtitle>
                          {fechaFiltro 
                            ? 'No se encontraron comisiones para la fecha seleccionada' 
                            : 'No hay comisiones registradas'
                          }
                        </EmptySubtitle>
                      </EmptyState>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableContainer>

          {totalPaginas > 1 && (
            <PaginationContainer>
              <PaginationButton 
                onClick={() => handlePageChange(pagina - 1)} 
                disabled={pagina === 1}
              >
                ← Anterior
              </PaginationButton>

              <PaginationInfo>
                <CurrentPage>{pagina}</CurrentPage>
                <PageSeparator>de</PageSeparator>
                <TotalPages>{totalPaginas}</TotalPages>
              </PaginationInfo>

              <PaginationButton 
                onClick={() => handlePageChange(pagina + 1)} 
                disabled={pagina === totalPaginas}
              >
                Siguiente →
              </PaginationButton>
            </PaginationContainer>
          )}
        </TableSection>
      </Container>
    </TablasLayout>
  );
}

export default ComisionesCalculadas;

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  animation: ${slideIn} 0.8s ease-out;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const TitleIcon = styled.div`
  font-size: 3rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  margin: 0;
  font-weight: 400;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  animation: ${slideIn} 0.8s ease-out 0.2s both;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    animation: ${pulse} 0.6s ease-in-out;
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
`;

const FilterSection = styled.div`
  margin-bottom: 2.5rem;
  animation: ${slideIn} 0.8s ease-out 0.4s both;
`;

const FilterCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1a202c;
  font-size: 1.1rem;
`;

const FilterIcon = styled.span`
  font-size: 1.2rem;
`;

const FilterInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: white;
  }
`;

const ClearFilterButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }
`;

const TableSection = styled.div`
  animation: ${slideIn} 0.8s ease-out 0.6s both;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  th {
    padding: 1.5rem 1rem;
    text-align: left;
    font-weight: 600;
    color: white;
    font-size: 1rem;
    border-bottom: none;
    white-space: nowrap;
  }
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  animation: ${slideIn} 0.5s ease-out ${props => props.index * 0.05}s both;
  
  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    transform: translateX(5px);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
  
  td {
    padding: 1.5rem 1rem;
    vertical-align: middle;
  }
`;

const DateCell = styled.div`
  font-weight: 600;
  color: #1a202c;
`;

const PersonCell = styled.div`
  font-weight: 600;
  color: #667eea;
`;

const TreatmentCell = styled.div`
  color: #1a202c;
  font-weight: 500;
`;

const SessionsCell = styled.div`
  background: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
  font-weight: 600;
  display: inline-block;
  min-width: 50px;
`;

const PriceCell = styled.div`
  font-weight: 700;
  color: #059669;
  font-size: 1.1rem;
`;

const CommissionCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CommissionAmount = styled.div`
  font-weight: 600;
  color: #7c3aed;
`;

const CommissionPercent = styled.div`
  font-size: 0.85rem;
  color: #64748b;
`;

const FixedCommissionCell = styled.div`
  font-weight: 600;
  color: #dc2626;
`;

const TotalCommissionCell = styled.div`
  font-weight: 700;
  color: #1a202c;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 0.75rem;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #f59e0b;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const EmptySubtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const PaginationButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const CurrentPage = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
`;

const PageSeparator = styled.span`
  color: #64748b;
  font-weight: 500;
`;

const TotalPages = styled.span`
  color: #1a202c;
  font-weight: 600;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: #64748b;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 1.5rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.8rem;
  color: #dc2626;
  margin: 0;
`;

const ErrorMessage = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
`;

const RetryButton = styled.button`
  background: #dc2626;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #b91c1c;
    transform: translateY(-2px);
  }
`;
