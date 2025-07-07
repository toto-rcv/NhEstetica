import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable, { EditTableButton } from '../../components/tablas/EditableTable';
import { productosService } from '../../services/productosService';
import AddProductoModal from '../../components/tablas/productos/AddProductoModal';

const Productos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  // Estados para la búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Cargar productos cuando cambie la página, items por página o el término de búsqueda
  useEffect(() => {
    loadProductos(terminoBusqueda);
  }, [currentPage, itemsPerPage, terminoBusqueda]);

  const loadProductos = async (searchTerm) => {
    try {
      setLoading(true);
      const response = await productosService.getProductos(searchTerm, currentPage, itemsPerPage);
      
      // Asegurarse de que la respuesta tenga la estructura esperada
      if (response && response.data && response.pagination) {
        setData(response.data);
        setPaginationInfo(response.pagination);
        setError(null);
        
        // Actualizar mensaje si hay búsqueda activa
        if (searchTerm) {
          if (response.data.length === 0) {
            setMensaje('No se pudo encontrar el Producto solicitado');
          } else {
            setMensaje(`Se encontraron ${response.pagination.totalItems} producto${response.pagination.totalItems > 1 ? 's' : ''}`);
          }
        } else {
          setMensaje('');
        }
      } else {
        // Manejar respuesta en formato legacy (sin paginación)
        setData(response || []);
        setPaginationInfo({
          totalPages: 1,
          totalItems: (response || []).length,
          currentPage: 1,
          itemsPerPage: itemsPerPage,
          hasNextPage: false,
          hasPrevPage: false
        });
        setError(null);
        setMensaje('');
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar los productos');
      setData([]);
      setPaginationInfo({
        totalPages: 0,
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: itemsPerPage,
        hasNextPage: false,
        hasPrevPage: false
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarProductos = async (termino) => {
    setBuscando(true);
    setCurrentPage(1); // Resetear a la primera página en nueva búsqueda
    await loadProductos(termino);
    setBuscando(false);
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
      buscarProductos(termino);
    }, 500);
  };

  const limpiarBusqueda = async () => {
    setTerminoBusqueda('');
    setCurrentPage(1);
    setMensaje('');
    // Recargar productos sin filtro usando loadProductos con término vacío
    await loadProductos('');
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
      
      const response = await fetch('/api/upload/image?type=producto', {
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

      // Obtener el producto actual
      const currentProduct = data[rowIndex];
      
      // Actualizar el producto en la base de datos
      const updatedProductData = {
        ...currentProduct,
        imagen: newImagePath
      };

      // Guardar en la base de datos
      await productosService.updateProducto(currentProduct.id, updatedProductData);

      // Actualizar la imagen en los datos locales inmediatamente
      const updatedData = [...data];
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        imagen: newImagePath
      };
      setData(updatedData);

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
    if (imagePath.startsWith('/images-de-productos/')) {
      const filename = imagePath.replace('/images-de-productos/', '');
      return `/api/upload/image/producto/${filename}`;
    }
    
    // Por defecto, asumir que es una ruta relativa válida
    return imagePath;
  };

  const columns = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'costo', header: 'Costo' },
    { accessorKey: 'precio', header: 'Precio' },
    { accessorKey: 'subtitle', header: 'Subtítulo', hideOnMobile: true },
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
                  <ProductImage src={getImageUrl(row.original.imagen)} alt="Producto" />
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
    },
    { accessorKey: 'categoria', header: 'Categoría' },
    { accessorKey: 'marca', header: 'Marca' },
    { 
      accessorKey: 'isNatural', 
      header: 'Natural', 
      cell: ({ getValue }) => getValue() ? 'Sí' : 'No',
      hideOnMobile: true 
    },
    { 
      accessorKey: 'isVegan', 
      header: 'Vegano', 
      cell: ({ getValue }) => getValue() ? 'Sí' : 'No',
      hideOnMobile: true 
    },
    { 
      accessorKey: 'benefits', 
      header: 'Beneficios', 
      cell: ({ getValue, row, table }) => {
        const benefits = getValue();
        if (!benefits || !Array.isArray(benefits)) return '';
        // Si está en modo edición, mostrar input con placeholder
        if (table.options.state?.editingCell && table.options.state.editingCell.rowIndex === row.index && table.options.state.editingCell.columnId === 'benefits') {
          return (
            <input
              value={Array.isArray(benefits) ? benefits.join('. ') : (benefits || '')}
              onChange={() => {}} // El input real es manejado por EditableTable
              placeholder="Separá cada beneficio con un punto (.)"
              style={{ width: '100%', padding: 8, border: '1px solid #ced4da', borderRadius: 4 }}
              disabled
            />
          );
        }
        return (
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {benefits.map((b, i) => (
              <li key={i} style={{ listStyle: 'none', marginBottom: 2 }}>
                <span style={{ color: '#28a745', fontWeight: 'bold', marginRight: 6 }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
        );
      },
      hideOnMobile: true 
    },
    { 
      accessorKey: 'modoUso', 
      header: 'Modo de Uso', 
      cell: ({ getValue, row, table }) => {
        const modoUso = getValue();
        if (!modoUso || !Array.isArray(modoUso)) return '';
        // Si está en modo edición, mostrar input con placeholder
        if (table.options.state?.editingCell && table.options.state.editingCell.rowIndex === row.index && table.options.state.editingCell.columnId === 'modoUso') {
          return (
            <input
              value={Array.isArray(modoUso) ? modoUso.join('. ') : (modoUso || '')}
              onChange={() => {}} // El input real es manejado por EditableTable
              placeholder="Separá cada paso con un punto (.)"
              style={{ width: '100%', padding: 8, border: '1px solid #ced4da', borderRadius: 4 }}
              disabled
            />
          );
        }
        return (
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {modoUso.map((m, i) => (
              <li key={i} style={{ listStyle: 'none', marginBottom: 2 }}>
                <span style={{ color: '#28a745', fontWeight: 'bold', marginRight: 6 }}>✓</span>
                {m}
              </li>
            ))}
          </ul>
        );
      },
      hideOnMobile: true 
    },
  ];

  const handleDataChange = async (newData) => {
    setIsSaving(true);
    try {
      // Identificar filas nuevas (sin id)
      const newRows = newData.filter(row => !row.id && row.nombre && row.precio);
      for (const newRow of newRows) {
        // Convertir benefits de string a array si es necesario (separar por punto)
        const processedRow = {
          ...newRow,
          benefits: typeof newRow.benefits === 'string' && newRow.benefits.trim() 
            ? newRow.benefits.split('.').map(b => b.trim()).filter(b => b)
            : newRow.benefits || [],
          modoUso: typeof newRow.modoUso === 'string' && newRow.modoUso.trim() 
            ? newRow.modoUso.split('.').map(m => m.trim()).filter(m => m)
            : newRow.modoUso || []
        };
        await productosService.createProducto(processedRow);
      }
      if (newRows.length > 0) {
        await loadProductos(terminoBusqueda);
        // Limpiar búsqueda si estaba activa
        if (terminoBusqueda) {
          limpiarBusqueda();
        }
      }
    } catch (err) {
      setError('Error al guardar producto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    try {
      const rowToDelete = data[rowIndex];
      if (rowToDelete && rowToDelete.id) {
        // Eliminar producto y obtener respuesta
        const response = await productosService.deleteProducto(rowToDelete.id);
        
        // Recargar productos
        await loadProductos(terminoBusqueda);
        
        // Limpiar búsqueda si estaba activa
        if (terminoBusqueda) {
          limpiarBusqueda();
        }
        
        // Mostrar mensaje de éxito con información sobre ventas asociadas
        if (response.ventasAsociadas > 0) {
          setMensaje(`${response.message} (${response.ventasAsociadas} venta(s) histórica(s) se mantienen)`);
        } else {
          setMensaje(response.message);
        }
        setTimeout(() => setMensaje(''), 5000); // Limpiar mensaje después de 5 segundos
      }
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      
      // Manejar diferentes tipos de errores
      if (err.message && err.message.includes('No se puede eliminar')) {
        setError(err.message);
      } else if (err.message && err.message.includes('no encontrado')) {
        setError('El producto ya no existe en la base de datos');
      } else {
        setError('Error al eliminar producto. Inténtalo de nuevo.');
      }
      
      // Limpiar error después de 5 segundos
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdateProducto = async (productoId, updatedData) => {
    try {
      // Asegurarse de que modoUso y benefits sean arrays
      const processedData = {
        ...updatedData,
        benefits: typeof updatedData.benefits === 'string' && updatedData.benefits.trim() 
          ? updatedData.benefits.split('.').map(b => b.trim()).filter(b => b)
          : (Array.isArray(updatedData.benefits) ? updatedData.benefits : []),
        modoUso: typeof updatedData.modoUso === 'string' && updatedData.modoUso.trim() 
          ? updatedData.modoUso.split('.').map(m => m.trim()).filter(m => m)
          : (Array.isArray(updatedData.modoUso) ? updatedData.modoUso : [])
      };
      await productosService.updateProducto(productoId, processedData);
      await loadProductos(terminoBusqueda);
    } catch (err) {
      setError('Error al actualizar producto');
    }
  };

  // Funciones de paginación
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Resetear a la primera página
  };

  if (loading) {
    return (
      <TablasLayout title="Gestión de Productos">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Cargando productos...
        </div>
      </TablasLayout>
    );
  }

  if (error) {
    return (
      <TablasLayout title="Gestión de Productos">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Error: {error}
          <br />
          <button onClick={() => loadProductos(terminoBusqueda)} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Reintentar
          </button>
        </div>
      </TablasLayout>
    );
  }

  return (
    <TablasLayout title="Gestión de Productos">
      <Container>
        <Title>Gestión de Productos</Title>
        <Text>Aquí podrás gestionar la información de los productos del establecimiento.</Text>

        {mensaje && <MensajeContainer tipo={mensaje.includes('No se pudo encontrar') ? 'error' : 'success'}>{mensaje}</MensajeContainer>}

        {/* Sección con buscador y botón agregar */}
        <TopActionsContainer>
          <SearchInputContainer>
            <SearchInput
              type="text"
              placeholder="Buscar producto por nombre, marca o subtítulo..."
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
            Agregar Producto
          </EditTableButton>
        </TopActionsContainer>

        <AddProductoModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={async () => { setShowAddModal(false); await loadProductos(terminoBusqueda); limpiarBusqueda(); }}
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
        
        {/* Información de paginación y selector de elementos por página */}
        <PaginationInfoContainer>
          <PaginationInfo>
            Mostrando {data?.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, paginationInfo?.totalItems || 0)} de {paginationInfo?.totalItems || 0} productos
          </PaginationInfo>
          <ItemsPerPageContainer>
            <label>Elementos por página:</label>
            <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </ItemsPerPageContainer>
        </PaginationInfoContainer>

        <EditableTable
          data={data}
          columns={columns}
          onDataChange={handleDataChange}
          title="Base de Datos de Productos"
          addRowText={null}
          onDeleteRow={handleDeleteRow}
          onUpdateRow={handleUpdateProducto}
          customButtons={null}
        />

        {/* Controles de paginación */}
        {(paginationInfo?.totalPages || 0) > 1 && (
          <PaginationContainer>
            <PaginationButton 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!paginationInfo?.hasPrevPage}
            >
              ⟨ Anterior
            </PaginationButton>
            
            <PaginationNumbers>
              {Array.from({ length: Math.min(5, paginationInfo?.totalPages || 0) }, (_, i) => {
                const totalPages = paginationInfo?.totalPages || 0;
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <PaginationNumber
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    $isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationNumber>
                );
              })}
            </PaginationNumbers>
            
            <PaginationButton 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!paginationInfo?.hasNextPage}
            >
              Siguiente ⟩
            </PaginationButton>
          </PaginationContainer>
        )}
      </Container>
    </TablasLayout>
  );
};

export default Productos;

// Estilos para la búsqueda
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

// Estilos para la paginación
const PaginationInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const PaginationInfo = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
`;

const ItemsPerPageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
  }

  select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 0.9rem;
    background: white;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: white;
  color: #6c757d;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const PaginationNumbers = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const PaginationNumber = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #dee2e6;
  background: ${props => props.$isActive ? '#3498db' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#6c757d'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.$isActive ? '#2980b9' : '#e9ecef'};
    border-color: ${props => props.$isActive ? '#2980b9' : '#adb5bd'};
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
`;

// Componentes para mostrar imágenes en la tabla
const ImageCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
`;

const ProductImage = styled.img`
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

  &:hover ${ProductImage} {
    transform: scale(1.05);
  }

  &:hover ${NoImagePlaceholder} {
    background: #e9ecef;
    border-color: #adb5bd;
  }
`; 