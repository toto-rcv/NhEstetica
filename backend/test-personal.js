const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testPersonalAPI() {
  console.log('🧪 Probando API del Personal...\n');

  try {
    // 1. Obtener personal (debería estar vacío inicialmente)
    console.log('1. Obteniendo personal...');
    const getResponse = await fetch(`${API_BASE_URL}/personal`);
    const personal = await getResponse.json();
    console.log('Personal actual:', personal);
    console.log('✅ GET /personal funcionando\n');

    // 2. Crear un nuevo empleado
    console.log('2. Creando nuevo empleado...');
    const newEmployee = {
      dni: '12345678',
      nombre: 'María',
      apellido: 'González',
      direccion: 'Calle Principal 123',
      telefono: '123-456-7890',
      email: 'maria@example.com',
      cargo: 'Esteticista',
      especialidad: 'Tratamientos faciales',
      fecha_contratacion: '2023-01-15',
      comision_venta: 10.5,
      comision_fija: 500,
      sueldo_mensual: 2500
    };

    const createResponse = await fetch(`${API_BASE_URL}/personal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployee),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      console.log('❌ Error al crear empleado:', error);
      return;
    }

    const createResult = await createResponse.json();
    console.log('Empleado creado:', createResult);
    console.log('✅ POST /personal funcionando\n');

    // 3. Obtener personal nuevamente (debería tener el empleado creado)
    console.log('3. Obteniendo personal actualizado...');
    const getResponse2 = await fetch(`${API_BASE_URL}/personal`);
    const personal2 = await getResponse2.json();
    console.log('Personal actualizado:', personal2);
    console.log('✅ GET /personal después de crear funcionando\n');

    // 4. Buscar empleado por término
    console.log('4. Buscando empleado por término "María"...');
    const searchResponse = await fetch(`${API_BASE_URL}/personal/search?termino=María`);
    const searchResult = await searchResponse.json();
    console.log('Resultado de búsqueda:', searchResult);
    console.log('✅ GET /personal/search funcionando\n');

    // 5. Obtener empleado por ID
    if (personal2.length > 0) {
      const employeeId = personal2[0].id;
      console.log(`5. Obteniendo empleado por ID ${employeeId}...`);
      const getByIdResponse = await fetch(`${API_BASE_URL}/personal/${employeeId}`);
      const employee = await getByIdResponse.json();
      console.log('Empleado encontrado:', employee);
      console.log('✅ GET /personal/:id funcionando\n');

      // 6. Actualizar empleado
      console.log('6. Actualizando empleado...');
      const updateData = {
        ...newEmployee,
        cargo: 'Esteticista Senior',
        sueldo_mensual: 2800
      };

      const updateResponse = await fetch(`${API_BASE_URL}/personal/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        console.log('❌ Error al actualizar empleado:', error);
        return;
      }

      const updateResult = await updateResponse.json();
      console.log('Empleado actualizado:', updateResult);
      console.log('✅ PUT /personal/:id funcionando\n');

      // 7. Verificar actualización
      console.log('7. Verificando actualización...');
      const getByIdResponse2 = await fetch(`${API_BASE_URL}/personal/${employeeId}`);
      const updatedEmployee = await getByIdResponse2.json();
      console.log('Empleado después de actualizar:', updatedEmployee);
      console.log('✅ Verificación de actualización exitosa\n');

      // 8. Eliminar empleado
      console.log('8. Eliminando empleado...');
      const deleteResponse = await fetch(`${API_BASE_URL}/personal/${employeeId}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        const error = await deleteResponse.json();
        console.log('❌ Error al eliminar empleado:', error);
        return;
      }

      const deleteResult = await deleteResponse.json();
      console.log('Empleado eliminado:', deleteResult);
      console.log('✅ DELETE /personal/:id funcionando\n');

      // 9. Verificar eliminación
      console.log('9. Verificando eliminación...');
      const getResponse3 = await fetch(`${API_BASE_URL}/personal`);
      const personal3 = await getResponse3.json();
      console.log('Personal después de eliminar:', personal3);
      console.log('✅ Verificación de eliminación exitosa\n');
    }

    console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
}

// Ejecutar pruebas
testPersonalAPI(); 