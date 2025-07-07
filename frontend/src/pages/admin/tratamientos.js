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
  // Estados para la búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [tratamientosOriginales, setTratamientosOriginales] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    loadTratamientos();
  }, []);

  const loadTratamientos = async () => {
    try {
      setLoading(true);
      const tratamientosData = await tratamientosService.getTratamientos();
      setData(tratamientosData);
      setTratamientosOriginales(tratamientosData); // Guardamos los tratamientos originales
      setError(null);
    } catch (err) {
      setError('Error al cargar los tratamientos');
    } finally {
      setLoading(false);
    }
  };

  const buscarTratamientos = async (termino) => {
    if (!termino.trim()) {
      // Si no hay término de búsqueda, mostrar todos los tratamientos
      setData(tratamientosOriginales);
      setMensaje('');
      return;
    }

    setBuscando(true);
    try {
      const tratamientosData = await tratamientosService.getTratamientos(termino);
      
      if (tratamientosData.length === 0) {
        setMensaje('No se pudo encontrar el Tratamiento solicitado');
        setData([]);
      } else {
        setData(tratamientosData);
        setMensaje(`Se encontraron ${tratamientosData.length} tratamiento${tratamientosData.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Error al buscar tratamientos:', error);
      setMensaje('Error al buscar tratamientos');
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
      buscarTratamientos(termino);
    }, 500);
  };

  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setData(tratamientosOriginales);
    setMensaje('');
  };

  // Función para manejar el cambio de imagen en modo edición
  const handleImageChange = async (e, rowIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5MB');
      return;
    }

    try {
      setLoading(true);
      
      // Subir la nueva imagen
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');
      
      const response = await fetch('/api/upload/image?type=tratamiento', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const result = await response.json();
      const newImagePath = result.imagePath;

      // Obtener el tratamiento actual
      const currentTratamiento = data[rowIndex];
      
      // Actualizar el tratamiento en la base de datos
      const updatedTratamientoData = {
        ...currentTratamiento,
        imagen: newImagePath
      };

      // Guardar en la base de datos
      await tratamientosService.updateTratamiento(currentTratamiento.id, updatedTratamientoData);

      // Actualizar la imagen en los datos locales inmediatamente
      const updatedData = [...data];
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        imagen: newImagePath
      };
      setData(updatedData);
      setTratamientosOriginales(updatedData);

      // Mostrar mensaje de éxito
      setMensaje('Imagen actualizada correctamente');
      setTimeout(() => setMensaje(''), 3000);

    } catch (error) {
      console.error('Error al cambiar imagen:', error);
      setError(error.message || 'Error al cambiar la imagen');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Función helper para manejar rutas de imágenes
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Si ya es una ruta de API, usarla directamente
    if (imagePath.startsWith('/api/upload/image/')) {
      return imagePath;
    }
    
    // Si es el formato anterior, convertirla al nuevo formato
    if (imagePath.startsWith('/images-de-tratamientos/')) {
      const filename = imagePath.replace('/images-de-tratamientos/', '');
      return `/api/upload/image/tratamiento/${filename}`;
    }
    
    // Por defecto, asumir que es una ruta relativa válida
    return imagePath;
  };

  const columns = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'precio', header: 'Precio' },
    { accessorKey: 'categoria', header: 'Categoría' },
    { accessorKey: 'duracion', header: 'Duración', hideOnMobile: true },
    { accessorKey: 'descripcion', header: 'Descripción', hideOnMobile: true },
    { 
      accessorKey: 'imagen', 
      header: 'Imagen', 
      hideOnMobile: true,
      cell: ({ row, table }) => {
        const isEditing = table.options.state?.editingCell && 
                         table.options.state.editingCell.rowIndex === row.index && 
                         table.options.state.editingCell.columnId === 'imagen';
        
        return (
          <ImageCell>
            <ImageUploadContainer>
              <ImageUploadInput
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, row.index)}
                id={`image-upload-${row.index}`}
              />
              <ImageUploadLabel htmlFor={`image-upload-${row.index}`}>
                {row.original.imagen ? (
                  <TratamientoImage src={getImageUrl(row.original.imagen)} alt="Tratamiento" />
                ) : (
                  <NoImagePlaceholder>
                    📷 Agregar
                  </NoImagePlaceholder>
                )}
              </ImageUploadLabel>
            </ImageUploadContainer>
          </ImageCell>
        );
      },
      size: 80,
    }
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
        // Limpiar búsqueda si estaba activa
        if (terminoBusqueda) {
          limpiarBusqueda();
        }
      } else {
        setData(newData);
        setTratamientosOriginales(newData);
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
        // Limpiar búsqueda si estaba activa
        if (terminoBusqueda) {
          limpiarBusqueda();
        }
      } else {
        const newData = data.filter((_, idx) => idx !== rowIndex);
        setData(newData);
        setTratamientosOriginales(newData);
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
      // Mantener búsqueda activa si había una
      if (terminoBusqueda) {
        setTimeout(() => buscarTratamientos(terminoBusqueda), 100);
      }
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
      <Container>
        <Title>Gestión de Tratamientos</Title>
        <Text>Aquí podrás gestionar la información de los tratamientos del establecimiento.</Text>

        {mensaje && <MensajeContainer tipo={mensaje.includes('No se pudo encontrar') ? 'error' : 'success'}>{mensaje}</MensajeContainer>}

        {/* Sección con buscador y botón agregar */}
        <TopActionsContainer>
          <SearchInputContainer>
            <SearchInput
              type="text"
              placeholder="Buscar tratamiento por nombre, categoría o descripción..."
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
          
          <EditTableButton style={{ background: '#28a745', color: 'white' }} onClick={() => setShowAddModal(true)}>
            Agregar Tratamiento
          </EditTableButton>
        </TopActionsContainer>

        <AddTratamientoModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={async () => { setShowAddModal(false); await loadTratamientos(); limpiarBusqueda(); }}
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
          customButtons={null}
        />
      </Container>
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
  padding: 12px 0px 12px 15px;
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

// Componentes para mostrar imágenes en la tabla
const ImageCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
`;

const TratamientoImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e9ecef;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
  }
`;

const NoImagePlaceholder = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.2;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    border-color: #007bff;
    color: #007bff;
    transform: scale(1.05);
  }
`;

// Componentes para la subida de imagen en modo edición
const ImageUploadContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageUploadInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  cursor: pointer;
`;

const ImageUploadLabel = styled.label`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:hover ${TratamientoImage} {
    transform: scale(1.05);
  }

  &:hover ${NoImagePlaceholder} {
    background: #e9ecef;
    border-color: #adb5bd;
  }
`;