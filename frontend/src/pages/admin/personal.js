import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable, { EditTableButton } from '../../components/tablas/EditableTable';
import { personalService } from '../../services/personalService';
import AddPersonalModal from '../../components/tablas/AddPersonalModal';

const Personal = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Cargar datos del personal al montar el componente
  useEffect(() => {
    loadPersonal();
  }, []);

  const loadPersonal = async () => {
    try {
      setLoading(true);
      const personalData = await personalService.getPersonal();
      setData(personalData);
      setError(null);
      setValidationErrors([]);
    } catch (err) {
      console.error('Error al cargar personal:', err);
      setError('Error al cargar los datos del personal');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: 'dni',
      header: 'DNI',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'nombreCompleto',
      header: 'Nombre Completo',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
    },
    {
      accessorKey: 'cargo',
      header: 'Cargo',
      hideOnMobile: true,
    },
    {
      accessorKey: 'especialidad',
      header: 'Especialidad',
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktopSmall: true,
    },
    {
      accessorKey: 'fechaContratacion',
      header: 'Fecha de Contratación',
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktopSmall: true,
    }
  ];

  const detailsColumns = [
    {
      accessorKey: 'dni',
      header: 'DNI',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
    },
    {
      accessorKey: 'apellido',
      header: 'Apellido',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
    },
    {
      accessorKey: 'cargo',
      header: 'Cargo',
      hideOnMobile: true,
    },
    {
      accessorKey: 'especialidad',
      header: 'Especialidad',
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktopSmall: true,
    },
    {
      accessorKey: 'fechaContratacion',
      header: 'Fecha de Contratación',
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktopSmall: true,
    }
  ];

  const handleRowClick = (rowIndex) => {
    console.log('Row clicked:', rowIndex);
    if (data[rowIndex]) {
      const person = data[rowIndex];
      setSelectedPerson({
        id: person.id,
        dni: person.dni || '',
        nombre: person.nombre || '',
        apellido: person.apellido || '',
        direccion: person.direccion || '',
        telefono: person.telefono || '',
        email: person.email || '',
        cargo: person.cargo || '',
        especialidad: person.especialidad || '',
        fechaContratacion: person.fechaContratacion || '',
        comisionVenta: person.comision_venta ? `${person.comision_venta}%` : '0%',
        comisionFija: person.comision_fija ? `$${person.comision_fija}` : '$0',
        sueldoMensual: person.sueldo_mensual ? `$${person.sueldo_mensual}` : '$0'
      });
    }
  };

  const handleDataChange = async (newData) => {
    try {
      setIsSaving(true);
      
      // Identificar qué filas son nuevas (sin ID) y cuáles son existentes
      const newRows = newData.filter(row => !row.id);
      const existingRows = newData.filter(row => row.id);
      
      // Solo procesar filas que tengan datos válidos
      const validNewRows = newRows.filter(row => 
        row.dni && row.dni.trim() !== '' && 
        row.nombreCompleto && row.nombreCompleto.trim() !== ''
      );
      
      // Crear nuevos empleados solo si tienen datos válidos
      for (const newRow of validNewRows) {
        // Procesar la fecha de contratación
        let fechaContratacion = null;
        if (newRow.fechaContratacion) {
          // Si la fecha está en formato DD/MM/YYYY, convertirla a YYYY-MM-DD
          if (newRow.fechaContratacion.includes('/')) {
            const [day, month, year] = newRow.fechaContratacion.split('/');
            fechaContratacion = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          } else {
            fechaContratacion = newRow.fechaContratacion;
          }
        }

        const empleadoData = {
          dni: newRow.dni,
          nombre: newRow.nombreCompleto ? newRow.nombreCompleto.split(' ')[0] : '',
          apellido: newRow.nombreCompleto ? newRow.nombreCompleto.split(' ').slice(1).join(' ') : '',
          direccion: newRow.direccion || '',
          telefono: newRow.telefono || '',
          email: newRow.email || '',
          cargo: newRow.cargo || '',
          especialidad: newRow.especialidad || '',
          fecha_contratacion: fechaContratacion,
          comision_venta: 0,
          comision_fija: 0,
          sueldo_mensual: 0
        };

        await personalService.createPersonal(empleadoData);
      }

      // Solo recargar datos si se creó algo nuevo
      if (validNewRows.length > 0) {
        await loadPersonal();
      } else {
        // Si no se guardó nada nuevo, solo actualizar el estado local
        setData(newData);
      }
      
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      
      // Separar errores de validación de otros errores
      if (err.message.includes('Errores de validación:')) {
        const errorLines = err.message.split('\n');
        const validationErrors = errorLines.slice(1); // Excluir la primera línea que dice "Errores de validación:"
        setValidationErrors(validationErrors);
        setError(null);
      } else {
        setError(err.message || 'Error al guardar los cambios');
        setValidationErrors([]);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    try {
      const rowToDelete = data[rowIndex];
      if (rowToDelete && rowToDelete.id) {
        await personalService.deletePersonal(rowToDelete.id);
        await loadPersonal();
      } else {
        // Si es una fila nueva sin ID, solo eliminarla del estado local
        const newData = data.filter((_, index) => index !== rowIndex);
        setData(newData);
      }
    } catch (err) {
      console.error('Error al eliminar empleado:', err);
      setError(err.message || 'Error al eliminar el empleado');
    }
  };

  // Función para actualizar un empleado existente
  const handleUpdateEmployee = async (employeeId, updatedData) => {
    try {
      // Procesar la fecha de contratación
      let fechaContratacion = null;
      if (updatedData.fechaContratacion) {
        if (updatedData.fechaContratacion.includes('/')) {
          const [day, month, year] = updatedData.fechaContratacion.split('/');
          fechaContratacion = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
          fechaContratacion = updatedData.fechaContratacion;
        }
      }

      const empleadoData = {
        dni: updatedData.dni,
        nombre: updatedData.nombreCompleto ? updatedData.nombreCompleto.split(' ')[0] : '',
        apellido: updatedData.nombreCompleto ? updatedData.nombreCompleto.split(' ').slice(1).join(' ') : '',
        direccion: updatedData.direccion || '',
        telefono: updatedData.telefono || '',
        email: updatedData.email || '',
        cargo: updatedData.cargo || '',
        especialidad: updatedData.especialidad || '',
        fecha_contratacion: fechaContratacion,
        comision_venta: updatedData.comision_venta || 0,
        comision_fija: updatedData.comision_fija || 0,
        sueldo_mensual: updatedData.sueldo_mensual || 0
      };

      await personalService.updatePersonal(employeeId, empleadoData);
      await loadPersonal();
    } catch (err) {
      console.error('Error al actualizar empleado:', err);
      setError(err.message || 'Error al actualizar el empleado');
    }
  };

  const getInitials = (nombreCompleto) => {
    if (!nombreCompleto) return 'NA';
    return nombreCompleto
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCommissionForDate = () => {
    return { comisionDia: '$0', comisionMes: '$0' };
  };

  const getCommissionHistory = () => {
    return [];
  };

  const clearDate = () => {
    setSelectedDate('');
  };

  if (loading) {
    return (
      <TablasLayout title="Gestión de Personal">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Cargando datos del personal...
        </div>
      </TablasLayout>
    );
  }

  if (error) {
    return (
      <TablasLayout title="Gestión de Personal">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Error: {error}
          <br />
          <button onClick={loadPersonal} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Reintentar
          </button>
        </div>
      </TablasLayout>
    );
  }

  return (
    <TablasLayout title="Gestión de Personal">
      <AddPersonalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={async () => { setShowAddModal(false); await loadPersonal(); }}
      />
      {isSaving && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          Guardando cambios...
        </div>
      )}
      
      <EditableTable
        data={data}
        columns={columns}
        onDataChange={handleDataChange}
        title="Base de Datos del Personal"
        addRowText={null}
        onRowClick={handleRowClick}
        onDeleteRow={handleDeleteRow}
        onUpdateRow={handleUpdateEmployee}
        customButtons={
          <EditTableButton style={{ background: '#28a745', color: 'white' }} onClick={() => setShowAddModal(true)}>
            Agregar Empleado
          </EditTableButton>
        }
      />
      
      {/* Mostrar errores de validación */}
      {validationErrors.length > 0 && (
        <ValidationErrorContainer>
          <ValidationErrorHeader>
            <h4>❌ Errores de Validación</h4>
            <CloseButton onClick={() => setValidationErrors([])}>✕</CloseButton>
          </ValidationErrorHeader>
          <ValidationErrorList>
            {validationErrors.map((error, index) => (
              <ValidationErrorItem key={index}>
                • {error}
              </ValidationErrorItem>
            ))}
          </ValidationErrorList>
        </ValidationErrorContainer>
      )}
      
      {selectedPerson ? (
        <>
          <DetailsContainer>
            <SelectedPersonInfo>
              <strong>Empleado Seleccionado:</strong> {selectedPerson.nombre} {selectedPerson.apellido}
            </SelectedPersonInfo>
            <DetailsHeader>
              <DetailsInfo>
                <h3>Detalles del Empleado</h3>
                <EditableTable
                  data={[selectedPerson]}
                  columns={detailsColumns}
                  onDataChange={() => {}}
                  title="Información Personal"
                  addRowText=""
                />
              </DetailsInfo>
            </DetailsHeader>
            <PhotoSection>
              <ProfilePhoto>
                {getInitials(selectedPerson.nombre + ' ' + selectedPerson.apellido)}
              </ProfilePhoto>
              <CommissionInfo>
                <CommissionItem>
                  <CommissionLabel>% de Comisión por Venta</CommissionLabel>
                  <CommissionValue>{selectedPerson.comisionVenta}</CommissionValue>
                </CommissionItem>
                <CommissionItem>
                  <CommissionLabel>Comisión Fija</CommissionLabel>
                  <CommissionValue>{selectedPerson.comisionFija}</CommissionValue>
                </CommissionItem>
                <CommissionItem>
                  <CommissionLabel>Sueldo Mensual</CommissionLabel>
                  <CommissionValue>{selectedPerson.sueldoMensual}</CommissionValue>
                </CommissionItem>
              </CommissionInfo>
            </PhotoSection>
          </DetailsContainer>

          <CommissionTableContainer>
            <CommissionTableHeader>
              <h3>Comisiones del Empleado</h3>
            </CommissionTableHeader>
            <CommissionTableContent>
              <CommissionRow>
                <CommissionLabelLarge>Fecha:</CommissionLabelLarge>
                <DateInput
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </CommissionRow>
              <CommissionRow>
                <CommissionLabelLarge>Comisión del Día:</CommissionLabelLarge>
                <CommissionValueLarge>{getCommissionForDate().comisionDia}</CommissionValueLarge>
              </CommissionRow>
              <CommissionRow>
                <CommissionLabelLarge>Comisión del Mes:</CommissionLabelLarge>
                <CommissionValueLarge>{getCommissionForDate().comisionMes}</CommissionValueLarge>
              </CommissionRow>
            </CommissionTableContent>
          </CommissionTableContainer>

          <HistoryContainer>
            <HistoryHeader>
              <h3>
                Historial de Comisiones 
                {selectedDate ? ` - ${selectedDate}` : ' - Últimas 10 Comisiones'}
              </h3>
              {selectedDate && (
                <ClearDateButton onClick={clearDate}>
                  Limpiar Fecha
                </ClearDateButton>
              )}
            </HistoryHeader>
            <HistoryContent>
              {getCommissionHistory().length > 0 ? (
                getCommissionHistory().map((item, index) => (
                  <HistoryItem key={index}>
                    <div>
                      <HistoryDate>{item.fecha} - {item.hora}</HistoryDate>
                      <HistoryService>{item.servicio}</HistoryService>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <HistoryAmount>{item.comision}</HistoryAmount>
                      <HistoryStatus $status={item.estado}>{item.estado}</HistoryStatus>
                    </div>
                  </HistoryItem>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  {selectedDate ? 'No hay comisiones registradas para esta fecha' : 'No hay comisiones registradas'}
                </p>
              )}
            </HistoryContent>
          </HistoryContainer>
        </>
      ) : (
        <DetailsContainer>
          <p style={{ textAlign: 'center', color: '#666' }}>
            Haz clic en una fila de la tabla para ver los detalles del empleado
          </p>
        </DetailsContainer>
      )}
    </TablasLayout>
  );
};

export default Personal; 


const DetailsContainer = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: visible;
  padding: 1rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding: 0.5rem;
  }
  
  @media (max-width: 600px) {
    margin-top: 1rem;
    padding: 0.3rem;
  }
`;

const DetailsHeader = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  overflow: visible;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
  
  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;

const DetailsInfo = styled.div`
  overflow: visible;
`;

const PhotoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  background: white;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 600px) {
    padding: 1rem;
    gap: 1rem;
    flex-direction: column;
    align-items: center;
  }
`;

const ProfilePhoto = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 2.5rem;
  }
  
  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
    font-size: 2rem;
  }
`;

const CommissionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 250px;
  
  @media (max-width: 768px) {
    min-width: 200px;
    gap: 0.8rem;
  }
  
  @media (max-width: 600px) {
    min-width: auto;
    width: 100%;
    max-width: 300px;
    gap: 0.6rem;
  }
`;

const CommissionItem = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #e9ecef;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 600px) {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
`;

const CommissionLabel = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.25rem;
`;

const CommissionValue = styled.div`
  color: #007bff;
  font-size: 1.1rem;
  font-weight: bold;
`;

const SelectedPersonInfo = styled.div`
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #2196f3;
`;

const CommissionTableContainer = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CommissionTableHeader = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const CommissionTableContent = styled.div`
  padding: 1.5rem;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  width: 150px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const CommissionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CommissionLabelLarge = styled.div`
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
`;

const CommissionValueLarge = styled.div`
  color: #28a745;
  font-size: 1.2rem;
  font-weight: bold;
`;

const HistoryContainer = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const HistoryHeader = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClearDateButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #5a6268;
  }
`;

const HistoryContent = styled.div`
  padding: 1.5rem;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const HistoryDate = styled.div`
  font-weight: 500;
  color: #495057;
`;

const HistoryAmount = styled.div`
  color: #28a745;
  font-weight: 600;
`;

const HistoryService = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const HistoryStatus = styled.div`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'Pagado':
        return '#d4edda';
      case 'Pendiente':
        return '#fff3cd';
      case 'Cancelado':
        return '#f8d7da';
      default:
        return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'Pagado':
        return '#155724';
      case 'Pendiente':
        return '#856404';
      case 'Cancelado':
        return '#721c24';
      default:
        return '#495057';
    }
  }};
`;

const ValidationErrorContainer = styled.div`
  margin-top: 1rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ValidationErrorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  h4 {
    margin: 0;
    color: #856404;
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  background: #856404;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #6c5ce7;
  }
`;

const ValidationErrorList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ValidationErrorItem = styled.li`
  color: #856404;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;