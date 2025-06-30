import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import TablaVentasTratamientos from '../../components/tablas/ventas/tratamientos/TablaVentasTratamientos';
import VentaForm from '../../components/tablas/ventas/tratamientos/AgregarVenta';

const VentasTratamientos = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

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
  });

  const [ventaEditada, setVentaEditada] = useState(null);
  const [ventaEditandoId, setVentaEditandoId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ventasRes, clientesRes, tratamientosRes] = await Promise.all([
        fetch('/api/ventas/tratamientos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/clientes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('/api/tratamientos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
      ]);

      const ventasData = await ventasRes.json();
      const clientesData = await clientesRes.json();
      const tratamientosData = await tratamientosRes.json();

      setVentas(ventasData);
      setClientes(clientesData);
      setTratamientos(tratamientosData);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setMensaje('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaVenta(prev => ({ ...prev, [name]: value }));
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
        await fetchData();
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
      const res = await fetch(`/api/ventas/tratamientos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        await fetchData();
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
        await fetchData();
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
        <Title>Gestión de Ventas de Tratamientos</Title>
        <Text>
          Aquí podrás gestionar las ventas y transacciones de tratamientos del establecimiento.
        </Text>
        <VentaForm
          nuevaVenta={nuevaVenta}
          onChange={handleInputChange}
          onSubmit={handleAgregarVenta}
          clientes={clientes}
          tratamientos={tratamientos}
        />

        {mensaje && <p>{mensaje}</p>}

        {loading ? (
          <p>Cargando ventas...</p>
        ) : (

          <TablaVentasTratamientos
          ventas={ventas}
          clientes={clientes}
          tratamientos={tratamientos}
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