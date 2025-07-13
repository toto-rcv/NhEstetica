import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import ClienteAutocomplete from './extensions/ClienteAutocomplete';

Modal.setAppElement('#root');

const VentaForm = ({ nuevaVenta, onChange, onSubmit, clientes, tratamientos, personal }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const abrirModal = () => {
    if (!nuevaVenta.id) {
      setModalIsOpen(true);
    }
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
    cerrarModal();
  };

  useEffect(() => {
    if (nuevaVenta.id && modalIsOpen) {
      cerrarModal();
    }
  }, [nuevaVenta]);

  return (
    <>
      <AgregarBtn onClick={abrirModal}>💰 Agregar Venta</AgregarBtn>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={cerrarModal}
        contentLabel="Formulario Venta"
        style={modalStyles}
      >
        <Form onSubmit={handleSubmit}>
          <Header>
            <ModalTitle>Agregar nueva venta</ModalTitle>
            <CerrarBtn type="button" onClick={cerrarModal}>✖</CerrarBtn>
          </Header>

          <InputsRow>
            <select name="tratamiento_id" value={nuevaVenta.tratamiento_id} onChange={onChange} required>
              <option value="">Seleccionar tratamiento</option>
              {tratamientos.map(trat => (
                <option key={trat.id} value={trat.id}>
                  {trat.nombre}
                </option>
              ))}
            </select>

            <ClienteAutocomplete
              clientes={clientes}
              value={nuevaVenta.cliente_id}
              onChange={onChange}
              required
            />

            <input
              type="number"
              name="sesiones"
              placeholder="Sesiones"
              value={nuevaVenta.sesiones}
              onChange={onChange}
              required
            />

            <input
              type="number"
              name="precio"
              placeholder="Precio"
              min="0"
              value={nuevaVenta.precio}
              onChange={onChange}
              required
            />

            <select name="personal_id" value={nuevaVenta.personal_id || ''} onChange={onChange}>
              <option value="">Seleccionar personal</option>
              {personal.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>

            <select name="forma_de_pago" value={nuevaVenta.forma_de_pago} onChange={onChange}>
              <option value="">Seleccioná una forma de pago</option>
             <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Débito">Débito</option>
              <option value="Crédito">Crédito</option>
            </select>

             <input
              type="number"
              name="cuotas"
              value={nuevaVenta.cuotas}
              onChange={onChange}
              placeholder="Cuotas"
              disabled={nuevaVenta.forma_de_pago === 'Crédito' ? false : true}
              min="1"
            />

            <label>
              Fecha de vencimiento:
              <input
                type="date"
                name="vencimiento"
                value={nuevaVenta.vencimiento || ''}
                onChange={onChange}
              />
            </label>          

            <input
              type="text"
              name="observacion"
              placeholder="Observación"
              value={nuevaVenta.observacion || ''}
              onChange={onChange}
            />

            <label>
              Fecha de compra:
              <input
                type="date"
                name="fecha"
                value={nuevaVenta.fecha || ''}
                onChange={onChange}
              />
            </label>

            <button type="submit">💰 Agregar Venta</button>
          </InputsRow>
        </Form>
      </Modal>
    </>
  );
};

export default VentaForm;

// --------- STYLES ---------
const modalStyles = {
  content: {
    maxWidth: '650px',
    width: '95%',
    margin: 'auto',
    borderRadius: '20px',
    padding: '1.2rem',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e0f7fa 100%)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxHeight: '85vh',
    overflowY: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    outline: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 1000,
  },
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
`;

const InputsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 0.8rem;

  input,
  select {
    padding: 10px 14px;
    font-size: 0.9rem;
    width: 100%;
    box-sizing: border-box;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    color: #374151;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
      padding: 8px 12px;
      font-size: 0.85rem;
    }
    
    @media (max-width: 480px) {
      padding: 8px 10px;
      font-size: 0.8rem;
    }
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    gap: 0.3rem;
    color: #374151;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    
    @media (max-width: 768px) {
      font-size: 0.75rem;
      gap: 0.2rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  }

  input:focus,
  select:focus {
    border-color: #10b981;
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    background: #ffffff;
    transform: translateY(-1px);
  }

  select {
    cursor: pointer;
  }

  button {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    font-weight: 700;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    font-family: "Raleway";
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
      
      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(0);
    }
    
    @media (max-width: 768px) {
      padding: 10px 20px;
      font-size: 0.85rem;
    }
    
    @media (max-width: 480px) {
      padding: 10px 16px;
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 768px) {
    gap: 0.6rem;
    margin-bottom: 0.6rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const AgregarBtn = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin: 1rem 0;
  font-family: "Raleway";
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.7rem 1.3rem;
    margin: 0.8rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.6rem 1rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    gap: 0.3rem;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
  
  @media (max-width: 768px) {
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.6rem;
  }
`;

const CerrarBtn = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  z-index: 10;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(-50%) scale(1.05);
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
`;

const ModalTitle = styled.h3`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;
