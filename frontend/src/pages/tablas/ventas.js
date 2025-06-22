import React, { useState } from 'react';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable from '../../components/tablas/EditableTable';

const Ventas = () => {
  const [data, setData] = useState([
    {
      id: 1,
      fecha: '2024-01-15',
      cliente: 'María González',
      servicio: 'Tratamiento Facial',
      precio: '$150.00',
      descuento: '$0.00',
      total: '$150.00',
      vendedor: 'Ana Estética',
      estado: 'Completado'
    },
    {
      id: 2,
      fecha: '2024-01-15',
      cliente: 'Ana López',
      servicio: 'Depilación Láser',
      precio: '$200.00',
      descuento: '$20.00',
      total: '$180.00',
      vendedor: 'María Estética',
      estado: 'Completado'
    },
    {
      id: 3,
      fecha: '2024-01-15',
      cliente: 'Carlos Ruiz',
      servicio: 'Masaje Relajante',
      precio: '$80.00',
      descuento: '$0.00',
      total: '$80.00',
      vendedor: 'Laura Estética',
      estado: 'Pendiente'
    },
    {
      id: 4,
      fecha: '2024-01-15',
      cliente: 'Laura Martínez',
      servicio: 'Tratamiento Corporal',
      precio: '$120.00',
      descuento: '$15.00',
      total: '$105.00',
      vendedor: 'Ana Estética',
      estado: 'Completado'
    }
  ]);

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID Venta',
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
    },
    {
      accessorKey: 'cliente',
      header: 'Cliente',
    },
    {
      accessorKey: 'servicio',
      header: 'Servicio',
    },
    {
      accessorKey: 'precio',
      header: 'Precio',
    },
    {
      accessorKey: 'descuento',
      header: 'Descuento',
    },
    {
      accessorKey: 'total',
      header: 'Total',
    },
    {
      accessorKey: 'vendedor',
      header: 'Vendedor',
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
    }
  ];

  return (
    <TablasLayout title="Gestión de Ventas">
      <EditableTable
        data={data}
        columns={columns}
        onDataChange={setData}
        title="Registro de Ventas"
        addRowText="Agregar Venta"
      />
    </TablasLayout>
  );
};

export default Ventas; 