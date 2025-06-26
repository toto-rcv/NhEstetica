import React from 'react';
import styled from 'styled-components';

const TablaVentasProductos = ({
  ventas,
  clientes,
  productos,
  onDelete,
  onEditStart,
  onEditChange,
  onEditCancel,
  onEditSave,
  editandoId,
  ventaEditada
}) => (
  <Table>
    <thead>
      <tr>
        <th>Producto</th>
        <th>Marca</th>
        <th>Costo</th>
        <th>Precio</th>
        <th>Ganancia</th>
        <th>Cliente</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {ventas.map((venta) => {
        const enEdicion = venta.id === editandoId;
        const producto = productos.find(p => p.id === (enEdicion ? parseInt(ventaEditada?.producto_id) : venta.producto_id));
        const nombreProducto = producto?.nombre || venta.nombre_producto || '';
        const marcaProducto = producto?.marca || venta.marca_producto || '';

        return (
          <tr key={venta.id}>
            <td>
              {enEdicion ? (
                <select
                  name="producto_id"
                  value={ventaEditada?.producto_id || ''}
                  onChange={onEditChange}
                >
                  <option value="">Seleccionar producto...</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                nombreProducto
              )}
            </td>
            <td>{marcaProducto}</td>
            <td>
              {enEdicion ? (
                <input
                  name="costo"
                  type="number"
                  value={ventaEditada?.costo || ''}
                  onChange={onEditChange}
                />
              ) : (
                `$${venta.costo}`
              )}
            </td>
            <td>
              {enEdicion ? (
                <input
                  name="precio"
                  type="number"
                  value={ventaEditada?.precio || ''}
                  onChange={onEditChange}
                />
              ) : (
                `$${venta.precio}`
              )}
            </td>
            <td>
              {!enEdicion &&
                `$${(venta.precio - venta.costo).toFixed(2)}`
              }
            </td>
            <td>
              {enEdicion ? (
                <select
                  name="cliente_id"
                  value={ventaEditada?.cliente_id || ''}
                  onChange={onEditChange}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              ) : (
                `${venta.cliente_nombre || ''} ${venta.cliente_apellido || ''}`
              )}
            </td>
            <td>
              {enEdicion ? (
                <>
                  <Button onClick={onEditSave}>Guardar</Button>
                  <Button danger onClick={onEditCancel}>Cancelar</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => onEditStart(venta)}>Editar</Button>
                  <Button danger onClick={() => onDelete(venta.id)}>Eliminar</Button>
                </>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

export default TablaVentasProductos;


// Estilos
const Table = styled.table`
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;

  th, td {
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
    color: #333;
  }

  tr:hover {
    background-color: #f0f0f0;
  }

  input, select {
    width: 100%;
    padding: 6px 10px;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fefefe;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 4px rgba(102, 126, 234, 0.5);
    }
  }
`;

const Button = styled.button`
  background-color: ${props => props.danger ? '#e74c3c' : '#3498db'};
  color: white;
  border: none;
  padding: 6px 10px;
  margin-right: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.8;
  }
`;
