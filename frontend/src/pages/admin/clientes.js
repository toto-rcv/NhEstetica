import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import TablaClientes from '../../components/tablas/clientes/TablaClientes';
import ClienteForm from '../../components/tablas/clientes/AgregarCliente';
import DetalleCliente from '../../components/tablas/clientes/DetalleCliente';

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
  const clientesPorPagina = 5;

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await fetch('/api/clientes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setClientes(data);
      setClientesOriginales(data); // Guardamos los clientes originales
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setLoading(false);
    }
  };

  const buscarClientes = async (termino) => {
    if (!termino.trim()) {
      // Si no hay término de búsqueda, mostrar todos los clientes
      setClientes(clientesOriginales);
      setMensaje('');
      setPaginaActual(1); // Resetear a la primera página
      return;
    }

    setBuscando(true);
    try {
      const res = await fetch(`/api/clientes/search?term=${encodeURIComponent(termino)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      
      if (data.length === 0) {
        setMensaje('No se pudo encontrar al Cliente solicitado');
        setClientes([]);
      } else {
        setClientes(data);
        setMensaje(`Se encontraron ${data.length} cliente${data.length > 1 ? 's' : ''}`);
      }
      setPaginaActual(1); // Resetear a la primera página
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
    
    // Limpiar el timeout anterior si existe
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Búsqueda en tiempo real con debounce
    window.searchTimeout = setTimeout(() => {
      buscarClientes(termino);
    }, 500);
  };

  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setClientes(clientesOriginales);
    setMensaje('');
    setPaginaActual(1); // Resetear a la primera página
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
      let body;
      let headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      let isFormData = clienteEditado.imagen instanceof File;
      if (isFormData) {
        body = new FormData();
        body.append('nombre', clienteEditado.nombre);
        body.append('apellido', clienteEditado.apellido);
        body.append('direccion', clienteEditado.direccion);
        body.append('email', clienteEditado.email);
        body.append('telefono', clienteEditado.telefono);
        body.append('antiguedad', clienteEditado.antiguedad);
        body.append('imagen', clienteEditado.imagen);
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(clienteEditado);
      }
      const res = await fetch(`/api/clientes/${clienteEditado.id}`, {
        method: 'PUT',
        headers,
        body,
      });
      const data = await res.json();
      if (res.ok) {
        // Actualizar tanto la lista actual como la original
        setClientes(prev => prev.map(c => (c.id === data.id ? data : c)));
        setClientesOriginales(prev => prev.map(c => (c.id === data.id ? data : c)));
        setMensaje('Cliente actualizado ✅');
        cancelarEdicion();
      } else {
        setMensaje(data.message || 'Error al guardar cambios');
      }
    } catch (error) {
      setMensaje('Error de red al guardar cambios');
    }
  };

  const handleEliminarCliente = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        // Actualizar tanto la lista actual como la original
        const nuevosClientes = clientes.filter(cliente => cliente.id !== id);
        const nuevosClientesOriginales = clientesOriginales.filter(cliente => cliente.id !== id);
        
        setClientes(nuevosClientes);
        setClientesOriginales(nuevosClientesOriginales);
        
        // Ajustar página actual si es necesario
        const nuevasPaginas = Math.ceil(nuevosClientes.length / clientesPorPagina);
        if (paginaActual > nuevasPaginas && nuevasPaginas > 0) {
          setPaginaActual(nuevasPaginas);
        }
        
        setMensaje('Cliente eliminado correctamente ❌');
      } else {
        const data = await res.json();
        setMensaje(data.message || 'Error al eliminar cliente');
      }
    } catch (error) {
      setMensaje('Error de red al intentar eliminar cliente');
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
    const imagen = files ? files[0] : value; // aceptar ambos casos
    setNuevoCliente(prev => ({ ...prev, imagen }));
  } else {
    setNuevoCliente(prev => ({ ...prev, [name]: value }));
  }
};

  const handleAgregarCliente = async (e) => {
  e.preventDefault();
  setMensaje('');

  const esEdicion = Boolean(nuevoCliente.id);
  try {
    const url = esEdicion
      ? `/api/clientes/${nuevoCliente.id}`
      : '/api/clientes';
    const method = esEdicion ? 'PUT' : 'POST';

    const formData = new FormData();
    formData.append('nombre', nuevoCliente.nombre);
    formData.append('apellido', nuevoCliente.apellido);
    formData.append('direccion', nuevoCliente.direccion);
    formData.append('email', nuevoCliente.email);
    formData.append('telefono', nuevoCliente.telefono);
    formData.append('antiguedad', nuevoCliente.antiguedad);
    if (nuevoCliente.imagen) {
      formData.append('imagen', nuevoCliente.imagen);
    }

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        // NO poner 'Content-Type': 'multipart/form-data' aquí
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje(esEdicion ? 'Cliente actualizado con éxito ✏️' : 'Cliente agregado con éxito ✅');
      // Refrescar la lista de clientes tras agregar
      await cargarClientes();
      // Limpiar el formulario
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
      // Limpiar búsqueda si estaba activa y ir a la última página si se agregó un cliente
      if (terminoBusqueda) {
        limpiarBusqueda();
      } else if (!esEdicion) {
        // Si agregamos un cliente nuevo, ir a la última página para verlo
        const nuevasPaginas = Math.ceil((clientes.length + 1) / clientesPorPagina);
        setPaginaActual(nuevasPaginas);
      }
    } else {
      setMensaje(data.message || 'Error al guardar cliente');
    }
  } catch (error) {
    setMensaje('Error de red al intentar guardar cliente');
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

  return (
    <TablasLayout title="Gestión de Clientes">
      <Container>
        <Title>Gestión de Clientes</Title>
        <Text>Aquí podrás gestionar la información de los clientes del establecimiento.</Text>

        {mensaje && <MensajeContainer tipo={mensaje.includes('No se pudo encontrar') ? 'error' : 'success'}>{mensaje}</MensajeContainer>}

        {/* Sección con buscador y botón agregar */}
        <TopActionsContainer>
          <SearchInputContainer>
            <SearchInput
              type="text"
              placeholder="Buscar cliente por nombre o apellido..."
              value={terminoBusqueda}
              onChange={handleBusquedaChange}
            />
            {buscando && <SearchSpinner>🔍</SearchSpinner>}
            {terminoBusqueda && (
              <ClearButton onClick={limpiarBusqueda}>
                ✕
              </ClearButton>
            )}
          </SearchInputContainer>
          
          <ClienteForm
            nuevoCliente={nuevoCliente}
            onChange={handleInputChange}
            onSubmit={handleAgregarCliente}
            mensaje={mensaje}
          />
        </TopActionsContainer>

        {loading ? (
          <p>Cargando clientes...</p>
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
            
            {/* Componente de Paginación */}
            {totalPaginas > 1 && (
              <PaginationContainer>
                <PaginationInfo>
                  Mostrando {indicePrimerCliente + 1} - {Math.min(indiceUltimoCliente, clientes.length)} de {clientes.length} clientes
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

        {!clienteSeleccionado && (
          <DetailsContainer>
            <p style={{ textAlign: 'center', color: '#666' }}>
              Haz clic en una fila de la tabla para ver los detalles del empleado
            </p>
          </DetailsContainer>
        )}

        {clienteSeleccionado && (
          <DetalleCliente cliente={clienteSeleccionado} onClose={cerrarDetalle} />
        )}
      </Container>
    </TablasLayout>
  );
};

export default Clientes;

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


const DetailsContainer = styled.div`
  margin-top: 2rem;
  background: var(--background-overlay);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: visible;
  padding: 1rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding: 0.5rem;
  }
  
  @media (max-width: 600px) {
    margin-top: 1rem;
    padding: 0.3rem;
  }
`;

const TopActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  justify-content: space-between;


  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 250px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 45px 12px 15px;
  font-size: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #3498db;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
  }

  &::placeholder {
    color: #999;
    font-style: italic;
  }
`;

const SearchSpinner = styled.div`
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translateY(-50%);
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #e74c3c;
  }
`;

const MensajeContainer = styled.div`
  padding: 12px 20px;
  margin: 1rem 0;
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
  border: 1px solid ${props => props.active ? '#3498db' : '#e1e5e9'};
  border-radius: 8px;
  background: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-width: 40px;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#2980b9' : '#e1e5e9'};
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