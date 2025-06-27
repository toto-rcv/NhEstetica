// Clientes.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import TablaClientes from '../../components/tablas/clientes/TablaClientes';
import ClienteForm from '../../components/tablas/clientes/AgregarCliente';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [clienteEditandoId, setClienteEditandoId] = useState(null);
  const [clienteEditado, setClienteEditado] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/clientes', {
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

  const guardarEdicion = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/clientes/${clienteEditado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(clienteEditado),
      });

      const data = await res.json();

      if (res.ok) {
        setClientes(prev => prev.map(c => (c.id === clienteEditado.id ? clienteEditado : c)));
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
      const res = await fetch(`http://localhost:5000/api/clientes/${id}`, {
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
  antiguedad: 0
});

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNuevoCliente(prev => ({ ...prev, [name]: value }));
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

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(nuevoCliente),
    });

    const data = await res.json();

    if (res.ok) {
      if (esEdicion) {
        setClientes(prev =>
          prev.map(c => (c.id === nuevoCliente.id ? { ...nuevoCliente } : c))
        );
        setMensaje('Cliente actualizado con éxito ✏️');
      } else {
        setClientes(prev => [...prev, { ...nuevoCliente, id: data.id || Date.now() }]);
        setMensaje('Cliente agregado con éxito ✅');
      }

      // Resetear
      setNuevoCliente({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        antiguedad: 0,
      });
    } else {
      setMensaje(data.message || 'Error al guardar cliente');
    }
  } catch (error) {
    setMensaje('Error de red al intentar guardar cliente');
  }
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
          />
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