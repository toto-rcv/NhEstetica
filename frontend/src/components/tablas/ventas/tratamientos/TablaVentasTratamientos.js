import React from 'react';
import styled from 'styled-components';

const TablaVentasTratamientos = ({
  ventas,
  clientes,
  tratamientos,
  personal,
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
        <th>Personal</th>
        <th>Sesiones</th>
        <th>Precio</th>
        <th>Total</th>
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

        const tratamientoNombre = tratamientos.find(t => t.id === venta.tratamiento_id)?.nombre || '';
        const cliente = clientes.find(c => c.id === venta.cliente_id) || {};
        const personalData = personal.find(p => p.id === venta.personal_id) || {};

        return (
          <tr key={venta.id}>
            <td>
              {enEdicion ? (
                <select name="tratamiento_id" value={ventaEditada.tratamiento_id || ''} onChange={onEditChange}>
                  <option value="">Seleccionar tratamiento</option>
                  {tratamientos.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              ) : (
                tratamientoNombre
              )}
            </td>

             <td>
              {enEdicion ? (
                <select name="personal_id" value={ventaEditada.personal_id || ''} onChange={onEditChange}>
                  <option value="">Seleccionar personal</option>
                  {personal.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                  ))}
                </select>
              ) : (
                personalData.nombre ? `${personalData.nombre} ${personalData.apellido}` : '-'
              )}
            </td>


            <td>
              {enEdicion ? (
                <input type="number" name="sesiones" value={ventaEditada.sesiones || ''} onChange={onEditChange} />
              ) : (
                venta.sesiones
              )}
            </td>           
            <td>
              {enEdicion ? (
                <input type="number" name="precio" value={ventaEditada.precio || ''} onChange={onEditChange} />
              ) : (
                `$${venta.precio || 0}`
              )}
            </td>

            <td>
              {`$${(venta.precio * venta.sesiones).toFixed(0)}`}
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
                <input type="date" name="vencimiento" value={ventaEditada.vencimiento?.slice(0, 10) || ''} onChange={onEditChange} />
              ) : (
                venta.vencimiento?.slice(0, 10) || '-'
              )}
            </td>

            <td>
              {enEdicion ? (
                <input type="number" name="cuotas" value={ventaEditada.cuotas || ''} onChange={onEditChange} />
              ) : (
                venta.cuotas || 0
              )}
            </td>

            <td>
              {enEdicion ? (
                <input type="text" name="observacion" value={ventaEditada.observacion || ''} onChange={onEditChange} />
              ) : (
                venta.observacion || '-'
              )}
            </td>

            <td>
              {enEdicion ? (
                <select name="cliente_id" value={ventaEditada.cliente_id || ''} onChange={onEditChange}>
                  <option value="">Seleccionar cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
                  ))}
                </select>
              ) : (
                `${cliente.nombre || ''} ${cliente.apellido || ''}`
              )}
            </td>

            <td>
              {enEdicion ? (
                <input type="date" name="fecha" value={ventaEditada.fecha?.slice(0, 10) || ''} onChange={onEditChange} />
              ) : (
                venta.fecha?.slice(0, 10) || '-'
              )}
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

export default TablaVentasTratamientos;

const Table = styled.table`
  width: 100%;
  margin-top: 2rem;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.1);

  th, td {
    padding: 15px 12px;
    text-align: center;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  }

  th {
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    
    &:first-child {
      border-top-left-radius: 16px;
    }
    
    &:last-child {
      border-top-right-radius: 16px;
    }
  }

  tbody tr {
    transition: all 0.3s ease;
    background: white;
    
    &:hover {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }
    
    &:nth-child(even) {
      background: rgba(248, 250, 252, 0.5);
      
      &:hover {
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      }
    }
  }

  td {
    font-size: 0.9rem;
    color: #374151;
    vertical-align: middle;
  }

  input, select {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.85rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    color: #374151;
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
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  select {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    
    th, td {
      padding: 10px 8px;
    }
  }
`;

const Button = styled.button`
  background: ${props => props.$danger 
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 2px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  width: 100px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px ${props => props.$danger 
    ? 'rgba(239, 68, 68, 0.2)' 
    : 'rgba(16, 185, 129, 0.2)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.$danger 
      ? 'rgba(239, 68, 68, 0.3)' 
      : 'rgba(16, 185, 129, 0.3)'};
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 80px;
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;
