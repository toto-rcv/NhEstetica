import React, { useState } from 'react';
import styled from 'styled-components';
import { tratamientosService } from '../../../services/tratamientosService';

const initialState = {
  nombre: '',
  precio: '',
  descripcion: '',
  categoria: '',
  duracion: '',
  imagen: ''
};

const AddTratamientoModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.precio) newErrors.precio = 'El precio es obligatorio';
    else if (isNaN(form.precio) || parseFloat(form.precio) <= 0) newErrors.precio = 'El precio debe ser un número válido mayor a 0';
    if (!form.categoria) newErrors.categoria = 'La categoría es obligatoria';
    if (!form.duracion) newErrors.duracion = 'La duración es obligatoria';
    return newErrors;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
    setErrors({ ...errors, [name]: undefined });
    setBackendError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload/image?type=tratamiento', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      const result = await response.json();
      return result.imagePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Error al subir la imagen');
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
      let imagePath = '';
      
      // Subir imagen si se seleccionó una
      if (imageFile) {
        imagePath = await uploadImage(imageFile);
      }
      
      const tratamientoData = {
        ...form,
        precio: parseFloat(form.precio),
        imagen: imagePath
      };
      
      await tratamientosService.createTratamiento(tratamientoData);
      setForm(initialState);
      setErrors({});
      setImageFile(null);
      setImagePreview('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setBackendError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialState);
    setErrors({});
    setBackendError('');
    setImageFile(null);
    setImagePreview('');
    onClose();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose} title="Cerrar">&times;</CloseButton>
        <ModalTitle>Agregar Tratamiento</ModalTitle>
        <FormContainer>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Field>
              <Label>Nombre del Tratamiento*</Label>
              <Input name="nombre" value={form.nombre} onChange={handleChange} />
              {errors.nombre && <ErrorMsg>{errors.nombre}</ErrorMsg>}
            </Field>
            
            <Field>
              <Label>Precio*</Label>
              <Input 
                name="precio" 
                type="number" 
                step="0.01" 
                value={form.precio} 
                onChange={handleChange} 
              />
              {errors.precio && <ErrorMsg>{errors.precio}</ErrorMsg>}
            </Field>
            
            <Row>
              <Field style={{ flex: 1 }}>
                <Label>Categoría*</Label>
                <Select name="categoria" value={form.categoria} onChange={handleChange}>
                  <option value="">Seleccionar categoría</option>
                  <option value="Facial">Facial</option>
                  <option value="Corporal">Corporal</option>
                  <option value="Masajes">Masajes</option>
                  <option value="Depilación">Depilación</option>
                </Select>
                {errors.categoria && <ErrorMsg>{errors.categoria}</ErrorMsg>}
              </Field>
              
              <Field style={{ flex: 1 }}>
                <Label>Duración*</Label>
                <Input name="duracion" value={form.duracion} onChange={handleChange} placeholder="Ej: 60 minutos" />
                {errors.duracion && <ErrorMsg>{errors.duracion}</ErrorMsg>}
              </Field>
            </Row>
            
            <Field>
              <Label>Descripción</Label>
              <TextArea name="descripcion" value={form.descripcion} onChange={handleChange} />
            </Field>
            
            <Field>
              <Label>Imagen del Tratamiento</Label>
              <ImageUploadContainer>
                <ImageInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="imageUpload"
                />
                <ImageLabel htmlFor="imageUpload">
                  {imagePreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </ImageLabel>
                {imagePreview && (
                  <ImagePreview>
                    <img 
                      src={imagePreview} 
                      alt="Vista previa" 
                      style={{ width: '100%', height: 'auto', maxHeight: '150px', objectFit: 'cover' }}
                    />
                  </ImagePreview>
                )}
              </ImageUploadContainer>
            </Field>

            {backendError && (
              <ErrorMsg style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {backendError}
              </ErrorMsg>
            )}
            
            <ButtonsContainer>
              <CancelButton type="button" onClick={handleClose} disabled={loading}>
                Cancelar
              </CancelButton>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Tratamiento'}
              </SubmitButton>
            </ButtonsContainer>
          </form>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

// Estilos
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
  max-width: 600px;
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

const FormContainer = styled.div`
  padding: 0;
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

const Row = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 16px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;
  }
  
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

const Select = styled.select`
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #cfd8dc;
  border-radius: 7px;
  font-size: 1.04rem;
  background: #f6fafd;
  transition: border 0.2s, box-shadow 0.2s;
  font-family: inherit;
  box-sizing: border-box;
  min-height: 100px;
  resize: vertical;
  
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

const ImageUploadContainer = styled.div`
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

const ImageInput = styled.input`
  display: none;
`;

const ImageLabel = styled.label`
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

const ImagePreview = styled.div`
  margin-top: 10px;
  
  img {
    border-radius: 8px;
    border: 2px solid #26a69a;
  }
`;

const ButtonsContainer = styled.div`
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

const SubmitButton = styled.button`
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

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  color: #3a4a6b;
`;

const Radio = styled.input`
  margin-right: 8px;
  transform: scale(1.1);
`;

export default AddTratamientoModal; 