import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import TablaVentas from '../../components/tablas/ventas/TablaVentas';
import VentaForm from '../../components/tablas/ventas/AgregarVenta';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
const [clientes, setClientes] = useState([]);
const [loading, setLoading] = useState(true);
const [mensaje, setMensaje] = useState('');
const [nuevaVenta, setNuevaVenta] = useState({
  tratamiento: '',
  sesiones: '',
  costo: '',
  precio: '',
  cliente_id: ''
});
const [ventaEditada, setVentaEditada] = useState(null);
const [ventaEditandoId, setVentaEditandoId] = useState(null);


useEffect(() => {
  const fetchData = async () => {
    try {
      const [ventasRes, clientesRes] = await Promise.all([
        fetch('http://localhost:5000/api/ventas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch('http://localhost:5000/api/clientes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ]);

      const ventasData = await ventasRes.json();
      const clientesData = await clientesRes.json();

      console.log('🧾 Ventas:', ventasData);
      console.log('👥 Clientes:', clientesData);

      setVentas(ventasData);
      setClientes(clientesData);
    } catch (error) {
      console.error('❌ Error al obtener ventas o clientes:', error);
      setMensaje('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);



const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNuevaVenta(prev => ({ ...prev, [name]: value }));
};

const handleAgregarVenta = async (e) => {
  e.preventDefault();
  setMensaje('');

  try {
    const res = await fetch('http://localhost:5000/api/ventas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(nuevaVenta),
    });

    const data = await res.json();

    if (res.ok) {
      setVentas(prev => [...prev, { ...nuevaVenta, id: data.id || Date.now() }]);
      setMensaje('Venta registrada correctamente ✅');
      setNuevaVenta({
        tratamiento: '',
        sesiones: '',
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
    const res = await fetch(`http://localhost:5000/api/ventas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (res.ok) {
      setVentas(prev => prev.filter(v => v.id !== id));
      setMensaje('Venta eliminada correctamente ✅');
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
  setVentaEditada(prev => ({ ...prev, [name]: value }));
};

const cancelarEdicion = () => {
  setVentaEditandoId(null);
  setVentaEditada(null);
};

const guardarEdicion = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/ventas/${ventaEditandoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(ventaEditada),
    });

    const data = await res.json();

    if (res.ok) {
      setVentas(prev =>
        prev.map(v => (v.id === ventaEditandoId ? { ...v, ...ventaEditada } : v))
      );
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
        <Title>Gestión de Ventas</Title>
        <Text>
          Aquí podrás gestionar las ventas y transacciones del establecimiento.
        </Text>
        <VentaForm
          nuevaVenta={nuevaVenta}
          onChange={handleInputChange}
          onSubmit={handleAgregarVenta}
          clientes={clientes}
        />

        {loading ? (
          <p>Cargando ventas...</p>
        ) : (
          <TablaVentas
            ventas={ventas}
            clientes={clientes}
            onDelete={handleEliminarVenta}
            onEditStart={iniciarEdicion}
            onEditChange={handleEditarEnLinea}
            onEditCancel={cancelarEdicion}
            onEditSave={guardarEdicion}
            editandoId={ventaEditandoId}
            ventaEditada={ventaEditada}
          />
        )}

      </Container>
    </TablasLayout>
  );
};

export default Ventas; 

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