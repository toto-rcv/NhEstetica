import React, { useState } from 'react';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable from '../../components/tablas/EditableTable';

const Inicio = () => {
  const [data, setData] = useState([
    {
      id: 1,
      metric: 'Total de Clientes',
      valor: '150',
      descripcion: 'Número total de clientes registrados',
      fecha: '2024-01-15'
    },
    {
      id: 2,
      metric: 'Ventas del Mes',
      valor: '$25,000',
      descripcion: 'Ingresos totales del mes actual',
      fecha: '2024-01-15'
    },
    {
      id: 3,
      metric: 'Citas Programadas',
      valor: '45',
      descripcion: 'Citas agendadas para esta semana',
      fecha: '2024-01-15'
    },
    {
      id: 4,
      metric: 'Personal Activo',
      valor: '8',
      descripcion: 'Empleados trabajando actualmente',
      fecha: '2024-01-15'
    }
  ]);

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'metric',
      header: 'Métrica',
    },
    {
      accessorKey: 'valor',
      header: 'Valor',
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
    }
  ];

  return (
    <TablasLayout title="Panel de Inicio">
      <EditableTable
        data={data}
        columns={columns}
        onDataChange={setData}
        title="Métricas del Sistema"
        addRowText="Agregar Métrica"
      />
    </TablasLayout>
  );
};

export default Inicio; 