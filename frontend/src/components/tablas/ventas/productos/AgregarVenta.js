import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import ProductoAutocomplete from './extensions/ProductoAutocomplete';
import ClienteAutocomplete from '../tratamientos/extensions/ClienteAutocomplete';

Modal.setAppElement('#root');

const VentaForm = ({ nuevaVenta, onChange, onSubmit, clientes, productos }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const productoSeleccionado = productos.find(p => p.id === parseInt(nuevaVenta.producto_id));

  return (
    <>
      <AgregarBtn onClick={abrirModal}>Agregar Venta</AgregarBtn>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={cerrarModal}
        contentLabel="Formulario Venta Producto"
        style={modalStyles}
      >
        <Form onSubmit={handleSubmit}>
          <Header>
            <CerrarBtn type="button" onClick={cerrarModal}>✖</CerrarBtn>
          </Header>

          <h3>Agregar nueva venta de producto</h3>

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

             <ClienteAutocomplete
              clientes={clientes}
              value={nuevaVenta.cliente_id}
              onChange={onChange}
            />

            <input
            type="date"
            name="fecha"
            value={nuevaVenta.fecha}
            onChange={onChange}
            placeholder="Fecha"
          />

          <select
            name="forma_de_pago"
            value={nuevaVenta.forma_de_pago}
            onChange={onChange}
          >
            <option value="">Seleccioná una forma de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Contado">Contado</option>
            <option value="Debito">Débito</option>
          </select>

          <input
            type="number"
            name="cuotas"
            value={nuevaVenta.cuotas}
            onChange={onChange}
            placeholder="Cuotas"
            disabled={nuevaVenta.forma_de_pago !== 'Debito'}
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
  padding: 1rem;
  border-radius: 20px;
  font-family: "Raleway";
`;

const InputsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;

  input, select {
    padding: 0.5rem;
    font-size: 1rem;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    background: #667eea;
    color: white;
    font-weight: bold;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 5px;
    font-family: "Raleway";
    cursor: pointer;
    align-self: flex-start;
  }

  button:hover {
    background: #5566dd;
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
    maxWidth: '500px',
    margin: 'auto',
    borderRadius: '20px',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
  },
};

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
  gap: 20px;
`;

const CerrarBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #333;
  }
`;
