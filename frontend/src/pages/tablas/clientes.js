import React, { useState } from 'react';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable from '../../components/tablas/EditableTable';

const Clientes = () => {
  const [data, setData] = useState([]);

  const columns = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
    },
    {
      accessorKey: 'apellido',
      header: 'Apellido',
    },
    {
      accessorKey: 'direccion',
      header: 'Dirección',
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'antiguedad',
      header: 'Antigüedad (días)',
    },
    {
      accessorKey: 'fechaInscripcion',
      header: 'Fecha de Inscripción',
    }
  ];

  return (
    <TablasLayout title="Gestión de Clientes">
      <EditableTable
        data={data}
        columns={columns}
        onDataChange={setData}
        title="Base de Datos de Clientes"
        addRowText="Agregar Cliente"
      />
    </TablasLayout>
  );
};

export default Clientes; 