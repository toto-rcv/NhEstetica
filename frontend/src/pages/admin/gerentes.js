import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable, { EditTableButton } from '../../components/tablas/EditableTable';
import { gerentesService } from '../../services/gerentesService';
import AddGerenteModal from '../../components/tablas/AddGerenteModal';

const Gerentes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Cargar datos de gerentes al montar el componente
  useEffect(() => {
    loadGerentes();
  }, []);

  const loadGerentes = async () => {
    try {
      setLoading(true);
      const gerentesData = await gerentesService.getGerentes();
      setData(gerentesData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar gerentes:', err);
      setError('Error al cargar los datos de los gerentes');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 60,
    },
    {
      accessorKey: 'username',
      header: 'Email',
    },
    {
      accessorKey: 'permisos',
      header: 'Permisos',
      cell: ({ row }) => (
        <PermisosCell>
          {row.original.permisos === 1 ? 'Administrador' : 'Usuario'}
        </PermisosCell>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Creación',
      cell: ({ row }) => (
        <DateCell>
          {new Date(row.original.created_at).toLocaleDateString('es-ES')}
        </DateCell>
      ),
      hideOnMobile: true,
    }
  ];

  const handleDataChange = async (newData) => {
    try {
      setData(newData);
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Error al actualizar los datos');
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    try {
      const gerenteToDelete = data[rowIndex];
      await gerentesService.deleteGerente(gerenteToDelete.id);
      
      const newData = data.filter((_, index) => index !== rowIndex);
      setData(newData);
    } catch (error) {
      console.error('Error deleting gerente:', error);
      setError('Error al eliminar el gerente');
    }
  };

  const handleUpdateGerente = async (gerenteId, updatedData) => {
    try {
      await gerentesService.updateGerente(gerenteId, updatedData);
      await loadGerentes(); // Recargar datos
    } catch (error) {
      console.error('Error updating gerente:', error);
      setError('Error al actualizar el gerente');
    }
  };

  const handleAddGerente = async (gerenteData) => {
    try {
      await gerentesService.createGerente(gerenteData);
      await loadGerentes(); // Recargar datos
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating gerente:', error);
      setError('Error al crear el gerente');
    }
  };

  if (loading) {
    return (
      <TablasLayout>
        <LoadingContainer>
          <LoadingText>Cargando gerentes...</LoadingText>
        </LoadingContainer>
      </TablasLayout>
    );
  }

  if (error) {
    return (
      <TablasLayout>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={loadGerentes}>Reintentar</RetryButton>
        </ErrorContainer>
      </TablasLayout>
    );
  }

  return (
    <TablasLayout>
      <Container>
        <Header>
          <Title>Gestión de Gerentes</Title>
          <AddButton onClick={() => setShowAddModal(true)}>
            + Agregar Gerente
          </AddButton>
        </Header>

        <TableContainer>
          <EditableTable
            data={data}
            columns={columns}
            onDataChange={handleDataChange}
            onDeleteRow={handleDeleteRow}
            onUpdateRow={handleUpdateGerente}
            tableTitle="Gerentes"
            showAddButton={false}
            showSearch={true}
            showPagination={true}
            itemsPerPage={10}
          />
        </TableContainer>

        {showAddModal && (
          <AddGerenteModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddGerente}
          />
        )}
      </Container>
    </TablasLayout>
  );
};

export default Gerentes;

// === STYLES ===

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: var(--background-dark);
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

const AddButton = styled.button`
  background: var(--terciary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: var(--primary-color-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(224, 117, 162, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const LoadingText = styled.p`
  color: var(--background-dark);
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  gap: 1rem;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 1.2rem;
  text-align: center;
`;

const RetryButton = styled.button`
  background: var(--terciary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--primary-color-dark);
  }
`;

const PermisosCell = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.children === 'Administrador' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(155, 155, 155, 0.1)'};
  color: ${props => props.children === 'Administrador' ? '#3498db' : '#9b9b9b'};
`;

const DateCell = styled.span`
  color: var(--text-color);
  font-size: 0.875rem;
`; 