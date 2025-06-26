-- Fix ventas_productos table to make marca field nullable or provide default
-- Option 1: Make marca nullable (recommended since we'll get it from productos table)
ALTER TABLE ventas_productos MODIFY COLUMN marca VARCHAR(200) NULL;

-- Option 2: If you prefer to keep marca NOT NULL, you can set a default value
-- ALTER TABLE ventas_productos MODIFY COLUMN marca VARCHAR(200) NOT NULL DEFAULT 'Sin marca'; 