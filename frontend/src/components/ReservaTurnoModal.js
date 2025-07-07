import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { turnosService } from '../services/turnosService';
import { clientesService } from '../services/clientesService';

const ReservaTurnoModal = ({ isOpen, onClose, tratamiento, onSuccess }) => {
  const { user, isLoggedIn } = useAuth();
  const [step, setStep] = useState(1); // 1: Fecha, 2: Horario, 3: Datos personales
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [loadingClienteData, setLoadingClienteData] = useState(false);
  const [error, setError] = useState('');
  
  // Datos del cliente
  const [datosCliente, setDatosCliente] = useState({
    dni_cliente: '',
    nombre_cliente: '',
    apellido_cliente: '',
    email_cliente: '',
    telefono_cliente: '',
    observaciones: ''
  });
  
  const [errorsCliente, setErrorsCliente] = useState({});

  // Función para cargar datos del cliente logueado
  const cargarDatosClienteLogueado = async () => {
    if (!isLoggedIn || !user || user.type !== 'cliente') return;
    
    setLoadingClienteData(true);
    try {
      // Buscar cliente por email en la base de datos
      const clienteData = await clientesService.getClienteByEmail(user.email);
      
      // Auto-completar datos del cliente
      setDatosCliente(prev => ({
        ...prev,
        dni_cliente: clienteData.dni || '',
        nombre_cliente: user.nombre || '',
        apellido_cliente: user.apellido || '',
        email_cliente: user.email || '',
        telefono_cliente: clienteData.telefono || ''
      }));
    } catch (error) {
      console.error('Error al cargar datos del cliente:', error);
      // Usar datos del contexto como fallback
      setDatosCliente(prev => ({
        ...prev,
        nombre_cliente: user.nombre || '',
        apellido_cliente: user.apellido || '',
        email_cliente: user.email || ''
      }));
    } finally {
      setLoadingClienteData(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Generar fechas disponibles
      const fechas = turnosService.generateAvailableDates();
      setFechasDisponibles(fechas);
      
      // Resetear estado
      setStep(1);
      setFechaSeleccionada('');
      setHorarioSeleccionado('');
      setHorariosDisponibles([]);
      setDatosCliente({
        dni_cliente: '',
        nombre_cliente: '',
        apellido_cliente: '',
        email_cliente: '',
        telefono_cliente: '',
        observaciones: ''
      });
      setErrorsCliente({});
      setError('');
      
      // Cargar datos del cliente logueado
      cargarDatosClienteLogueado();
    }
  }, [isOpen, isLoggedIn, user]);

  const handleFechaChange = async (fecha) => {
    setFechaSeleccionada(fecha);
    setHorarioSeleccionado('');
    setLoadingHorarios(true);
    setError('');
    
    try {
      const horarios = await turnosService.getHorariosDisponibles(fecha, tratamiento.id);
      setHorariosDisponibles(horarios);
      
      if (horarios.length === 0) {
        setError('No hay horarios disponibles para esta fecha');
      }
    } catch (err) {
      setError(err.message);
      setHorariosDisponibles([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  const handleHorarioChange = (horario) => {
    setHorarioSeleccionado(horario);
  };

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setDatosCliente(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errorsCliente[name]) {
      setErrorsCliente(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    if (step === 1 && fechaSeleccionada) {
      setStep(2);
    } else if (step === 2 && horarioSeleccionado) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validar datos del cliente
      const validation = turnosService.validateTurnoData({
        ...datosCliente,
        tratamiento_id: tratamiento.id,
        fecha: fechaSeleccionada,
        hora: horarioSeleccionado
      });
      
      if (!validation.isValid) {
        setErrorsCliente(validation.errors);
        setLoading(false);
        return;
      }
      
      // Crear turno
      const turnoData = {
        tratamiento_id: tratamiento.id,
        fecha: fechaSeleccionada,
        hora: horarioSeleccionado,
        ...datosCliente
      };
      
      const response = await turnosService.createTurno(turnoData);
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        
        <ModalHeader>
          <ModalTitle>Reservar Turno</ModalTitle>
          <TratamientoInfo>
            <TratamientoNombre>{tratamiento.nombre}</TratamientoNombre>
            <TratamientoPrecio>${tratamiento.precio}</TratamientoPrecio>
          </TratamientoInfo>
        </ModalHeader>

        <StepIndicator>
          <StepItem $active={step === 1} $completed={step > 1}>
            <StepNumber>1</StepNumber>
            <StepLabel>Fecha</StepLabel>
          </StepItem>
          <StepItem $active={step === 2} $completed={step > 2}>
            <StepNumber>2</StepNumber>
            <StepLabel>Horario</StepLabel>
          </StepItem>
          <StepItem $active={step === 3}>
            <StepNumber>3</StepNumber>
            <StepLabel>Datos</StepLabel>
          </StepItem>
        </StepIndicator>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ModalBody>
          {step === 1 && (
            <StepContent>
              <StepTitle>Selecciona una fecha</StepTitle>
              <CalendarContainer>
                <CalendarHeader>
                  <CalendarTitle>
                    {turnosService.generateMonthCalendar().monthName}
                  </CalendarTitle>
                </CalendarHeader>
                <CalendarGrid>
                  {/* Encabezados de días */}
                  <CalendarDayHeader>Dom</CalendarDayHeader>
                  <CalendarDayHeader>Lun</CalendarDayHeader>
                  <CalendarDayHeader>Mar</CalendarDayHeader>
                  <CalendarDayHeader>Mié</CalendarDayHeader>
                  <CalendarDayHeader>Jue</CalendarDayHeader>
                  <CalendarDayHeader>Vie</CalendarDayHeader>
                  <CalendarDayHeader>Sáb</CalendarDayHeader>
                  
                  {/* Días del calendario */}
                  {turnosService.generateMonthCalendar().calendar.map((week, weekIndex) => (
                    week.map((day, dayIndex) => (
                      <CalendarDay
                        key={`${weekIndex}-${dayIndex}`}
                        $isEmpty={!day}
                        $isUnavailable={day && !day.isAvailable}
                        $isToday={day && day.isToday}
                        $isSelected={day && fechaSeleccionada === day.value}
                        onClick={() => day && day.isAvailable && handleFechaChange(day.value)}
                      >
                        {day ? day.day : ''}
                      </CalendarDay>
                    ))
                  ))}
                </CalendarGrid>
                <CalendarLegend>
                  <LegendItem>
                    <LegendColor color="var(--primary-color-dark)" />
                    <span>Hoy</span>
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="var(--secondary-color)" />
                    <span>Disponible</span>
                  </LegendItem>
                  <LegendItem>
                    <LegendColor color="#e0e0e0" />
                    <span>No disponible</span>
                  </LegendItem>
                </CalendarLegend>
              </CalendarContainer>
            </StepContent>
          )}

          {step === 2 && (
            <StepContent>
              <StepTitle>Selecciona un horario</StepTitle>
              <FechaSeleccionada>
                {turnosService.formatDate(fechaSeleccionada)} - {turnosService.getDayOfWeek(fechaSeleccionada)}
              </FechaSeleccionada>
              
              {loadingHorarios ? (
                <LoadingMessage>Cargando horarios disponibles...</LoadingMessage>
              ) : (
                <HorariosGrid>
                  {horariosDisponibles.map(horario => (
                    <HorarioItem
                      key={horario.hora}
                      $selected={horarioSeleccionado === horario.hora}
                      onClick={() => handleHorarioChange(horario.hora)}
                    >
                      {horario.hora_display}
                    </HorarioItem>
                  ))}
                </HorariosGrid>
              )}
            </StepContent>
          )}

          {step === 3 && (
            <StepContent>
              <StepTitle>Ingresa tus datos</StepTitle>
              <ResumenSeleccion>
                <ResumenItem>
                  <strong>Fecha:</strong> {turnosService.formatDate(fechaSeleccionada)}
                </ResumenItem>
                <ResumenItem>
                  <strong>Horario:</strong> {turnosService.formatTime(horarioSeleccionado)}
                </ResumenItem>
                <ResumenItem>
                  <strong>Tratamiento:</strong> {tratamiento.nombre}
                </ResumenItem>
              </ResumenSeleccion>

              <FormularioCliente onSubmit={handleSubmit}>
                <FormRow>
                  <FormField>
                    <Label>DNI *</Label>
                    <Input
                      type="text"
                      name="dni_cliente"
                      value={datosCliente.dni_cliente}
                      onChange={handleClienteChange}
                      placeholder="12345678"
                      maxLength="8"
                      disabled={loadingClienteData}
                    />
                    {errorsCliente.dni_cliente && (
                      <ErrorMsg>{errorsCliente.dni_cliente}</ErrorMsg>
                    )}
                  </FormField>
                </FormRow>

                <FormRow>
                  <FormField>
                    <Label>Nombre *</Label>
                    <Input
                      type="text"
                      name="nombre_cliente"
                      value={datosCliente.nombre_cliente}
                      onChange={handleClienteChange}
                      placeholder="Juan"
                      disabled={loadingClienteData}
                    />
                    {errorsCliente.nombre_cliente && (
                      <ErrorMsg>{errorsCliente.nombre_cliente}</ErrorMsg>
                    )}
                  </FormField>
                  <FormField>
                    <Label>Apellido *</Label>
                    <Input
                      type="text"
                      name="apellido_cliente"
                      value={datosCliente.apellido_cliente}
                      onChange={handleClienteChange}
                      placeholder="Pérez"
                      disabled={loadingClienteData}
                    />
                    {errorsCliente.apellido_cliente && (
                      <ErrorMsg>{errorsCliente.apellido_cliente}</ErrorMsg>
                    )}
                  </FormField>
                </FormRow>

                <FormRow>
                  <FormField>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      name="email_cliente"
                      value={datosCliente.email_cliente}
                      onChange={handleClienteChange}
                      placeholder="juan.perez@email.com"
                      disabled={loadingClienteData}
                    />
                    {errorsCliente.email_cliente && (
                      <ErrorMsg>{errorsCliente.email_cliente}</ErrorMsg>
                    )}
                  </FormField>
                  <FormField>
                    <Label>Teléfono *</Label>
                    <Input
                      type="tel"
                      name="telefono_cliente"
                      value={datosCliente.telefono_cliente}
                      onChange={handleClienteChange}
                      placeholder="11 1234-5678"
                      disabled={loadingClienteData}
                    />
                    {errorsCliente.telefono_cliente && (
                      <ErrorMsg>{errorsCliente.telefono_cliente}</ErrorMsg>
                    )}
                  </FormField>
                </FormRow>

                <FormRow>
                  <FormField>
                    <Label>Observaciones</Label>
                    <TextArea
                      name="observaciones"
                      value={datosCliente.observaciones}
                      onChange={handleClienteChange}
                      placeholder="Alguna observación especial..."
                      rows="3"
                      disabled={loadingClienteData}
                    />
                  </FormField>
                </FormRow>
              </FormularioCliente>
            </StepContent>
          )}
        </ModalBody>

        <ModalFooter>
          {step > 1 && (
            <Button type="button" $variant="secondary" onClick={handlePrevStep}>
              Anterior
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              type="button"
              $variant="primary"
              onClick={handleNextStep}
              disabled={
                (step === 1 && !fechaSeleccionada) ||
                (step === 2 && !horarioSeleccionado)
              }
            >
              Siguiente
            </Button>
          ) : (
            <Button
              type="button"
              $variant="primary"
              onClick={handleSubmit}
              disabled={loading || loadingClienteData}
            >
              {loading ? 'Reservando...' : 'Confirmar Reserva'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReservaTurnoModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  animation: fadeIn 0.4s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e0f7fa 100%);
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  @keyframes slideIn {
    0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 18px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }
`;

const ModalHeader = styled.div`
  padding: 40px 40px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h2`
  background: var(--primary-color-dark);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 20px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: var(--primary-color-dark);
    border-radius: 2px;
  }
`;

const TratamientoInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TratamientoNombre = styled.span`
  font-weight: 600;
  color: var(--text-color);
`;

const TratamientoPrecio = styled.span`
  font-weight: 700;
  color: var(--primary-color-dark);
  font-size: 1.1rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 2rem;
  gap: 2rem;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: ${props => props.$active || props.$completed ? 1 : 0.5};
`;

const StepNumber = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${props => props.$active || props.$completed ? 'var(--primary-color)' : '#ccc'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

const StepLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 8px;
  margin: 1rem 2rem;
  border: 1px solid #f5c6cb;
`;

const ModalBody = styled.div`
  padding: 1rem 2rem;
  min-height: 300px;
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StepTitle = styled.h3`
  margin: 0 0 1rem;
  color: var(--terciary-color);
  font-size: 1.2rem;
`;

const CalendarContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CalendarHeader = styled.div`
  background: var(--primary-color-dark);
  color: white;
  padding: 1rem;
  text-align: center;
`;

const CalendarTitle = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: white;
`;

const CalendarDayHeader = styled.div`
  background: #f8f9fa;
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.8rem;
  color: #666;
  border-bottom: 1px solid #eee;
`;

const CalendarDay = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  cursor: ${props => props.$isEmpty || props.$isUnavailable ? 'default' : 'pointer'};
  font-weight: 500;
  transition: all 0.3s ease;
  
  ${props => props.$isEmpty && `
    background: #fafafa;
    color: transparent;
  `}
  
  ${props => props.$isUnavailable && `
    background: #f5f5f5;
    color: #ccc;
  `}
  
  ${props => props.$isToday && `
    background: var(--primary-color);
    color: white;
    font-weight: 700;
  `}
  
  ${props => props.$isSelected && `
    background: var(--secondary-color);
    color: white;
    font-weight: 700;
  `}
  
  &:hover {
    ${props => !props.$isEmpty && !props.$isUnavailable && `
      background: rgba(166, 118, 78, 0.1);
    `}
  }
`;

const CalendarLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #666;
`;

const LegendColor = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: ${props => props.color};
  border: 1px solid #ddd;
`;

const FechaSeleccionada = styled.div`
  background: var(--primary-color-dark);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const HorariosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const HorarioItem = styled.div`
  padding: 0.75rem;
  border: 2px solid ${props => props.$selected ? 'var(--primary-color-dark)' : '#eee'};
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  background: ${props => props.$selected ? 'var(--primary-color-dark)' : 'white'};
  color: ${props => props.$selected ? 'white' : 'var(--text-color)'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-color-dark);
    background: ${props => props.$selected ? 'var(--primary-color)' : 'rgba(166, 118, 78, 0.1)'};
  }
`;

const ResumenSeleccion = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ResumenItem = styled.div`
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormularioCliente = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormField = styled.div`
  flex: 1;
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
  
  &:disabled {
    background: #f8f9fa;
    opacity: 0.7;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  &:disabled {
    background: #f8f9fa;
    opacity: 0.7;
  }
`;

const ErrorMsg = styled.span`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const ModalFooter = styled.div`
  padding: 1rem 2rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: "Raleway",arial;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.$variant === 'primary' && `
    background: var(--primary-color);
    color: white;
    
    &:hover:not(:disabled) {
      background: var(--primary-color-dark);
    }
  `}
  
  ${props => props.$variant === 'secondary' && `
    background: #6c757d;
    color: white;
    
    &:hover:not(:disabled) {
      background: #5a6268;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`; 