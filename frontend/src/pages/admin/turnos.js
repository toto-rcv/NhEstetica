import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import { turnosService } from '../../services/turnosService';
import { tratamientosService } from '../../services/tratamientosService';

const TurnosAdmin = () => {
  const [turnos, setTurnos] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filtros
  const [filtros, setFiltros] = useState({
    fecha: '',
    cliente: '',
    tratamiento: '',
    estado: ''
  });

  // Estados para modal de edición

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadTurnos();
  }, [filtros]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [turnosData, tratamientosData] = await Promise.all([
        turnosService.getTurnos(),
        tratamientosService.getTratamientos()
      ]);
      
      setTurnos(turnosData);
      setTratamientos(tratamientosData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTurnos = async () => {
    try {
      const turnosData = await turnosService.getTurnos(filtros);
      setTurnos(turnosData);
      setCurrentPage(1);
    } catch (err) {
      setError('Error al cargar turnos');
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFiltros({
      fecha: '',
      cliente: '',
      tratamiento: '',
      estado: ''
    });
  };

  const handleDeleteTurno = async (turnoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este turno?')) {
      try {
        await turnosService.deleteTurno(turnoId);
        setSuccess('Turno eliminado exitosamente');
        loadTurnos();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Error al eliminar turno');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleUpdateEstado = async (turnoId, nuevoEstado) => {
    try {
      await turnosService.updateTurno(turnoId, { estado: nuevoEstado });
      setSuccess('Estado actualizado exitosamente');
      loadTurnos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar estado');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmado':
        return '#28a745';
      case 'pendiente':
        return '#ffc107';
      case 'cancelado':
        return '#dc3545';
      case 'completado':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      case 'completado':
        return 'Completado';
      default:
        return estado;
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTurnos = turnos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(turnos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <TablasLayout title="Administración de Turnos">
        <LoadingMessage>Cargando turnos...</LoadingMessage>
      </TablasLayout>
    );
  }

  return (
    <TablasLayout title="Administración de Turnos">
      <Statistics>
        <StatItem>
          <StatNumber>{turnos.length}</StatNumber>
          <StatLabel>Total Turnos</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{turnos.filter(t => t.estado === 'pendiente').length}</StatNumber>
          <StatLabel>Pendientes</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{turnos.filter(t => t.estado === 'confirmado').length}</StatNumber>
          <StatLabel>Confirmados</StatLabel>
        </StatItem>
      </Statistics>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <FiltersSection>
        <FiltersTitle>Filtros</FiltersTitle>
        <FiltersGrid>
          <FilterField>
            <Label>Fecha</Label>
            <Input
              type="date"
              name="fecha"
              value={filtros.fecha}
              onChange={handleFilterChange}
            />
          </FilterField>
          <FilterField>
            <Label>Cliente</Label>
            <Input
              type="text"
              name="cliente"
              value={filtros.cliente}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre..."
            />
          </FilterField>
          <FilterField>
            <Label>Tratamiento</Label>
            <Select
              name="tratamiento"
              value={filtros.tratamiento}
              onChange={handleFilterChange}
            >
              <option value="">Todos los tratamientos</option>
              {tratamientos.map(tratamiento => (
                <option key={tratamiento.id} value={tratamiento.nombre}>
                  {tratamiento.nombre}
                </option>
              ))}
            </Select>
          </FilterField>
          <FilterField>
            <Label>Estado</Label>
            <Select
              name="estado"
              value={filtros.estado}
              onChange={handleFilterChange}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
              <option value="completado">Completado</option>
            </Select>
          </FilterField>
          <FilterField>
            <ClearButton onClick={clearFilters}>
              Limpiar Filtros
            </ClearButton>
          </FilterField>
        </FiltersGrid>
      </FiltersSection>

      <TableSection>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Tratamiento</th>
                <th>Estado</th>
                <th>Contacto</th>
                <th>Acciones</th>
              </tr>
            </TableHeader>
            <TableBody>
              {currentTurnos.map(turno => (
                <TableRow key={turno.id}>
                  <TableCell>
                    {turnosService.formatDate(turno.fecha)}
                  </TableCell>
                  <TableCell>
                    {turnosService.formatTime(turno.hora)}
                  </TableCell>
                  <TableCell>
                    <ClienteInfo>
                      <ClienteNombre>
                        {turno.nombre_cliente} {turno.apellido_cliente}
                      </ClienteNombre>
                      <ClienteDni>DNI: {turno.dni_cliente}</ClienteDni>
                    </ClienteInfo>
                  </TableCell>
                  <TableCell>
                    {turno.tratamiento_nombre}
                  </TableCell>
                  <TableCell>
                    <EstadoBadge color={getEstadoColor(turno.estado)}>
                      {getEstadoText(turno.estado)}
                    </EstadoBadge>
                  </TableCell>
                  <TableCell>
                    <ContactoInfo>
                      <ContactoItem>{turno.email_cliente}</ContactoItem>
                      <ContactoItem>{turno.telefono_cliente}</ContactoItem>
                    </ContactoInfo>
                  </TableCell>
                  <TableCell>
                    <ActionsContainer>          
                      
                      {turno.estado === 'pendiente' && (
                        <ActionButton 
                          onClick={() => handleUpdateEstado(turno.id, 'confirmado')}
                          color="#28a745"
                          title="Confirmar"
                        >
                          ✅
                        </ActionButton>
                      )}
                      
                      {turno.estado === 'confirmado' && (
                        <ActionButton 
                          onClick={() => handleUpdateEstado(turno.id, 'completado')}
                          color="#007bff"
                          title="Completar"
                        >
                          ✔️
                        </ActionButton>
                      )}
                      
                      <ActionButton 
                        onClick={() => handleDeleteTurno(turno.id)}
                        color="#dc3545"
                        title="Eliminar"
                      >
                        🗑️
                      </ActionButton>
                    </ActionsContainer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {turnos.length === 0 && (
            <EmptyState>
              <EmptyIcon>📅</EmptyIcon>
              <EmptyText>No hay turnos que coincidan con los filtros</EmptyText>
            </EmptyState>
          )}
        </TableContainer>

        {totalPages > 1 && (
          <PaginationContainer>
            <PaginationButton
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </PaginationButton>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationButton
                key={i + 1}
                onClick={() => paginate(i + 1)}
                active={currentPage === i + 1}
              >
                {i + 1}
              </PaginationButton>
            ))}
            
            <PaginationButton
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </PaginationButton>
          </PaginationContainer>
        )}
      </TableSection>
    </TablasLayout>
  );
};

export default TurnosAdmin;

// Styled Components
const Statistics = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const StatItem = styled.div`
  text-align: center;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 80px;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color-dark);
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
`;

const FiltersSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FiltersTitle = styled.h3`
  margin: 0 0 1rem;
  color: var(--terciary-color);
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--terciary-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-family: var(--text-font);
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #5a6268;
  }
`;

const TableSection = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--terciary-color);
    border-bottom: 2px solid #dee2e6;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }
  
  &:hover {
    background: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  vertical-align: top;
`;

const ClienteInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClienteNombre = styled.div`
  font-weight: 600;
  color: var(--terciary-color);
`;

const ClienteDni = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const EstadoBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background: ${props => props.color};
`;

const ContactoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ContactoItem = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: ${props => props.color};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.div`
  font-size: 1.2rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--terciary-color)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? 'var(--primary-color)' : '#f8f9fa'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`; 