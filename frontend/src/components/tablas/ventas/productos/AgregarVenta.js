import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import ProductoAutocomplete from './extensions/ProductoAutocomplete';
import ClienteAutocomplete from '../tratamientos/extensions/ClienteAutocomplete';

Modal.setAppElement('#root');

const VentaForm = ({ nuevaVenta, onChange, onSubmit, clientes, productos }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { width } = useScreenSize();

  const abrirModal = () => {
    if (!nuevaVenta.id) setModalIsOpen(true);
  };

  const cerrarModal = () => setModalIsOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
    cerrarModal();
  };

  useEffect(() => {
    if (nuevaVenta.id && modalIsOpen) cerrarModal();
  }, [nuevaVenta]);

  const productoSeleccionado = Array.isArray(productos) ? productos.find(p => p.id === parseInt(nuevaVenta.producto_id)) : null;

  return (
    <>
      <AgregarBtn onClick={abrirModal}>
        <span>💰</span>
        Agregar Venta
      </AgregarBtn>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={cerrarModal}
        contentLabel="Formulario Venta Producto"
        style={getModalStyles(width)}
      >
        <Form onSubmit={handleSubmit}>
          <Header>
            <CerrarBtn type="button" onClick={cerrarModal}>✖</CerrarBtn>
          </Header>

          <ModalTitle>Agregar nueva venta de producto</ModalTitle>

          <InputsRow>
            <ProductoAutocomplete
              value={nuevaVenta.producto_id}
              onChange={onChange}
            />
            {productoSeleccionado && (
              <span><strong>Marca:</strong> {productoSeleccionado.marca}</span>
            )}

            <input
              type="number"
              name="costo"
              placeholder="Costo"
              min="0"
              value={nuevaVenta.costo}
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
            <input
              type="number"
              name="cantidad"
              placeholder="Cantidad"
              min="1"
              value={nuevaVenta.cantidad}
              onChange={onChange}
              required
            />

             <ClienteAutocomplete
              clientes={clientes}
              value={nuevaVenta.cliente_id}
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

          <select
            name="forma_de_pago"
            value={nuevaVenta.forma_de_pago}
            onChange={onChange}
          >
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

          <input
            type="text"
            name="observacion"
            value={nuevaVenta.observacion}
            onChange={onChange}
            placeholder="Observaciones"
          />
            <button type="submit">Agregar</button>
          </InputsRow>
        </Form>
      </Modal>
    </>
  );
};

export default VentaForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const InputsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;

  input,
  select {
    padding: 14px 18px;
    font-size: 1rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    display: block;
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    gap: 0.3rem;
    font-size: 0.95rem;
  }

  input:hover,
  select:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }

  input:focus,
  select:focus {
    border-color: #10b981;
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    background: #ffffff;
    transform: translateY(-1px);
  }

  button {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    font-weight: bold;
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    font-family: "Raleway";
    align-self: flex-start;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 200px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
  }

  button:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);

    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    gap: 0.8rem;
    
    input,
    select {
      padding: 12px 16px;
      font-size: 0.95rem;
    }

    button {
      padding: 12px 24px;
      font-size: 15px;
      max-width: 100%;
      align-self: stretch;
    }

    label {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    gap: 0.7rem;
    
    input,
    select {
      padding: 10px 14px;
      font-size: 0.9rem;
      border-radius: 8px;
    }

    button {
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 8px;
    }

    label {
      font-size: 0.85rem;
      gap: 0.2rem;
    }
  }
`;


const AgregarBtn = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin: 0;
  font-family: "Raleway";
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-width: 150px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
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
    font-size: 0.85rem;
    padding: 0.6rem 1rem;
    min-width: 140px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.6rem 1rem;
    width: 100%;
    max-width: 200px;
    min-width: auto;
  }
`;

// Hook para detectar tamaño de pantalla
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

const getModalStyles = (width) => {
  const isMobile = width <= 480;
  const isTablet = width <= 768 && width > 480;
  
  return {
    content: {
      maxWidth: isMobile ? '100%' : '600px',
      width: isMobile ? '100%' : isTablet ? '98%' : '95%',
      height: isMobile ? '100%' : 'auto',
      maxHeight: isMobile ? '100vh' : '95vh',
      margin: 'auto',
      borderRadius: isMobile ? '0' : isTablet ? '15px' : '20px',
      padding: isMobile ? '1rem' : isTablet ? '1rem' : '1.5rem',
      top: isMobile ? '0' : '50%',
      left: isMobile ? '0' : '50%',
      right: 'auto',
      bottom: 'auto',
      transform: isMobile ? 'none' : 'translate(-50%, -50%)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e0f2fe 100%)',
      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
      overflow: 'auto',
      border: 'none',
    },
    overlay: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
    },
  };
};

const Header = styled.div`
  width: 100%;
  height: 0; /* no ocupa espacio visual */
  position: relative;
`;

const CerrarBtn = styled.button`
  position: absolute;
  top: -20px;
  right: -20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  z-index: 100;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    top: -15px;
    right: -15px;
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    font-size: 16px;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  }
`;


const ModalTitle = styled.h3`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 22px;
    margin-bottom: 18px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 15px;
    margin-top: 10px;
  }
`;
