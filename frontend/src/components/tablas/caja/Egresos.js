import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModalEgreso from './ModalEgreso';

const Egresos = ({ fechaSeleccionada, onActualizar }) => {
  const [egresos, setEgresos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [egresoEditado, setEgresoEditado] = useState({});

  const fetchEgresos = async () => {
    setCargando(true);
    try {
      const res = await fetch(`http://localhost:5000/api/egresos/fecha/${fechaSeleccionada}`);
      if (!res.ok) throw new Error('Error al cargar egresos');
      const data = await res.json();
      setEgresos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchEgresos();
  }, [fechaSeleccionada]);

 const handleGuardarEgreso = async (nuevoEgreso) => {
    try {
      const res = await fetch('http://localhost:5000/api/egresos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEgreso),
      });
      if (!res.ok) throw new Error('Error al guardar egreso');
      fetchEgresos();
      setModalAbierto(false);
      onActualizar && onActualizar(); // <-- importante
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminarEgreso = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este egreso?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/egresos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar egreso');
      fetchEgresos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditarClick = (egreso) => {
    setEditandoId(egreso.id);
    setEgresoEditado({ 
      detalle: egreso.detalle,
      forma_pago: egreso.forma_pago,
      importe: egreso.importe,
      fecha: egreso.fecha
    });
  };

  const handleEditChange = (campo, valor) => {
    setEgresoEditado(prev => ({ ...prev, [campo]: valor }));
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setEgresoEditado({});
  };

const handleGuardarEdicion = async () => {
  const { detalle, forma_pago, importe } = egresoEditado;

  try {
    const res = await fetch(`http://localhost:5000/api/egresos/${editandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ detalle, forma_pago, importe }),
    });

    if (!res.ok) throw new Error('Error al actualizar egreso');

    await fetchEgresos();
    setEditandoId(null);
    setEgresoEditado({});
  } catch (err) {
    alert(err.message);
  }
};



  if (cargando) return <p>Cargando egresos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Section>
      <Header>
        <h3>Egresos</h3>
        <AddButton onClick={() => setModalAbierto(true)}>Agregar Egreso</AddButton>
      </Header>

      {egresos.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Detalle</th>
              <th>Forma de Pago</th>
              <th>Importe</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {egresos.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.fecha).toLocaleDateString()}</td>
                {editandoId === e.id ? (
                  <>
                    <td>
                      <input
                        value={egresoEditado.detalle}
                        onChange={(ev) => handleEditChange('detalle', ev.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        value={egresoEditado.forma_pago}
                        onChange={(e) => handleEditChange('forma_pago', e.target.value)}
                      >
                        <option value="">Seleccione</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Débito">Débito</option>
                        <option value="Crédito">Crédito</option>
                        <option value="MP">MP</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={egresoEditado.importe}
                        onChange={(ev) => handleEditChange('importe', ev.target.value)}
                      />
                    </td>
                    <td>
                      <ActionButton onClick={handleGuardarEdicion}>💾</ActionButton>
                      <ActionButton onClick={handleCancelarEdicion}>❌</ActionButton>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{e.detalle}</td>
                    <td>{e.forma_pago}</td>
                    <td>${parseFloat(e.importe).toFixed(2)}</td>
                    <td>
                      <ActionButton onClick={() => handleEditarClick(e)}>✏️</ActionButton>
                      <ActionButton onClick={() => handleEliminarEgreso(e.id)}>🗑️</ActionButton>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>No hay egresos para esta fecha.</p>
      )}

<ModalEgreso
  isOpen={modalAbierto}
  onClose={() => setModalAbierto(false)}
  onGuardar={handleGuardarEgreso}
  fecha={fechaSeleccionada}
/>
    </Section>
  );
};

export default Egresos;

// --- Estilos ---
const Section = styled.div`
  margin-top: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
  font-size: 1.5rem;
  }
`;

const AddButton = styled.button`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 13px;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    font-size: 17px;

  &:hover {
    background: linear-gradient(135deg, #5566cc 0%, #553399 100%);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
  }

  input, select {
    width: 100%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin: 0 0.3rem;

  &:hover {
    opacity: 0.7;
  }
`;
