# Sistema de Migraciones - NhEstetica

Este directorio contiene todas las migraciones de la base de datos del sistema NhEstetica.

## Estructura de Archivos

```
migraciones/
├── 001_create_database.sql      # Crear base de datos
├── 002_create_users_table.sql   # Tabla de usuarios
├── 003_create_personal_table.sql # Tabla de personal
├── 004_create_clientes_table.sql # Tabla de clientes
├── 005_create_comisiones_table.sql # Tabla de comisiones
└── README.md                    # Este archivo
```

## Cómo Ejecutar las Migraciones

### Opción 1: Ejecutar todas las migraciones
```bash
cd backend
node run-migrations.js
```

### Opción 2: Ejecutar migración individual
```bash
mysql -u TU_USUARIO -p < migraciones/002_create_users_table.sql
```

### Opción 3: Desde MySQL Workbench o phpMyAdmin
Copia y pega el contenido de cada archivo .sql en tu cliente MySQL.

## Orden de Ejecución

Las migraciones deben ejecutarse en el siguiente orden:

1. **001_create_database.sql** - Crear la base de datos
2. **002_create_users_table.sql** - Tabla de autenticación
3. **003_create_personal_table.sql** - Tabla de empleados
4. **004_create_clientes_table.sql** - Tabla de clientes
5. **005_create_comisiones_table.sql** - Tabla de comisiones (depende de personal)

## Agregar Nuevas Migraciones

Para agregar una nueva migración:

1. Crea un nuevo archivo con el formato: `XXX_nombre_migracion.sql`
2. Usa el siguiente número secuencial (ej: 006, 007, etc.)
3. Incluye comentarios descriptivos al inicio del archivo
4. Usa `IF NOT EXISTS` para evitar errores si la tabla ya existe

### Ejemplo de nueva migración:
```sql
-- Migración 006: Crear tabla productos
-- Fecha: 2024-06-22
-- Descripción: Tabla para gestionar productos de la empresa

USE nhestetica_db;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Verificar Estado de la Base de Datos

Para verificar qué tablas existen:
```sql
USE nhestetica_db;
SHOW TABLES;
```

## Rollback (Reversión)

Para revertir una migración específica, crea un archivo de rollback:
```sql
-- Rollback 005: Eliminar tabla comisiones
DROP TABLE IF EXISTS comisiones;
```

## Notas Importantes

- **Siempre haz backup** antes de ejecutar migraciones en producción
- **Prueba las migraciones** en un entorno de desarrollo primero
- **Mantén el orden** de ejecución de las migraciones
- **Documenta cambios** importantes en los comentarios de cada migración 