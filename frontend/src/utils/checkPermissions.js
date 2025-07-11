// Utilidad para verificar permisos del usuario actual
export const checkUserPermissions = () => {
  try {
    const userType = localStorage.getItem('userType');
    const permisos = localStorage.getItem('permisos');
    const username = localStorage.getItem('username');
    
    console.log('🔍 Información del usuario actual:');
    console.log('Tipo de usuario:', userType);
    console.log('Username:', username);
    console.log('Permisos:', permisos);
    
    if (userType === 'admin') {
      const hasFullPermission = permisos === '1' || permisos === 1;
      console.log('¿Tiene permisos completos?', hasFullPermission);
      
      if (hasFullPermission) {
        console.log('✅ Usuario con permisos nivel 1 - Acceso completo');
      } else {
        console.log('⚠️  Usuario sin permisos nivel 1 - Acceso restringido');
      }
    } else {
      console.log('❌ No es usuario administrador');
    }
    
    return {
      userType,
      username,
      permisos,
      hasFullPermission: userType === 'admin' && (permisos === '1' || permisos === 1)
    };
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    return null;
  }
};

// Función para verificar si el usuario puede acceder a rutas protegidas
export const canAccessProtectedRoute = () => {
  const userInfo = checkUserPermissions();
  return userInfo?.hasFullPermission || false;
}; 