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
      <AgregarBtn onClick={abrirModal}>Agregar Venta</AgregarBtn>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={cerrarModal}
        contentLabel="Formulario Venta"
        style={modalStyles}
      >
        <Form onSubmit={handleSubmit}>
          <Header>
            <CerrarBtn type="button" onClick={cerrarModal}>✖</CerrarBtn>
          </Header>

          <ModalTitle>Agregar nueva venta</ModalTitle>

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
              readOnly
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
              <option value="Contado">Contado</option>
              <option value="Debito">Débito</option>
            </select>

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
              type="number"
              name="cuotas"
              placeholder="Cuotas"
              min="0"
              value={nuevaVenta.cuotas || ''}
              onChange={onChange}
            />

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

            <button type="submit">Agregar</button>
          </InputsRow>
        </Form>
      </Modal>
    </>
  );
};

export default VentaForm;

// --------- STYLES ---------
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 30px;
  text-align: left;
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
  }

  input:focus,
  select:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: bold;
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    font-family: "Raleway";
    align-self: flex-start;
    transition: 0.3s ease;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
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

const modalStyles = {
  content: {
    maxWidth: '600px',
    width: '90%',
    margin: 'auto',
    borderRadius: '20px',
    padding: '2rem',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e0f7fa 100%)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
};

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
`;

const CerrarBtn = styled.button`
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

const ModalTitle = styled.h3`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
`;
