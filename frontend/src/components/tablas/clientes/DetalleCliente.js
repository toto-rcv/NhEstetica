import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Definir URL base para las APIs
const API_BASE_URL = '/api';

const DetalleCliente = ({ cliente, onClose }) => {
  const [ventasProductosOriginal, setVentasProductosOriginal] = useState([]);
  const [ventasProductosFiltradas, setVentasProductosFiltradas] = useState([]);

  const [ventasTratamientosOriginal, setVentasTratamientosOriginal] = useState([]);
  const [ventasTratamientosFiltradas, setVentasTratamientosFiltradas] = useState([]);

  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('productos');

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);

        const [resProd, resTrat] = await Promise.all([
          fetch(`${API_BASE_URL}/ventas/productos/cliente/${cliente.id}`, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
          }),
          fetch(`${API_BASE_URL}/ventas/tratamientos/cliente/${cliente.id}`, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
          })
        ]);

        const [dataProd, dataTrat] = await Promise.all([
          resProd.json(),
          resTrat.json()
        ]);

        setVentasProductosOriginal(Array.isArray(dataProd) ? dataProd : []);
        setVentasProductosFiltradas(Array.isArray(dataProd) ? dataProd : []);

        setVentasTratamientosOriginal(Array.isArray(dataTrat) ? dataTrat : []);
        setVentasTratamientosFiltradas(Array.isArray(dataTrat) ? dataTrat : []);

      } catch (err) {
        console.error('Error al obtener ventas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (cliente?.id) fetchVentas();
  }, [cliente]);

const handleBuscarPorFecha = () => {
  const desde = filtroDesde ? new Date(filtroDesde) : null;
  const hasta = filtroHasta ? new Date(filtroHasta) : null;

  const filtrarPorRango = (ventas) =>
    ventas.filter(v => {
      const fecha = new Date(v.fecha);
      if (desde && fecha < desde) return false;
      if (hasta && fecha > hasta) return false;
      return true;
    });

  setVentasProductosFiltradas(filtrarPorRango(ventasProductosOriginal));
  setVentasTratamientosFiltradas(filtrarPorRango(ventasTratamientosOriginal));
};

  const limpiarFiltros = () => {
    setFiltroDesde('');
    setFiltroHasta('');
    setVentasProductosFiltradas(ventasProductosOriginal);
    setVentasTratamientosFiltradas(ventasTratamientosOriginal);
  };

  const calcularEstadisticas = () => {
  const totalTratamientos = ventasTratamientosFiltradas.reduce((acc, v) => acc + v.precio, 0);
  const totalProductos = ventasProductosFiltradas.reduce((acc, v) => acc + v.precio * v.cantidad, 0);
  const total = totalTratamientos + totalProductos;

  const fechas = [...ventasTratamientosFiltradas, ...ventasProductosFiltradas]
    .map(v => new Date(v.fecha))
      .filter(d => !isNaN(d));

  const visitas = ventasTratamientosFiltradas.length;

    if (fechas.length === 0) return { 
      total: 0, 
      promedioMensual: 0, 
      promedioVisita: 0,
      totalProductos,
      totalTratamientos,
      totalVisitas: visitas
    };

  const fechaMin = new Date(Math.min(...fechas));
  const fechaMax = new Date(Math.max(...fechas));

  const meses = Math.max(
    (fechaMax.getFullYear() - fechaMin.getFullYear()) * 12 + (fechaMax.getMonth() - fechaMin.getMonth()) + 1,
    1
  );

  const promedioMensual = total / meses;
  const promedioVisita = visitas ? total / visitas : 0;

  return {
    total,
    promedioMensual,
      promedioVisita,
      totalProductos,
      totalTratamientos,
      totalVisitas: visitas
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  if (!cliente) return null;

  const estadisticas = calcularEstadisticas();

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ClienteInfo>
            <ClienteAvatar>
              {cliente.imagen ? (
                <AvatarImage src={cliente.imagen} alt="Cliente" />
              ) : (
                <DefaultAvatar>
                  <AvatarIcon>👤</AvatarIcon>
                </DefaultAvatar>
              )}
            </ClienteAvatar>
            <ClienteDetails>
              <ClienteName>{cliente.nombre} {cliente.apellido}</ClienteName>
              <ClienteEmail>{cliente.email}</ClienteEmail>
              <ClientePhone>{cliente.telefono}</ClientePhone>
            </ClienteDetails>
          </ClienteInfo>
          <CloseButton onClick={onClose}>
            ✕
          </CloseButton>
        </ModalHeader>

        {/* Estadísticas rápidas */}
        <StatsSection>
          <StatCard>
            <StatIcon>💰</StatIcon>
            <StatValue>{formatCurrency(estadisticas.total)}</StatValue>
            <StatLabel>Total Gastado</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>📅</StatIcon>
            <StatValue>{formatCurrency(estadisticas.promedioMensual)}</StatValue>
            <StatLabel>Promedio Mensual</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>🎯</StatIcon>
            <StatValue>{formatCurrency(estadisticas.promedioVisita)}</StatValue>
            <StatLabel>Promedio por Visita</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>📊</StatIcon>
            <StatValue>{estadisticas.totalVisitas}</StatValue>
            <StatLabel>Total Visitas</StatLabel>
          </StatCard>
        </StatsSection>

        {/* Filtros de fecha */}
        <FilterSection>
          <FilterTitle>
            <FilterIcon>🔍</FilterIcon>
            Filtrar por Rango de Fechas
          </FilterTitle>
          <FilterControls>
            <FilterGroup>
              <FilterLabel>Desde</FilterLabel>
              <FilterInput
              type="date"
              value={filtroDesde}
              onChange={(e) => setFiltroDesde(e.target.value)}
            />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Hasta</FilterLabel>
              <FilterInput
              type="date"
              value={filtroHasta}
              onChange={(e) => setFiltroHasta(e.target.value)}
            />
            </FilterGroup>
            <FilterActions>
              <FilterButton onClick={handleBuscarPorFecha}>
                🔍 Buscar
              </FilterButton>
              <ClearFilterButton onClick={limpiarFiltros}>
                🗑️ Limpiar
              </ClearFilterButton>
            </FilterActions>
          </FilterControls>
        </FilterSection>

        {/* Tabs para cambiar entre productos y tratamientos */}
        <TabsContainer>
          <Tab 
            $active={activeTab === 'productos'} 
            onClick={() => setActiveTab('productos')}
          >
            🛍️ Productos ({ventasProductosFiltradas.length})
          </Tab>
          <Tab 
            $active={activeTab === 'tratamientos'} 
            onClick={() => setActiveTab('tratamientos')}
          >
            ✨ Tratamientos ({ventasTratamientosFiltradas.length})
          </Tab>
          <Tab 
            $active={activeTab === 'estadisticas'} 
            onClick={() => setActiveTab('estadisticas')}
          >
            📊 Estadísticas
          </Tab>
        </TabsContainer>

        <ContentArea>
        {loading ? (
            <LoadingContainer>
              <LoadingSpinner>⏳</LoadingSpinner>
              <LoadingText>Cargando información del cliente...</LoadingText>
            </LoadingContainer>
          ) : (
            <>
              {activeTab === 'productos' && (
                <TabContent>
                  <SectionTitle>
                    <SectionIcon>🛍️</SectionIcon>
                    Compras de Productos
                  </SectionTitle>
                  {ventasProductosFiltradas.length > 0 ? (
                    <>
                      <DataTable>
            <thead>
                          <TableRow>
                            <TableHeader>Producto</TableHeader>
                            <TableHeader>Marca</TableHeader>
                            <TableHeader>Precio</TableHeader>
                            <TableHeader>Cantidad</TableHeader>
                            <TableHeader>Fecha</TableHeader>
                            <TableHeader>Forma de Pago</TableHeader>
                            <TableHeader>Cuotas</TableHeader>
                            <TableHeader>Subtotal</TableHeader>
                          </TableRow>
            </thead>
            <tbody>
              {ventasProductosFiltradas.map(v => (
                            <TableRow key={v.id}>
                              <TableCell>{v.nombre_producto}</TableCell>
                              <TableCell>{v.marca_producto}</TableCell>
                              <TableCell>{formatCurrency(v.precio)}</TableCell>
                              <TableCell>{v.cantidad}</TableCell>
                              <TableCell>{formatDate(v.fecha)}</TableCell>
                              <TableCell>
                                <PaymentBadge>{v.forma_de_pago}</PaymentBadge>
                              </TableCell>
                              <TableCell>{v.cuotas || 0}</TableCell>
                              <TableCell>
                                <TotalAmount>{formatCurrency(v.precio * v.cantidad)}</TotalAmount>
                              </TableCell>
                            </TableRow>
              ))}
            </tbody>
            <tfoot>
                          <TableRow>
                            <TableCell colSpan="7" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                              Total en Productos:
                            </TableCell>
                            <TableCell>
                              <GrandTotal>
                                {formatCurrency(ventasProductosFiltradas.reduce((acc, v) => acc + (v.precio * v.cantidad), 0))}
                              </GrandTotal>
                            </TableCell>
                          </TableRow>
            </tfoot>
                      </DataTable>
                    </>
                  ) : (
                    <EmptyState>
                      <EmptyIcon>🛍️</EmptyIcon>
                      <EmptyTitle>No se encontraron compras de productos</EmptyTitle>
                      <EmptySubtitle>Este cliente no ha realizado compras de productos en el rango seleccionado</EmptySubtitle>
                    </EmptyState>
                  )}
                </TabContent>
              )}

              {activeTab === 'tratamientos' && (
                <TabContent>
                  <SectionTitle>
                    <SectionIcon>✨</SectionIcon>
                    Tratamientos Realizados
                  </SectionTitle>
                  {ventasTratamientosFiltradas.length > 0 ? (
                    <>
                      <DataTable>
            <thead>
                          <TableRow>
                            <TableHeader>Tratamiento</TableHeader>
                            <TableHeader>Sesiones</TableHeader>
                            <TableHeader>Precio</TableHeader>
                            <TableHeader>Fecha</TableHeader>
                            <TableHeader>Forma de Pago</TableHeader>
                            <TableHeader>Cuotas</TableHeader>
                            <TableHeader>Vencimiento</TableHeader>
                          </TableRow>
            </thead>
            <tbody>
              {ventasTratamientosFiltradas.map(v => (
                            <TableRow key={v.id}>
                              <TableCell>{v.tratamiento_nombre}</TableCell>
                              <TableCell>
                                <SessionBadge>{v.sesiones} sesiones</SessionBadge>
                              </TableCell>
                              <TableCell>{formatCurrency(v.precio)}</TableCell>
                              <TableCell>{formatDate(v.fecha)}</TableCell>
                              <TableCell>
                                <PaymentBadge>{v.forma_de_pago}</PaymentBadge>
                              </TableCell>
                              <TableCell>{v.cuotas || 0}</TableCell>
                              <TableCell>
                                {v.vencimiento ? (
                                  <ExpiryDate $expired={new Date(v.vencimiento) < new Date()}>
                                    {formatDate(v.vencimiento)}
                                  </ExpiryDate>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                            </TableRow>
              ))}
            </tbody>
            <tfoot>
                          <TableRow>
                            <TableCell colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                              Total en Tratamientos:
                            </TableCell>
                            <TableCell>
                              <GrandTotal>
                                {formatCurrency(ventasTratamientosFiltradas.reduce((acc, v) => acc + v.precio, 0))}
                              </GrandTotal>
                            </TableCell>
                          </TableRow>
            </tfoot>
                      </DataTable>
                    </>
                  ) : (
                    <EmptyState>
                      <EmptyIcon>✨</EmptyIcon>
                      <EmptyTitle>No se encontraron tratamientos</EmptyTitle>
                      <EmptySubtitle>Este cliente no ha realizado tratamientos en el rango seleccionado</EmptySubtitle>
                    </EmptyState>
                  )}
                </TabContent>
              )}

              {activeTab === 'estadisticas' && (
                <TabContent>
                  <SectionTitle>
                    <SectionIcon>📊</SectionIcon>
                    Estadísticas Detalladas
                  </SectionTitle>
                  <StatsGrid>
                    <StatsCard>
                      <StatsCardHeader>
                        <StatsCardIcon>💰</StatsCardIcon>
                        <StatsCardTitle>Resumen Financiero</StatsCardTitle>
                      </StatsCardHeader>
                      <StatsCardContent>
                        <StatLine>
                          <StatLineLabel>Total en Productos:</StatLineLabel>
                          <StatLineValue>{formatCurrency(estadisticas.totalProductos)}</StatLineValue>
                        </StatLine>
                        <StatLine>
                          <StatLineLabel>Total en Tratamientos:</StatLineLabel>
                          <StatLineValue>{formatCurrency(estadisticas.totalTratamientos)}</StatLineValue>
                        </StatLine>
                        <StatLine $highlight>
                          <StatLineLabel>Total General:</StatLineLabel>
                          <StatLineValue>{formatCurrency(estadisticas.total)}</StatLineValue>
                        </StatLine>
                      </StatsCardContent>
                    </StatsCard>

                    <StatsCard>
                      <StatsCardHeader>
                        <StatsCardIcon>📈</StatsCardIcon>
                        <StatsCardTitle>Promedios</StatsCardTitle>
                      </StatsCardHeader>
                      <StatsCardContent>
                        <StatLine>
                          <StatLineLabel>Gasto Mensual:</StatLineLabel>
                          <StatLineValue>{formatCurrency(estadisticas.promedioMensual)}</StatLineValue>
                        </StatLine>
                        <StatLine>
                          <StatLineLabel>Gasto por Visita:</StatLineLabel>
                          <StatLineValue>{formatCurrency(estadisticas.promedioVisita)}</StatLineValue>
                        </StatLine>
                        <StatLine>
                          <StatLineLabel>Total de Visitas:</StatLineLabel>
                          <StatLineValue>{estadisticas.totalVisitas}</StatLineValue>
                        </StatLine>
                      </StatsCardContent>
                    </StatsCard>
                  </StatsGrid>
                </TabContent>
              )}
            </>
          )}
        </ContentArea>
      </ModalContainer>
    </Overlay>
  );
};

export default DetalleCliente;

// Estilos modernos y profesionales
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;

  @keyframes slideIn {
    0% { transform: scale(0.9) translateY(-20px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClienteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const ClienteAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarIcon = styled.span`
  font-size: 2rem;
  color: white;
`;

const ClienteDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ClienteName = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

const ClienteEmail = styled.div`
  opacity: 0.9;
  font-size: 1rem;
`;

const ClientePhone = styled.div`
  opacity: 0.8;
  font-size: 0.9rem;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const FilterSection = styled.div`
  padding: 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
`;

const FilterTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #2d3748;
`;

const FilterIcon = styled.span`
  font-size: 1.2rem;
`;

const FilterControls = styled.div`
  display: flex;
  align-items: end;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
`;

const FilterInput = styled.input`
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const ClearFilterButton = styled.button`
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #edf2f7;
    transform: translateY(-2px);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.$active ? '#667eea' : 'transparent'};
  color: ${props => props.$active ? '#667eea' : '#718096'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? 'white' : '#edf2f7'};
    color: ${props => props.$active ? '#667eea' : '#4a5568'};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.4rem;
  color: #2d3748;
`;

const SectionIcon = styled.span`
  font-size: 1.4rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
`;

const LoadingSpinner = styled.div`
  font-size: 3rem;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #718096;
  font-size: 1.1rem;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8fafc;
  }
  
  &:hover {
    background: #e6f7ff;
  }
`;

const TableHeader = styled.th`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #4a5568;
`;

const PaymentBadge = styled.span`
  background: #e6fffa;
  color: #38a169;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid #9ae6b4;
`;

const SessionBadge = styled.span`
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid #cbd5e0;
`;

const ExpiryDate = styled.span`
  background: ${props => props.$expired ? '#fed7d7' : '#f0fff4'};
  color: ${props => props.$expired ? '#c53030' : '#2f855a'};
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid ${props => props.$expired ? '#feb2b2' : '#9ae6b4'};
`;

const TotalAmount = styled.span`
  font-weight: 600;
  color: #2d3748;
`;

const GrandTotal = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: #667eea;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const EmptySubtitle = styled.p`
  color: #718096;
  max-width: 400px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const StatsCardHeader = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const StatsCardIcon = styled.div`
  font-size: 2rem;
`;

const StatsCardTitle = styled.h4`
    margin: 0;
  font-size: 1.2rem;
  color: #2d3748;
`;

const StatsCardContent = styled.div`
  padding: 1.5rem;
`;

const StatLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: ${props => props.$highlight ? '2px solid #667eea' : '1px solid #e2e8f0'};
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.$highlight && `
    background: #f0f9ff;
    margin: 0 -1.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
  `}
`;

const StatLineLabel = styled.span`
  color: #4a5568;
  font-weight: 500;
`;

const StatLineValue = styled.span`
  color: #2d3748;
  font-weight: 700;
  font-size: 1.1rem;
`;
