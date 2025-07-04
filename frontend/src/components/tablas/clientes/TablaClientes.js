// TablaClientes.js
import React from 'react';
import styled from 'styled-components';

const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-AR'); // "dd/mm/aaaa"
};


const TablaClientes = ({
  clientes,
  onDelete,
  onEditStart,
  onEditChange,
  onEditCancel,
  onEditSave,
  editandoId,
  clienteEditado,
  onRowClick,
  onEditImageChange
}) => (
  <Table>
    <thead>
      <tr>
        <th>Imagen</th>
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Email</th>
        <th>Teléfono</th>
        <th>Dirección</th>
        <th>Nacionalidad</th>
        <th>Antigüedad</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {clientes.map((cliente) => {
        const enEdicion = cliente.id === editandoId;
        return (
          <tr key={cliente.id}
          onClick={() => !enEdicion && onRowClick?.(cliente)}
          style={{ cursor: !enEdicion ? 'pointer' : 'default' }}>
            <td>
              {enEdicion ? (
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <Img
    src={
      clienteEditado?.imagen instanceof File
        ? URL.createObjectURL(clienteEditado.imagen)
        : clienteEditado?.imagen || cliente.imagen
    }
    alt="Cliente"
    style={{ marginBottom: '0.5rem' }}
  />
  <input
    id={`edit-img-${cliente.id}`}
    type="file"
    accept="image/*"
    style={{ display: 'none' }}
    onChange={onEditImageChange}
  />
  <Button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      document.getElementById(`edit-img-${cliente.id}`).click();
    }}
    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
  >
    Editar imagen
  </Button>
</div>

                </div>
              ) : cliente.imagen ? (
                <Img src={cliente.imagen} alt="Cliente" />
              ) : (
                <Placeholder>📷</Placeholder>
              )}
            </td>
            <td>
              {enEdicion ? (
                <input
                  name="nombre"
                  value={clienteEditado?.nombre || ''}
                  onChange={onEditChange}
                />
              ) : (
                cliente.nombre
              )}
            </td>
            <td>
              {enEdicion ? (
                <input
                  name="apellido"
                  value={clienteEditado?.apellido || ''}
                  onChange={onEditChange}
                />
              ) : (
                cliente.apellido
              )}
            </td>
            <td>
              {enEdicion ? (
                <input
                  name="email"
                  value={clienteEditado?.email || ''}
                  onChange={onEditChange}
                />
              ) : (
                cliente.email
              )}
            </td>
            <td>
              {enEdicion ? (
                <input
                  name="telefono"
                  value={clienteEditado?.telefono || ''}
                  onChange={onEditChange}
                />
              ) : (
                cliente.telefono
              )}
            </td>
            <td>
              {enEdicion ? (
                <input
                  name="direccion"
                  value={clienteEditado?.direccion || ''}
                  onChange={onEditChange}
                />
              ) : (
                cliente.direccion
              )}
            </td>
            <td>
  {enEdicion ? (
    <select
      name="nacionalidad"
      value={clienteEditado?.nacionalidad || ''}
      onChange={onEditChange}
      style={{
        padding: '6px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%',
        fontSize: '0.9rem'
      }}
    >
      <option value="">Selecciona nacionalidad</option>
      <option value="Argentina">Argentina</option>
      <option value="Paraguay">Paraguay</option>
    </select>
  ) : (
    cliente.nacionalidad || '-'
  )}
</td>

            <td>
              {enEdicion ? (
                <input
                  name="antiguedad"
                  type="date"
                  value={clienteEditado?.antiguedad?.slice(0, 10) || ''}
                  onChange={onEditChange}
                />
              ) : (
                formatDate(cliente.antiguedad)
              )}
            </td>
            <td>
              {enEdicion ? (
                <>
                 <Button onClick={(e) => { e.stopPropagation(); onEditSave(); }}>Guardar</Button>
                                   <Button $danger onClick={(e) => { e.stopPropagation(); onEditCancel(); }}>Cancelar</Button>
                </>
              ) : (
                <>
                 <Button onClick={(e) => { e.stopPropagation(); onEditStart(cliente); }}>
                  Editar
                </Button>
                                  <Button $danger onClick={(e) => { e.stopPropagation(); onDelete(cliente.id); }}>
                  Eliminar
                </Button>
                </>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

export default TablaClientes;

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
  
 input {
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

const Img = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
`;

const Placeholder = styled.div`
  width: 50px;
  height: 50px;
  background: #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const Button = styled.button`
  background-color: ${props => props.$danger ? '#e74c3c' : '#3498db'};
  color: white;
  border: none;
  padding: 6px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.8;
  }
`;
