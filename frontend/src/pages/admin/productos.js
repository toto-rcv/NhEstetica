import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable, { EditTableButton } from '../../components/tablas/EditableTable';
import { productosService } from '../../services/productosService';

const Productos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const productosData = await productosService.getProductos();
      setData(productosData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { accessorKey: 'nombre', header: 'Nombre' },
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
            : newRow.benefits || []
        };
        await productosService.createProducto(processedRow);
      }
      if (newRows.length > 0) {
        await loadProductos();
      } else {
        setData(newData);
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
      } else {
        setData(data.filter((_, idx) => idx !== rowIndex));
      }
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };

  const handleUpdateProducto = async (productoId, updatedData) => {
    try {
      // Convertir benefits de string a array si es necesario (separar por punto)
      const processedData = {
        ...updatedData,
        benefits: typeof updatedData.benefits === 'string' && updatedData.benefits.trim() 
          ? updatedData.benefits.split('.').map(b => b.trim()).filter(b => b)
          : updatedData.benefits || []
      };
      await productosService.updateProducto(productoId, processedData);
      await loadProductos();
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
      />
    </TablasLayout>
  );
};

export default Productos; 