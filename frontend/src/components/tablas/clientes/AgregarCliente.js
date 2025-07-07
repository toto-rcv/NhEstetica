import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ClienteForm = ({ nuevoCliente, onChange, onSubmit }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const abrirModal = () => {
    if (!nuevoCliente.id) {
      setModalIsOpen(true);
      // Resetear vista previa de imagen
      setImagePreview('');
    }
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const simulatedEvent = {
        target: {
          name: 'imagen',
          files: [file],
        },
      };
      onChange(simulatedEvent);
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(e);
      cerrarModal();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (nuevoCliente.id && modalIsOpen) {
      cerrarModal();
    }
  }, [nuevoCliente]);

  return (
    <>
      <AddClientButton onClick={abrirModal}>
        <ButtonIcon>👤</ButtonIcon>
        <ButtonText>Agregar Cliente</ButtonText>
      </AddClientButton>

      {modalIsOpen && (
        <ModalOverlay onClick={cerrarModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <TitleIcon>👤</TitleIcon>
                Nuevo Cliente
              </ModalTitle>
              <CloseButton onClick={cerrarModal} title="Cerrar">
                ✕
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGrid>
                <FormColumn>
                  <Field>
                    <Label>
                      <LabelIcon>👤</LabelIcon>
                      Nombre *
                    </Label>
                    <Input 
                      name="nombre" 
                      value={nuevoCliente.nombre} 
                      onChange={onChange} 
                      required 
                      placeholder="Ingresa el nombre"
                    />
                  </Field>

                  <Field>
                    <Label>
                      <LabelIcon>👤</LabelIcon>
                      Apellido *
                    </Label>
                    <Input 
                      name="apellido" 
                      value={nuevoCliente.apellido} 
                      onChange={onChange} 
                      required 
                      placeholder="Ingresa el apellido"
                    />
                  </Field>

                  <Field>
                    <Label>
                      <LabelIcon>📧</LabelIcon>
                      Email
                    </Label>
                    <Input 
                      type="email" 
                      name="email" 
                      value={nuevoCliente.email} 
                      onChange={onChange} 
                      placeholder="ejemplo@correo.com"
                    />
                  </Field>

                  <Field>
                    <Label>
                      <LabelIcon>📞</LabelIcon>
                      Teléfono
                    </Label>
                    <Input 
                      type="tel" 
                      name="telefono" 
                      value={nuevoCliente.telefono} 
                      onChange={onChange} 
                      placeholder="+54 11 1234-5678"
                    />
                  </Field>
                </FormColumn>

                <FormColumn>
                  <Field>
                    <Label>
                      <LabelIcon>🏠</LabelIcon>
                      Dirección
                    </Label>
                    <Input 
                      name="direccion" 
                      value={nuevoCliente.direccion} 
                      onChange={onChange} 
                      placeholder="Calle, número, ciudad"
                    />
                  </Field>

                  <Field>
                    <Label>
                      <LabelIcon>🌍</LabelIcon>
                      Nacionalidad
                    </Label>
                    <Select
                      name="nacionalidad"
                      value={nuevoCliente.nacionalidad}
                      onChange={onChange}
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Argentina">🇦🇷 Argentina</option>
                      <option value="Paraguay">🇵🇾 Paraguay</option>
                    </Select>
                  </Field>

                  <Field>
                    <Label>
                      <LabelIcon>📅</LabelIcon>
                      Fecha de ingreso
                    </Label>
                    <Input
                      type="date"
                      name="antiguedad"
                      value={nuevoCliente.antiguedad || ''}
                      onChange={onChange}
                    />
                  </Field>

                  <Field>
                    <Label>
                      <LabelIcon>📷</LabelIcon>
                      Foto del Cliente
                    </Label>
                    <ImageUploadArea>
                      <ImageInput 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        id="image-upload"
                      />
                      <ImageUploadLabel htmlFor="image-upload">
                        {imagePreview ? (
                          <ImagePreview>
                            <PreviewImage src={imagePreview} alt="Vista previa" />
                            <ChangeImageText>Cambiar imagen</ChangeImageText>
                          </ImagePreview>
                        ) : (
                          <ImagePlaceholder>
                            <PlaceholderIcon>📷</PlaceholderIcon>
                            <PlaceholderText>Seleccionar imagen</PlaceholderText>
                            <PlaceholderSubtext>JPG, PNG, GIF (máx. 5MB)</PlaceholderSubtext>
                          </ImagePlaceholder>
                        )}
                      </ImageUploadLabel>
                    </ImageUploadArea>
                  </Field>
                </FormColumn>
              </FormGrid>

              <FormFooter>
                <ButtonGroup>
                  <CancelButton type="button" onClick={cerrarModal}>
                    ❌ Cancelar
                  </CancelButton>
                  <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner />
                        Guardando...
                      </>
                    ) : (
                      <>
                        ✅ Agregar Cliente
                      </>
                    )}
                  </SubmitButton>
                </ButtonGroup>
              </FormFooter>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ClienteForm;

// Estilos modernos y profesionales
const AddClientButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
`;

const ButtonText = styled.span`
  font-weight: 600;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
  padding: 2rem;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideIn {
    0% { transform: scale(0.9) translateY(-20px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px 20px 0 0;
`;

const ModalTitle = styled.h2`
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TitleIcon = styled.span`
  font-size: 1.5rem;
  color: #667eea;
`;

const CloseButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
  }
`;

const Form = styled.form`
  padding: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LabelIcon = styled.span`
  font-size: 1rem;
  color: #667eea;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  color: #2d3748;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  color: #2d3748;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ImageUploadArea = styled.div`
  position: relative;
`;

const ImageInput = styled.input`
  display: none;
`;

const ImageUploadLabel = styled.label`
  display: block;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ImagePlaceholder = styled.div`
  border: 2px dashed #cbd5e0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  background: #f7fafc;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const PlaceholderIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #a0aec0;
`;

const PlaceholderText = styled.div`
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.25rem;
`;

const PlaceholderSubtext = styled.div`
  font-size: 0.85rem;
  color: #718096;
`;

const ImagePreview = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const ChangeImageText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 1rem;
  font-weight: 600;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ImagePreview}:hover & {
    opacity: 1;
  }
`;

const FormFooter = styled.div`
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CancelButton = styled.button`
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
