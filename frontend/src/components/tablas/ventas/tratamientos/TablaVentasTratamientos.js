import React from 'react';
import styled from 'styled-components';

const TablaVentasTratamientos = ({
  ventas,
  clientes,
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
        <th>Tratamiento</th>
        <th>Sesiones</th>
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
        return (
          <tr key={venta.id}>
            <td>
              {enEdicion ? (
                <input
                  name="tratamiento"
                  value={ventaEditada?.tratamiento || ''}
                  onChange={onEditChange}
                />
              ) : (
                venta.tratamiento
              )}
            </td>
            <td>
              {enEdicion ? (
                <input
                  name="sesiones"
                  value={ventaEditada?.sesiones || ''}
                  onChange={onEditChange}
                />
              ) : (
                venta.sesiones
              )}
            </td>
            <td>
              {enEdicion ? (
                <input
                  name="costo"
                  type="number"
                  value={ventaEditada?.costo || 0}
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
                  value={ventaEditada?.precio || 0}
                  onChange={onEditChange}
                />
              ) : (
                `$${venta.precio}`
              )}
            </td>
            <td>
              {!enEdicion && (
                `$${(venta.precio - venta.costo) * parseInt(venta.sesiones || 0)}`
              )}
            </td>
            <td>
              {enEdicion ? (
                <select
                  name="cliente_id"
                  value={ventaEditada?.cliente_id || ''}
                  onChange={onEditChange}
                >
                  <option value="">Seleccionar...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              ) : (
                `${venta.nombre || ''} ${venta.apellido || ''}`
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

export default TablaVentasTratamientos;

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
