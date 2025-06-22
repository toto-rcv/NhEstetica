import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import styled from 'styled-components';

const TableContainer = styled.div`
  background: white;
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
  
  &:hover {
    background: #218838;
  }
`;

const EditTableButton = styled.button`
  background: ${props => props.$isEditing ? '#dc3545' : '#ffc107'};
  color: ${props => props.$isEditing ? 'white' : '#212529'};
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 1rem;
  
  &:hover {
    background: ${props => props.$isEditing ? '#c82333' : '#e0a800'};
  }
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const EditableTable = ({ 
  data, 
  columns, 
  onDataChange, 
  title = 'Tabla Editable',
  addRowText = 'Agregar Fila',
  onRowClick = null
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
      newData[editingCell.rowIndex] = {
        ...newData[editingCell.rowIndex],
        [editingCell.columnId]: editValue
      };
      onDataChange(newData);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleAddRow = () => {
    const newRow = columns.reduce((acc, column) => {
      if (column.accessorKey && column.accessorKey !== 'actions') {
        acc[column.accessorKey] = '';
      }
      return acc;
    }, {});
    
    onDataChange([...data, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    onDataChange(newData);
  };

  const handleRowClick = (rowIndex) => {
    if (onRowClick) {
      onRowClick(rowIndex);
    }
  };

  const toggleEditMode = () => {
    setIsEditingMode(!isEditingMode);
    // Limpiar cualquier celda que esté siendo editada al cambiar modo
    if (editingCell) {
      setEditingCell(null);
      setEditValue('');
    }
  };

  return (
    <TableContainer>
      <TableHeader>
        <h3>{title}</h3>
        <ButtonGroup>
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
                    <Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  );
                }
                
                return (
                  <Td
                    key={cell.id}
                    $editable={isEditingMode}
                    onClick={(e) => handleCellClick(rowIndex, cell.column.id, cell.getValue(), e)}
                  >
                    {isEditing ? (
                      <EditableCell
                        value={editValue}
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
  );
};

export default EditableTable; 