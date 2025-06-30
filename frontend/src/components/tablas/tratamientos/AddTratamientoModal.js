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
      const response = await fetch('/api/upload/image', {
        method: 'POST',
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.8rem;
  text-align: center;
`;

const FormContainer = styled.div`
  padding: 0 10px;
`;

const Field = styled.div`
  margin-bottom: 15px;
`;

const Row = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background: white;
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const ImageInput = styled.input`
  display: none;
`;

const ImageLabel = styled.label`
  background-color: #4a90e2;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  &:hover {
    background-color: #357abf;
  }
`;

const ImagePreview = styled.div`
  margin-top: 10px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #357abf;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Radio = styled.input`
  margin-right: 5px;
`;

export default AddTratamientoModal; 