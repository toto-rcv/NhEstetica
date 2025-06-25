const validatePersonal = (req, res, next) => {
  const { dni, nombre, apellido, direccion, telefono, email, cargo, especialidad, fecha_contratacion, comision_venta, comision_fija, sueldo_mensual } = req.body;

  const errors = [];

  // Validar DNI
  if (!dni) {
    errors.push('El DNI es requerido');
  } else if (dni.length < 7 || dni.length > 20) {
    errors.push('El DNI debe tener entre 7 y 20 caracteres');
  } else if (!/^[0-9]+$/.test(dni)) {
    errors.push('El DNI debe contener solo números');
  }

  // Validar nombre
  if (!nombre) {
    errors.push('El nombre es requerido');
  } else if (nombre.length < 2 || nombre.length > 100) {
    errors.push('El nombre debe tener entre 2 y 100 caracteres');
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
    errors.push('El nombre solo puede contener letras y espacios');
  }

  // Validar apellido
  if (!apellido) {
    errors.push('El apellido es requerido');
  } else if (apellido.length < 2 || apellido.length > 100) {
    errors.push('El apellido debe tener entre 2 y 100 caracteres');
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) {
    errors.push('El apellido solo puede contener letras y espacios');
  }

  // Validar dirección (opcional)
  if (direccion && direccion.length > 500) {
    errors.push('La dirección no puede exceder 500 caracteres');
  }

  // Validar teléfono (opcional)
  if (telefono) {
    if (telefono.length < 7 || telefono.length > 20) {
      errors.push('El teléfono debe tener entre 7 y 20 caracteres');
    } else if (!/^[0-9\-\+\(\)\s]+$/.test(telefono)) {
      errors.push('El teléfono solo puede contener números, guiones, paréntesis, espacios y el símbolo +');
    }
  }

  // Validar email (opcional)
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('El formato del email no es válido');
    } else if (email.length > 100) {
      errors.push('El email no puede exceder 100 caracteres');
    }
  }

  // Validar cargo (opcional)
  if (cargo && cargo.length > 100) {
    errors.push('El cargo no puede exceder 100 caracteres');
  }

  // Validar especialidad (opcional)
  if (especialidad && especialidad.length > 100) {
    errors.push('La especialidad no puede exceder 100 caracteres');
  }

  // Validar fecha de contratación (opcional)
  if (fecha_contratacion) {
    const fecha = new Date(fecha_contratacion);
    const hoy = new Date();
    if (isNaN(fecha.getTime())) {
      errors.push('La fecha de contratación no es válida');
    } else if (fecha > hoy) {
      errors.push('La fecha de contratación no puede ser futura');
    }
  }

  // Validar comisión por venta (opcional)
  if (comision_venta !== undefined && comision_venta !== null) {
    const comision = parseFloat(comision_venta);
    if (isNaN(comision)) {
      errors.push('La comisión por venta debe ser un número válido');
    } else if (comision < 0 || comision > 100) {
      errors.push('La comisión por venta debe estar entre 0 y 100');
    }
  }

  // Validar comisión fija (opcional)
  if (comision_fija !== undefined && comision_fija !== null) {
    const comision = parseFloat(comision_fija);
    if (isNaN(comision)) {
      errors.push('La comisión fija debe ser un número válido');
    } else if (comision < 0) {
      errors.push('La comisión fija no puede ser negativa');
    }
  }

  // Validar sueldo mensual (opcional)
  if (sueldo_mensual !== undefined && sueldo_mensual !== null) {
    const sueldo = parseFloat(sueldo_mensual);
    if (isNaN(sueldo)) {
      errors.push('El sueldo mensual debe ser un número válido');
    } else if (sueldo < 0) {
      errors.push('El sueldo mensual no puede ser negativo');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors: errors
    });
  }

  next();
};

module.exports = { validatePersonal }; 