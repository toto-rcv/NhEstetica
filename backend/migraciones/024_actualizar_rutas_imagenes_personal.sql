-- Migración 024: Actualizar rutas de imágenes del personal al nuevo formato de API
UPDATE personal 
SET imagen = CONCAT('/api/upload/image/personal/', SUBSTRING(imagen, LOCATE('personal-', imagen)))
WHERE imagen IS NOT NULL 
  AND imagen LIKE '/images-de-personal/%'
  AND imagen LIKE '%personal-%'; 