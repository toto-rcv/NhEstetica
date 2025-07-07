import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import TablaClientes from '../../components/tablas/clientes/TablaClientes';
import ClienteForm from '../../components/tablas/clientes/AgregarCliente';
import DetalleCliente from '../../components/tablas/clientes/DetalleCliente';
import { clientesService } from '../../services/clientesService';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [clienteEditandoId, setClienteEditandoId] = useState(null);
  const [clienteEditado, setClienteEditado] = useState(null);
  
  // Estados para la búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [clientesOriginales, setClientesOriginales] = useState([]);
  
  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 8;

  // Estados para filtros avanzados
  const [filtroNacionalidad, setFiltroNacionalidad] = useState('');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.getClientes();
      setClientes(data);
      setClientesOriginales(data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setMensaje('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let clientesFiltrados = [...clientesOriginales];

    // Filtro por texto
    if (terminoBusqueda.trim()) {
      const termino = terminoBusqueda.toLowerCase();
      clientesFiltrados = clientesFiltrados.filter(cliente =>
        cliente.nombre.toLowerCase().includes(termino) ||
        cliente.apellido.toLowerCase().includes(termino) ||
        cliente.email.toLowerCase().includes(termino) ||
        cliente.telefono.includes(termino)
      );
    }

    // Filtro por nacionalidad
    if (filtroNacionalidad) {
      clientesFiltrados = clientesFiltrados.filter(cliente => 
        cliente.nacionalidad === filtroNacionalidad
      );
    }

    // Filtro por fecha
    if (filtroFechaDesde || filtroFechaHasta) {
      clientesFiltrados = clientesFiltrados.filter(cliente => {
        const fechaCliente = new Date(cliente.antiguedad);
        const fechaDesde = filtroFechaDesde ? new Date(filtroFechaDesde) : null;
        const fechaHasta = filtroFechaHasta ? new Date(filtroFechaHasta) : null;
        
        if (fechaDesde && fechaCliente < fechaDesde) return false;
        if (fechaHasta && fechaCliente > fechaHasta) return false;
        return true;
      });
    }

    setClientes(clientesFiltrados);
    setPaginaActual(1);
    
    if (clientesFiltrados.length === 0 && (terminoBusqueda || filtroNacionalidad || filtroFechaDesde || filtroFechaHasta)) {
      setMensaje('No se encontraron clientes con los criterios seleccionados');
    } else {
      setMensaje('');
    }
  };

  const buscarClientes = async (termino) => {
    if (!termino.trim()) {
      setClientes(clientesOriginales);
      setMensaje('');
      setPaginaActual(1);
      return;
    }

    setBuscando(true);
    try {
      const data = await clientesService.searchClientes(termino);
      
      if (data.length === 0) {
        setMensaje('No se encontraron clientes con ese criterio de búsqueda');
        setClientes([]);
      } else {
        setClientes(data);
        setMensaje(`Se encontraron ${data.length} cliente${data.length > 1 ? 's' : ''}`);
      }
      setPaginaActual(1);
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      setMensaje('Error al buscar clientes');
    } finally {
      setBuscando(false);
    }
  };

  const handleBusquedaChange = (e) => {
    const termino = e.target.value;
    setTerminoBusqueda(termino);
    
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    window.searchTimeout = setTimeout(() => {
      aplicarFiltros();
    }, 300);
  };

  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setFiltroNacionalidad('');
    setFiltroFechaDesde('');
    setFiltroFechaHasta('');
    setClientes(clientesOriginales);
    setMensaje('');
    setPaginaActual(1);
  };

  const iniciarEdicion = (cliente) => {
    setClienteEditandoId(cliente.id);
    setClienteEditado(cliente);
  };

  const cancelarEdicion = () => {
    setClienteEditandoId(null);
    setClienteEditado(null);
  };

  const handleEditarEnLinea = (e) => {
    const { name, value } = e.target;
    setClienteEditado(prev => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClienteEditado(prev => ({ ...prev, imagen: file }));
    }
  };

  const guardarEdicion = async () => {
    try {
      const clienteActualizado = await clientesService.updateCliente(clienteEditado.id, clienteEditado);
      
      // Actualizar la lista de clientes con el cliente actualizado
      setClientes(prev => prev.map(c => (c.id === clienteActualizado.id ? clienteActualizado : c)));
      setClientesOriginales(prev => prev.map(c => (c.id === clienteActualizado.id ? clienteActualizado : c)));
      
      setMensaje('Cliente actualizado exitosamente ✅');
      cancelarEdicion();
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      setMensaje(error.message || 'Error al actualizar el cliente');
    }
  };

  const handleEliminarCliente = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (!confirmar) return;

    try {
      await clientesService.deleteCliente(id);
      
      const nuevosClientes = clientes.filter(cliente => cliente.id !== id);
      const nuevosClientesOriginales = clientesOriginales.filter(cliente => cliente.id !== id);
      
      setClientes(nuevosClientes);
      setClientesOriginales(nuevosClientesOriginales);
      
      const nuevasPaginas = Math.ceil(nuevosClientes.length / clientesPorPagina);
      if (paginaActual > nuevasPaginas && nuevasPaginas > 0) {
        setPaginaActual(nuevasPaginas);
      }
      
      setMensaje('Cliente eliminado correctamente ✅');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      
      // Manejar diferentes tipos de errores
      if (error.message && error.message.includes('registros relacionados')) {
        setMensaje('❌ No se puede eliminar el cliente porque tiene registros relacionados (turnos, ventas, etc.)');
      } else if (error.message && error.message.includes('no encontrado')) {
        setMensaje('❌ Cliente no encontrado');
      } else {
        setMensaje(`❌ Error al eliminar el cliente: ${error.message || 'Error desconocido'}`);
      }
    }
  };

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    email: '',
    telefono: '',
    antiguedad: 0,
    imagen: null,
    nacionalidad: '',
  });
  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'imagen') {
      const imagen = files ? files[0] : value;
      setNuevoCliente(prev => ({ ...prev, imagen }));
    } else {
      setNuevoCliente(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAgregarCliente = async (e) => {
    e.preventDefault();

    try {
      if (nuevoCliente.id) {
        await clientesService.updateCliente(nuevoCliente.id, nuevoCliente);
        setMensaje('Cliente actualizado exitosamente ✅');
      } else {
        await clientesService.createCliente(nuevoCliente);
        setMensaje('Cliente agregado exitosamente ✅');
      }
      
      await cargarClientes();
      setNuevoCliente({
        nombre: '',
        apellido: '',
        direccion: '',
        email: '',
        telefono: '',
        antiguedad: '',
        imagen: null,
        nacionalidad: '',
      });
    } catch (error) {
      setMensaje(error.message || 'Error al guardar el cliente');
    }
  };

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const handleFilaClick = (cliente) => {
    setClienteSeleccionado(cliente);
  };

  const cerrarDetalle = () => {
    setClienteSeleccionado(null);
  };

  // Funciones de paginación
  const indiceUltimoCliente = paginaActual * clientesPorPagina;
  const indicePrimerCliente = indiceUltimoCliente - clientesPorPagina;
  const clientesActuales = clientes.slice(indicePrimerCliente, indiceUltimoCliente);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  // Calcular estadísticas
  const estadisticas = {
    total: clientes.length,
    argentinos: clientes.filter(c => c.nacionalidad === 'Argentina').length,
    paraguayos: clientes.filter(c => c.nacionalidad === 'Paraguay').length,
    nuevosEsteMes: clientes.filter(c => {
      const fechaCliente = new Date(c.antiguedad);
      const hoy = new Date();
      return fechaCliente.getMonth() === hoy.getMonth() && fechaCliente.getFullYear() === hoy.getFullYear();
    }).length
  };

  return (
    <TablasLayout>
      <Container>
        <Header>
          <HeaderContent>
            <TitleSection>
              <Title>👥 Gestión de Clientes</Title>
              <Subtitle>Administra y supervisa la información de tus clientes</Subtitle>
            </TitleSection>
            <ActionButtons>
              <ClienteForm
                nuevoCliente={nuevoCliente}
                onChange={handleInputChange}
                onSubmit={handleAgregarCliente}
                mensaje={mensaje}
              />
            </ActionButtons>
          </HeaderContent>
        </Header>

        {/* Estadísticas rápidas */}
        <StatsContainer>
          <StatCard>
            <StatNumber>{estadisticas.total}</StatNumber>
            <StatLabel>Total Clientes</StatLabel>
            <StatIcon>👥</StatIcon>
          </StatCard>
          <StatCard>
            <StatNumber>{estadisticas.argentinos}</StatNumber>
            <StatLabel>Argentinos</StatLabel>
            <StatIcon>🇦🇷</StatIcon>
          </StatCard>
          <StatCard>
            <StatNumber>{estadisticas.paraguayos}</StatNumber>
            <StatLabel>Paraguayos</StatLabel>
            <StatIcon>🇵🇾</StatIcon>
          </StatCard>
          <StatCard>
            <StatNumber>{estadisticas.nuevosEsteMes}</StatNumber>
            <StatLabel>Nuevos este mes</StatLabel>
            <StatIcon>🆕</StatIcon>
          </StatCard>
        </StatsContainer>

        {mensaje && (
          <MensajeContainer tipo={mensaje.includes('Error') || mensaje.includes('No se') ? 'error' : 'success'}>
            {mensaje}
          </MensajeContainer>
        )}

        {/* Controles de búsqueda y filtros */}
        <SearchSection>
          <SearchContainer>
            <SearchInputContainer>
              <SearchIcon>🔍</SearchIcon>
              <SearchInput
                type="text"
                placeholder="Buscar por nombre, apellido, email o teléfono..."
                value={terminoBusqueda}
                onChange={handleBusquedaChange}
              />
              {buscando && <SearchSpinner>⏳</SearchSpinner>}
              {terminoBusqueda && (
                <ClearButton onClick={limpiarFiltros}>
                  ✕
                </ClearButton>
              )}
            </SearchInputContainer>
          </SearchContainer>

          <FilterSection>
            <FilterToggle onClick={() => setMostrarFiltros(!mostrarFiltros)}>
              🔧 Filtros {mostrarFiltros ? '▼' : '▶'}
            </FilterToggle>
            
            {mostrarFiltros && (
              <FiltersContainer>
                <FilterGroup>
                  <FilterLabel>Nacionalidad</FilterLabel>
                  <FilterSelect
                    value={filtroNacionalidad}
                    onChange={(e) => setFiltroNacionalidad(e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Paraguay">Paraguay</option>
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Desde</FilterLabel>
                  <FilterInput
                    type="date"
                    value={filtroFechaDesde}
                    onChange={(e) => setFiltroFechaDesde(e.target.value)}
                  />
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Hasta</FilterLabel>
                  <FilterInput
                    type="date"
                    value={filtroFechaHasta}
                    onChange={(e) => setFiltroFechaHasta(e.target.value)}
                  />
                </FilterGroup>

                <FilterActions>
                  <ApplyFiltersButton onClick={aplicarFiltros}>
                    Aplicar Filtros
                  </ApplyFiltersButton>
                  <ClearFiltersButton onClick={limpiarFiltros}>
                    Limpiar
                  </ClearFiltersButton>
                </FilterActions>
              </FiltersContainer>
            )}
          </FilterSection>
        </SearchSection>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner>⏳</LoadingSpinner>
            <LoadingText>Cargando clientes...</LoadingText>
          </LoadingContainer>
        ) : clientes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>No hay clientes registrados</EmptyTitle>
            <EmptySubtitle>
              {terminoBusqueda || filtroNacionalidad || filtroFechaDesde || filtroFechaHasta
                ? 'No se encontraron clientes con los criterios seleccionados'
                : 'Comienza agregando tu primer cliente'}
            </EmptySubtitle>
          </EmptyState>
        ) : (
          <>
            <TablaClientes
              clientes={clientesActuales}
              onDelete={handleEliminarCliente}
              onEditStart={iniciarEdicion}
              onEditChange={handleEditarEnLinea}
              onEditCancel={cancelarEdicion}
              onEditSave={guardarEdicion}
              editandoId={clienteEditandoId}
              clienteEditado={clienteEditado}
              onRowClick={handleFilaClick}
              onEditImageChange={handleEditImageChange}
            />
            
            {/* Paginación mejorada */}
            {totalPaginas > 1 && (
              <PaginationContainer>
                <PaginationInfo>
                  <strong>{indicePrimerCliente + 1} - {Math.min(indiceUltimoCliente, clientes.length)}</strong> de <strong>{clientes.length}</strong> clientes
                </PaginationInfo>
                
                <PaginationControls>
                  <PaginationButton 
                    onClick={paginaAnterior} 
                    disabled={paginaActual === 1}
                  >
                    ← Anterior
                  </PaginationButton>
                  
                  {[...Array(totalPaginas)].map((_, index) => {
                    const numeroPagina = index + 1;
                    const isVisible = 
                      numeroPagina === 1 || 
                      numeroPagina === totalPaginas || 
                      (numeroPagina >= paginaActual - 1 && numeroPagina <= paginaActual + 1);
                    
                    if (!isVisible) return null;
                    
                    return (
                      <PaginationButton
                        key={numeroPagina}
                        onClick={() => cambiarPagina(numeroPagina)}
                        $active={paginaActual === numeroPagina}
                      >
                        {numeroPagina}
                      </PaginationButton>
                    );
                  })}
                  
                  <PaginationButton 
                    onClick={paginaSiguiente} 
                    disabled={paginaActual === totalPaginas}
                  >
                    Siguiente →
                  </PaginationButton>
                </PaginationControls>
              </PaginationContainer>
            )}
          </>
        )}

        {!clienteSeleccionado && !loading && clientes.length > 0 && (
          <DetailsPlaceholder>
            <PlaceholderIcon>👆</PlaceholderIcon>
            <PlaceholderText>Haz clic en cualquier cliente para ver sus detalles</PlaceholderText>
          </DetailsPlaceholder>
        )}

        {clienteSeleccionado && (
          <DetalleCliente cliente={clienteSeleccionado} onClose={cerrarDetalle} />
        )}
      </Container>
    </TablasLayout>
  );
};

export default Clientes;

// Estilos modernos y profesionales
const Container = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 2rem;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
`;

const TitleSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  opacity: 0.6;
`;

const SearchSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchInputContainer = styled.div`
  position: relative;
  max-width: 500px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #a0aec0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #f7fafc;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const SearchSpinner = styled.div`
  position: absolute;
  right: 3rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 1.2rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #fed7d7;
    color: #e53e3e;
  }
`;

const FilterSection = styled.div``;

const FilterToggle = styled.button`
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
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

const FilterSelect = styled.select`
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FilterInput = styled.input`
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: end;
`;

const ApplyFiltersButton = styled.button`
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

const ClearFiltersButton = styled.button`
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
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const LoadingSpinner = styled.div`
  font-size: 3rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #718096;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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
  text-align: center;
  max-width: 400px;
`;

const DetailsPlaceholder = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  margin-top: 2rem;
`;

const PlaceholderIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const PlaceholderText = styled.p`
  color: #718096;
  font-size: 1.1rem;
`;

const MensajeContainer = styled.div`
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
  border: 2px solid;
  background: ${props => props.tipo === 'error' ? '#fed7d7' : '#c6f6d5'};
  color: ${props => props.tipo === 'error' ? '#c53030' : '#2f855a'};
  border-color: ${props => props.tipo === 'error' ? '#feb2b2' : '#9ae6b4'};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PaginationInfo = styled.div`
  color: #4a5568;
  font-size: 0.9rem;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PaginationButton = styled.button`
  padding: 0.6rem 1rem;
  border: 2px solid ${props => props.$active ? '#667eea' : '#e2e8f0'};
  border-radius: 8px;
  background: ${props => props.$active ? '#667eea' : 'white'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;

  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#5a67d8' : '#f7fafc'};
    transform: translateY(-1px);
  }

  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
    border-color: #e2e8f0;
  }
`;