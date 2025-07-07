import React, { useState } from 'react';
import styled from 'styled-components';
import { productosService } from '../../../services/productosService';

const initialState = {
  nombre: '',
  costo: '',
  precio: '',
  subtitle: '',
  descripcion: '',
  categoria: '',
  marca: '',
  isNatural: false,
  isVegan: false,
  benefits: '',
  modoUso: '',
  imagen: ''
};

const AddProductoModal = ({ isOpen, onClose, onSuccess }) => {
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
    if (!form.costo) newErrors.costo = 'El costo es obligatorio';
    else if (isNaN(form.costo) || parseFloat(form.costo) <= 0) newErrors.costo = 'El costo debe ser un número válido mayor a 0';
    if (!form.precio) newErrors.precio = 'El precio es obligatorio';
    else if (isNaN(form.precio) || parseFloat(form.precio) <= 0) newErrors.precio = 'El precio debe ser un número válido mayor a 0';
    if (!form.categoria) newErrors.categoria = 'La categoría es obligatoria';
    if (!form.marca) newErrors.marca = 'La marca es obligatoria';
    if (form.isNatural === undefined) newErrors.isNatural = 'Debe seleccionar si es natural o no';
    if (form.isVegan === undefined) newErrors.isVegan = 'Debe seleccionar si es vegano o no';
    return newErrors;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : 
              (name === 'isNatural' || name === 'isVegan') ? value === 'true' : 
              value 
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
      if (!token) throw new Error('No hay token de autenticación');
      const response = await fetch('/api/upload/image?type=producto', {
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
      
      // Procesar benefits
      const benefitsArray = form.benefits 
        ? form.benefits.split('.').map(b => b.trim()).filter(b => b)
        : [];

      // Procesar modo de uso
      const modoUsoArray = form.modoUso 
        ? form.modoUso.split('.').map(m => m.trim()).filter(m => m)
        : [];
      
      const productoData = {
        ...form,
        costo: parseFloat(form.costo),
        precio: parseFloat(form.precio),
        imagen: imagePath,
        benefits: benefitsArray,
        modoUso: modoUsoArray
      };
      
      console.log('Datos que se envían al backend:', productoData);
      
      await productosService.createProducto(productoData);
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
        <ModalTitle>Agregar Producto</ModalTitle>
        <FormContainer>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Field>
              <Label>Nombre del Producto*</Label>
              <Input name="nombre" value={form.nombre} onChange={handleChange} />
              {errors.nombre && <ErrorMsg>{errors.nombre}</ErrorMsg>}
            </Field>
            
            <Field>
              <Label>Costo*</Label>
              <Input 
                name="costo" 
                type="number" 
                step="0.01" 
                value={form.costo} 
                onChange={handleChange} 
              />
              {errors.costo && <ErrorMsg>{errors.costo}</ErrorMsg>}
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
                <Input name="categoria" value={form.categoria} onChange={handleChange} />
                {errors.categoria && <ErrorMsg>{errors.categoria}</ErrorMsg>}
              </Field>
              
              <Field style={{ flex: 1 }}>
                <Label>Marca*</Label>
                <Input name="marca" value={form.marca} onChange={handleChange} />
                {errors.marca && <ErrorMsg>{errors.marca}</ErrorMsg>}
              </Field>
            </Row>
            
            <Field>
              <Label>Subtítulo</Label>
              <Input name="subtitle" value={form.subtitle} onChange={handleChange} />
            </Field>
            
            <Field>
              <Label>Descripción</Label>
              <TextArea name="descripcion" value={form.descripcion} onChange={handleChange} />
            </Field>
            
            <Field>
              <Label>Beneficios</Label>
              <TextArea 
                name="benefits" 
                value={form.benefits} 
                onChange={handleChange}
                placeholder="Separá cada beneficio con un punto (.)"
              />
            </Field>
            
            <Field>
              <Label>Modo de Uso</Label>
              <TextArea 
                name="modoUso" 
                value={form.modoUso} 
                onChange={handleChange}
                placeholder="Separá cada paso con un punto (.)"
              />
            </Field>
            
            <Row>
              <Field style={{ flex: 1 }}>
                <Label>¿Es un producto natural?*</Label>
                <RadioGroup>
                  <RadioLabel>
                    <Radio 
                      type="radio" 
                      name="isNatural" 
                      value="true"
                      checked={form.isNatural === true}
                      onChange={handleChange} 
                    />
                    Sí
                  </RadioLabel>
                  <RadioLabel>
                    <Radio 
                      type="radio" 
                      name="isNatural" 
                      value="false"
                      checked={form.isNatural === false}
                      onChange={handleChange} 
                    />
                    No
                  </RadioLabel>
                </RadioGroup>
                {errors.isNatural && <ErrorMsg>{errors.isNatural}</ErrorMsg>}
              </Field>
              
              <Field style={{ flex: 1 }}>
                <Label>¿Es un producto vegano?*</Label>
                <RadioGroup>
                  <RadioLabel>
                    <Radio 
                      type="radio" 
                      name="isVegan" 
                      value="true"
                      checked={form.isVegan === true}
                      onChange={handleChange} 
                    />
                    Sí
                  </RadioLabel>
                  <RadioLabel>
                    <Radio 
                      type="radio" 
                      name="isVegan" 
                      value="false"
                      checked={form.isVegan === false}
                      onChange={handleChange} 
                    />
                    No
                  </RadioLabel>
                </RadioGroup>
                {errors.isVegan && <ErrorMsg>{errors.isVegan}</ErrorMsg>}
              </Field>
            </Row>
            
            <Field>
              <Label>Imagen del Producto</Label>
              <ImageInput 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
              />
              {imagePreview && (
                <ImagePreview>
                  <img src={imagePreview} alt="Preview" />
                </ImagePreview>
              )}
            </Field>
            
            {backendError && <ErrorMsg style={{ marginBottom: 10 }}>{backendError}</ErrorMsg>}
            
            <ButtonGroup>
              <AddButton type="submit" disabled={loading}>
                {loading ? (
                  <span role="img" aria-label="Cargando" style={{ marginRight: 6 }}>⏳</span>
                ) : (
                  <span role="img" aria-label="Agregar" style={{ marginRight: 6 }}>➕</span>
                )}
                {loading ? 'Agregando...' : 'Agregar Producto'}
              </AddButton>
              <CancelButton type="button" onClick={handleClose}>
                <span role="img" aria-label="Cancelar" style={{ marginRight: 6 }}>❌</span>
                Cancelar
              </CancelButton>
            </ButtonGroup>
          </form>
        </FormContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddProductoModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.4s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e0f7fa 100%);
  padding: 40px 40px 30px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  text-align: center;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @keyframes slideIn {
    0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  
  @media (max-width: 768px) {
    padding: 30px 25px 25px 25px;
    max-width: 95%;
    width: 95%;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 25px 20px 20px 20px;
    max-width: 98%;
    width: 98%;
    border-radius: 12px;
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
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
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  z-index: 10;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }
  
  @media (max-width: 600px) {
    top: 10px;
    right: 15px;
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
`;

const ModalTitle = styled.h2`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  letter-spacing: 0.5px;
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
  
  @media (max-width: 600px) {
    font-size: 24px;
    margin-bottom: 25px;
  }
  @media (max-width: 400px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const Field = styled.div`
  margin-bottom: 20px;
  width: 100%;
  
  @media (max-width: 768px) {
    margin-bottom: 18px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  
  &:focus {
    border: 2px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
    padding: 12px 16px;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 14px;
    border-radius: 8px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  font-family: inherit;
  min-height: 120px;
  resize: vertical;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  
  &:focus {
    border: 2px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
    padding: 12px 16px;
    border-radius: 10px;
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 14px;
    border-radius: 8px;
    min-height: 80px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    gap: 15px;
    margin-top: 8px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-top: 6px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #4a5568;
  font-size: 15px;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: #f7fafc;
  border: 2px solid transparent;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    border-color: rgba(102, 126, 234, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 6px 10px;
    border-radius: 6px;
  }
`;

const Radio = styled.input`
  margin-right: 8px;
  transform: scale(1.2);
  accent-color: #667eea;
  
  @media (max-width: 480px) {
    transform: scale(1.1);
    margin-right: 6px;
  }
`;

const ImageInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  font-size: 16px;
  background: #f7fafc;
  transition: all 0.3s ease;
  font-family: inherit;
  cursor: pointer;
  box-sizing: border-box;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
  
  &:focus {
    border: 2px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
    padding: 12px 16px;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 14px;
    border-radius: 8px;
  }
`;

const ImagePreview = styled.div`
  margin-top: 15px;
  text-align: center;
  
  img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: 3px solid #ffffff;
  }
`;

const ErrorMsg = styled.div`
  color: #e53e3e;
  font-size: 13px;
  margin-top: 5px;
  font-weight: 500;
  padding: 8px 12px;
  background: rgba(229, 62, 62, 0.1);
  border-radius: 6px;
  border-left: 3px solid #e53e3e;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 25px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
    
    button { 
      width: 100%; 
      justify-content: center; 
    }
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 180px;
  
  &:hover:enabled {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
    padding: 14px 28px;
    min-width: 160px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 12px 24px;
    min-width: 100%;
  }
`;

const CancelButton = styled.button`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  color: #4a5568;
  border: 2px solid #e2e8f0;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 140px;
  
  &:hover {
    background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
    color: #c53030;
    border-color: #feb2b2;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(254, 178, 178, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
    padding: 14px 28px;
    min-width: 120px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    padding: 12px 24px;
    min-width: 100%;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 18px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`; 