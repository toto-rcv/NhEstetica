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

  const tableData = useMemo(() => data, [data]);

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
    setEditValue(value);
  };

  const handleCellChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const newData = [...data];
      const rowData = newData[editingCell.rowIndex];
      rowData[editingCell.columnId] = editValue;
      if (rowData.id && onUpdateRow) {
        onUpdateRow(rowData.id, rowData);
      } else {
        onDataChange(newData);
      }
      // No salimos del modo edición ni limpiamos editingCell aquí
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

  const toggleEditMode = () => {
    setIsEditingMode(!isEditingMode);
    // Limpiar cualquier celda que esté siendo editada solo al salir de edición
    if (isEditingMode) {
      setEditingCell(null);
      setEditValue('');
    }
  };

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
              onClick={toggleEditMode}
            >
              {isEditingMode ? 'Salir de Edición' : 'Editar Tabla'}
            </EditTableButton>
          </ButtonGroup>
        </TableHeader>
        
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
  
  &:hover {
    background-color: ${props => props.$editable ? '#f8f9fa' : 'transparent'};
  }
`;

const Tr = styled.tr`
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: background-color 0.2s ease;
  
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
  background: ${props => props.$isEditing ? '#dc3545' : '#ffc107'};
  color: ${props => props.$isEditing ? 'white' : '#212529'};
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: all 0.2s;
  &:hover {
    background: ${props => props.$isEditing ? '#c82333' : '#e0a800'};
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