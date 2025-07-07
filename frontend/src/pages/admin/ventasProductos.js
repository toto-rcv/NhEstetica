import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import TablaVentasProductos from '../../components/tablas/ventas/productos/TablaVentasProductos';
import VentaForm from '../../components/tablas/ventas/productos/AgregarVenta';
import { clientesService } from '../../services/clientesService';

const VentasProductos = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasOriginales, setVentasOriginales] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  // Estados para filtros de fecha
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const ventasPorPagina = 5;

  // Función para obtener el primer y último día del mes actual
  const obtenerRangoMesActual = () => {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    
    return {
      desde: primerDia.toISOString().split('T')[0],
      hasta: ultimoDia.toISOString().split('T')[0]
    };
  };

  const [nuevaVenta, setNuevaVenta] = useState({
  producto_id: '',
  costo: '',
  precio: '',
  cantidad: '',
  cliente_id: '',
  fecha: '',
  forma_de_pago: '',
  cuotas: '',
  observacion: ''
  });

  const [ventaEditada, setVentaEditada] = useState(null);
  const [ventaEditandoId, setVentaEditandoId] = useState(null);

const fetchData = async () => {
  try {
    const [ventasRes, clientesData, productosRes] = await Promise.all([
      fetch('/api/ventas/productos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      clientesService.getClientes(),
      fetch('/api/productos?limit=1000', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    ]);

    const ventasData = await ventasRes.json();
    const productosResponse = await productosRes.json();
    
    // La API devuelve un objeto con estructura de paginación: {data: productos[], pagination: {}}
    const productosData = productosResponse.data || productosResponse;

    // Ordenar ventas por fecha (más reciente primero)
    ventasData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    setVentasOriginales(ventasData);
    setClientes(clientesData);
    setProductos(productosData);
    
    // Aplicar filtro inicial si las fechas ya están establecidas
    if (fechaDesde && fechaHasta) {
      const ventasFiltradas = ventasData.filter(venta => {
        const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
        return fechaVenta >= fechaDesde && fechaVenta <= fechaHasta;
      });
      setVentas(ventasFiltradas);
    } else {
      setVentas(ventasData);
    }
  } catch (error) {
    console.error('❌ Error al obtener datos:', error);
    setMensaje('Error al cargar datos');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // Establecer fechas por defecto al cargar
  const { desde, hasta } = obtenerRangoMesActual();
  setFechaDesde(desde);
  setFechaHasta(hasta);
  fetchData();
}, []);

useEffect(() => {
  // Aplicar filtro cuando cambien las fechas o ventas originales
  if (ventasOriginales.length > 0) {
    aplicarFiltroFechas();
  }
}, [fechaDesde, fechaHasta, ventasOriginales]);

const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === 'producto_id') {
    // Buscar el producto seleccionado
    const producto = productos.find(p => p.id === Number(value));
    if (producto) {
      setNuevaVenta(prev => ({
        ...prev,
        producto_id: value,
        precio: producto.precio,
        costo: producto.costo
      }));
    } else {
      // Si no se encuentra producto, solo asigna producto_id y limpia precio
      setNuevaVenta(prev => ({
        ...prev,
        producto_id: value,
        precio: '',
        costo: ''
      }));
    }
  } else {
    setNuevaVenta(prev => ({ ...prev, [name]: value }));
  }
};


  const handleAgregarVenta = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const res = await fetch('/api/ventas/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(nuevaVenta),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchData(); // Recarga completa desde backend y reaplica filtros
        setMensaje('Venta registrada correctamente ✅');
        setNuevaVenta({
          producto_id: '',
          costo: '',
          precio: '',
          cantidad: '',
          cliente_id: '',
          fecha: '',
          forma_de_pago: '',
          cuotas: '',
          observacion: ''
        });
        // Si se agrega una venta nueva, ir a la primera página para verla
        setPaginaActual(1);
      } else {
        setMensaje(data.message || 'Error al registrar venta');
      }
    } catch (error) {
      setMensaje('Error de red al guardar venta');
    }
  };

  const handleEliminarVenta = async (id) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar esta venta?')) return;

    try {
      const res = await fetch(`/api/ventas/productos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        await fetchData(); // Recarga completa desde backend y reaplica filtros
        setMensaje('Venta eliminada correctamente ✅');
        
        // Ajustar página actual si es necesario
        const nuevasPaginas = Math.ceil((ventas.length - 1) / ventasPorPagina);
        if (paginaActual > nuevasPaginas && nuevasPaginas > 0) {
          setPaginaActual(nuevasPaginas);
        }
      }
      else {
        const data = await res.json();
        setMensaje(data.message || 'Error al eliminar venta');
      }
    } catch (error) {
      setMensaje('Error de red al eliminar venta');
    }
  };

  const iniciarEdicion = (venta) => {
    setVentaEditandoId(venta.id);
    setVentaEditada({ ...venta });
  };

  const handleEditarEnLinea = (e) => {
    const { name, value } = e.target;
    setVentaEditada((prev) => ({ ...prev, [name]: value }));
  };

  const cancelarEdicion = () => {
    setVentaEditandoId(null);
    setVentaEditada(null);
  };

const prepararDatosParaBackend = (datos) => {
  return {
    ...datos,
    producto_id: Number(datos.producto_id),
    cliente_id: Number(datos.cliente_id),
    costo: datos.costo !== '' ? Number(datos.costo) : 0,
    precio: datos.precio !== '' ? Number(datos.precio) : 0,
    cantidad: datos.cantidad !== '' ? Number(datos.cantidad) : 1,
    cuotas: datos.cuotas !== '' ? Number(datos.cuotas) : null,
    // fecha, forma_de_pago, observacion se pueden dejar como vienen
  };
};

const guardarEdicion = async () => {
  try {
    const datosParaEnviar = prepararDatosParaBackend(ventaEditada);
    const res = await fetch(`/api/ventas/productos/${ventaEditandoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(datosParaEnviar),
    });

    const data = await res.json();

    if (res.ok) {
      await fetchData(); // Recargar ventas completas con filtros aplicados
      setMensaje('Venta actualizada correctamente ✅');
      cancelarEdicion();
    } else {
      setMensaje(data.message || 'Error al actualizar venta');
    }
  } catch (error) {
    setMensaje('Error de red al actualizar venta');
  }
};

const aplicarFiltroFechas = () => {
  if (!fechaDesde || !fechaHasta) {
    setVentas(ventasOriginales);
    setPaginaActual(1);
    return;
  }

  const ventasFiltradas = ventasOriginales.filter(venta => {
    const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
    return fechaVenta >= fechaDesde && fechaVenta <= fechaHasta;
  });

  // Ordenar por fecha (más reciente primero)
  ventasFiltradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  setVentas(ventasFiltradas);
  setPaginaActual(1);
};

const resetearAlMesActual = () => {
  const { desde, hasta } = obtenerRangoMesActual();
  setFechaDesde(desde);
  setFechaHasta(hasta);
};

const handleFechaChange = (e) => {
  const { name, value } = e.target;
  if (name === 'fechaDesde') {
    setFechaDesde(value);
  } else if (name === 'fechaHasta') {
    setFechaHasta(value);
  }
};

// Funciones de paginación
const indiceUltimaVenta = paginaActual * ventasPorPagina;
const indicePrimeraVenta = indiceUltimaVenta - ventasPorPagina;
const ventasActuales = ventas.slice(indicePrimeraVenta, indiceUltimaVenta);
const totalPaginas = Math.ceil(ventas.length / ventasPorPagina);

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

  return (
    <TablasLayout >
      <Container>
        <Title>Gestión de ventas del producto</Title>
        {/* Filtros de fecha */}
        <FiltrosContainer>
          <FiltrosFecha>
            <FiltroTitle>
              <FilterIcon>📅</FilterIcon>
              Filtrar por fecha
            </FiltroTitle>
            <FechaInputs>
              <InputGroup>
                <InputLabel>Desde:</InputLabel>
                <DateInput
                  type="date"
                  name="fechaDesde"
                  value={fechaDesde}
                  onChange={handleFechaChange}
                />
              </InputGroup>
              <InputGroup>
                <InputLabel>Hasta:</InputLabel>
                <DateInput
                  type="date"
                  name="fechaHasta"
                  value={fechaHasta}
                  onChange={handleFechaChange}
                />
              </InputGroup>
              <FiltroButtons>
                <FiltroButton onClick={aplicarFiltroFechas}>
                  <ButtonIcon>🔍</ButtonIcon>
                  Aplicar Filtro
                </FiltroButton>
                <FiltroButton onClick={resetearAlMesActual} $secondary>
                  <ButtonIcon>📊</ButtonIcon>
                  Mes Actual
                </FiltroButton>
              </FiltroButtons>
            </FechaInputs>
            <FiltroInfo>
              <InfoIcon>ℹ️</InfoIcon>
              Mostrando {ventas.length} venta{ventas.length !== 1 ? 's' : ''} 
              {fechaDesde && fechaHasta && ` del ${fechaDesde} al ${fechaHasta}`}
            </FiltroInfo>
          </FiltrosFecha>
        </FiltrosContainer>

        {mensaje && (
          <MensajeContainer tipo={mensaje.includes('Error') ? 'error' : 'success'}>
            <MensajeIcon>{mensaje.includes('Error') ? '❌' : '✅'}</MensajeIcon>
            {mensaje}
          </MensajeContainer>
        )}

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Cargando ventas...</LoadingText>
          </LoadingContainer>
        ) : (
          <>
            <TablaHeader>
              {!loading && (
                <VentaForm
                  nuevaVenta={nuevaVenta}
                  onChange={handleInputChange}
                  onSubmit={handleAgregarVenta}
                  clientes={clientes || []}
                  productos={productos || []}
                />
              )}
            </TablaHeader>
            <TablaVentasProductos
              ventas={ventasActuales}
              clientes={clientes || []}
              productos={productos || []}
              onDelete={handleEliminarVenta}
              onEditStart={iniciarEdicion}
              onEditChange={handleEditarEnLinea}
              onEditCancel={cancelarEdicion}
              onEditSave={guardarEdicion}
              editandoId={ventaEditandoId}
              ventaEditada={ventaEditada}
            />

            {/* Componente de Paginación */}
            {totalPaginas > 1 && (
              <PaginationContainer>
                <PaginationInfo>
                  <PaginationIcon>📄</PaginationIcon>
                  Mostrando {indicePrimeraVenta + 1} - {Math.min(indiceUltimaVenta, ventas.length)} de {ventas.length} ventas
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
      </Container>
    </TablasLayout>
  );
};

export default VentasProductos;

// Styled Components con mejores colores y efectos
const Container = styled.div`
  text-align: left;
  padding: 2rem;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 50%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;
  }
`;

const Title = styled.h2`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 8px rgba(102, 126, 234, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;



const FiltrosContainer = styled.div`
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`;

const FiltrosFecha = styled.div``;

const TablaHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FiltroTitle = styled.h4`
  margin: 0 0 1.5rem 0;
  color: #1e293b;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterIcon = styled.span`
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const FechaInputs = styled.div`
  display: flex;
  align-items: end;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DateInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  min-width: 160px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #1e293b;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: #ffffff;
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #cbd5e1;
  }
`;

const FiltroButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FiltroButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  background: ${props => props.$secondary 
    ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  cursor: pointer;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonIcon = styled.span`
  font-size: 0.9rem;
`;

const FiltroInfo = styled.p`
  margin-top: 1.5rem;
  margin-bottom: 0;
  color: #64748b;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 10px;
  border-left: 4px solid #667eea;
`;

const InfoIcon = styled.span`
  font-size: 1rem;
`;

const MensajeContainer = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
  background: ${props => props.tipo === 'error' 
    ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' 
    : 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'};
  color: ${props => props.tipo === 'error' ? '#dc2626' : '#16a34a'};
  border: 1px solid ${props => props.tipo === 'error' ? '#fecaca' : '#bbf7d0'};
  box-shadow: 0 4px 12px ${props => props.tipo === 'error' 
    ? 'rgba(239, 68, 68, 0.1)' 
    : 'rgba(34, 197, 94, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MensajeIcon = styled.span`
  font-size: 1.1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
`;

const PaginationInfo = styled.span`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    text-align: center;
    font-size: 0.8rem;
  }
`;

const PaginationIcon = styled.span`
  font-size: 1rem;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.3rem;
  }
`;

const PaginationButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: 2px solid ${props => props.$active ? '#667eea' : '#e2e8f0'};
  border-radius: 12px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 45px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  &:hover:not(:disabled) {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)' 
      : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  &:disabled {
    background: #f1f5f9;
    color: #cbd5e1;
    cursor: not-allowed;
    border-color: #e2e8f0;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
    min-width: 40px;
  }
`;