import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ClienteForm = ({ nuevoCliente, onChange, onSubmit }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const abrirModal = () => {
    // Solo abrimos el modal si estamos agregando (sin ID)
    if (!nuevoCliente.id) {
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

  // Si detectamos que se está editando (hay un id), cerramos el modal si estuviera abierto
  useEffect(() => {
    if (nuevoCliente.id && modalIsOpen) {
      cerrarModal();
    }
  }, [nuevoCliente]);

  return (
    <>
      <AgregarBtn onClick={abrirModal}>Agregar Cliente</AgregarBtn>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={cerrarModal}
        contentLabel="Formulario Cliente"
        style={modalStyles}
      >
          <Form onSubmit={handleSubmit}>
            <Header>
              <CerrarBtn type="button" onClick={cerrarModal}>✖</CerrarBtn>
            </Header>
              <h3>Agregar nuevo cliente</h3>

            <InputsRow>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoCliente.nombre}
              onChange={onChange}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={nuevoCliente.apellido}
              onChange={onChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={nuevoCliente.email}
              onChange={onChange}
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={nuevoCliente.telefono}
              onChange={onChange}
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={nuevoCliente.direccion}
              onChange={onChange}
            />

            <FieldGroup>
              <label htmlFor="antiguedad">Antigüedad (años):</label>
              <input
                type="number"
                id="antiguedad"
                name="antiguedad"
                placeholder="Ej: 2"
                min={0}
                value={nuevoCliente.antiguedad}
                onChange={onChange}
              />
            </FieldGroup>

            <button type="submit">Agregar</button>
          </InputsRow>
        </Form>
      </Modal>
    </>
  );
};

export default ClienteForm;

const Form = styled.form` 
  padding: 1rem;
  border-radius: 20px;
  font-family: "Raleway";
`;

const InputsRow = styled.div`
  display: flex;
  flex-direction: column; /* <== cada input en una línea */
  gap: 1rem;
  margin-bottom: 1rem;

  input {
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
    align-self: flex-start; /* botón alineado al inicio */
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

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    color: #444;
  }

  input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;


const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
  gap: 20px;

  h3 {
    margin: 0;
  }
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
