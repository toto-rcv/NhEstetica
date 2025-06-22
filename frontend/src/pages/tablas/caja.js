import React, { useState } from 'react';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable from '../../components/tablas/EditableTable';

const Caja = () => {
  const [data, setData] = useState([
    {
      id: 1,
      fecha: '2024-01-15',
      tipo: 'Ingreso',
      concepto: 'Tratamiento facial',
      monto: '$150.00',
      metodo: 'Efectivo',
      cliente: 'María González',
      estado: 'Completado'
    },
    {
      id: 2,
      fecha: '2024-01-15',
      tipo: 'Egreso',
      concepto: 'Compra de productos',
      monto: '-$75.50',
      metodo: 'Tarjeta',
      cliente: 'N/A',
      estado: 'Completado'
    },
    {
      id: 3,
      fecha: '2024-01-15',
      tipo: 'Ingreso',
      concepto: 'Depilación láser',
      monto: '$200.00',
      metodo: 'Transferencia',
      cliente: 'Ana López',
      estado: 'Pendiente'
    },
    {
      id: 4,
      fecha: '2024-01-15',
      tipo: 'Ingreso',
      concepto: 'Masaje relajante',
      monto: '$80.00',
      metodo: 'Efectivo',
      cliente: 'Carlos Ruiz',
      estado: 'Completado'
    }
  ]);

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
    },
    {
      accessorKey: 'concepto',
      header: 'Concepto',
    },
    {
      accessorKey: 'monto',
      header: 'Monto',
    },
    {
      accessorKey: 'metodo',
      header: 'Método de Pago',
    },
    {
      accessorKey: 'cliente',
      header: 'Cliente',
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
    }
  ];

  return (
    <TablasLayout title="Gestión de Caja">
      <EditableTable
        data={data}
        columns={columns}
        onDataChange={setData}
        title="Transacciones Financieras"
        addRowText="Agregar Transacción"
      />
    </TablasLayout>
  );
};

export default Caja; 