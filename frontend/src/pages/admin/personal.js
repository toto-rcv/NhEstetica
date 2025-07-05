import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TablasLayout from '../../components/tablas/TablasLayout';
import EditableTable, { EditTableButton } from '../../components/tablas/EditableTable';
import { personalService } from '../../services/personalService';
import AddPersonalModal from '../../components/tablas/AddPersonalModal';

const Personal = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [commissions, setCommissions] = useState({ comisionDia: '$0', comisionMes: '$0' });
  const [commissionHistory, setCommissionHistory] = useState([]);
  const [loadingCommissions, setLoadingCommissions] = useState(false);

  // Cargar datos del personal al montar el componente
  useEffect(() => {
    loadPersonal();
  }, []);

  const loadPersonal = async () => {
    try {
      setLoading(true);
      const personalData = await personalService.getPersonal();
      setData(personalData);
      setError(null);
      setValidationErrors([]);
    } catch (err) {
      console.error('Error al cargar personal:', err);
      setError('Error al cargar los datos del personal');
    } finally {
      setLoading(false);
    }
  };

  // Función helper para manejar rutas de imágenes
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Si ya es una ruta de API, usarla directamente
    if (imagePath.startsWith('/api/upload/image/')) {
      return imagePath;
    }
    
    // Si es el formato anterior, convertirla al nuevo formato
    if (imagePath.startsWith('/images-de-personal/')) {
      const filename = imagePath.replace('/images-de-personal/', '');
      return `/api/upload/image/personal/${filename}`;
    }
    
    // Por defecto, asumir que es una ruta relativa válida
    return imagePath;
  };

  const columns = [
    {
      accessorKey: 'imagen',
      header: 'Foto',
      cell: ({ row }) => (
        <ImageCell>
          {row.original.imagen ? (
            <EmployeeImage src={getImageUrl(row.original.imagen)} alt="Empleado" />
          ) : (
            <EmployeeInitials>
              {getInitials(row.original.nombreCompleto)}
            </EmployeeInitials>
          )}
        </ImageCell>
      ),
      size: 80,
    },
    {
      accessorKey: 'dni',
      header: 'DNI',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'nombreCompleto',
      header: 'Nombre Completo',
    },
    {
      accessorKey: 'email',
      header: 'Email',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
    },
    {
      accessorKey: 'cargo',
      header: 'Cargo',
      hideOnMobile: true,
    },
    {
      accessorKey: 'especialidad',
      header: 'Especialidad',
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktopSmall: true,
    },
    {
      accessorKey: 'fechaContratacion',
      header: 'Fecha de Contratación',
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktopSmall: true,
    }
  ];

  const detailsColumns = [
    {
      accessorKey: 'dni',
      header: 'DNI',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'nombre',
      header: 'Nombre',
    },
    {
      accessorKey: 'apellido',
      header: 'Apellido',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'direccion',
      header: 'Dirección',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
    },
    {
      accessorKey: 'cargo',
      header: 'Cargo',
      hideOnMobile: true,
    },
    {
      accessorKey: 'especialidad',
      header: 'Especialidad',
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktopSmall: true,
    },
    {
      accessorKey: 'fechaContratacion',
      header: 'Fecha de Contratación',
      hideOnMobile: true,
      hideOnTablet: true,
      hideOnDesktopSmall: true,
    },
    {
      accessorKey: 'comisionVenta',
      header: '% Comisión Venta',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'comisionFija',
      header: 'Comisión Fija',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    {
      accessorKey: 'sueldoMensual',
      header: 'Sueldo Mensual',
      hideOnMobile: true,
      hideOnTablet: true,
    }
  ];

  const handleRowClick = (rowIndex) => {
    console.log('Row clicked:', rowIndex);
    if (data[rowIndex]) {
      const person = data[rowIndex];
      setSelectedPerson({
        id: person.id,
        dni: person.dni || '',
        nombre: person.nombre || '',
        apellido: person.apellido || '',
        direccion: person.direccion || '',
        telefono: person.telefono || '',
        email: person.email || '',
        cargo: person.cargo || '',
        especialidad: person.especialidad || '',
        fechaContratacion: person.fechaContratacion || '',
        imagen: person.imagen || '',
        comisionVenta: person.comision_venta ? `${person.comision_venta}%` : '0%',
        comisionFija: person.comision_fija ? `$${person.comision_fija}` : '$0',
        sueldoMensual: person.sueldo_mensual ? `$${person.sueldo_mensual}` : '$0'
      });
    }
  };

  const handleDataChange = async (newData) => {
    try {
      setIsSaving(true);
      
      // Identificar qué filas son nuevas (sin ID) y cuáles son existentes
      const newRows = newData.filter(row => !row.id);
      const existingRows = newData.filter(row => row.id);
      
      // Solo procesar filas que tengan datos válidos
      const validNewRows = newRows.filter(row => 
        row.dni && row.dni.trim() !== '' && 
        row.nombreCompleto && row.nombreCompleto.trim() !== ''
      );
      
      // Crear nuevos empleados solo si tienen datos válidos
      for (const newRow of validNewRows) {
        // Procesar la fecha de contratación
        let fechaContratacion = null;
        if (newRow.fechaContratacion) {
          // Si la fecha está en formato DD/MM/YYYY, convertirla a YYYY-MM-DD
          if (newRow.fechaContratacion.includes('/')) {
            const [day, month, year] = newRow.fechaContratacion.split('/');
            fechaContratacion = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          } else {
            fechaContratacion = newRow.fechaContratacion;
          }
        }

        const empleadoData = {
          dni: newRow.dni,
          nombre: newRow.nombreCompleto ? newRow.nombreCompleto.split(' ')[0] : '',
          apellido: newRow.nombreCompleto ? newRow.nombreCompleto.split(' ').slice(1).join(' ') : '',
          direccion: newRow.direccion || '',
          telefono: newRow.telefono || '',
          email: newRow.email || '',
          cargo: newRow.cargo || '',
          especialidad: newRow.especialidad || '',
          fecha_contratacion: fechaContratacion,
          comision_venta: 0,
          comision_fija: 0,
          sueldo_mensual: 0
        };

        await personalService.createPersonal(empleadoData);
      }

      // Solo recargar datos si se creó algo nuevo
      if (validNewRows.length > 0) {
        await loadPersonal();
      } else {
        // Si no se guardó nada nuevo, solo actualizar el estado local
        setData(newData);
      }
      
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      
      // Separar errores de validación de otros errores
      if (err.message.includes('Errores de validación:')) {
        const errorLines = err.message.split('\n');
        const validationErrors = errorLines.slice(1); // Excluir la primera línea que dice "Errores de validación:"
        setValidationErrors(validationErrors);
        setError(null);
      } else {
        setError(err.message || 'Error al guardar los cambios');
        setValidationErrors([]);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRow = async (rowIndex) => {
    try {
      const rowToDelete = data[rowIndex];
      if (rowToDelete && rowToDelete.id) {
        await personalService.deletePersonal(rowToDelete.id);
        await loadPersonal();
      } else {
        // Si es una fila nueva sin ID, solo eliminarla del estado local
        const newData = data.filter((_, index) => index !== rowIndex);
        setData(newData);
      }
    } catch (err) {
      console.error('Error al eliminar empleado:', err);
      setError(err.message || 'Error al eliminar el empleado');
    }
  };

  // Función para actualizar un empleado existente
  const handleUpdateEmployee = async (employeeId, updatedData) => {
    try {
      setIsSaving(true);
      setError(null);
      setValidationErrors([]);

      // Procesar la fecha de contratación
      let fechaContratacion = null;
      if (updatedData.fechaContratacion) {
        if (updatedData.fechaContratacion.includes('/')) {
          const [day, month, year] = updatedData.fechaContratacion.split('/');
          fechaContratacion = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
          fechaContratacion = updatedData.fechaContratacion;
        }
      }

      // Procesar nombre y apellido
      let nombre = '';
      let apellido = '';
      
      if (updatedData.nombreCompleto) {
        const nombreParts = updatedData.nombreCompleto.trim().split(' ');
        nombre = nombreParts[0] || '';
        apellido = nombreParts.slice(1).join(' ') || '';
      } else if (updatedData.nombre && updatedData.apellido) {
        nombre = updatedData.nombre;
        apellido = updatedData.apellido;
      }

      // Procesar comisiones (remover símbolos si existen)
      let comisionVenta = 0;
      let comisionFija = 0;
      let sueldoMensual = 0;

      if (updatedData.comisionVenta) {
        comisionVenta = parseFloat(updatedData.comisionVenta.toString().replace(/[%$]/g, '')) || 0;
      }
      if (updatedData.comisionFija) {
        comisionFija = parseFloat(updatedData.comisionFija.toString().replace(/[%$]/g, '')) || 0;
      }
      if (updatedData.sueldoMensual) {
        sueldoMensual = parseFloat(updatedData.sueldoMensual.toString().replace(/[%$]/g, '')) || 0;
      }

      const empleadoData = {
        dni: updatedData.dni || '',
        nombre: nombre,
        apellido: apellido,
        direccion: updatedData.direccion || '',
        telefono: updatedData.telefono || '',
        email: updatedData.email || '',
        cargo: updatedData.cargo || '',
        especialidad: updatedData.especialidad || '',
        fecha_contratacion: fechaContratacion,
        comision_venta: comisionVenta,
        comision_fija: comisionFija,
        sueldo_mensual: sueldoMensual
      };

      console.log('Datos enviados al backend:', empleadoData);
      
      await personalService.updatePersonal(employeeId, empleadoData);
      await loadPersonal();
      
      // Si el empleado actualizado es el que está seleccionado, actualizar también selectedPerson
      if (selectedPerson && selectedPerson.id === employeeId) {
        // Recargar la información del empleado seleccionado
        const updatedPersonData = await personalService.getPersonalById(employeeId);
        setSelectedPerson({
          id: updatedPersonData.id,
          dni: updatedPersonData.dni || '',
          nombre: updatedPersonData.nombre || '',
          apellido: updatedPersonData.apellido || '',
          direccion: updatedPersonData.direccion || '',
          telefono: updatedPersonData.telefono || '',
          email: updatedPersonData.email || '',
          cargo: updatedPersonData.cargo || '',
          especialidad: updatedPersonData.especialidad || '',
          fechaContratacion: updatedPersonData.fecha_contratacion || '',
          imagen: updatedPersonData.imagen || '',
          comisionVenta: updatedPersonData.comision_venta ? `${updatedPersonData.comision_venta}%` : '0%',
          comisionFija: updatedPersonData.comision_fija ? `$${updatedPersonData.comision_fija}` : '$0',
          sueldoMensual: updatedPersonData.sueldo_mensual ? `$${updatedPersonData.sueldo_mensual}` : '$0'
        });
      }
      
      setError(null);
      setValidationErrors([]);
      
    } catch (err) {
      console.error('Error al actualizar empleado:', err);
      
      // Manejar errores de validación
      if (err.message.includes('Errores de validación:')) {
        const errorLines = err.message.split('\n');
        const validationErrors = errorLines.slice(1);
        setValidationErrors(validationErrors);
        setError(null);
      } else {
        setError(err.message || 'Error al actualizar el empleado');
        setValidationErrors([]);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Función para manejar cambios en la tabla de detalles del empleado
  const handleDetailsDataChange = (newData) => {
    // Actualizar el estado del empleado seleccionado con los nuevos datos
    if (newData.length > 0) {
      setSelectedPerson(newData[0]);
    }
  };

  // Función para actualizar empleado desde la tabla de detalles
  const handleUpdateEmployeeFromDetails = async (employeeId, updatedData) => {
    try {
      setIsSaving(true);
      setError(null);
      setValidationErrors([]);

      // Procesar la fecha de contratación
      let fechaContratacion = null;
      if (updatedData.fechaContratacion) {
        if (updatedData.fechaContratacion.includes('/')) {
          const [day, month, year] = updatedData.fechaContratacion.split('/');
          fechaContratacion = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
          fechaContratacion = updatedData.fechaContratacion;
        }
      }

      // Procesar comisiones (remover símbolos si existen)
      let comisionVenta = 0;
      let comisionFija = 0;
      let sueldoMensual = 0;

      if (updatedData.comisionVenta) {
        comisionVenta = parseFloat(updatedData.comisionVenta.toString().replace(/[%$]/g, '')) || 0;
      }
      if (updatedData.comisionFija) {
        comisionFija = parseFloat(updatedData.comisionFija.toString().replace(/[%$]/g, '')) || 0;
      }
      if (updatedData.sueldoMensual) {
        sueldoMensual = parseFloat(updatedData.sueldoMensual.toString().replace(/[%$]/g, '')) || 0;
      }

      const empleadoData = {
        dni: updatedData.dni || '',
        nombre: updatedData.nombre || '',
        apellido: updatedData.apellido || '',
        direccion: updatedData.direccion || '',
        telefono: updatedData.telefono || '',
        email: updatedData.email || '',
        cargo: updatedData.cargo || '',
        especialidad: updatedData.especialidad || '',
        fecha_contratacion: fechaContratacion,
        comision_venta: comisionVenta,
        comision_fija: comisionFija,
        sueldo_mensual: sueldoMensual
      };

      console.log('Datos enviados desde tabla de detalles:', empleadoData);
      
      await personalService.updatePersonal(employeeId, empleadoData);
      await loadPersonal();
      
      // Actualizar el estado local del empleado seleccionado
      const updatedPersonData = await personalService.getPersonalById(employeeId);
      setSelectedPerson({
        id: updatedPersonData.id,
        dni: updatedPersonData.dni || '',
        nombre: updatedPersonData.nombre || '',
        apellido: updatedPersonData.apellido || '',
        direccion: updatedPersonData.direccion || '',
        telefono: updatedPersonData.telefono || '',
        email: updatedPersonData.email || '',
        cargo: updatedPersonData.cargo || '',
        especialidad: updatedPersonData.especialidad || '',
        fechaContratacion: updatedPersonData.fecha_contratacion || '',
        imagen: updatedPersonData.imagen || '',
        comisionVenta: updatedPersonData.comision_venta ? `${updatedPersonData.comision_venta}%` : '0%',
        comisionFija: updatedPersonData.comision_fija ? `$${updatedPersonData.comision_fija}` : '$0',
        sueldoMensual: updatedPersonData.sueldo_mensual ? `$${updatedPersonData.sueldo_mensual}` : '$0'
      });
      
      setError(null);
      setValidationErrors([]);
      
    } catch (err) {
      console.error('Error al actualizar empleado desde detalles:', err);
      
      // Manejar errores de validación
      if (err.message.includes('Errores de validación:')) {
        const errorLines = err.message.split('\n');
        const validationErrors = errorLines.slice(1);
        setValidationErrors(validationErrors);
        setError(null);
      } else {
        setError(err.message || 'Error al actualizar el empleado');
        setValidationErrors([]);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (nombreCompleto) => {
    if (!nombreCompleto) return 'NA';
    return nombreCompleto
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const clearDate = () => {
    setSelectedDate('');
  };

  const setTodayDate = () => {
    // Crear fecha local sin problemas de zona horaria
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const getCommissionHistory = async () => {
    if (!selectedPerson) return [];
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return [];
      
      // Obtener ventas de tratamientos donde participó este personal
      const response = await fetch('/api/ventas/tratamientos', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return [];
      
      const ventas = await response.json();
      
      // Filtrar ventas del personal seleccionado
      const ventasPersonal = ventas.filter(venta => venta.personal_id === selectedPerson.id);
      
      // Filtrar por fecha si hay una seleccionada
      let ventasFiltradas = ventasPersonal;
      if (selectedDate && selectedDate.trim() !== '') {
        ventasFiltradas = ventasPersonal.filter(venta => {
          // Priorizar el campo fecha sobre created_at
          if (venta.fecha) {
            // Si existe el campo fecha, usar SOLO ese campo
            const fechaVenta = new Date(venta.fecha);
            const fechaVentaStr = `${fechaVenta.getFullYear()}-${String(fechaVenta.getMonth() + 1).padStart(2, '0')}-${String(fechaVenta.getDate()).padStart(2, '0')}`;
            return fechaVentaStr === selectedDate;
          } else if (venta.created_at) {
            // Si no existe el campo fecha, usar created_at como fallback
            const fechaCreated = new Date(venta.created_at);
            const fechaCreatedStr = `${fechaCreated.getFullYear()}-${String(fechaCreated.getMonth() + 1).padStart(2, '0')}-${String(fechaCreated.getDate()).padStart(2, '0')}`;
            return fechaCreatedStr === selectedDate;
          }
          
          return false;
        });
      }
      
      // Convertir ventas a formato de historial de comisiones
      const historial = ventasFiltradas.map(venta => {
        // Función auxiliar para crear fecha válida
        const crearFechaValida = (fechaString) => {
          if (!fechaString) return null;
          
          // Usar directamente new Date() ya que las fechas vienen en formato ISO
          return new Date(fechaString);
        };
        
        // Usar el campo fecha de la venta si existe, sino usar created_at
        let fechaVenta;
        let fechaHoraVenta;
        
        if (venta.fecha) {
          // Si existe el campo fecha, usarlo para la fecha
          fechaVenta = crearFechaValida(venta.fecha);
          // Para la hora, usar created_at si existe, sino usar la fecha
          fechaHoraVenta = venta.created_at ? crearFechaValida(venta.created_at) : fechaVenta;
        } else {
          // Si no existe el campo fecha, usar created_at para ambos
          fechaVenta = crearFechaValida(venta.created_at);
          fechaHoraVenta = crearFechaValida(venta.created_at);
        }
        
        // Validar que las fechas sean válidas
        if (!fechaVenta || isNaN(fechaVenta.getTime())) {
          fechaVenta = new Date(); // Usar fecha actual como fallback
        }
        if (!fechaHoraVenta || isNaN(fechaHoraVenta.getTime())) {
          fechaHoraVenta = fechaVenta; // Usar fechaVenta como fallback
        }
        
        // Obtener valores de comisión del empleado
        const comisionPorcentaje = Number(selectedPerson.comisionVenta ? 
          selectedPerson.comisionVenta.replace('%', '') : 0);
        const comisionFija = Number(selectedPerson.comisionFija ? 
          selectedPerson.comisionFija.replace('$', '') : 0);
        
        // Calcular comisiones según la fórmula correcta
        const precio = Number(venta.precio || 0);
        const sesiones = Number(venta.sesiones || 0);
        const precioTotal = precio * sesiones;
        const comisionPorcentualCalculada = (precioTotal * comisionPorcentaje) / 100;
        const comisionFijaTotal = comisionFija * sesiones;
        const totalComision = comisionPorcentualCalculada + comisionFijaTotal;
        
        return {
          fecha: fechaVenta.toLocaleDateString('es-ES'),
          hora: fechaHoraVenta.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          servicio: venta.tratamiento_nombre || 'Tratamiento',
          sesiones: sesiones,
          precioUnitario: precio,
          precioTotal: precioTotal,
          comision: `$${totalComision.toFixed(2)}`,
          comisionPorcentual: `$${comisionPorcentualCalculada.toFixed(2)}`,
          comisionFija: `$${comisionFijaTotal.toFixed(2)}`,
          estado: 'Completado',
          fechaCompleta: fechaVenta // Para el ordenamiento - usar la fecha del campo fecha
        };
      });
      
      // Ordenar por fecha y hora descendente (más reciente primero)
      historial.sort((a, b) => b.fechaCompleta - a.fechaCompleta);
      
      // Si no hay fecha específica, limitar a 10; si hay fecha, mostrar todas
      return (!selectedDate || selectedDate.trim() === '') ? historial.slice(0, 10) : historial;
      
    } catch (error) {
      console.error('Error al obtener historial de comisiones:', error);
      return [];
    }
  };

  const getCommissionForDate = async () => {
    if (!selectedPerson) return { comisionDia: '$0', comisionMes: '$0' };
    
    // Si no hay fecha seleccionada, no calcular comisiones por día/mes
    if (!selectedDate || selectedDate.trim() === '') {
      return { comisionDia: '$-', comisionMes: '$-' };
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return { comisionDia: '$0', comisionMes: '$0' };
      
      // Obtener ventas de tratamientos donde participó este personal
      const response = await fetch('/api/ventas/tratamientos', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return { comisionDia: '$0', comisionMes: '$0' };
      
      const ventas = await response.json();
      
      // Filtrar ventas del personal seleccionado
      const ventasPersonal = ventas.filter(venta => venta.personal_id === selectedPerson.id);
      
      const fechaSeleccionada = selectedDate;
      const [año, mes] = fechaSeleccionada.split('-');
      
      // Calcular comisiones del DÍA específico seleccionado
      const ventasDelDia = ventasPersonal.filter(venta => {
        // Priorizar el campo fecha sobre created_at
        if (venta.fecha) {
          // Si existe el campo fecha, usar SOLO ese campo
          const fechaVenta = new Date(venta.fecha);
          const fechaVentaStr = `${fechaVenta.getFullYear()}-${String(fechaVenta.getMonth() + 1).padStart(2, '0')}-${String(fechaVenta.getDate()).padStart(2, '0')}`;
          return fechaVentaStr === fechaSeleccionada;
        } else if (venta.created_at) {
          // Si no existe el campo fecha, usar created_at como fallback
          const fechaCreated = new Date(venta.created_at);
          const fechaCreatedStr = `${fechaCreated.getFullYear()}-${String(fechaCreated.getMonth() + 1).padStart(2, '0')}-${String(fechaCreated.getDate()).padStart(2, '0')}`;
          return fechaCreatedStr === fechaSeleccionada;
        }
        
        return false;
      });
      
      // Calcular comisiones del MES COMPLETO (del 1 al último día del mes)
      const ventasDelMes = ventasPersonal.filter(venta => {
        // Priorizar el campo fecha sobre created_at
        if (venta.fecha) {
          // Si existe el campo fecha, usar SOLO ese campo
          const fechaVenta = new Date(venta.fecha);
          const añoVenta = fechaVenta.getFullYear();
          const mesVenta = fechaVenta.getMonth() + 1;
          return añoVenta === parseInt(año) && mesVenta === parseInt(mes);
        } else if (venta.created_at) {
          // Si no existe el campo fecha, usar created_at como fallback
          const fechaCreated = new Date(venta.created_at);
          const añoCreated = fechaCreated.getFullYear();
          const mesCreated = fechaCreated.getMonth() + 1;
          return añoCreated === parseInt(año) && mesCreated === parseInt(mes);
        }
        
        return false;
      });
      
      // Obtener valores de comisión del empleado
      const comisionPorcentaje = Number(selectedPerson.comisionVenta ? 
        selectedPerson.comisionVenta.replace('%', '') : 0);
      const comisionFija = Number(selectedPerson.comisionFija ? 
        selectedPerson.comisionFija.replace('$', '') : 0);
      
      // Sumatoria de comisiones del DÍA
      const comisionDia = ventasDelDia.reduce((total, venta) => {
        const precio = Number(venta.precio || 0);
        const sesiones = Number(venta.sesiones || 0);
        const precioTotal = precio * sesiones;
        const comisionPorcentualCalculada = (precioTotal * comisionPorcentaje) / 100;
        const comisionFijaTotal = comisionFija * sesiones;
        const totalComision = comisionPorcentualCalculada + comisionFijaTotal;
        return total + totalComision;
      }, 0);
      
      // Sumatoria de comisiones del MES COMPLETO
      const comisionMes = ventasDelMes.reduce((total, venta) => {
        const precio = Number(venta.precio || 0);
        const sesiones = Number(venta.sesiones || 0);
        const precioTotal = precio * sesiones;
        const comisionPorcentualCalculada = (precioTotal * comisionPorcentaje) / 100;
        const comisionFijaTotal = comisionFija * sesiones;
        const totalComision = comisionPorcentualCalculada + comisionFijaTotal;
        return total + totalComision;
      }, 0);
      
      return {
        comisionDia: `$${comisionDia.toFixed(2)}`,
        comisionMes: `$${comisionMes.toFixed(2)}`,
        // Información adicional para debug
        ventasDelDia: ventasDelDia.length,
        ventasDelMes: ventasDelMes.length
      };
      
    } catch (error) {
      console.error('Error al calcular comisiones:', error);
      return { comisionDia: '$0', comisionMes: '$0' };
    }
  };

  // Nueva función para actualizar las comisiones
  const updateCommissions = async () => {
    if (selectedPerson) {
      setLoadingCommissions(true);
      try {
        const [comissionData, historyData] = await Promise.all([
          getCommissionForDate(),
          getCommissionHistory()
        ]);
        setCommissions(comissionData);
        setCommissionHistory(historyData);
      } catch (error) {
        console.error('Error al actualizar comisiones:', error);
      } finally {
        setLoadingCommissions(false);
      }
    }
  };

  // Efecto para actualizar comisiones cuando cambia la fecha o la persona seleccionada
  useEffect(() => {
    if (selectedPerson) {
      updateCommissions();
    } else {
      // Limpiar datos cuando no hay persona seleccionada
      setCommissions({ comisionDia: '$0', comisionMes: '$0' });
      setCommissionHistory([]);
    }
  }, [selectedDate, selectedPerson]);

  if (loading) {
    return (
      <TablasLayout title="Gestión de Personal">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Cargando datos del personal...
        </div>
      </TablasLayout>
    );
  }

  if (error) {
    return (
      <TablasLayout title="Gestión de Personal">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          Error: {error}
          <br />
          <button onClick={loadPersonal} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Reintentar
          </button>
        </div>
      </TablasLayout>
    );
  }

  return (
    <TablasLayout title="Gestión de Personal">
      <AddPersonalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={async () => { setShowAddModal(false); await loadPersonal(); }}
      />
      {isSaving && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          Guardando cambios...
        </div>
      )}
      
      <EditableTable
        data={data}
        columns={columns}
        onDataChange={handleDataChange}
        title="Base de Datos del Personal"
        addRowText={null}
        onRowClick={handleRowClick}
        onDeleteRow={handleDeleteRow}
        onUpdateRow={handleUpdateEmployee}
        customButtons={
          <EditTableButton style={{ background: '#28a745', color: 'white' }} onClick={() => setShowAddModal(true)}>
            Agregar Empleado
          </EditTableButton>
        }
      />
      
      {/* Mostrar errores de validación */}
      {validationErrors.length > 0 && (
        <ValidationErrorContainer>
          <ValidationErrorHeader>
            <h4>❌ Errores de Validación</h4>
            <CloseButton onClick={() => setValidationErrors([])}>✕</CloseButton>
          </ValidationErrorHeader>
          <ValidationErrorList>
            {validationErrors.map((error, index) => (
              <ValidationErrorItem key={index}>
                • {error}
              </ValidationErrorItem>
            ))}
          </ValidationErrorList>
        </ValidationErrorContainer>
      )}
      
      {selectedPerson ? (
        <>
          <DetailsContainer>
            <SelectedPersonInfo>
              <strong>Empleado Seleccionado:</strong> {selectedPerson.nombre} {selectedPerson.apellido}
            </SelectedPersonInfo>
            <DetailsHeader>
              <DetailsInfo>
                <h3>Detalles del Empleado</h3>
                <EditableTable
                  data={[selectedPerson]}
                  columns={detailsColumns}
                  onDataChange={handleDetailsDataChange}
                  onUpdateRow={handleUpdateEmployeeFromDetails}
                  title="Información Personal"
                  addRowText=""
                />
              </DetailsInfo>
            </DetailsHeader>
            <PhotoSection>
              <ProfilePhoto>
                {selectedPerson.imagen ? (
                  <ProfileImage src={getImageUrl(selectedPerson.imagen)} alt="Empleado" />
                ) : (
                  getInitials(selectedPerson.nombre + ' ' + selectedPerson.apellido)
                )}
              </ProfilePhoto>
              <CommissionInfo>
                <CommissionItem>
                  <CommissionLabel>% de Comisión por Venta</CommissionLabel>
                  <CommissionValue>{selectedPerson.comisionVenta}</CommissionValue>
                </CommissionItem>
                <CommissionItem>
                  <CommissionLabel>Comisión Fija</CommissionLabel>
                  <CommissionValue>{selectedPerson.comisionFija}</CommissionValue>
                </CommissionItem>
                <CommissionItem>
                  <CommissionLabel>Sueldo Mensual</CommissionLabel>
                  <CommissionValue>{selectedPerson.sueldoMensual}</CommissionValue>
                </CommissionItem>
              </CommissionInfo>
            </PhotoSection>
          </DetailsContainer>

          <CommissionTableContainer>
            <CommissionTableHeader>
              <h3>💰 Comisiones del Empleado - Sumatorias</h3>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                Selecciona una fecha para ver las comisiones del día específico y del mes completo
              </p>
            </CommissionTableHeader>
            <CommissionTableContent>
              <CommissionRow>
                <CommissionLabelLarge>Fecha Seleccionada:</CommissionLabelLarge>
                <DateInput
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </CommissionRow>
              
              <CommissionRow>
                <CommissionLabelLarge>
                  📅 Comisión del Día ({selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES') : 'Sin fecha'}):
                </CommissionLabelLarge>
                <CommissionValueLarge>
                  {loadingCommissions ? 'Calculando...' : commissions.comisionDia}
                  {commissions.ventasDelDia !== undefined && (
                    <small style={{ display: 'block', fontSize: '0.8em', color: '#666', marginTop: '2px' }}>
                      {commissions.ventasDelDia} venta{commissions.ventasDelDia !== 1 ? 's' : ''}
                    </small>
                  )}
                </CommissionValueLarge>
              </CommissionRow>
              
              <CommissionRow>
                <CommissionLabelLarge>
                  📊 Comisión del Mes Completo ({selectedDate ? 
                    `${new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}` : 
                    'Sin fecha'}):
                </CommissionLabelLarge>
                <CommissionValueLarge>
                  {loadingCommissions ? 'Calculando...' : commissions.comisionMes}
                  {commissions.ventasDelMes !== undefined && (
                    <small style={{ display: 'block', fontSize: '0.8em', color: '#666', marginTop: '2px' }}>
                      {commissions.ventasDelMes} venta{commissions.ventasDelMes !== 1 ? 's' : ''} en el mes
                    </small>
                  )}
                </CommissionValueLarge>
              </CommissionRow>
              
              {selectedDate && commissions.comisionDia !== '$-' && commissions.comisionMes !== '$-' && (
                <CommissionRow style={{ borderTop: '2px solid #007bff', marginTop: '10px', paddingTop: '10px' }}>
                  <CommissionLabelLarge style={{ fontWeight: 'bold', color: '#007bff' }}>
                    💰 Resumen de Comisiones:
                  </CommissionLabelLarge>
                  <CommissionValueLarge style={{ color: '#007bff' }}>
                    <div>Día: {commissions.comisionDia}</div>
                    <div>Mes: {commissions.comisionMes}</div>
                  </CommissionValueLarge>
                </CommissionRow>
              )}
            </CommissionTableContent>
          </CommissionTableContainer>

          <HistoryContainer>
            <HistoryHeader>
              <h3>
                Historial de Comisiones 
                {selectedDate ? ` - ${selectedDate}` : ' - Últimas 10 Comisiones'}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedDate ? (
                  <ClearDateButton onClick={clearDate}>
                    Limpiar Fecha
                  </ClearDateButton>
                ) : (
                  <ClearDateButton onClick={setTodayDate}>
                    Ver Hoy
                  </ClearDateButton>
                )}
              </div>
            </HistoryHeader>
            <HistoryContent>
              {loadingCommissions ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  Cargando historial de comisiones...
                </p>
              ) : commissionHistory.length > 0 ? (
                commissionHistory.map((item, index) => (
                  <HistoryItem key={index}>
                    <div>
                      <HistoryDate>{item.fecha} - {item.hora}</HistoryDate>
                      <HistoryService>{item.servicio}</HistoryService>
                      <HistoryDetails>
                        <HistoryDetailItem>
                          <strong>Sesiones:</strong> {item.sesiones}
                        </HistoryDetailItem>
                        <HistoryDetailItem>
                          <strong>Precio Unit.:</strong> ${item.precioUnitario}
                        </HistoryDetailItem>
                        <HistoryDetailItem>
                          <strong>Total:</strong> ${item.precioTotal}
                        </HistoryDetailItem>
                        <HistoryDetailItem>
                          <strong>Com. %:</strong> {item.comisionPorcentual}
                        </HistoryDetailItem>
                        <HistoryDetailItem>
                          <strong>Com. Fija:</strong> {item.comisionFija}
                        </HistoryDetailItem>
                      </HistoryDetails>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <HistoryAmount>{item.comision}</HistoryAmount>
                      <HistoryStatus $status={item.estado}>{item.estado}</HistoryStatus>
                    </div>
                  </HistoryItem>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  {selectedDate ? 'No hay comisiones registradas para esta fecha' : 'No hay comisiones registradas para este empleado'}
                </p>
              )}
            </HistoryContent>
          </HistoryContainer>
        </>
      ) : (
        <DetailsContainer>
          <p style={{ textAlign: 'center', color: '#666' }}>
            Haz clic en una fila de la tabla para ver los detalles del empleado
          </p>
        </DetailsContainer>
      )}
    </TablasLayout>
  );
};

export default Personal; 


const DetailsContainer = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: visible;
  padding: 1rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding: 0.5rem;
  }
  
  @media (max-width: 600px) {
    margin-top: 1rem;
    padding: 0.3rem;
  }
`;

const DetailsHeader = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  overflow: visible;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
  
  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;

const DetailsInfo = styled.div`
  overflow: visible;
`;

const PhotoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  background: white;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 600px) {
    padding: 1rem;
    gap: 1rem;
    flex-direction: column;
    align-items: center;
  }
`;

const ProfilePhoto = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 2.5rem;
  }
  
  @media (max-width: 600px) {
    width: 100px;
    height: 100px;
    font-size: 2rem;
  }
`;

const CommissionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 250px;
  
  @media (max-width: 768px) {
    min-width: 200px;
    gap: 0.8rem;
  }
  
  @media (max-width: 600px) {
    min-width: auto;
    width: 100%;
    max-width: 300px;
    gap: 0.6rem;
  }
`;

const CommissionItem = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #e9ecef;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 600px) {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
`;

const CommissionLabel = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.25rem;
`;

const CommissionValue = styled.div`
  color: #007bff;
  font-size: 1.1rem;
  font-weight: bold;
`;

const SelectedPersonInfo = styled.div`
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #2196f3;
`;

const CommissionTableContainer = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CommissionTableHeader = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const CommissionTableContent = styled.div`
  padding: 1.5rem;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  width: 150px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const CommissionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CommissionLabelLarge = styled.div`
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
`;

const CommissionValueLarge = styled.div`
  color: #28a745;
  font-size: 1.2rem;
  font-weight: bold;
`;

const HistoryContainer = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const HistoryHeader = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClearDateButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #5a6268;
  }
`;

const HistoryContent = styled.div`
  padding: 1.5rem;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const HistoryDate = styled.div`
  font-weight: 500;
  color: #495057;
`;

const HistoryAmount = styled.div`
  color: #28a745;
  font-weight: 600;
`;

const HistoryService = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const HistoryStatus = styled.div`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'Pagado':
        return '#d4edda';
      case 'Pendiente':
        return '#fff3cd';
      case 'Cancelado':
        return '#f8d7da';
      default:
        return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'Pagado':
        return '#155724';
      case 'Pendiente':
        return '#856404';
      case 'Cancelado':
        return '#721c24';
      default:
        return '#495057';
    }
  }};
`;

const ValidationErrorContainer = styled.div`
  margin-top: 1rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ValidationErrorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  h4 {
    margin: 0;
    color: #856404;
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  background: #856404;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #6c5ce7;
  }
`;

const ValidationErrorList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ValidationErrorItem = styled.li`
  color: #856404;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

// Nuevos componentes styled para las imágenes
const ImageCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
`;

const EmployeeImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
`;

const EmployeeInitials = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: 2px solid #e9ecef;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const HistoryDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const HistoryDetailItem = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;