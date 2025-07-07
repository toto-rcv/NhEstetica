import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import { inicioService } from '../../services/inicioService';

const Inicio = () => {
  const [ranking, setRanking] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [clientesActivosYPasivos, setClientesActivosYPasivos] = useState(null);
  const [tratamientosVencimiento, setTratamientosVencimiento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rankingData, tratamientosData] = await Promise.all([
        inicioService.getRankingClientes(),
        inicioService.getTratamientosVencimientoMes()
      ]);
      
      setRanking(rankingData.ranking);
      setEstadisticas(rankingData.estadisticas);
      setClientesActivosYPasivos(rankingData.clientesActivosYPasivos);
      setTratamientosVencimiento(tratamientosData.tratamientos);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => {
    // Asegurar que amount sea un número
    const numericAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(numericAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  return (
    <TablasLayout title="">
      <Container>
        <WelcomeContainer>
          <WelcomeTitle>Bienvenido al Panel de Administración</WelcomeTitle>
          <WelcomeText>
            Aquí puedes ver el ranking de clientes y las estadísticas principales.
          </WelcomeText>
        </WelcomeContainer>

        {estadisticas && (
          <StatsContainer>
            <StatCard>
              <StatTitle>Cliente que más gastó este mes</StatTitle>
              <StatValue>{estadisticas.clienteMasGastoMes.cliente}</StatValue>
              <StatAmount>{formatMoney(estadisticas.clienteMasGastoMes.total)}</StatAmount>
            </StatCard>
            
            <StatCard>
              <StatTitle>Cliente que más gastó este año</StatTitle>
              <StatValue>{estadisticas.clienteMasGastoAño.cliente}</StatValue>
              <StatAmount>{formatMoney(estadisticas.clienteMasGastoAño.total)}</StatAmount>
            </StatCard>
          </StatsContainer>
        )}

        {clientesActivosYPasivos && (
          <ClientesActivosPasivosContainer>
            <TitleSection>Estado de Clientes</TitleSection>
            <ClientesGrid>
              {/* Clientes Activos */}
              <ClientesSection>
                <ClientesSectionTitle $activos>
                  Clientes Activos (compraron hace menos de 1 mes)
                </ClientesSectionTitle>
                <ClientesStats>
                  <ClientesStatItem>
                    <ClientesStatLabel>Cantidad:</ClientesStatLabel>
                    <ClientesStatValue>{clientesActivosYPasivos.activos.cantidad}</ClientesStatValue>
                  </ClientesStatItem>
                </ClientesStats>
                <ClientesTable>
                  <ClientesTableHead>
                    <tr>
                      <Th>Cliente</Th>
                      <Th>Última Compra</Th>
                      <Th>Total Compras</Th>
                    </tr>
                  </ClientesTableHead>
                  <tbody>
                    {clientesActivosYPasivos.activos.clientes.map((cliente) => (
                      <tr key={cliente.id}>
                        <Td>{cliente.cliente}</Td>
                        <Td>{formatDate(cliente.ultima_compra)}</Td>
                        <Td>{cliente.total_compras}</Td>
                      </tr>
                    ))}
                  </tbody>
                </ClientesTable>
              </ClientesSection>

              {/* Clientes Pasivos */}
              <ClientesSection>
                <ClientesSectionTitle $pasivos>
                  Clientes Pasivos (compraron hace más de 3 meses)
                </ClientesSectionTitle>
                <ClientesStats>
                  <ClientesStatItem>
                    <ClientesStatLabel>Cantidad:</ClientesStatLabel>
                    <ClientesStatValue>{clientesActivosYPasivos.pasivos.cantidad}</ClientesStatValue>
                  </ClientesStatItem>
                </ClientesStats>
                <ClientesTable>
                  <ClientesTableHead>
                    <tr>
                      <Th>Cliente</Th>
                      <Th>Última Compra</Th>
                      <Th>Total Compras</Th>
                    </tr>
                  </ClientesTableHead>
                  <tbody>
                    {clientesActivosYPasivos.pasivos.clientes.map((cliente) => (
                      <tr key={cliente.id}>
                        <Td>{cliente.cliente}</Td>
                        <Td>{formatDate(cliente.ultima_compra)}</Td>
                        <Td>{cliente.total_compras}</Td>
                      </tr>
                    ))}
                  </tbody>
                </ClientesTable>
              </ClientesSection>
            </ClientesGrid>
          </ClientesActivosPasivosContainer>
        )}

        <TratamientosVencimientoContainer>
          <TratamientosVencimientoTitle>Tratamientos que Vencen Este Mes</TratamientosVencimientoTitle>
          {tratamientosVencimiento.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Cliente</Th>
                  <Th>Tratamiento</Th>
                  <Th>Fecha de Vencimiento</Th>
                </tr>
              </thead>
              <tbody>
                {tratamientosVencimiento.map((tratamiento, index) => (
                  <tr key={index}>
                    <Td>{tratamiento.cliente}</Td>
                    <Td>{tratamiento.tratamiento}</Td>
                    <Td>{formatDate(tratamiento.fecha_vencimiento)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <NoDataMessage>No hay tratamientos que venzan este mes</NoDataMessage>
          )}
        </TratamientosVencimientoContainer>

        <RankingContainer>
          <RankingTitle>Ranking de Clientes</RankingTitle>
          <Table>
            <thead>
              <tr>
                <Th>Ranking</Th>
                <Th>Cliente</Th>
                <Th>TGM (Total Gastado Mes)</Th>
                <Th>TGA (Total Gastado Año)</Th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((cliente) => (
                <tr key={cliente.id}>
                  <Td>{cliente.ranking}</Td>
                  <Td>{cliente.cliente}</Td>
                  <Td>{formatMoney(cliente.total_mes)}</Td>
                  <Td>{formatMoney(cliente.total_año)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </RankingContainer>
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
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
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

const StatValue = styled.p`
  color: #4caf50;
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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

const RankingContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
`;

const RankingTitle = styled.h3`
  margin: 0;
  padding: 1.5rem;
background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);

  font-size: 1.3rem;
  font-weight: 600;
  border: none;
  color: #333;
  position: relative;
  
  &:before {
    content: '🏆';
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  tbody tr {
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    &:nth-child(even) {
      background: #fafafa;
    }
    
    &:nth-child(odd) {
      background: white;
    }
  }
`;

const Th = styled.th`
  background: linear-gradient(to bottom, #667eea 0%, #764ba2 100%);
  padding: 1.2rem;
  text-align: left;
  font-weight: 600;
  color: white;
  border: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-size: 0.95rem;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 1.2rem;
  border: none;
  color: #444;
  font-size: 0.95rem;
  
  &:nth-child(1) {
    font-weight: bold;
    color: #4caf50;
    position: relative;
    
    &:before {
      content: '🏆';
      margin-right: 0.5rem;
      font-size: 1.1rem;
    }
  }
  
  &:nth-child(2) {
    font-weight: 500;
    color: #333;
  }
  
  &:nth-child(3) {
    font-weight: 600;
    color: #2196f3;
    text-align: center;
  }
  
  &:nth-child(4) {
    font-weight: 600;
    color: #2196f3;
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  }
`;

// Estilos para la sección de clientes activos y pasivos
const ClientesActivosPasivosContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const TitleSection = styled.h3`
  color: #333;
  margin: 0;
  padding: 1.5rem;
  background: #f5f5f5;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
`;

const ClientesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ClientesSection = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
`;

const ClientesSectionTitle = styled.h4`
  color: ${props => props.$activos ? '#4caf50' : '#ff9800'};
  margin: 0 0 1rem 0;
  padding: 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 2px solid ${props => props.$activos ? '#4caf50' : '#ff9800'};
`;

const ClientesStats = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ClientesStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ClientesStatLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const ClientesStatValue = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const ClientesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  tbody tr {
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:nth-child(even) {
      background: #fafafa;
    }
    
    &:nth-child(odd) {
      background: white;
    }
  }
  
  td {
    padding: 1rem;
    border: none;
    color: #444;
    font-size: 0.9rem;
    
    &:first-child {
      font-weight: 600;
      color: #333;
      position: relative;
      
      &:before {
        content: '👤';
        margin-right: 0.5rem;
        font-size: 1rem;
      }
    }
    
    &:nth-child(2) {
      color: #666;
      font-style: italic;
    }
    
    &:nth-child(3) {
      font-weight: 600;
      color: #2196f3;
      text-align: center;
    }
  }
`;

const ClientesTableHead = styled.thead`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  
  th {
    padding: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: white;
    border: none;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    letter-spacing: 0.5px;
    
    &:first-child {
      border-top-left-radius: 6px;
    }
    
    &:last-child {
      border-top-right-radius: 6px;
    }
  }
`;

// Estilos para la tabla de tratamientos por vencer
const TratamientosVencimientoContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
  
  table {
    tbody tr {
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      &:nth-child(even) {
        background: #fafafa;
      }
      
      &:nth-child(odd) {
        background: white;
      }
    }
    
    td {
      padding: 1.2rem;
      border: none;
      color: #444;
      font-size: 0.95rem;
      
      &:first-child {
        font-weight: 600;
        color: #333;
        position: relative;
        
        &:before {
          content: '👤';
          margin-right: 0.5rem;
          font-size: 1rem;
        }
      }
      
      &:nth-child(2) {
        color: #e91e63;
        font-weight: 600;
        position: relative;
        
        &:before {
          content: '💆';
          margin-right: 0.5rem;
          font-size: 1rem;
        }
      }
      
             &:nth-child(3) {
         font-weight: 600;
         color: #ff5722;
         text-align: center;
         background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
         position: relative;
         
         &:before {
           content: '⏰';
           margin-right: 0.5rem;
           font-size: 1rem;
         }
       }
    }
    
    th {
      background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
      padding: 1.2rem;
      font-size: 0.95rem;
      font-weight: 600;
      color: white;
      border: none;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      letter-spacing: 0.5px;
      
      &:first-child {
        border-top-left-radius: 8px;
      }
      
      &:last-child {
        border-top-right-radius: 8px;
      }
    }
  }
`;

const TratamientosVencimientoTitle = styled.h3`
  color: #333;
  margin: 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 1px solid #ffb74d;
  text-align: left;
  position: relative;
  
  &:before {
    content: '⚠️';
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
  font-style: italic;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  border-radius: 10px;
  margin: 1rem;
  position: relative;
  
  &:before {
    content: '✅';
    display: block;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;