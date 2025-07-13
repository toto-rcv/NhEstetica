import React from 'react';
import styled from 'styled-components';

const ResumenFinanciero = ({
  estadisticas,
  alquiler,
  expensas,
  editingAlquiler,
  editingExpensas,
  handleEditAlquiler,
  handleEditExpensas,
  handleSaveGastos,
  saving,
  saveError,
  saveSuccess,
  setAlquiler,
  setExpensas,
  formatMoney,
  gananciaMensual,
}) => {
  const totalGastosActualizados =
    (parseFloat(estadisticas.totalGastos?.egresos) || 0) +
    (parseFloat(estadisticas.totalGastos?.comisiones) || 0) +
    (parseFloat(alquiler) || 0) +
    (parseFloat(expensas) || 0);

    const totalIngresos = Object.values(estadisticas.ventasPorForma || {}).reduce(
  (acc, val) => acc + (parseFloat(val) || 0),
  0
);


  return (
    <Container>
    <GridResumen>
      <TablaContainer>
        <StatCard>
          <StatTitle>Ingresos del Mes</StatTitle>
          <StatAmount>{formatMoney(totalIngresos)}</StatAmount>
        </StatCard>
        <TablaTitulo>Ventas por Forma de Pago</TablaTitulo>
        <StyledTable>
          <thead>
            <tr>
              <th>Forma de Pago</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(estadisticas.ventasPorForma || {}).map(([forma, total], index) => (
              <tr key={forma} className={index % 2 === 0 ? 'even' : 'odd'}>
                <td>
                  <PaymentMethod>
                    <PaymentIcon>{getPaymentIcon(forma)}</PaymentIcon>
                    <PaymentText>{forma}</PaymentText>
                  </PaymentMethod>
                </td>
                <td>
                  <AmountCell>{formatMoney(total)}</AmountCell>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>

        <StatTitle>Total retirado de Caja: {formatMoney(estadisticas.cierres)}</StatTitle>
      </TablaContainer>

      <GastosContainer>
        <StatCardNegative>
          <StatTitle>Total Gastos del Mes</StatTitle>
          <StatAmountNegative>{formatMoney(totalGastosActualizados)}</StatAmountNegative>
        </StatCardNegative>        
        <GastosTable>
          <thead>
            <tr>
              <th>Tipo de Gasto</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd">
              <td>
                <GastoType>
                  <GastoIcon>📊</GastoIcon>
                  <GastoText>Gastos de Egresos</GastoText>
                </GastoType>
              </td>
              <td>
                <GastosAmountCell>{formatMoney(estadisticas.totalGastos?.egresos)}</GastosAmountCell>
              </td>
              <td>-</td>
            </tr>
            <tr className="even">
              <td>
                <GastoType>
                  <GastoIcon>💼</GastoIcon>
                  <GastoText>Gastos de Comisiones</GastoText>
                </GastoType>
              </td>
              <td>
                <GastosAmountCell>{formatMoney(estadisticas.totalGastos?.comisiones)}</GastosAmountCell>
              </td>
              <td>-</td>
            </tr>
            <tr className="odd">
              <td>
                <GastoType>
                  <GastoIcon>🏢</GastoIcon>
                  <GastoText>Expensas de Local</GastoText>
                </GastoType>
              </td>
              <td>
                {editingExpensas ? (
                  <Input
                    type="number"
                    value={expensas}
                    onChange={e => setExpensas(e.target.value)}
                    placeholder="Ingrese expensas"
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <TextoEditable onClick={handleEditExpensas}>{formatMoney(expensas)}</TextoEditable>
                )}
              </td>
              <td>
                <EditButton onClick={handleEditExpensas}>
                  {editingExpensas ? '✓' : '✏️'}
                </EditButton>
              </td>
            </tr>
            <tr className="even">
              <td>
                <GastoType>
                  <GastoIcon>🏠</GastoIcon>
                  <GastoText>Alquiler de Local</GastoText>
                </GastoType>
              </td>
              <td>
                {editingAlquiler ? (
                  <Input
                    type="number"
                    value={alquiler}
                    onChange={e => setAlquiler(e.target.value)}
                    placeholder="Ingrese alquiler"
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <TextoEditable onClick={handleEditAlquiler}>{formatMoney(alquiler)}</TextoEditable>
                )}
              </td>
              <td>
                <EditButton onClick={handleEditAlquiler}>
                  {editingAlquiler ? '✓' : '✏️'}
                </EditButton>
              </td>
            </tr>
          </tbody>
        </GastosTable>

        {(editingAlquiler || editingExpensas) && (
          <GuardarBtn onClick={handleSaveGastos} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar gastos fijos'}
          </GuardarBtn>
        )}

        {saveError && <ErrorMsg>{saveError}</ErrorMsg>}
        {saveSuccess && <SuccessMsg>Guardado con éxito!</SuccessMsg>}
      </GastosContainer>
     
    </GridResumen>
     <StatCard>
        <StatTitle>Ganancia Mensual Final</StatTitle>
        <StatAmount>{formatMoney(gananciaMensual)}</StatAmount>
      </StatCard>
    </Container>
  );
};

// Función para obtener iconos según el método de pago
const getPaymentIcon = (forma) => {
  const icons = {
    'Efectivo': '💵',
    'Tarjeta de Débito': '💳',
    'Tarjeta de Crédito': '💳',
    'Transferencia': '🏦',
    'Mercado Pago': '📱',
    'Otros': '💰'
  };
  return icons[forma] || '💰';
};

export default ResumenFinanciero;

const Container = styled.div`
`

const GridResumen = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const TablaContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin-bottom: 2rem;
  border: 1px solid #e8e8e8;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
   background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
    border-radius: 20px 20px 0 0;
  }
`;

const TablaTitulo = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
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
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  thead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    th {
      color: white;
      font-weight: 600;
      font-size: 1.1rem;
      padding: 1.2rem 1rem;
      text-align: left;
      border: none;
      position: relative;
      
      &:first-child {
        border-radius: 15px 0 0 0;
      }
      
      &:last-child {
        border-radius: 0 15px 0 0;
      }
    }
  }

  tbody {
    tr {
      transition: all 0.3s ease;
      
      &.even {
        background-color: #f8f9fa;
      }
      
      &.odd {
        background-color: white;
      }
      
      &:hover {
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        transform: scale(1.01);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      &:last-child {
        td:first-child {
          border-radius: 0 0 0 15px;
        }
        
        td:last-child {
          border-radius: 0 0 15px 0;
        }
      }
    }
    
    td {
      padding: 1.2rem 1rem;
      border: none;
      color: #2c3e50;
      font-weight: 500;
      font-size: 1rem;
      border-bottom: 1px solid #e8e8e8;
    }
  }
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const PaymentIcon = styled.span`
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
`;

const PaymentText = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const AmountCell = styled.span`
  font-weight: 700;
  color: #27ae60;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.2);
`;

const GastosContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  position: relative;
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
    border-radius: 20px 20px 0 0;
  }
`;

const GastosTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  thead {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    
    th {
      color: white;
      font-weight: 600;
      font-size: 1.1rem;
      padding: 1.2rem 1rem;
      text-align: left;
      border: none;
      position: relative;
      
      &:first-child {
        border-radius: 15px 0 0 0;
      }
      
      &:last-child {
        border-radius: 0 15px 0 0;
      }
    }
  }

  tbody {
    tr {
      transition: all 0.3s ease;
      
      &.even {
        background-color: #f8f9fa;
      }
      
      &.odd {
        background-color: white;
      }
      
      &:hover {
        background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
        transform: scale(1.01);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      &:last-child {
        td:first-child {
          border-radius: 0 0 0 15px;
        }
        
        td:last-child {
          border-radius: 0 0 15px 0;
        }
      }
    }
    
    td {
      padding: 1.2rem 1rem;
      border: none;
      color: #2c3e50;
      font-weight: 500;
      font-size: 1rem;
      border-bottom: 1px solid #e8e8e8;
    }
  }
`;

const GastoType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const GastoIcon = styled.span`
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  border-radius: 50%;
  color: white;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
`;

const GastoText = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const TotalAmount = styled.span`
  font-weight: 700;
  color: #e74c3c;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.2);
  border: 2px solid #e74c3c;
`;

const TotalGastosAmount = styled.span`
  font-weight: 700;
  color: #e74c3c;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  padding: 1rem 1.5rem;
  border-radius: 25px;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
  border: 2px solid #e74c3c;
`;

const GastosAmountCell = styled.span`
  font-weight: 700;
  color: #e74c3c;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.2);
`;

const EditButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
`;

const StatCardNegative = styled(StatCard)`
  &::before {
    background:linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
  }

`

const StatTitle = styled.h3`
  color: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 700;

  &:before {
    content: '📊';
    margin-right: 0.5rem;
    font-size: 1.3rem;
  }
`;

const StatAmount = styled.p`
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  padding: 1rem 1.5rem;
  border-radius: 25px;
  margin-top: 1rem;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  border: 2px solid #4caf50;
`;

const StatAmountNegative = styled(StatAmount)`
  color: #e74c3c;
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border: 2px solid #e74c3c;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  font-size: 1.1rem;
  border-radius: 15px;
  border: 2px solid #e0e0e0;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: scale(1.02);
  }
`;

const GuardarBtn = styled.button`
  margin-top: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 15px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
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
`;

const ErrorMsg = styled.p`
  color: #e74c3c;
  margin-top: 0.5rem;
  font-weight: 600;
  background: #fdf2f2;
  padding: 0.8rem;
  border-radius: 10px;
  border-left: 4px solid #e74c3c;
`;

const SuccessMsg = styled.p`
  color: #27ae60;
  margin-top: 0.5rem;
  font-weight: 600;
  background: #f0f9f0;
  padding: 0.8rem;
  border-radius: 10px;
  border-left: 4px solid #27ae60;
`;

const TextoEditable = styled.p`
  cursor: pointer;
  padding: 0.8rem 1.2rem;
  border-radius: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #667eea;
  text-align: center;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-top: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border-color: #764ba2;
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
`;
