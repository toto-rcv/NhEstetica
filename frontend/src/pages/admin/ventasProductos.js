import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import TablaVentasProductos from '../../components/tablas/ventas/productos/TablaVentasProductos';
import VentaForm from '../../components/tablas/ventas/productos/AgregarVenta';

const VentasProductos = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const [nuevaVenta, setNuevaVenta] = useState({
    producto_id: '',
    costo: '',
    precio: '',
    cliente_id: ''
  });

  const [ventaEditada, setVentaEditada] = useState(null);
  const [ventaEditandoId, setVentaEditandoId] = useState(null);

const fetchData = async () => {
  try {
    const [ventasRes, clientesRes, productosRes] = await Promise.all([
      fetch('http://localhost:5000/api/ventas/productos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      fetch('http://localhost:5000/api/clientes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      fetch('http://localhost:5000/api/productos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    ]);

    const ventasData = await ventasRes.json();
    const clientesData = await clientesRes.json();
    const productosData = await productosRes.json();

    setVentas(ventasData);
    setClientes(clientesData);
    setProductos(productosData);
  } catch (error) {
    console.error('❌ Error al obtener datos:', error);
    setMensaje('Error al cargar datos');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaVenta((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgregarVenta = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const res = await fetch('http://localhost:5000/api/ventas/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(nuevaVenta),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchData(); // Recarga completa desde backend
        setMensaje('Venta registrada correctamente ✅');
        setNuevaVenta({
          producto_id: '',
          costo: '',
          precio: '',
          cliente_id: ''
        });
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
      const res = await fetch(`http://localhost:5000/api/ventas/productos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        await fetchData(); // Recarga completa desde backend
        setMensaje('Venta eliminada correctamente ✅');
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

const guardarEdicion = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/ventas/productos/${ventaEditandoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(ventaEditada),
    });

    const data = await res.json();

    if (res.ok) {
      await fetchData(); // 👈 Recargar ventas completas con joins y datos actualizados
      setMensaje('Venta actualizada correctamente ✅');
      cancelarEdicion();
    } else {
      setMensaje(data.message || 'Error al actualizar venta');
    }
  } catch (error) {
    setMensaje('Error de red al actualizar venta');
  }
};


  return (
    <TablasLayout title="Gestión de Ventas">
      <Container>
        <Title>Gestión de Ventas de Productos</Title>
        <Text>
          Aquí podrás gestionar las ventas y transacciones de productos del establecimiento.
        </Text>
        <VentaForm
          nuevaVenta={nuevaVenta}
          onChange={handleInputChange}
          onSubmit={handleAgregarVenta}
          clientes={clientes}
          productos={productos}
        />

        {loading ? (
          <p>Cargando ventas...</p>
        ) : (
          <TablaVentasProductos
            ventas={ventas}
            clientes={clientes}
            productos={productos}
            onDelete={handleEliminarVenta}
            onEditStart={iniciarEdicion}
            onEditChange={handleEditarEnLinea}
            onEditCancel={cancelarEdicion}
            onEditSave={guardarEdicion}
            editandoId={ventaEditandoId}
            ventaEditada={ventaEditada}
          />
        )}
        {mensaje && <p>{mensaje}</p>}
      </Container>
    </TablasLayout>
  );
};

export default VentasProductos;

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