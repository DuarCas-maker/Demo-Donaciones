# Despliegue en Dokploy

Repositorio: https://github.com/DuarCas-maker/Demo-Donaciones

- Rama: `main`.
- Ruta de compilación: `/` (raíz del repositorio).
- Tipo de compilación: Dockerfile.
- Archivo: `Dockerfile`.
- Contexto Docker: `.`.
- Puerto del contenedor: `80`.
- Dominio: `donaciones-albadan.riverosadvisory.com`.
- Ruta del dominio: `/`.
- HTTPS: activado, certificado Let's Encrypt.
- No requiere variables de entorno, secretos, base de datos ni volúmenes.

El contenedor compila la aplicación con Node 24 y pnpm 11.25.0, ejecuta las pruebas y sirve los archivos estáticos con Nginx. El fallback a index.html permite abrir o recargar rutas como `/causas/aprender-para-crecer`, `/donante/resumen` y `/admin`.

Nginx responde `200` en `/health`. Las rutas de imágenes y recursos inexistentes devuelven `404`.

Los datos de la demo se conservan en localStorage de cada navegador. No se comparten entre dispositivos y permanecen simulados aunque la demo se publique por HTTPS. El cambio de localhost al dominio utiliza un almacenamiento independiente.

El dominio tiene un registro A hacia `72.60.168.172`. El despliegue se realiza como una aplicación nueva para este repositorio.
