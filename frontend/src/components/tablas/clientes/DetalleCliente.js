import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DetalleCliente = ({ cliente, onClose }) => {
  const [ventas, setVentas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/ventas/productos/cliente/' + cliente.id, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
        const data = await res.json();
        setVentas(data);
        setVentasFiltradas(data);
      } catch (err) {
        console.error('Error al obtener ventas del cliente:', err);
      } finally {
        setLoading(false);
      }
    };

    if (cliente?.id) fetchVentas();
  }, [cliente]);

  const handleBuscarPorFecha = () => {
    if (!filtroFecha) {
      setVentasFiltradas(ventas);
      return;
    }

    const filtradas = ventas.filter(v =>
      v.fecha?.startsWith(filtroFecha)
    );

    setVentasFiltradas(filtradas);
  };

  if (!cliente) return null;

  return (
    <Overlay onClick={onClose}>
      <DetalleContainer onClick={(e) => e.stopPropagation()}>
        <Encabezado>
        {cliente.imagen && (
          <ImagenCliente src={cliente.imagen} alt="Foto del cliente" />
        )}
        <h3>Cliente: {cliente.nombre} {cliente.apellido}</h3>
      </Encabezado>


        <InputGroup>
          <label>Buscar por fecha (YYYY-MM-DD):</label>
          <div>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
            <button onClick={handleBuscarPorFecha}>Buscar</button>
          </div>
        </InputGroup>

        <h4>Compras de Productos del cliente</h4>

        {loading ? (
          <MensajeCargando>Cargando ventas...</MensajeCargando>
        ) : ventasFiltradas.length > 0 ? (
          <VentasTable>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Fecha de Compra</th>
                <th>Forma de pago</th>
                <th>Cuotas</th>
                <th>Observación</th>
                <th>Subtotal</th> {/* ← nueva columna */}
              </tr>
            </thead>

            <tbody>
              {ventasFiltradas.map((venta) => {
                const subtotal = venta.precio * venta.cantidad;
                return (
                  <tr key={venta.id}>
                    <td>{venta.nombre_producto}</td>
                    <td>{venta.marca_producto}</td>
                    <td>${venta.precio}</td>
                    <td>{venta.cantidad}</td>
                    <td>{venta.fecha?.split('T')[0]}</td>
                    <td>{venta.forma_de_pago}</td>
                    <td>{venta.cuotas ? venta.cuotas : '0'}</td>
                    <td>{venta.observacion}</td>
                    <td>${subtotal}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                <td style={{ fontWeight: 'bold' }}>
                  ${ventasFiltradas.reduce((acc, v) => acc + (v.precio * v.cantidad), 0)}
                </td>
              </tr>
            </tfoot>

          </VentasTable>
        ) : (
          <MensajeSinVentas>No se encontraron compras para este cliente.</MensajeSinVentas>
        )}

        <CerrarButton onClick={onClose}>Cerrar</CerrarButton>
      </DetalleContainer>
    </Overlay>
  );
};

export default DetalleCliente;

// Estilos

const Overlay = styled.div`
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 999;
`;

const DetalleContainer = styled.div`
  padding: 2rem;
  border-radius: 10px;
  margin-top: 30px;
  width: 90%;
  background: var(--background-overlay);


  h3 {
    font-size: 1.4rem;
  }
`;

const CerrarButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  input {
    padding: 6px;
    margin-right: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    padding: 6px 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const VentasTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 1.1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f0f0f0;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const MensajeSinVentas = styled.p`
  margin-top: 1rem;
  font-style: italic;
  color: #666;
`;

const MensajeCargando = styled.p`
  margin-top: 1rem;
  font-style: italic;
  color: #999;
`;

const Encabezado = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const ImagenCliente = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ccc;
`;
