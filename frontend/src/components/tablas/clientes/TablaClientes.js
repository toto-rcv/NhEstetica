// TablaClientes.js
import React from 'react';
import styled from 'styled-components';

const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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
}) => {
  if (!clientes || clientes.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>👥</EmptyIcon>
        <EmptyTitle>No hay clientes para mostrar</EmptyTitle>
        <EmptySubtitle>Los clientes aparecerán aquí cuando se agreguen</EmptySubtitle>
      </EmptyState>
    );
  }

  return (
    <TableContainer>
      <TableWrapper>
        <Table>
          <TableHeader>
            <tr>
              <HeaderCell>
                <HeaderContent>
                  <HeaderIcon>📷</HeaderIcon>
                  <HeaderText>Foto</HeaderText>
                </HeaderContent>
              </HeaderCell>
              <HeaderCell>
                <HeaderContent>
                  <HeaderIcon>👤</HeaderIcon>
                  <HeaderText>Nombre</HeaderText>
                </HeaderContent>
              </HeaderCell>
              <HeaderCell>
                <HeaderContent>
                  <HeaderIcon>👤</HeaderIcon>
                  <HeaderText>Apellido</HeaderText>
                </HeaderContent>
              </HeaderCell>
              <HeaderCell>
                <HeaderContent>
                  <HeaderIcon>📧</HeaderIcon>
                  <HeaderText>Email</HeaderText>
                </HeaderContent>
              </HeaderCell>
              <HeaderCell>
                <HeaderContent>
                  <HeaderIcon>📞</HeaderIcon>
                  <HeaderText>Teléfono</HeaderText>
                </HeaderContent>
              </HeaderCell>
              <HeaderCell>
                <HeaderContent>
                  <HeaderIcon>🏠</HeaderIcon>
                  <HeaderText>Dirección</HeaderText>
                </HeaderContent>
              </HeaderCell>
              <HeaderCell>
                <HeaderContent>
                  <HeaderIcon>🌍</HeaderIcon>
                  <HeaderText>Nacionalidad</HeaderText>
                </HeaderContent>
              </HeaderCell>
              <HeaderCell>
                <HeaderContent>
                  <HeaderIcon>📅</HeaderIcon>
                  <HeaderText>Desde</HeaderText>
                </HeaderContent>
              </HeaderCell>
              <HeaderCell>
                <HeaderContent>
                  <HeaderIcon>⚙️</HeaderIcon>
                  <HeaderText>Acciones</HeaderText>
                </HeaderContent>
              </HeaderCell>
            </tr>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente, index) => {
              const enEdicion = cliente.id === editandoId;
              return (
                <TableRow 
                  key={cliente.id}
                  onClick={() => !enEdicion && onRowClick?.(cliente)}
                  $clickable={!enEdicion}
                  $editing={enEdicion}
                  $index={index}
                >
                  <TableCell>
                    <ImageContainer>
                      {enEdicion ? (
                        <EditImageContainer>
                          <ProfileImage
                            src={
                              clienteEditado?.imagen instanceof File
                                ? URL.createObjectURL(clienteEditado.imagen)
                                : clienteEditado?.imagen || cliente.imagen || '/default-avatar.png'
                            }
                            alt="Cliente"
                          />
                          <EditImageButton
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById(`edit-img-${cliente.id}`).click();
                            }}
                          >
                            📷 Cambiar
                          </EditImageButton>
                          <HiddenFileInput
                            id={`edit-img-${cliente.id}`}
                            type="file"
                            accept="image/*"
                            onChange={onEditImageChange}
                          />
                        </EditImageContainer>
                      ) : cliente.imagen ? (
                        <ProfileImage src={cliente.imagen} alt="Cliente" />
                      ) : (
                        <DefaultAvatar>
                          <AvatarIcon>👤</AvatarIcon>
                        </DefaultAvatar>
                      )}
                    </ImageContainer>
                  </TableCell>
                  
                  <TableCell>
                    {enEdicion ? (
                      <EditInput
                        name="nombre"
                        value={clienteEditado?.nombre || ''}
                        onChange={onEditChange}
                        placeholder="Nombre"
                      />
                    ) : (
                      <CellContent>{cliente.nombre}</CellContent>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {enEdicion ? (
                      <EditInput
                        name="apellido"
                        value={clienteEditado?.apellido || ''}
                        onChange={onEditChange}
                        placeholder="Apellido"
                      />
                    ) : (
                      <CellContent>{cliente.apellido}</CellContent>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {enEdicion ? (
                      <EditInput
                        name="email"
                        type="email"
                        value={clienteEditado?.email || ''}
                        onChange={onEditChange}
                        placeholder="email@ejemplo.com"
                      />
                    ) : (
                      <EmailLink href={`mailto:${cliente.email}`}>
                        {cliente.email}
                      </EmailLink>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {enEdicion ? (
                      <EditInput
                        name="telefono"
                        type="tel"
                        value={clienteEditado?.telefono || ''}
                        onChange={onEditChange}
                        placeholder="Teléfono"
                      />
                    ) : (
                      <PhoneLink href={`tel:${cliente.telefono}`}>
                        {cliente.telefono}
                      </PhoneLink>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {enEdicion ? (
                      <EditInput
                        name="direccion"
                        value={clienteEditado?.direccion || ''}
                        onChange={onEditChange}
                        placeholder="Dirección"
                      />
                    ) : (
                      <CellContent>{cliente.direccion}</CellContent>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {enEdicion ? (
                      <EditSelect
                        name="nacionalidad"
                        value={clienteEditado?.nacionalidad || ''}
                        onChange={onEditChange}
                      >
                        <option value="">Seleccionar</option>
                        <option value="Argentina">🇦🇷 Argentina</option>
                        <option value="Paraguay">🇵🇾 Paraguay</option>
                      </EditSelect>
                    ) : (
                      <NationalityBadge nationality={cliente.nacionalidad}>
                        {cliente.nacionalidad === 'Argentina' && '🇦🇷'}
                        {cliente.nacionalidad === 'Paraguay' && '🇵🇾'}
                        {cliente.nacionalidad || 'Sin especificar'}
                      </NationalityBadge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {enEdicion ? (
                      <EditInput
                        name="antiguedad"
                        type="date"
                        value={clienteEditado?.antiguedad?.slice(0, 10) || ''}
                        onChange={onEditChange}
                      />
                    ) : (
                      <DateBadge>
                        {formatDate(cliente.antiguedad)}
                      </DateBadge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <ActionsContainer>
                      {enEdicion ? (
                        <>
                          <ActionButton 
                            $primary
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onEditSave(); 
                            }}
                            title="Guardar cambios"
                          >
                            ✅ Guardar
                          </ActionButton>
                          <ActionButton 
                            $secondary
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onEditCancel(); 
                            }}
                            title="Cancelar edición"
                          >
                            ❌ Cancelar
                          </ActionButton>
                        </>
                      ) : (
                        <>
                          <ActionButton 
                            $edit
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onEditStart(cliente); 
                            }}
                            title="Editar cliente"
                          >
                            ✏️ Editar
                          </ActionButton>
                          <ActionButton 
                            $danger
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onDelete(cliente.id); 
                            }}
                            title="Eliminar cliente"
                          >
                            🗑️ Eliminar
                          </ActionButton>
                        </>
                      )}
                    </ActionsContainer>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableWrapper>
    </TableContainer>
  );
};

export default TablaClientes;

// Estilos modernos y profesionales
const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const HeaderCell = styled.th`
  padding: 1.5rem 1rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.85rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  
  &:first-child {
    padding-left: 1.5rem;
  }
  
  &:last-child {
    padding-right: 1.5rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderIcon = styled.span`
  font-size: 1rem;
  opacity: 0.8;
`;

const HeaderText = styled.span`
  font-size: 0.85rem;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  ${props => props.$editing && `
    background: #f8fafc;
    border-left: 4px solid #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
  `}
  
  &:hover {
    background: ${props => props.$editing ? '#f8fafc' : '#f7fafc'};
    transform: ${props => props.$clickable ? 'translateY(-1px)' : 'none'};
    box-shadow: ${props => props.$clickable ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem 1rem;
  vertical-align: middle;
  
  &:first-child {
    padding-left: 1.5rem;
  }
  
  &:last-child {
    padding-right: 1.5rem;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: scale(1.05);
  }
`;

const DefaultAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #e2e8f0;
`;

const AvatarIcon = styled.span`
  font-size: 1.5rem;
  color: #a0aec0;
`;

const EditImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const EditImageButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CellContent = styled.div`
  font-weight: 500;
  color: #2d3748;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmailLink = styled.a`
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  transition: all 0.3s ease;
  
  &:hover {
    color: #5a67d8;
    text-decoration: underline;
  }
`;

const PhoneLink = styled.a`
  color: #38a169;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: #2f855a;
    text-decoration: underline;
  }
`;

const NationalityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => {
    switch(props.nationality) {
      case 'Argentina': return '#e6f7ff';
      case 'Paraguay': return '#f0f9ff';
      default: return '#f7fafc';
    }
  }};
  color: ${props => {
    switch(props.nationality) {
      case 'Argentina': return '#0369a1';
      case 'Paraguay': return '#0c4a6e';
      default: return '#718096';
    }
  }};
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid ${props => {
    switch(props.nationality) {
      case 'Argentina': return '#bae6fd';
      case 'Paraguay': return '#93c5fd';
      default: return '#e2e8f0';
    }
  }};
`;

const DateBadge = styled.div`
  background: #f0fff4;
  color: #2f855a;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #9ae6b4;
  text-align: center;
  min-width: 90px;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  ${props => props.$primary && `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-color: #10b981;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  `}
  
  ${props => props.$secondary && `
    background: #f7fafc;
    color: #4a5568;
    border-color: #e2e8f0;
    
    &:hover {
      background: #edf2f7;
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.$edit && `
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border-color: #f59e0b;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
  `}
  
  ${props => props.$danger && `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border-color: #ef4444;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
  `}
`;

const EditInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const EditSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const EmptySubtitle = styled.p`
  color: #718096;
  text-align: center;
  max-width: 400px;
`;
