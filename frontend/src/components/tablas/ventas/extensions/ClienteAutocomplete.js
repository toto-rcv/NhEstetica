import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ClienteAutocomplete = ({ clientes, value, onChange }) => {
  const [inputText, setInputText] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const match = clientes.find(c => c.id === value);
    if (match) {
      setInputText(`${match.nombre} ${match.apellido}`);
    }
  }, [value, clientes]);

  const handleInput = (e) => {
    const text = e.target.value;
    setInputText(text);

    const resultados = clientes.filter(c =>
      `${c.nombre} ${c.apellido}`.toLowerCase().includes(text.toLowerCase())
    );

    setFiltered(resultados);
  };

  const seleccionarCliente = (cliente) => {
    setInputText(`${cliente.nombre} ${cliente.apellido}`);
    setFiltered([]);
    onChange({ target: { name: 'cliente_id', value: cliente.id } });
  };

  return (
    <AutocompleteContainer>
      <input
        type="text"
        value={inputText}
        onChange={handleInput}
        placeholder="Buscar cliente..."
      />
      {filtered.length > 0 && (
        <Suggestions>
          {filtered.map(cliente => (
            <li key={cliente.id} onClick={() => seleccionarCliente(cliente)}>
              {cliente.nombre} {cliente.apellido}
            </li>
          ))}
        </Suggestions>
      )}
    </AutocompleteContainer>
  );
};

export default ClienteAutocomplete;

// Estilos
const AutocompleteContainer = styled.div`
  position: relative;
`;

const Suggestions = styled.ul`
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 5;

  li {
    padding: 8px 10px;
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }
`;
