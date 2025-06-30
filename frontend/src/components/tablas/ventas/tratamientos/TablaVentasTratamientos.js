import React from 'react';
import styled from 'styled-components';

const TablaVentasTratamientos = ({
  ventas,
  clientes,
  tratamientos,
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
        <th>Precio</th>
        <th>Forma de Pago</th>
        <th>Vencimiento</th>
        <th>Cuotas</th>
        <th>Observación</th>
        <th>Cliente</th>
        <th>Fecha</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {ventas.map((venta) => {
        const enEdicion = venta.id === editandoId;

        // Buscar nombre tratamiento y cliente para mostrar en vista
        const tratamientoNombre = tratamientos.find(t => t.id === venta.tratamiento_id)?.nombre || '';
        const clienteNombre = clientes.find(c => c.id === venta.cliente_id)?.nombre || '';
        const clienteApellido = clientes.find(c => c.id === venta.cliente_id)?.apellido || '';

        return (
          <tr key={venta.id}>
            <td>
              {enEdicion ? (
                <select
                  name="tratamiento_id"
                  value={ventaEditada.tratamiento_id || ''}
                  onChange={onEditChange}
                >
                  <option value="">Seleccionar tratamiento</option>
                  {tratamientos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                tratamientoNombre
              )}
            </td>

            <td>
              {enEdicion ? (
                <input
                  type="number"
                  name="sesiones"
                  value={ventaEditada.sesiones || ''}
                  onChange={onEditChange}
                />
              ) : (
                venta.sesiones
              )}
            </td>

            <td>
              {enEdicion ? (
                <input
                  type="number"
                  name="precio"
                  value={ventaEditada.precio || ''}
                  onChange={onEditChange}
                />
              ) : (
                `$${venta.precio || 0}`
              )}
            </td>

            <td>
              {enEdicion ? (
                <input
                  type="text"
                  name="forma_de_pago"
                  value={ventaEditada.forma_de_pago || ''}
                  onChange={onEditChange}
                />
              ) : (
                venta.forma_de_pago || '-'
              )}
            </td>

            <td>
              {enEdicion ? (
                <input
                  type="date"
                  name="vencimiento"
                  value={ventaEditada.vencimiento ? ventaEditada.vencimiento.split('T')[0] : ''}
                  onChange={onEditChange}
                />
              ) : (
                venta.vencimiento ? venta.vencimiento.split('T')[0] : '-'
              )}
            </td>

            <td>
              {enEdicion ? (
                <input
                  type="number"
                  name="cuotas"
                  value={ventaEditada.cuotas || ''}
                  onChange={onEditChange}
                />
              ) : (
                venta.cuotas || 0
              )}
            </td>

            <td>
              {enEdicion ? (
                <input
                  type="text"
                  name="observacion"
                  value={ventaEditada.observacion || ''}
                  onChange={onEditChange}
                />
              ) : (
                venta.observacion || '-'
              )}
            </td>

            <td>
              {enEdicion ? (
                <select
                  name="cliente_id"
                  value={ventaEditada.cliente_id || ''}
                  onChange={onEditChange}
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              ) : (
                `${clienteNombre} ${clienteApellido}`
              )}
            </td>
            <td>
              {enEdicion ? (
                <input
                  type="date"
                  name="fecha"
                  value={ventaEditada.fecha ? ventaEditada.fecha.split('T')[0] : ''}
                  onChange={onEditChange}
                />
              ) : (
                venta.fecha ? venta.fecha.split('T')[0] : '-'
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
