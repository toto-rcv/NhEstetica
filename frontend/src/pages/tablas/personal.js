import React, { useState } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable from '../../components/tablas/EditableTable';

const DetailsContainer = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 1rem;
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const DetailsInfo = styled.div`
  flex: 1;
  margin-right: 2rem;
`;

const PhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
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
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CommissionInfo = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const CommissionItem = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
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
  background: ${props => props.$status === 'Completado' ? '#d4edda' : '#fff3cd'};
  color: ${props => props.$status === 'Completado' ? '#155724' : '#856404'};
`;

const Personal = () => {
  const [data, setData] = useState([]);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const columns = [
    {
      accessorKey: 'dni',
      header: 'DNI',
    },
    {
      accessorKey: 'nombreCompleto',
      header: 'Nombre Completo',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
    },
    {
      accessorKey: 'cargo',
      header: 'Cargo',
    },
    {
      accessorKey: 'especialidad',
      header: 'Especialidad',
    },
    {
      accessorKey: 'fechaContratacion',
      header: 'Fecha de Contratación',
    }
  ];

  const detailsColumns = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
    },
    {
      accessorKey: 'apellido',
      header: 'Apellido',
    },
    {
      accessorKey: 'direccion',
      header: 'Dirección',
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'capacitacion',
      header: 'Capacitación',
    }
  ];

  const handleRowClick = (rowIndex) => {
    console.log('Row clicked:', rowIndex);
    if (data[rowIndex]) {
      const person = data[rowIndex];
      setSelectedPerson({
        nombre: person.nombreCompleto.split(' ')[0] || '',
        apellido: person.nombreCompleto.split(' ').slice(1).join(' ') || '',
        direccion: person.direccion || '',
        telefono: person.telefono || '',
        email: person.email || '',
        capacitacion: person.capacitacion || '',
        comisionVenta: person.comisionVenta || '0%',
        comisionFija: person.comisionFija || '$0',
        sueldoMensual: person.sueldoMensual || '$0'
      });
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

  console.log('Current selectedPerson:', selectedPerson);

  return (
    <TablasLayout title="Gestión de Personal">
      <EditableTable
        data={data}
        columns={columns}
        onDataChange={setData}
        title="Base de Datos del Personal"
        addRowText="Agregar Empleado"
        onRowClick={handleRowClick}
      />
      
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
            </DetailsHeader>
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