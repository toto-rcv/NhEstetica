import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ClienteAutocomplete = ({ clientes, value, onChange, required = false }) => {
  const [inputText, setInputText] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const match = clientes.find(c => c.id === value);
    if (match) {
      setInputText(`${match.nombre} ${match.apellido}`);
    } else if (value === '' || value === null) {
      setInputText('');
    }
  }, [value, clientes]);

  const handleInput = (e) => {
    const text = e.target.value;
    setInputText(text);
    setSelectedIndex(-1);

    if (text.length === 0) {
      setFiltered([]);
      setShowSuggestions(false);
      onChange({ target: { name: 'cliente_id', value: '' } });
      return;
    }

    const resultados = clientes.filter(c =>
      `${c.nombre} ${c.apellido}`.toLowerCase().includes(text.toLowerCase()) ||
      c.documento?.toString().includes(text) ||
      c.telefono?.toString().includes(text)
    );

    setFiltered(resultados);
    setShowSuggestions(resultados.length > 0);
  };

  const seleccionarCliente = (cliente) => {
    setInputText(`${cliente.nombre} ${cliente.apellido}`);
    setFiltered([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onChange({ target: { name: 'cliente_id', value: cliente.id } });
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filtered.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filtered[selectedIndex]) {
          seleccionarCliente(filtered[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (inputText.length > 0 && filtered.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <AutocompleteContainer>
      <SearchIcon>🔍</SearchIcon>
      <StyledInput
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Buscar cliente por nombre, documento o teléfono..."
        required={required}
        $hasValue={inputText.length > 0}
      />
      {showSuggestions && filtered.length > 0 && (
        <Suggestions ref={suggestionsRef}>
          {filtered.map((cliente, index) => (
            <SuggestionItem
              key={cliente.id}
              onClick={() => seleccionarCliente(cliente)}
              $selected={index === selectedIndex}
            >
              <ClienteInfo>
                <ClienteNombre>{cliente.nombre} {cliente.apellido}</ClienteNombre>
                <ClienteDetalles>
                  {cliente.documento && <span>📋 {cliente.documento}</span>}
                  {cliente.telefono && <span>📞 {cliente.telefono}</span>}
                </ClienteDetalles>
              </ClienteInfo>
            </SuggestionItem>
          ))}
        </Suggestions>
      )}
      {inputText.length > 0 && filtered.length === 0 && showSuggestions && (
        <NoResults>
          <NoResultsIcon>😔</NoResultsIcon>
          <NoResultsText>No se encontraron clientes</NoResultsText>
        </NoResults>
      )}
    </AutocompleteContainer>
  );
};

export default ClienteAutocomplete;

// Estilos mejorados
const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 1rem;
  z-index: 1;
  pointer-events: none;
`;

const StyledInput = styled.input`
  padding: 10px 14px 10px 40px;
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid ${props => props.$hasValue ? '#667eea' : '#e2e8f0'};
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #374151;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  outline: none;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: #ffffff;
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #cbd5e1;
  }

  &::placeholder {
    color: #9ca3af;
    font-style: italic;
  }
`;

const Suggestions = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);

  /* Scrollbar personalizada */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const SuggestionItem = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  background: ${props => props.$selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.$selected ? 'white' : '#374151'};
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$selected 
      ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)' 
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ClienteInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ClienteNombre = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;

const ClienteDetalles = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  opacity: 0.8;
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const NoResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 20px;
  text-align: center;
  color: #64748b;
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
`;

const NoResultsIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 8px;
`;

const NoResultsText = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;
