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
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const productosData = await productosService.getProductos();
      setData(productosData);
      setProductosOriginales(productosData); // Guardamos los productos originales
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const buscarProductos = async (termino) => {
    if (!termino.trim()) {
      // Si no hay término de búsqueda, mostrar todos los productos
      setData(productosOriginales);
      setMensaje('');
      return;
    }

    setBuscando(true);
    try {
      const productosData = await productosService.getProductos(termino);
      
      if (productosData.length === 0) {
        setMensaje('No se pudo encontrar el Producto solicitado');
        setData([]);
      } else {
        setData(productosData);
        setMensaje(`Se encontraron ${productosData.length} producto${productosData.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Error al buscar productos:', error);
      setMensaje('Error al buscar productos');
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
      buscarProductos(termino);
    }, 500);
  };

  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setData(productosOriginales);
    setMensaje('');
  };

  const columns = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'costo', header: 'Costo' },
    { accessorKey: 'precio', header: 'Precio' },
    { accessorKey: 'subtitle', header: 'Subtítulo', hideOnMobile: true },
    { accessorKey: 'descripcion', header: 'Descripción', hideOnMobile: true },
    { accessorKey: 'imagen', header: 'Imagen', hideOnMobile: true },
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
        await loadProductos();
        // Limpiar búsqueda si estaba activa
        if (terminoBusqueda) {
          limpiarBusqueda();
        }
      } else {
        setData(newData);
        setProductosOriginales(newData);
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
        await productosService.deleteProducto(rowToDelete.id);
        await loadProductos();
        // Limpiar búsqueda si estaba activa
        if (terminoBusqueda) {
          limpiarBusqueda();
        }
      } else {
        const newData = data.filter((_, idx) => idx !== rowIndex);
        setData(newData);
        setProductosOriginales(newData);
      }
    } catch (err) {
      setError('Error al eliminar producto');
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
      await loadProductos();
      // Mantener búsqueda activa si había una
      if (terminoBusqueda) {
        setTimeout(() => buscarProductos(terminoBusqueda), 100);
      }
    } catch (err) {
      setError('Error al actualizar producto');
    }
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
          <button onClick={loadProductos} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
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
          onSuccess={async () => { setShowAddModal(false); await loadProductos(); limpiarBusqueda(); }}
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
          title="Base de Datos de Productos"
          addRowText={null}
          onDeleteRow={handleDeleteRow}
          onUpdateRow={handleUpdateProducto}
          customButtons={null}
        />
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