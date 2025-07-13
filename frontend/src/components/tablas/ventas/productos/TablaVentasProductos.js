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
        <th>Cantidad</th>
        <th>Ganancia</th>
        <th>Cliente</th>
        <th>Forma de Pago</th>
        <th>Cuotas</th>
        <th>Observación</th>
        <th>Fecha</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {ventas.map((venta) => {
        const enEdicion = venta.id === editandoId;
        const producto = Array.isArray(productos) ? productos.find(p => p.id === (enEdicion ? parseInt(ventaEditada?.producto_id) : venta.producto_id)) : null;
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
                  {Array.isArray(productos) && productos.map((p) => (
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
              {enEdicion ? (
                <input
                  name="cantidad"
                  type="number"
                  value={ventaEditada?.cantidad || ''}
                  onChange={onEditChange}
                />
              ) : (
                `${venta.cantidad}`
              )}
            </td>

            <td>
              {!enEdicion && `$${((venta.precio - venta.costo) * venta.cantidad).toFixed(2)}`}
            </td>

            <td>
              {enEdicion ? (
                <select
                  name="cliente_id"
                  value={ventaEditada?.cliente_id || ''}
                  onChange={onEditChange}
                >
                  <option value="">Seleccionar cliente...</option>
                  {Array.isArray(clientes) && clientes.map((c) => (
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
                <select
                  name="forma_de_pago"
                  value={ventaEditada?.forma_de_pago || ''}
                  onChange={onEditChange}
                >
                  <option value="">Seleccionar forma de pago...</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Débito">Débito</option>
                  <option value="Crédito">Crédito</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              ) : (
                venta.forma_de_pago || "-"
              )}
            </td>


            <td>
              {enEdicion ? (
                <input
                  type="number"
                  name="cuotas"
                  value={ventaEditada?.cuotas || ''}
                  onChange={onEditChange}
                  min={1}
                />
              ) : (
                venta.cuotas || "-"
              )}
            </td>

            <td>
              {enEdicion ? (
                <input
                  type="text"
                  name="observacion"
                  value={ventaEditada?.observacion || ''}
                  onChange={onEditChange}
                />
              ) : (
                venta.observacion || "-"
              )}
            </td>

            <td>
              {new Date(venta.fecha).toLocaleString("es-AR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              })}
            </td>

            <td>
              {enEdicion ? (
                <>
                  <Button onClick={onEditSave}>Guardar</Button>
                  <Button $danger onClick={onEditCancel}>Cancelar</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => onEditStart(venta)}>Editar</Button>
                  <Button $danger onClick={() => onDelete(venta.id)}>Eliminar</Button>
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
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.1);

  th, td {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: linear-gradient(180deg, #667eea 0%, #5a67d8 50%, #4f46e5 100%);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  tbody tr {
    background: white;
    transition: all 0.3s ease;
    
    &:nth-child(even) {
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    }
    
    &:hover {
      background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }
  }

  td {
    border-bottom: 1px solid rgba(148, 163, 184, 0.06);
    color: #374151;
    font-size: 0.9rem;
    text-align: center;
    
    &:first-child {
      font-weight: 600;
      color: #1e293b;
    }
  }

  input, select {
    width: 100%;
    padding: 10px 14px;
    font-size: 0.9rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    color: #1e293b;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background: #ffffff;
      transform: translateY(-1px);
    }

    &:hover {
      border-color: #cbd5e1;
    }
  }
`;

const Button = styled.button`
  background: ${props => props.$danger 
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  padding: 8px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-family: "Raleway";
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px ${props => props.$danger 
    ? 'rgba(239, 68, 68, 0.3)' 
    : 'rgba(102, 126, 234, 0.3)'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  width: 100px;
  text-align: center;
  display: inline-block;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.$danger 
      ? 'rgba(239, 68, 68, 0.4)' 
      : 'rgba(102, 126, 234, 0.4)'};
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;
