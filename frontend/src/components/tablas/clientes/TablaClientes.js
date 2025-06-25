// TablaClientes.js
import React from 'react';
import styled from 'styled-components';

const TablaClientes = ({
  clientes,
  onDelete,
  onEditStart,
  onEditChange,
  onEditCancel,
  onEditSave,
  editandoId,
  clienteEditado
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
        <th>Antigüedad</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {clientes.map((cliente) => {
        const enEdicion = cliente.id === editandoId;
        return (
          <tr key={cliente.id}>
            <td>
              {cliente.imagen ? (
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
                <input
                  name="antiguedad"
                  type="number"
                  value={clienteEditado?.antiguedad || 0}
                  onChange={onEditChange}
                />
              ) : (
                cliente.antiguedad
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
                  <Button onClick={() => onEditStart(cliente)}>Editar</Button>
                  <Button danger onClick={() => onDelete(cliente.id)}>Eliminar</Button>
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
  width: 50px;
  height: 50px;
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
