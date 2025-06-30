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

  useEffect(() => {
    fetch('/api/clientes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setClientes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener clientes:', error);
        setLoading(false);
      });
  }, []);

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
        setClientes(prev => prev.map(c => (c.id === data.id ? data : c)));
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
        setClientes(prev => prev.filter(cliente => cliente.id !== id));
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
      ? `http://localhost:5000/api/clientes/${nuevoCliente.id}`
      : 'http://localhost:5000/api/clientes';
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
      // reset form...
      // Refrescar la lista de clientes tras agregar
      const clientesRes = await fetch('/api/clientes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (clientesRes.ok) {
        const lista = await clientesRes.json();
        setClientes(lista);
      }
      // Limpiar el formulario
      setNuevoCliente({
        nombre: '',
        apellido: '',
        direccion: '',
        email: '',
        telefono: '',
        antiguedad: 0,
        imagen: null,
      });
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

  return (
    <TablasLayout title="Gestión de Clientes">
      <Container>
        <Title>Gestión de Clientes</Title>
        <Text>Aquí podrás gestionar la información de los clientes del establecimiento.</Text>

        {mensaje && <p>{mensaje}</p>}

        <ClienteForm
          nuevoCliente={nuevoCliente}
          onChange={handleInputChange}
          onSubmit={handleAgregarCliente}
          mensaje={mensaje}
        />

        {loading ? (
          <p>Cargando clientes...</p>
        ) : (
          <TablaClientes
            clientes={clientes}
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
