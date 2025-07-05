import React, { useState } from 'react';
import styled from 'styled-components';

const ProductoAutocomplete = ({ value, onChange }) => {
  const [inputText, setInputText] = useState('');
  const [resultados, setResultados] = useState([]);

  const buscarProductos = async (texto) => {
    try {
      const res = await fetch(`/api/productos?query=${texto}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const responseData = await res.json();
      
      // La API devuelve un objeto con estructura de paginación: {data: productos[], pagination: {}}
      const data = responseData.data || responseData;
      setResultados(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al buscar productos:", err);
      setResultados([]);
    }
  };

  const handleInput = (e) => {
    const texto = e.target.value;
    setInputText(texto);
    if (texto.length >= 2) buscarProductos(texto);
    else setResultados([]);
  };

  const seleccionarProducto = (producto) => {
    setInputText(producto.nombre);
    setResultados([]);
    onChange({ target: { name: 'producto_id', value: producto.id } });
  };

  return (
    <AutocompleteContainer>
      <input
        type="text"
        value={inputText}
        onChange={handleInput}
        placeholder="Buscar producto..."
      />
      {resultados.length > 0 && (
        <Suggestions>
          {resultados.map(p => (
            <li key={p.id} onClick={() => seleccionarProducto(p)}>
              {p.nombre} - {p.marca}
            </li>
          ))}
        </Suggestions>
      )}
    </AutocompleteContainer>
  );
};

export default ProductoAutocomplete;

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
