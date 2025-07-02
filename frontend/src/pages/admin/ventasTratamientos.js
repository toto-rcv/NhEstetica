import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import TablaVentasTratamientos from '../../components/tablas/ventas/tratamientos/TablaVentasTratamientos';
import VentaForm from '../../components/tablas/ventas/tratamientos/AgregarVenta';

const VentasTratamientos = () => {
  const [ventas, setVentas] = useState([]);
  const [ventasOriginales, setVentasOriginales] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
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
    tratamiento_id: '',
    sesiones: '',
    precio: '',
    forma_de_pago: '',
    vencimiento: '',
    cuotas: '',
    observacion: '',
    cliente_id: '',
    fecha: '',
    personal_id: '' 
  });

  const [ventaEditada, setVentaEditada] = useState(null);
  const [ventaEditandoId, setVentaEditandoId] = useState(null);

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

  const fetchData = async () => {
    try {
      const [ventasRes, clientesRes, tratamientosRes, personalRes] = await Promise.all([
        fetch('/api/ventas/tratamientos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/clientes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/tratamientos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/personal', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
      ]);

      const personalData = await personalRes.json();
      const ventasData = await ventasRes.json();
      const clientesData = await clientesRes.json();
      const tratamientosData = await tratamientosRes.json();

      // Ordenar ventas por fecha (más reciente primero)
      ventasData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      setPersonal(personalData);
      setVentasOriginales(ventasData);
      setClientes(clientesData);
      setTratamientos(tratamientosData);
      
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
      console.error('Error al obtener datos:', error);
      setMensaje('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convertir IDs a número o null
    const parsedValue = ['tratamiento_id', 'cliente_id', 'personal_id'].includes(name)
      ? value === '' ? null : parseInt(value)
      : value;

    if (name === 'tratamiento_id') {
      const tratamientoSeleccionado = tratamientos.find(t => t.id === parseInt(value));
      setNuevaVenta(prev => ({
        ...prev,
        tratamiento_id: parsedValue,
        precio: tratamientoSeleccionado ? tratamientoSeleccionado.precio : ''
      }));
    } else {
      setNuevaVenta(prev => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleAgregarVenta = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const res = await fetch('/api/ventas/tratamientos', {
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
          tratamiento_id: '',
          sesiones: '',
          precio: '',
          forma_de_pago: '',
          vencimiento: '',
          cuotas: '',
          observacion: '',
          cliente_id: '',
           fecha: '',
           personal_id: ''
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
      const res = await fetch(`/api/ventas/tratamientos/${id}`, {
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
      } else {
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
    
    // Convertir IDs a número o null, igual que en handleInputChange
    const parsedValue = ['tratamiento_id', 'cliente_id', 'personal_id'].includes(name)
      ? value === '' ? null : parseInt(value)
      : value;
    
    setVentaEditada(prev => ({ ...prev, [name]: parsedValue }));
  };

  const cancelarEdicion = () => {
    setVentaEditandoId(null);
    setVentaEditada(null);
  };

  const guardarEdicion = async () => {
    try {
      const res = await fetch(`/api/ventas/tratamientos/${ventaEditandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(ventaEditada),
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
    <TablasLayout title="Gestión de Ventas">
      <Container>
        <Title>Gestión de Ventas de Tratamientos</Title>
        <Text>
          Aquí podrás gestionar las ventas y transacciones de tratamientos del establecimiento.
        </Text>

        {/* Filtros de fecha */}
        <FiltrosContainer>
          <FiltrosFecha>
            <h4>Filtrar por fecha</h4>
            <FechaInputs>
              <div>
                <label>Desde:</label>
                <input
                  type="date"
                  name="fechaDesde"
                  value={fechaDesde}
                  onChange={handleFechaChange}
                />
              </div>
              <div>
                <label>Hasta:</label>
                <input
                  type="date"
                  name="fechaHasta"
                  value={fechaHasta}
                  onChange={handleFechaChange}
                />
              </div>
              <FiltroButtons>
                <FiltroButton onClick={aplicarFiltroFechas}>
                  Aplicar Filtro
                </FiltroButton>
                <FiltroButton onClick={resetearAlMesActual} secondary>
                  Mes Actual
                </FiltroButton>
              </FiltroButtons>
            </FechaInputs>
            <FiltroInfo>
              Mostrando {ventas.length} venta{ventas.length !== 1 ? 's' : ''} 
              {fechaDesde && fechaHasta && ` del ${fechaDesde} al ${fechaHasta}`}
            </FiltroInfo>
          </FiltrosFecha>
        </FiltrosContainer>

        <VentaForm
          nuevaVenta={nuevaVenta}
          onChange={handleInputChange}
          onSubmit={handleAgregarVenta}
          clientes={clientes}
          tratamientos={tratamientos}
          personal={personal}
        />

        {mensaje && <MensajeContainer tipo={mensaje.includes('Error') ? 'error' : 'success'}>{mensaje}</MensajeContainer>}

        {loading ? (
          <p>Cargando ventas...</p>
        ) : (
          <>
            <TablaVentasTratamientos
              ventas={ventasActuales}
              clientes={clientes}
              tratamientos={tratamientos}
              personal={personal}
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
                        active={paginaActual === numeroPagina}
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

export default VentasTratamientos;

const Container = styled.div`
  text-align: left;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const Text = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const FiltrosContainer = styled.div`
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
`;

const FiltrosFecha = styled.div`
  h4 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.1rem;
  }
`;

const FechaInputs = styled.div`
  display:flex;
  gap: 1rem;
  flex-wrap: wrap;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    label {
      font-weight: 500;
      color: #555;
      font-size: 0.9rem;
    }

    input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 0.9rem;
      min-width: 140px;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FiltroButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FiltroButton = styled.button`
  padding: 0.7rem 1.2rem;
  border: none;
  background-color: ${props => props.secondary ? '#6c757d' : '#007bff'};
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.secondary ? '#5a6268' : '#0056b3'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FiltroInfo = styled.p`
  margin-top: 1rem;
  margin-bottom: 0;
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
`;

const MensajeContainer = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  background-color: ${props => props.tipo === 'error' ? '#fee' : '#efe'};
  color: ${props => props.tipo === 'error' ? '#c53030' : '#38a169'};
  border: 1px solid ${props => props.tipo === 'error' ? '#fed7d7' : '#c6f6d5'};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
`;

const PaginationInfo = styled.span`
  font-size: 0.9rem;
  color: #666;
  
  @media (max-width: 768px) {
    text-align: center;
    font-size: 0.8rem;
  }
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
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? '#007bff' : '#e1e5e9'};
  border-radius: 8px;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-width: 40px;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#0056b3' : '#e1e5e9'};
    transform: translateY(-1px);
  }

  &:disabled {
    background: #f0f0f0;
    color: #ccc;
    cursor: not-allowed;
    border-color: #e0e0e0;
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem 0.7rem;
    font-size: 0.8rem;
    min-width: 35px;
  }
`;