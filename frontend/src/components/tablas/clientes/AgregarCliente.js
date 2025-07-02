import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ClienteForm = ({ nuevoCliente, onChange, onSubmit }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const abrirModal = () => {
    if (!nuevoCliente.id) setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setImageFile(null);
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
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
    cerrarModal();
  };

  useEffect(() => {
    if (nuevoCliente.id && modalIsOpen) cerrarModal();
  }, [nuevoCliente]);

  return (
    <>
      <AgregarBtn onClick={abrirModal}>➕ Agregar Cliente</AgregarBtn>

      {modalIsOpen && (
        <ModalOverlay onClick={cerrarModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={cerrarModal} title="Cerrar">✖</CloseButton>
            <ModalTitle>Agregar Cliente</ModalTitle>

            <Form onSubmit={handleSubmit}>
              <Field>
                <Label>Nombre*</Label>
                <Input name="nombre" value={nuevoCliente.nombre} onChange={onChange} required />
              </Field>

              <Field>
                <Label>Apellido*</Label>
                <Input name="apellido" value={nuevoCliente.apellido} onChange={onChange} required />
              </Field>

              <Field>
                <Label>Nacionalidad</Label>
                <Select
                  name="nacionalidad"
                  value={nuevoCliente.nacionalidad}
                  onChange={onChange}
                >
                  <option value="">Selecciona nacionalidad</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Paraguay">Paraguay</option>
                </Select>
              </Field>
              <Field>
                <Label>Email</Label>
                <Input type="email" name="email" value={nuevoCliente.email} onChange={onChange} />
              </Field>

              <Field>
                <Label>Teléfono</Label>
                <Input type="tel" name="telefono" value={nuevoCliente.telefono} onChange={onChange} />
              </Field>

              <Field>
                <Label>Dirección</Label>
                <Input name="direccion" value={nuevoCliente.direccion} onChange={onChange} />
              </Field>

          <Field>
            <Label>Antigüedad (fecha)</Label>
            <Input
              type="date"
              name="antiguedad"
              value={nuevoCliente.antiguedad || ''}
              onChange={onChange}
            />
          </Field>

              <Field>
                <Label>Foto del Cliente</Label>
                <ImageInput type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <ImagePreview>
                    <img src={imagePreview} alt="Preview" />
                  </ImagePreview>
                )}
              </Field>

              <ButtonGroup>
                <AddButton type="submit">➕ Agregar</AddButton>
                <CancelButton type="button" onClick={cerrarModal}>❌ Cancelar</CancelButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ClienteForm;

// Reutilizados del modal de productos
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
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
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideIn {
    0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
`;

const ModalTitle = styled.h2`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 30px;
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
  z-index: 10;

  &:hover {
    transform: scale(1.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
  padding-right: 25px;
`;

const Field = styled.div`
  width: 100%;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  display: block;
  text-transform: uppercase;
  color: #2d3748;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  cursor: pointer;

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const ImagePreview = styled.div`
  margin-top: 15px;
  text-align: center;
  
  img {
    max-width: 200px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: 3px solid #ffffff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    button {
      width: 100%;
    }
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
`;

const CancelButton = styled.button`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  color: #4a5568;
  border: 2px solid #e2e8f0;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
    color: #c53030;
    border-color: #feb2b2;
  }
`;

const AgregarBtn = styled.button`
  background: #4caf50;
  color: white;
  font-size: 1rem;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 1rem 0;
  font-family: "Raleway";

  &:hover {
    background: #3e8e41;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background-color: #ffffff;
  font-family: inherit;
  transition: all 0.3s ease;
  appearance: none;

  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
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
