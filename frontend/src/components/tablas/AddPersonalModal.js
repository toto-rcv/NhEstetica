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
  imagen: '',
  comision_venta: 0,
  comision_fija: 0,
  sueldo_mensual: 0,
};

const AddPersonalModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    
    // Validación para campos numéricos
    if (form.comision_venta && (isNaN(form.comision_venta) || form.comision_venta < 0 || form.comision_venta > 100)) {
      newErrors.comision_venta = 'La comisión de venta debe ser un número entre 0 y 100';
    }
    if (form.comision_fija && (isNaN(form.comision_fija) || form.comision_fija < 0)) {
      newErrors.comision_fija = 'La comisión fija debe ser un número positivo';
    }
    if (form.sueldo_mensual && (isNaN(form.sueldo_mensual) || form.sueldo_mensual < 0)) {
      newErrors.sueldo_mensual = 'El sueldo mensual debe ser un número positivo';
    }
    
    return newErrors;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setBackendError('');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, imagen: 'Solo se permiten archivos de imagen' });
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, imagen: 'La imagen no puede superar los 5MB' });
      return;
    }

    setImageFile(file);
    setErrors({ ...errors, imagen: undefined });

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`/api/upload/image?type=personal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      return data.imagePath;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
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
      // Subir imagen si existe
      let imagePath = null;
      if (imageFile) {
        imagePath = await uploadImage();
      }

      // Crear empleado con la ruta de la imagen
      const empleadoData = {
        ...form,
        imagen: imagePath
      };

      await personalService.createPersonal(empleadoData);
      setForm(initialState);
      setErrors({});
      setImageFile(null);
      setImagePreview(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setBackendError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setForm({ ...form, imagen: '' });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} title="Cerrar">&times;</CloseButton>
        <ModalTitle>Agregar Empleado</ModalTitle>
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Campo de imagen */}
          <ImageSection>
            <Label>Imagen del Empleado</Label>
            {imagePreview ? (
              <ImagePreviewContainer>
                <ImagePreview src={imagePreview} alt="Preview" />
                <RemoveImageButton type="button" onClick={removeImage}>
                  ✕
                </RemoveImageButton>
              </ImagePreviewContainer>
            ) : (
              <ImageUploadArea>
                <ImageUploadInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="imageUpload"
                />
                <ImageUploadLabel htmlFor="imageUpload">
                  📷 Seleccionar Imagen
                </ImageUploadLabel>
                <ImageUploadText>
                  Formato: JPG, PNG, GIF (máx. 5MB)
                </ImageUploadText>
              </ImageUploadArea>
            )}
            {errors.imagen && <ErrorMsg>{errors.imagen}</ErrorMsg>}
          </ImageSection>

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

          {/* Campos de compensación */}
          <CompensationSection>
            <SectionTitle>💰 Información de Compensación</SectionTitle>
            
            <Field>
              <Label>% Comisión por Venta</Label>
              <Input 
                type="number" 
                name="comision_venta" 
                value={form.comision_venta} 
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                placeholder="Ej: 15"
              />
              {errors.comision_venta && <ErrorMsg>{errors.comision_venta}</ErrorMsg>}
            </Field>
            
            <Field>
              <Label>Comisión Fija ($)</Label>
              <Input 
                type="number" 
                name="comision_fija" 
                value={form.comision_fija} 
                onChange={handleChange}
                min="0"
                step="100"
                placeholder="Ej: 5000"
              />
              {errors.comision_fija && <ErrorMsg>{errors.comision_fija}</ErrorMsg>}
            </Field>
            
            <Field>
              <Label>Sueldo Mensual ($)</Label>
              <Input 
                type="number" 
                name="sueldo_mensual" 
                value={form.sueldo_mensual} 
                onChange={handleChange}
                min="0"
                step="1000"
                placeholder="Ej: 50000"
              />
              {errors.sueldo_mensual && <ErrorMsg>{errors.sueldo_mensual}</ErrorMsg>}
            </Field>
          </CompensationSection>

          {backendError && <ErrorMsg style={{ marginBottom: 10 }}>{backendError}</ErrorMsg>}
          <ButtonGroup>
            <AddButton type="submit" disabled={loading || uploadingImage}>
              {loading || uploadingImage ? (
                <span role="img" aria-label="Cargando" style={{ marginRight: 6 }}>⏳</span>
              ) : (
                <span role="img" aria-label="Agregar" style={{ marginRight: 6 }}>➕</span>
              )}
              {loading || uploadingImage ? 'Agregando...' : 'Agregar'}
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
  padding: 1rem;
  box-sizing: border-box;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 768px) {
    align-items: flex-start;
    padding: 0.5rem;
    overflow-y: auto;
  }
  
  @media (max-width: 480px) {
    padding: 0.25rem;
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #f8fafc 80%, #e0f7fa 100%);
  padding: 38px 36px 28px 36px;
  border-radius: 18px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);
  text-align: left;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: popIn 0.35s cubic-bezier(.68,-0.55,.27,1.55);
  
  @keyframes popIn {
    0% { transform: scale(0.85); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @media (max-width: 768px) {
    padding: 24px 20px 20px 20px;
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 12px;
    margin-top: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 20px 16px 16px 16px;
    max-width: 98vw;
    border-radius: 10px;
    margin-top: 0.5rem;
  }
  
  @media (max-width: 350px) {
    padding: 16px 12px 12px 12px;
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
  padding: 4px;
  
  &:hover {
    color: #e57373;
  }
  
  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
    font-size: 1.8rem;
    padding: 6px;
  }
  
  @media (max-width: 480px) {
    top: 8px;
    right: 8px;
    font-size: 1.6rem;
    padding: 8px;
  }
`;

const ModalTitle = styled.h2`
  color: #2e3a59;
  margin-bottom: 24px;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 350px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

const Field = styled.div`
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    margin-bottom: 14px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  color: #3a4a6b;
  font-size: 1.04rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 5px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 4px;
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
  box-sizing: border-box;
  
  &:focus {
    border: 1.5px solid #26a69a;
    outline: none;
    box-shadow: 0 0 0 2px #b2dfdb55;
    background: #fff;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 9px 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 8px 10px;
  }
`;

const ErrorMsg = styled.div`
  color: #e53935;
  font-size: 0.9rem;
  margin-top: 4px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-top: 3px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-top: 2px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 14px;
  justify-content: flex-end;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
    
    button {
      width: 100%;
      justify-content: center;
    }
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
  justify-content: center;
  min-height: 44px;
  
  &:hover:enabled {
    background: linear-gradient(90deg, #26a69a 0%, #43e97b 100%);
    box-shadow: 0 4px 16px #38f9d744;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 10px 20px;
    min-height: 42px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 12px 16px;
    min-height: 44px;
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
  justify-content: center;
  min-height: 44px;
  
  &:hover {
    background: #e57373;
    color: #fff;
    border: 1.5px solid #e57373;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 10px 18px;
    min-height: 42px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 12px 16px;
    min-height: 44px;
  }
`;

const ImageSection = styled.div`
  margin-bottom: 20px;
  text-align: center;
  
  @media (max-width: 768px) {
    margin-bottom: 18px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #cfd8dc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #f9f9f9;
  transition: border-color 0.2s;

  &:hover {
    border-color: #26a69a;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const ImageUploadInput = styled.input`
  display: none;
`;

const ImageUploadLabel = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background: #26a69a;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  font-size: 0.95rem;

  &:hover {
    background: #00897b;
  }
  
  @media (max-width: 768px) {
    padding: 9px 18px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
`;

const ImageUploadText = styled.p`
  margin: 10px 0 0 0;
  color: #666;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin: 8px 0 0 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin: 6px 0 0 0;
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #26a69a;
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e57373;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #f44336;
  }
  
  @media (max-width: 480px) {
    width: 22px;
    height: 22px;
    font-size: 11px;
    top: -6px;
    right: -6px;
  }
`;

const CompensationSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  
  @media (max-width: 768px) {
    margin-top: 16px;
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    margin-top: 12px;
    padding: 10px;
  }
`;

const SectionTitle = styled.h4`
  color: #28a745;
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 10px;
  }
`; 