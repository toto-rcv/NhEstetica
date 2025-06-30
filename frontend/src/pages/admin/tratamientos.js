import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable, { EditTableButton } from '../../components/tablas/EditableTable';
import { tratamientosService } from '../../services/tratamientosService';
import AddTratamientoModal from '../../components/tablas/tratamientos/AddTratamientoModal';

function TratamientosAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadTratamientos();
  }, []);

  const loadTratamientos = async () => {
    try {
      setLoading(true);
      const tratamientosData = await tratamientosService.getTratamientos();
      setData(tratamientosData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los tratamientos');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'precio', header: 'Precio' },
    { accessorKey: 'categoria', header: 'Categoría' },
    { accessorKey: 'duracion', header: 'Duración', hideOnMobile: true },
    { accessorKey: 'descripcion', header: 'Descripción', hideOnMobile: true },
    { accessorKey: 'imagen', header: 'Imagen', hideOnMobile: true }
  ];

  const handleDataChange = async (newData) => {
    setIsSaving(true);
    try {
      // Identificar filas nuevas (sin id)
      const newRows = newData.filter(row => !row.id && row.nombre && row.precio);
      for (const newRow of newRows) {
        // Procesar el nuevo registro
        const processedRow = {
          ...newRow,
          precio: parseFloat(newRow.precio)
        };
        await tratamientosService.createTratamiento(processedRow);
      }
      if (newRows.length > 0) {
        await loadTratamientos();
      } else {
        setData(newData);
      }
    } catch (err) {
      setError('Error al guardar tratamiento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    try {
      const rowToDelete = data[rowIndex];
      if (rowToDelete && rowToDelete.id) {
        await tratamientosService.deleteTratamiento(rowToDelete.id);
        await loadTratamientos();
      } else {
        setData(data.filter((_, idx) => idx !== rowIndex));
      }
    } catch (err) {
      setError('Error al eliminar tratamiento');
    }
  };

  const handleUpdateTratamiento = async (tratamientoId, updatedData) => {
    try {
      const processedData = {
        ...updatedData,
        precio: parseFloat(updatedData.precio || 0)
      };
      await tratamientosService.updateTratamiento(tratamientoId, processedData);
      await loadTratamientos();
    } catch (err) {
      setError('Error al actualizar tratamiento');
    }
  };

  if (loading) {
    return (
      <TablasLayout title="Gestión de Tratamientos">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Cargando tratamientos...
        </div>
      </TablasLayout>
    );
  }

  if (error) {
    return (
      <TablasLayout title="Gestión de Tratamientos">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Error: {error}
          <br />
          <button onClick={loadTratamientos} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Reintentar
          </button>
        </div>
      </TablasLayout>
    );
  }

  return (
    <TablasLayout title="Gestión de Tratamientos">
      <AddTratamientoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={async () => { setShowAddModal(false); await loadTratamientos(); }}
      />
      {isSaving && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          Guardando cambios...
        </div>
      )}
      <EditableTable
        data={data}
        columns={columns}
        onDataChange={handleDataChange}
        title="Base de Datos de Tratamientos"
        addRowText={null}
        onDeleteRow={handleDeleteRow}
        onUpdateRow={handleUpdateTratamiento}
        customButtons={
          <EditTableButton style={{ background: '#28a745', color: 'white' }} onClick={() => setShowAddModal(true)}>
            Agregar Tratamiento
          </EditTableButton>
        }
      />
    </TablasLayout>
  );
}

export default TratamientosAdmin;


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