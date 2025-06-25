import React, { useState } from 'react';
import styled from 'styled-components';
import { personalService } from '../../services/personalService';

const initialState = {
  dni: '',
  nombre: '',
  apellido: '',
  direccion: '',
  telefono: '',
  email: '',
  cargo: '',
  especialidad: '',
  fecha_contratacion: '',
};

const AddPersonalModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.dni) newErrors.dni = 'El DNI es obligatorio';
    else if (!/^\d{7,}$/.test(form.dni)) newErrors.dni = 'El DNI debe tener al menos 7 números';
    if (!form.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!form.email) newErrors.email = 'El email es obligatorio';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'El email no es válido';
    if (form.telefono && !/^\+?\d{7,15}$/.test(form.telefono)) newErrors.telefono = 'El teléfono no es válido';
    if (!form.cargo) newErrors.cargo = 'El cargo es obligatorio';
    if (!form.fecha_contratacion) newErrors.fecha_contratacion = 'La fecha de contratación es obligatoria';
    return newErrors;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setBackendError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    setBackendError('');
    try {
      await personalService.createPersonal(form);
      setForm(initialState);
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (err) {
      setBackendError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} title="Cerrar">&times;</CloseButton>
        <ModalTitle>Agregar Empleado</ModalTitle>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Field>
            <Label>DNI*</Label>
            <Input name="dni" value={form.dni} onChange={handleChange} />
            {errors.dni && <ErrorMsg>{errors.dni}</ErrorMsg>}
          </Field>
          <Field>
            <Label>Nombre*</Label>
            <Input name="nombre" value={form.nombre} onChange={handleChange} />
            {errors.nombre && <ErrorMsg>{errors.nombre}</ErrorMsg>}
          </Field>
          <Field>
            <Label>Apellido*</Label>
            <Input name="apellido" value={form.apellido} onChange={handleChange} />
            {errors.apellido && <ErrorMsg>{errors.apellido}</ErrorMsg>}
          </Field>
          <Field>
            <Label>Dirección</Label>
            <Input name="direccion" value={form.direccion} onChange={handleChange} />
          </Field>
          <Field>
            <Label>Teléfono</Label>
            <Input name="telefono" value={form.telefono} onChange={handleChange} />
            {errors.telefono && <ErrorMsg>{errors.telefono}</ErrorMsg>}
          </Field>
          <Field>
            <Label>Email*</Label>
            <Input name="email" value={form.email} onChange={handleChange} />
            {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
          </Field>
          <Field>
            <Label>Cargo*</Label>
            <Input name="cargo" value={form.cargo} onChange={handleChange} />
            {errors.cargo && <ErrorMsg>{errors.cargo}</ErrorMsg>}
          </Field>
          <Field>
            <Label>Especialidad</Label>
            <Input name="especialidad" value={form.especialidad} onChange={handleChange} />
          </Field>
          <Field>
            <Label>Fecha de Contratación*</Label>
            <Input type="date" name="fecha_contratacion" value={form.fecha_contratacion} onChange={handleChange} />
            {errors.fecha_contratacion && <ErrorMsg>{errors.fecha_contratacion}</ErrorMsg>}
          </Field>
          {backendError && <ErrorMsg style={{ marginBottom: 10 }}>{backendError}</ErrorMsg>}
          <ButtonGroup>
            <AddButton type="submit" disabled={loading}>
              {loading ? (
                <span role="img" aria-label="Cargando" style={{ marginRight: 6 }}>⏳</span>
              ) : (
                <span role="img" aria-label="Agregar" style={{ marginRight: 6 }}>➕</span>
              )}
              {loading ? 'Agregando...' : 'Agregar'}
            </AddButton>
            <CancelButton type="button" onClick={onClose}>
              <span role="img" aria-label="Cancelar" style={{ marginRight: 6 }}>❌</span>
              Cancelar
            </CancelButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddPersonalModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(40, 60, 80, 0.25);
  backdrop-filter: blur(5px) saturate(1.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #f8fafc 80%, #e0f7fa 100%);
  padding: 38px 36px 28px 36px;
  border-radius: 18px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);
  text-align: left;
  max-width: 440px;
  width: 97%;
  position: relative;
  animation: popIn 0.35s cubic-bezier(.68,-0.55,.27,1.55);
  @keyframes popIn {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  @media (max-width: 600px) {
    padding: 22px 8vw 18px 8vw;
    max-width: 98vw;
    border-radius: 12px;
  }
  @media (max-width: 400px) {
    padding: 12px 2vw 10px 2vw;
    border-radius: 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.7rem;
  color: #7b7b7b;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 10;
  &:hover {
    color: #e57373;
  }
  @media (max-width: 600px) {
    top: 8px;
    right: 10px;
    font-size: 2.1rem;
  }
`;

const ModalTitle = styled.h2`
  color: #2e3a59;
  margin-bottom: 22px;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  @media (max-width: 600px) {
    font-size: 21px;
    margin-bottom: 16px;
  }
  @media (max-width: 400px) {
    font-size: 18px;
  }
`;

const Field = styled.div`
  margin-bottom: 16px;
  @media (max-width: 600px) {
    margin-bottom: 12px;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
  color: #3a4a6b;
  font-size: 1.04rem;
  @media (max-width: 600px) {
    font-size: 0.98rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #cfd8dc;
  border-radius: 7px;
  font-size: 1.04rem;
  background: #f6fafd;
  transition: border 0.2s, box-shadow 0.2s;
  font-family: inherit;
  &:focus {
    border: 1.5px solid #26a69a;
    outline: none;
    box-shadow: 0 0 0 2px #b2dfdb55;
    background: #fff;
  }
  @media (max-width: 600px) {
    font-size: 0.97rem;
    padding: 8px 8px;
  }
`;

const ErrorMsg = styled.div`
  color: #e53935;
  font-size: 0.97rem;
  margin-top: 2px;
  font-weight: 500;
  @media (max-width: 600px) {
    font-size: 0.92rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 14px;
  justify-content: flex-end;
  margin-top: 22px;
  @media (max-width: 600px) {
    gap: 8px;
    margin-top: 14px;
  }
  @media (max-width: 400px) {
    flex-direction: column;
    gap: 7px;
    button { width: 100%; justify-content: center; }
  }
`;

const AddButton = styled.button`
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
  border: none;
  padding: 11px 26px;
  border-radius: 7px;
  font-size: 1.07rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px #38f9d733;
  transition: all 0.22s;
  display: flex;
  align-items: center;
  &:hover:enabled {
    background: linear-gradient(90deg, #26a69a 0%, #43e97b 100%);
    box-shadow: 0 4px 16px #38f9d744;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  @media (max-width: 600px) {
    font-size: 0.98rem;
    padding: 10px 10px;
  }
`;

const CancelButton = styled.button`
  background: #f5f5f5;
  color: #7b7b7b;
  border: 1.5px solid #cfd8dc;
  padding: 11px 22px;
  border-radius: 7px;
  font-size: 1.07rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.22s;
  display: flex;
  align-items: center;
  &:hover {
    background: #e57373;
    color: #fff;
    border: 1.5px solid #e57373;
  }
  @media (max-width: 600px) {
    font-size: 0.98rem;
    padding: 10px 10px;
  }
`; 