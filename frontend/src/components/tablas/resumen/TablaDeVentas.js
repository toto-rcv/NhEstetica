import React, { useState } from 'react';
import styled from 'styled-components';

const TablaDeVentas = ({ ventas }) => {
  const ventasTratamientos = ventas?.tratamientos || [];
  const ventasProductos = ventas?.productos || [];

  // Unificamos ambas listas, incluyendo fecha
    const ventasUnificadas = [
    ...ventasTratamientos.map((v) => ({
        cliente: v.cliente || '-',
        tratamiento: v.nombre || '-',
        producto: '-',
        total: parseFloat(v.total || 0),
        fecha: v.fecha || v.created_at || null,
    })),
    ...ventasProductos.map((v) => ({
        cliente: v.cliente || '-',
        tratamiento: '-',
        producto: v.nombre || '-',
        total: parseFloat(v.total || 0),
        fecha: v.fecha || v.created_at || null,
    })),
    ];

    const ventasOrdenadas = ventasUnificadas.sort((a, b) => {
  const fechaA = a.fecha ? new Date(a.fecha) : new Date(0);
  const fechaB = b.fecha ? new Date(b.fecha) : new Date(0);
  return fechaB - fechaA;
});

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return '-';
    return date.toLocaleDateString('es-AR'); // dd/mm/yyyy
  };

  // Paginación
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ventasOrdenadas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = ventasOrdenadas.slice(startIndex, startIndex + itemsPerPage);

  const totalGeneral = ventasUnificadas.reduce((acc, v) => acc + v.total, 0);

  if (!ventasUnificadas.length) {
    return <EmptyMessage>No hay ventas registradas este mes.</EmptyMessage>;
  }

  return (
    <VentasContainer>
      <VentasTitle>📊 Resumen de Ventas del Mes</VentasTitle>
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>📅 Fecha</th>
              <th>👤 Cliente</th>
              <th>💆 Tratamiento</th>
              <th>🛍️ Producto</th>
              <th>💰 Total</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((v, i) => (
              <tr key={startIndex + i} className={i % 2 === 0 ? 'even' : 'odd'}>
                <td>
                  <DateCell>{formatDate(v.fecha)}</DateCell>
                </td>
                <td>
                  <ClientCell>{v.cliente}</ClientCell>
                </td>
                <td>
                  <ServiceCell>{v.tratamiento}</ServiceCell>
                </td>
                <td>
                  <ProductCell>{v.producto}</ProductCell>
                </td>
                <td>
                  <AmountCell>${v.total.toLocaleString('es-AR')}</AmountCell>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <TrFooter>
              <td colSpan={4}>
                <TotalLabel>Total General</TotalLabel>
              </td>
              <TotalCell>${totalGeneral.toLocaleString('es-AR')}</TotalCell>
            </TrFooter>
          </tfoot>
        </StyledTable>
      </TableContainer>

      <PaginationContainer>
        <PageButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          &laquo; Anterior
        </PageButton>

        <PageInfo>
          Página {currentPage} de {totalPages}
        </PageInfo>

        <PageButton
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Siguiente &raquo;
        </PageButton>
      </PaginationContainer>
    </VentasContainer>
  );
};

export default TablaDeVentas;

// Styled Components con estética del resumen financiero
const VentasContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  position: relative;
  margin-top: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px 20px 0 0;
  }
`;

const VentasTitle = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  text-align: center;
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;

  th, td {
    padding: 16px 12px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  tbody tr {
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }
    
    &.even {
      background: #fafbfc;
    }
    
    &.odd {
      background: white;
    }
  }

  tbody tr:last-child {
    border-bottom: none;
  }
`;

const DateCell = styled.td`
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const ClientCell = styled.td`
  font-weight: 600;
  color: #34495e;
`;

const ServiceCell = styled.td`
  color: #8e44ad;
  font-weight: 500;
`;

const ProductCell = styled.td`
  color: #e67e22;
  font-weight: 500;
`;

const AmountCell = styled.td`
  font-weight: 700;
  color: #27ae60;
  font-size: 1.1rem;
`;

const TrFooter = styled.tr`
  background: linear-gradient(135deg, #ecf0f1 0%, #e8f4f8 100%);
  font-weight: 700;
  color: #2c3e50;
  border-top: 2px solid #667eea;
`;

const TotalLabel = styled.span`
  font-size: 1.1rem;
  color: #2c3e50;
`;

const TotalCell = styled.td`
  color: #27ae60;
  font-weight: bold;
  font-size: 1.2rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-style: italic;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px dashed #dee2e6;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #dee2e6;
`;

const PageButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:disabled {
    background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
    cursor: not-allowed;
    box-shadow: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const PageInfo = styled.span`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
`;
