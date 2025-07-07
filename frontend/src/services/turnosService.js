const API_URL = '/api/turnos';
const PUBLIC_API_URL = '/api/turnos/public';

class TurnosService {
  // Obtener token de autorización
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
  }

  // Obtener todos los turnos con filtros opcionales
  async getTurnos(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.fecha) params.append('fecha', filtros.fecha);
      if (filtros.cliente) params.append('cliente', filtros.cliente);
      if (filtros.tratamiento) params.append('tratamiento', filtros.tratamiento);
      if (filtros.estado) params.append('estado', filtros.estado);

      const response = await fetch(`${API_URL}?${params}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener turnos');
      return await response.json();
    } catch (error) {
      console.error('Error en getTurnos:', error);
      throw error;
    }
  }

  // Obtener turnos por fecha específica
  async getTurnosByFecha(fecha) {
    try {
      const response = await fetch(`${API_URL}/fecha/${fecha}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener turnos por fecha');
      return await response.json();
    } catch (error) {
      console.error('Error en getTurnosByFecha:', error);
      throw error;
    }
  }

  // Obtener horarios disponibles para una fecha y tratamiento (público)
  async getHorariosDisponibles(fecha, tratamientoId = null) {
    try {
      const params = new URLSearchParams();
      params.append('fecha', fecha);
      if (tratamientoId) params.append('tratamiento_id', tratamientoId);

      const response = await fetch(`${PUBLIC_API_URL}/horarios-disponibles?${params}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al obtener horarios disponibles');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getHorariosDisponibles:', error);
      throw error;
    }
  }

  // Crear nuevo turno (público)
  async createTurno(turnoData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await fetch(PUBLIC_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(turnoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear turno');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createTurno:', error);
      throw error;
    }
  }

  // Obtener turno por ID
  async getTurnoById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al obtener turno');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getTurnoById:', error);
      throw error;
    }
  }

  // Actualizar turno
  async updateTurno(id, turnoData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(turnoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar turno');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateTurno:', error);
      throw error;
    }
  }

  // Eliminar turno
  async deleteTurno(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar turno');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en deleteTurno:', error);
      throw error;
    }
  }

  // Obtener configuración de horarios
  async getConfiguracionHorarios() {
    try {
      const response = await fetch(`${API_URL}/configuracion-horarios`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener configuración de horarios');
      return await response.json();
    } catch (error) {
      console.error('Error en getConfiguracionHorarios:', error);
      throw error;
    }
  }

  // Actualizar configuración de horarios
  async updateConfiguracionHorarios(horarios) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      };

      const response = await fetch(`${API_URL}/configuracion-horarios`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ horarios }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar configuración de horarios');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateConfiguracionHorarios:', error);
      throw error;
    }
  }

  // Validar datos de turno
  validateTurnoData(turnoData) {
    const errors = {};

    if (!turnoData.tratamiento_id) {
      errors.tratamiento_id = 'El tratamiento es requerido';
    }

    if (!turnoData.fecha) {
      errors.fecha = 'La fecha es requerida';
    } else {
      const selectedDate = new Date(turnoData.fecha);
      const today = new Date();
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (selectedDate < todayMidnight) {
        errors.fecha = 'No se pueden reservar turnos en fechas pasadas';
      }
    }

    if (!turnoData.hora) {
      errors.hora = 'La hora es requerida';
    }

    if (!turnoData.dni_cliente) {
      errors.dni_cliente = 'El DNI es requerido';
    } else if (!/^\d{7,8}$/.test(turnoData.dni_cliente)) {
      errors.dni_cliente = 'El DNI debe tener 7 u 8 dígitos';
    }

    if (!turnoData.nombre_cliente) {
      errors.nombre_cliente = 'El nombre es requerido';
    } else if (turnoData.nombre_cliente.length < 2) {
      errors.nombre_cliente = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!turnoData.apellido_cliente) {
      errors.apellido_cliente = 'El apellido es requerido';
    } else if (turnoData.apellido_cliente.length < 2) {
      errors.apellido_cliente = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!turnoData.email_cliente) {
      errors.email_cliente = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(turnoData.email_cliente)) {
      errors.email_cliente = 'El formato del email no es válido';
    }

    if (!turnoData.telefono_cliente) {
      errors.telefono_cliente = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s-]{8,15}$/.test(turnoData.telefono_cliente)) {
      errors.telefono_cliente = 'El formato del teléfono no es válido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Formatear fecha para mostrar
  formatDate(date) {
    if (!date) {
      return 'Fecha no disponible';
    }

    let dateObj;
    
    try {
      if (typeof date === 'string') {
        // Si es una string, puede venir en varios formatos:
        // "YYYY-MM-DD", "YYYY-MM-DD HH:MM:SS", "2025-07-07T03:00:00.000Z", etc.
        if (date.includes('-')) {
          // Extraer solo la parte de fecha
          let datePart;
          
          if (date.includes('T')) {
            // Formato ISO: "2025-07-07T03:00:00.000Z"
            datePart = date.split('T')[0]; // "2025-07-07"
          } else if (date.includes(' ')) {
            // Formato MySQL: "2025-07-07 10:30:00"
            datePart = date.split(' ')[0]; // "2025-07-07"
          } else {
            // Solo fecha: "2025-07-07"
            datePart = date;
          }
          
          const [year, month, day] = datePart.split('-').map(Number);
          
          // Validar que los valores sean números válidos
          if (isNaN(year) || isNaN(month) || isNaN(day)) {
            throw new Error('Fecha inválida');
          }
          
          dateObj = new Date(year, month - 1, day); // month - 1 porque los meses en JS van de 0-11
        } else {
          // Intentar parsear directamente
          dateObj = new Date(date);
        }
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        // Intentar convertir cualquier otro tipo
        dateObj = new Date(date);
      }
      
      // Verificar que la fecha resultante sea válida
      if (isNaN(dateObj.getTime())) {
        throw new Error('Fecha inválida después del parsing');
      }
      
      return dateObj.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
    } catch (error) {
      console.error('Error al formatear fecha:', date, error);
      return 'Fecha inválida';
    }
  }

  // Formatear hora para mostrar
  formatTime(time) {
    if (!time) {
      return 'Hora no disponible';
    }

    try {
      // Si es una string, puede venir como "HH:MM:SS" o "HH:MM"
      if (typeof time === 'string') {
        // Tomar solo los primeros 5 caracteres (HH:MM)
        return time.substring(0, 5);
      }
      
      // Si es un objeto Date
      if (time instanceof Date) {
        return time.toTimeString().substring(0, 5);
      }
      
      // Intentar convertir a string y tomar los primeros 5 caracteres
      return String(time).substring(0, 5);
      
    } catch (error) {
      console.error('Error al formatear hora:', time, error);
      return 'Hora inválida';
    }
  }

  // Obtener días de la semana en español
  getDayOfWeek(date) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    if (!date) {
      return 'Día no disponible';
    }

    try {
      let dateObj;
      
             if (typeof date === 'string') {
         if (date.includes('-')) {
           // Extraer solo la parte de fecha
           let datePart;
           
           if (date.includes('T')) {
             // Formato ISO: "2025-07-07T03:00:00.000Z"
             datePart = date.split('T')[0]; // "2025-07-07"
           } else if (date.includes(' ')) {
             // Formato MySQL: "2025-07-07 10:30:00"
             datePart = date.split(' ')[0]; // "2025-07-07"
           } else {
             // Solo fecha: "2025-07-07"
             datePart = date;
           }
           
           const [year, month, day] = datePart.split('-').map(Number);
           
           // Validar que los valores sean números válidos
           if (isNaN(year) || isNaN(month) || isNaN(day)) {
             throw new Error('Fecha inválida');
           }
           
           dateObj = new Date(year, month - 1, day); // month - 1 porque los meses en JS van de 0-11
         } else {
           dateObj = new Date(date);
         }
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }
      
      // Verificar que la fecha resultante sea válida
      if (isNaN(dateObj.getTime())) {
        throw new Error('Fecha inválida después del parsing');
      }
      
      const dayIndex = dateObj.getDay();
      return days[dayIndex];
      
    } catch (error) {
      console.error('Error al obtener día de la semana:', date, error);
      return 'Día inválido';
    }
  }

  // Generar fechas disponibles del mes actual
  generateAvailableDates() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Obtener el primer y último día del mes
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const dates = [];
    
    // Generar todas las fechas del mes
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      
      // Solo incluir fechas desde hoy en adelante y excluir domingos (lunes=1, martes=2, ..., sábado=6)
      if (date >= todayMidnight && date.getDay() !== 0) {
        // Usar formato local para evitar problemas de zona horaria
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayStr = String(date.getDate()).padStart(2, '0');
        const dateValue = `${year}-${month}-${dayStr}`;
        
        dates.push({
          value: dateValue,
          label: day.toString(),
          fullDate: date,
          dayOfWeek: this.getDayOfWeek(date),
          isToday: date.toDateString() === new Date().toDateString()
        });
      }
    }
    
    return dates;
  }

  // Generar calendario mensual para mostrar en tabla
  generateMonthCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Obtener el primer día del mes y calcular en qué día de la semana cae
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    const calendar = [];
    let week = [];
    
    // Llenar días vacíos al inicio del mes
    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push(null);
    }
    
    // Llenar los días del mes
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isAvailable = date >= todayMidnight && date.getDay() !== 0; // No domingos (lunes=1, martes=2, ..., sábado=6) y desde hoy
      
      // Usar formato local para evitar problemas de zona horaria
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const dateValue = `${year}-${month}-${dayStr}`;
      
      const dayData = {
        day,
        date,
        value: dateValue,
        isAvailable,
        isToday: date.toDateString() === new Date().toDateString(),
        dayOfWeek: date.getDay()
      };
      
      week.push(dayData);
      
      // Si completamos una semana (7 días), agregar al calendario
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    
    // Completar la última semana si es necesario
    while (week.length > 0 && week.length < 7) {
      week.push(null);
    }
    if (week.length > 0) {
      calendar.push(week);
    }
    
    return {
      calendar,
      monthName: firstDay.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
      year: currentYear,
      month: currentMonth
    };
  }
}

export const turnosService = new TurnosService(); 