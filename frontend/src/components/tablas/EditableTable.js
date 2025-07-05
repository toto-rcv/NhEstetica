import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @media (max-width: 600px) {
    .hide-mobile {
      display: none !important;
    }
  }
  
  @media (max-width: 768px) {
    .hide-tablet {
      display: none !important;
    }
  }
  
  @media (max-width: 1130px) {
    .hide-desktop-small {
      display: none !important;
    }
  }
`;

const EditableTable = ({ 
  data, 
  columns, 
  onDataChange, 
  title = 'Tabla Editable',
  addRowText = 'Agregar Fila',
  onRowClick = null,
  onDeleteRow = null,
  onUpdateRow = null,
  customButtons = null
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});

  const tableColumns = useMemo(() => [
    ...columns,
    {
      id: 'actions',
      header: 'Acciones',
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div>
          <ActionButton
            $variant="delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRow(row.index);
            }}
          >
            Eliminar
          </ActionButton>
        </div>
      ),
    }
  ], [columns]);

  const tableData = useMemo(() => {
    // Aplicar cambios pendientes a los datos para mostrar en la tabla
    return data.map((row, index) => {
      const rowChanges = pendingChanges[index] || {};
      return { ...row, ...rowChanges };
    });
  }, [data, pendingChanges]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleCellClick = (rowIndex, columnId, value, e) => {
    if (!isEditingMode) return; // Solo permitir edición si está en modo edición
    
    e.stopPropagation();
    setEditingCell({ rowIndex, columnId });
    
    // Usar el valor pendiente si existe, sino el valor original
    const currentValue = pendingChanges[rowIndex] && pendingChanges[rowIndex][columnId] !== undefined
      ? pendingChanges[rowIndex][columnId]
      : value;
    
    setEditValue(currentValue);
  };

  const handleCellChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleCellBlur = () => {
    if (editingCell) {
      // Solo guardamos los cambios en el estado pendiente, no enviamos al backend
      setPendingChanges(prev => ({
        ...prev,
        [editingCell.rowIndex]: {
          ...prev[editingCell.rowIndex],
          [editingCell.columnId]: editValue
        }
      }));
      
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleAddRow = () => {
    const newRow = columns.reduce((acc, column) => {
      if (column.accessorKey && column.accessorKey !== 'actions') {
        // Inicializar valores por defecto según el tipo de columna
        if (column.accessorKey === 'benefits' || column.accessorKey === 'modoUso') {
          acc[column.accessorKey] = [];
        } else if (column.accessorKey === 'isNatural' || column.accessorKey === 'isVegan') {
          acc[column.accessorKey] = false;
        } else {
          acc[column.accessorKey] = '';
        }
      }
      return acc;
    }, {});
    
    onDataChange([...data, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    if (onDeleteRow) {
      // Si se proporciona un manejador personalizado, usarlo
      onDeleteRow(rowIndex);
    } else {
      // Comportamiento por defecto
      const newData = data.filter((_, index) => index !== rowIndex);
      onDataChange(newData);
    }
  };

  const handleRowClick = (rowIndex) => {
    if (onRowClick) {
      onRowClick(rowIndex);
    }
  };

  const applyPendingChanges = () => {
    // Aplicar todos los cambios pendientes al backend
    Object.keys(pendingChanges).forEach(async (rowIndex) => {
      const index = parseInt(rowIndex);
      const rowData = { ...data[index], ...pendingChanges[index] };
      
      if (rowData.id && onUpdateRow) {
        try {
          await onUpdateRow(rowData.id, rowData);
        } catch (error) {
          console.error('Error al actualizar fila:', error);
        }
      }
    });
    
    // Limpiar cambios pendientes
    setPendingChanges({});
  };



  const toggleEditMode = () => {
    if (isEditingMode) {
      // Al salir del modo edición, guardar automáticamente todos los cambios
      const hasChanges = Object.keys(pendingChanges).length > 0;
      if (hasChanges) {
        applyPendingChanges();
      }
      
      setIsEditingMode(false);
      setEditingCell(null);
      setEditValue('');
    } else {
      setIsEditingMode(true);
    }
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <>
      <GlobalStyle />
      <TableContainer>
        <TableHeader>
          <h3>{title}</h3>
          <ButtonGroup>
            {customButtons}
            {addRowText && (
              <AddRowButton onClick={handleAddRow}>
                {addRowText}
              </AddRowButton>
            )}

            <EditTableButton 
              $isEditing={isEditingMode}
              $hasChanges={hasPendingChanges}
              onClick={toggleEditMode}
            >
              {isEditingMode ? (hasPendingChanges ? 'Guardar y Terminar' : 'Terminar Edición') : 'Editar Tabla'}
            </EditTableButton>
          </ButtonGroup>
        </TableHeader>
        
        {hasPendingChanges && isEditingMode && (
          <PendingChangesIndicator>
            <span>📝 Tienes {Object.keys(pendingChanges).length} cambio(s) pendiente(s) - Se guardarán al terminar de editar</span>
          </PendingChangesIndicator>
        )}
        
        <Table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th
                    key={header.id}
                    $sortable={header.column.getCanSort()}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`${header.column.columnDef.hideOnMobile ? 'hide-mobile' : ''} ${header.column.columnDef.hideOnTablet ? 'hide-tablet' : ''} ${header.column.columnDef.hideOnDesktopSmall ? 'hide-desktop-small' : ''}`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted()] ?? null}
                  </Th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <Tr 
                key={row.id}
                $clickable={!!onRowClick}
                $hasChanges={!!pendingChanges[rowIndex]}
                onClick={() => handleRowClick(rowIndex)}
              >
                {row.getVisibleCells().map(cell => {
                  const isEditing = editingCell && 
                    editingCell.rowIndex === rowIndex && 
                    editingCell.columnId === cell.column.id;
                  
                  if (cell.column.id === 'actions') {
                    return (
                      <Td key={cell.id} className={`${cell.column.columnDef.hideOnMobile ? 'hide-mobile' : ''} ${cell.column.columnDef.hideOnTablet ? 'hide-tablet' : ''} ${cell.column.columnDef.hideOnDesktopSmall ? 'hide-desktop-small' : ''}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    );
                  }
                  
                  return (
                    <Td
                      key={cell.id}
                      $editable={isEditingMode}
                      $hasChanges={!!(pendingChanges[rowIndex] && pendingChanges[rowIndex][cell.column.id] !== undefined)}
                      onClick={(e) => handleCellClick(rowIndex, cell.column.id, cell.getValue(), e)}
                      className={`${cell.column.columnDef.hideOnMobile ? 'hide-mobile' : ''} ${cell.column.columnDef.hideOnTablet ? 'hide-tablet' : ''} ${cell.column.columnDef.hideOnDesktopSmall ? 'hide-desktop-small' : ''}`}
                    >
                      {isEditing ? (
                        cell.column.id === 'fechaContratacion' ? (
                          <EditableCell
                            type="date"
                            value={editValue ?? ''}
                            onChange={handleCellChange}
                            onBlur={handleCellBlur}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleCellBlur();
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <EditableCell
                            value={editValue ?? ''}
                            onChange={handleCellChange}
                            onBlur={handleCellBlur}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleCellBlur();
                              }
                            }}
                            autoFocus
                          />
                        )
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EditableTable; 

const TableContainer = styled.div`
  background: var(--background-color);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  user-select: none;
  
  &:hover {
    background: ${props => props.$sortable ? '#e9ecef' : '#f8f9fa'};
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
  cursor: ${props => props.$editable ? 'pointer' : 'default'};
  background-color: ${props => props.$hasChanges ? '#fff3cd' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.$editable ? '#f8f9fa' : 'transparent'};
  }
`;

const Tr = styled.tr`
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: background-color 0.2s ease;
  border-left: ${props => props.$hasChanges ? '4px solid #ffc107' : '4px solid transparent'};
  
  &:hover {
    background-color: ${props => props.$clickable ? '#f8f9fa' : 'transparent'};
  }
`;

const EditableCell = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$variant === 'delete' ? '#dc3545' : '#007bff'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin: 0 2px;
  
  &:hover {
    background: ${props => props.$variant === 'delete' ? '#c82333' : '#0056b3'};
  }
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;

  h3 {
    font-size: 1.5rem;
    margin: 0;
    @media (max-width: 768px) {
      font-size: 1.3rem;
    }
    @media (max-width: 600px) {
      font-size: 1.1rem;
      text-align: left;
    }
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    padding: 0.7rem 0.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  @media (max-width: 768px) {
    gap: 0.7rem;
  }
  @media (max-width: 600px) {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

const AddRowButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 1rem;
  margin-right: 1rem;
  transition: all 0.2s;
  &:hover {
    background: #218838;
  }
  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 13px;
    margin-bottom: 0.8rem;
    margin-right: 0.8rem;
  }
  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 12px;
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
  }
`;

export const EditTableButton = styled.button`
  background: ${props => {
    if (props.$isEditing && props.$hasChanges) return '#007bff';
    if (props.$isEditing) return '#28a745';
    return '#ffc107';
  }};
  color: ${props => props.$isEditing ? 'white' : '#212529'};
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: all 0.2s;
  box-shadow: ${props => props.$hasChanges ? '0 0 10px rgba(0, 123, 255, 0.5)' : 'none'};
  &:hover {
    background: ${props => {
      if (props.$isEditing && props.$hasChanges) return '#0056b3';
      if (props.$isEditing) return '#218838';
      return '#e0a800';
    }};
  }
  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 13px;
    margin-bottom: 0.8rem;
  }
  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 12px;
    margin-bottom: 0.5rem;
  }
`;

const PendingChangesIndicator = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
  color: #495057;
`;