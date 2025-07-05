import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';

const ITEMS_PER_PAGE = 10;

function ComisionesCalculadas() {
  const [ventas, setVentas] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ventasRes, personalRes] = await Promise.all([
        fetch('/api/ventas/tratamientos'),
        fetch('/api/personal')
      ]);

      if (!ventasRes.ok || !personalRes.ok) {
        throw new Error('Error al obtener datos');
      }

      const ventasData = await ventasRes.json();
      const personalData = await personalRes.json();

      setVentas(ventasData);
      setPersonal(personalData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const calcularComisiones = () => {
    return ventas
      .map((venta) => {
        const persona = personal.find((p) => p.id === venta.personal_id);
        if (!persona) return null;

        const comisionPorcentaje = Number(persona.comision_venta || 0);
        const comisionFija = Number(persona.comision_fija || 0);
        const totalVenta = venta.precio * venta.sesiones;
        const comisionPorcentualCalculada = (totalVenta * comisionPorcentaje) / 100;
        const totalComision = comisionPorcentualCalculada + (comisionFija * venta.sesiones);

      return {
        id: venta.id,
        fecha: venta.fecha,
        personal: `${persona.nombre} ${persona.apellido}`,
        tratamiento: venta.tratamiento_nombre,
        sesiones: venta.sesiones,
        precio: totalVenta,
        comision_pct: persona.comision_venta,
        comision_porcentual: comisionPorcentualCalculada,
        comision_fija: comisionFija * venta.sesiones,
        total_comision: totalComision
      };

      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  // Aplicar filtro por fecha
  const comisionesFiltradas = calcularComisiones().filter(c => {
    if (!fechaFiltro) return true;

    // Normalizamos la fecha de la venta para comparar solo yyyy-mm-dd
    const fechaVenta = new Date(c.fecha).toISOString().split('T')[0];

    return fechaVenta === fechaFiltro;
  });


  // Calcular páginas
  const totalPaginas = Math.ceil(comisionesFiltradas.length / ITEMS_PER_PAGE);

  // Paginación: obtener ítems de la página actual
  const comisionesPaginadas = comisionesFiltradas.slice(
    (pagina - 1) * ITEMS_PER_PAGE,
    pagina * ITEMS_PER_PAGE
  );

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPaginas) return;
    setPagina(newPage);
  };

  // Manejar cambio de filtro fecha (reset paginado)
  const handleFechaChange = (e) => {
    setFechaFiltro(e.target.value);
    setPagina(1);
  };

  return (
    <TablasLayout title="Comisiones del Personal">
      <Container>
        <h2>Historial de comisiones del personal por las ventas de tratamientos</h2>

        <FiltroContainer>
          <label htmlFor="fechaFiltro">Filtrar por Fecha:</label>
          <input
            id="fechaFiltro"
            type="date"
            value={fechaFiltro}
            onChange={handleFechaChange}
          />
        </FiltroContainer>

        {loading && <p>Cargando...</p>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!loading && !error && (
          <>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Personal</th>
                    <th>Tratamiento</th>
                    <th>Sesiones</th>
                    <th>Precio</th>
                    <th>Comisión %</th>
                    <th>Comisión fija</th>
                    <th>Total Comisión</th>
                  </tr>
                </thead>
               <tbody>
                {comisionesPaginadas.length > 0 ? (
                  comisionesPaginadas.map((c, index) => (
                    <tr key={c.id}>
                      <td>{new Date(c.fecha).toLocaleDateString()}</td>
                      <td>{c.personal}</td>
                      <td>{c.tratamiento}</td>
                      <td>{c.sesiones}</td>
                      <td>${Math.round(c.precio)}</td>
                      <td>${Math.round(c.comision_porcentual)} ({c.comision_pct}%)</td>
                      <td>${Math.round(c.comision_fija)}</td>
                      <td><strong>${Math.round(c.total_comision)}</strong></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>No hay datos de comisiones</td>
                  </tr>
                )}
              </tbody>

              </Table>
            </TableContainer>

            <Paginador>
              <button onClick={() => handlePageChange(pagina - 1)} disabled={pagina === 1}>
                ← Anterior
              </button>

              <PageInfo>
                Página {pagina} de {totalPaginas}
              </PageInfo>

              <button onClick={() => handlePageChange(pagina + 1)} disabled={pagina === totalPaginas}>
                Siguiente →
              </button>
            </Paginador>
          </>
        )}
      </Container>
    </TablasLayout>
  );
}

export default ComisionesCalculadas;

const Container = styled.div`
  text-align: left;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FiltroContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-weight: 600;
  }

  input[type="date"] {
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
`;

const TableContainer = styled.div`
  margin-top: 2rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  th {
    background: #667eea;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: white;
    border-bottom: 2px solid #ddd;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    color: #666;
    font-size: 1.1rem;
  }

  tr:hover {
    background: #f9f9f9;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const Paginador = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;

  button {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
    font-family: var(--text-font);

    &:disabled {
      background: #a0a0a0;
      cursor: default;
    }

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }
`;

const PageInfo = styled.span`
  font-weight: 600;
  align-self: center;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #d32f2f;
  font-size: 1.1rem;
  background: #ffebee;
  border-radius: 5px;
  margin: 1rem 0;
`;
