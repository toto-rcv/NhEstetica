import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DetalleCliente = ({ cliente, onClose }) => {
  const [ventasProductosOriginal, setVentasProductosOriginal] = useState([]);
  const [ventasProductosFiltradas, setVentasProductosFiltradas] = useState([]);

  const [ventasTratamientosOriginal, setVentasTratamientosOriginal] = useState([]);
  const [ventasTratamientosFiltradas, setVentasTratamientosFiltradas] = useState([]);

  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);

        const [resProd, resTrat] = await Promise.all([
          fetch(`/api/ventas/productos/cliente/${cliente.id}`, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
          }),
          fetch(`/api/ventas/tratamientos/cliente/${cliente.id}`, {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
          })
        ]);

        const [dataProd, dataTrat] = await Promise.all([
          resProd.json(),
          resTrat.json()
        ]);

        setVentasProductosOriginal(Array.isArray(dataProd) ? dataProd : []);
        setVentasProductosFiltradas(Array.isArray(dataProd) ? dataProd : []);

        setVentasTratamientosOriginal(Array.isArray(dataTrat) ? dataTrat : []);
        setVentasTratamientosFiltradas(Array.isArray(dataTrat) ? dataTrat : []);

      } catch (err) {
        console.error('Error al obtener ventas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (cliente?.id) fetchVentas();
  }, [cliente]);

const handleBuscarPorFecha = () => {
  const desde = filtroDesde ? new Date(filtroDesde) : null;
  const hasta = filtroHasta ? new Date(filtroHasta) : null;

  const filtrarPorRango = (ventas) =>
    ventas.filter(v => {
      const fecha = new Date(v.fecha);
      if (desde && fecha < desde) return false;
      if (hasta && fecha > hasta) return false;
      return true;
    });

  setVentasProductosFiltradas(filtrarPorRango(ventasProductosOriginal));
  setVentasTratamientosFiltradas(filtrarPorRango(ventasTratamientosOriginal));
};

   

  const calcularEstadisticas = () => {
  const totalTratamientos = ventasTratamientosFiltradas.reduce((acc, v) => acc + v.precio, 0);
  const totalProductos = ventasProductosFiltradas.reduce((acc, v) => acc + v.precio * v.cantidad, 0);
  const total = totalTratamientos + totalProductos;

  // Fechas mínimas y máximas
  const fechas = [...ventasTratamientosFiltradas, ...ventasProductosFiltradas]
    .map(v => new Date(v.fecha))
    .filter(d => !isNaN(d)); // quitar invalid dates

  const visitas = ventasTratamientosFiltradas.length;

  if (fechas.length === 0) return { total: 0, promedioMensual: 0, promedioVisita: 0 };

  const fechaMin = new Date(Math.min(...fechas));
  const fechaMax = new Date(Math.max(...fechas));

  const meses = Math.max(
    (fechaMax.getFullYear() - fechaMin.getFullYear()) * 12 + (fechaMax.getMonth() - fechaMin.getMonth()) + 1,
    1
  );

  const promedioMensual = total / meses;
  const promedioVisita = visitas ? total / visitas : 0;

  return {
    total,
    promedioMensual,
    promedioVisita
  };
};


  if (!cliente) return null;

  return (
    <Overlay onClick={onClose}>
      <DetalleContainer onClick={(e) => e.stopPropagation()}>
        <Encabezado>
          {cliente.imagen && <ImagenCliente src={cliente.imagen} alt="Foto del cliente" />}
          <h3>Cliente: {cliente.nombre} {cliente.apellido}</h3>
        </Encabezado>
        <InputGroup>
          <label>Buscar por rango de fechas:</label>
          <div>
            <input
              type="date"
              value={filtroDesde}
              onChange={(e) => setFiltroDesde(e.target.value)}
            />
            <span style={{ margin: '0 10px' }}>hasta</span>
            <input
              type="date"
              value={filtroHasta}
              onChange={(e) => setFiltroHasta(e.target.value)}
            />
            <button onClick={handleBuscarPorFecha}>Buscar</button>
          </div>
        </InputGroup>

        {/* Ventas de productos */}
        <h4>Compras de Productos</h4>
        {loading ? (
          <MensajeCargando>Cargando ventas...</MensajeCargando>
        ) : ventasProductosFiltradas.length > 0 ? (
          <VentasTable>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Fecha</th>
                <th>Forma de pago</th>
                <th>Cuotas</th>
                <th>Observación</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {ventasProductosFiltradas.map(v => (
                <tr key={v.id}>
                  <td>{v.nombre_producto}</td>
                  <td>{v.marca_producto}</td>
                  <td>${v.precio}</td>
                  <td>{v.cantidad}</td>
                  <td>{v.fecha?.split('T')[0]}</td>
                  <td>{v.forma_de_pago}</td>
                  <td>{v.cuotas || 0}</td>
                  <td>{v.observacion}</td>
                  <td>${v.precio * v.cantidad}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                <td style={{ fontWeight: 'bold' }}>
                  ${ventasProductosFiltradas.reduce((acc, v) => acc + (v.precio * v.cantidad), 0)}
                </td>
              </tr>
            </tfoot>
          </VentasTable>
        ) : (
          <MensajeSinVentas>No se encontraron compras de productos.</MensajeSinVentas>
        )}

        {/* Ventas de tratamientos */}
        <h4>Tratamientos Realizados</h4>
        {loading ? (
          <MensajeCargando>Cargando tratamientos...</MensajeCargando>
        ) : ventasTratamientosFiltradas.length > 0 ? (
          <VentasTable>
            <thead>
              <tr>
                <th>Tratamiento</th>
                <th>Sesiones</th>
                <th>Precio</th>
                <th>Fecha</th>
                <th>Forma de pago</th>
                <th>Cuotas</th>
                <th>Vencimiento</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {ventasTratamientosFiltradas.map(v => (
                <tr key={v.id}>
                  <td>{v.tratamiento_nombre}</td>
                  <td>{v.sesiones}</td>
                  <td>${v.precio}</td>
                  <td>{v.fecha?.split('T')[0]}</td>
                  <td>{v.forma_de_pago}</td>
                  <td>{v.cuotas || 0}</td>
                  <td>{v.vencimiento?.split('T')[0] || '-'}</td>
                  <td>{v.observacion}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="7" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                <td style={{ fontWeight: 'bold' }}>
                  ${ventasTratamientosFiltradas.reduce((acc, v) => acc + v.precio, 0)}
                </td>
              </tr>
            </tfoot>
          </VentasTable>
        ) : (
          <MensajeSinVentas>No se encontraron tratamientos realizados.</MensajeSinVentas>
        )}

        {/* Estadísticas del cliente */}
        <h4>Estadísticas del Cliente</h4>
        {loading ? (
          <MensajeCargando>Cargando estadísticas...</MensajeCargando>
        ) : ventasTratamientosFiltradas.length > 0 ? (
          <VentasTable>
            <thead>
              <tr>
                <th>Total Gastado</th>
                <th>Promedio Mensual</th>
                <th>Promedio por Visita</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${calcularEstadisticas().total.toFixed(2)}</td>
                <td>${calcularEstadisticas().promedioMensual.toFixed(2)}</td>
                <td>${calcularEstadisticas().promedioVisita.toFixed(2)}</td>
              </tr>
            </tbody>
          </VentasTable>

        ) : (
          <MensajeSinVentas>No se encontraron tratamientos realizados.</MensajeSinVentas>
        )}

        <CerrarButton onClick={onClose}>Cerrar</CerrarButton>
      </DetalleContainer>
    </Overlay>
  );
};

export default DetalleCliente;

// (Estilos quedan igual a los que tenías)


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
