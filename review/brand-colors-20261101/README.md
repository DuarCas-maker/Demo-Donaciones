# Parche de colores Abrígame · revisión

Paquete de revisión solicitado por el usuario el 01-11-2026: publicar únicamente el parche visual, sin incorporar todavía el monorepo local.

Esta carpeta contiene un parche; no lo aplica a la aplicación del repositorio. El ajuste depende de la estructura local `apps/` y `packages/`, que no forma parte de este commit. El parche no se puede aplicar directamente a la SPA antigua de `main`.

## Cambio propuesto

- Barra pública del logo y menú en morado base `#290035`, texto blanco y detalles dorados. Menú móvil con la misma combinación.
- Bloque inicial y secciones públicas sobre blanco, incluida la invitación de contacto.
- Encabezados del portal demo y del portal API con los colores oficiales y foco visible sobre fondo oscuro.
- Ajuste de línea del nombre de la fundación en la barra lateral, sin modificar el logo.
- Paleta existente contrastada con las páginas 4 y 5 del manual aportado: `#290035`, `#41065C`, `#7314B2`, `#D5A63C`, `#FFE28A`, `#FFF3D5`. Se conserva DejaVu Sans.

## Contenido

- [brand-colors.patch](brand-colors.patch): cambios sobre `apps/web/src/institutional.css`, `packages/ui/src/styles.css`, `packages/ui/src/live.css` y `BRAND_ASSETS.md`.
- [manifest.json](manifest.json): huellas SHA-256 antes/después, calculadas con texto UTF-8 normalizado a saltos LF.
- [visual-check.json](visual-check.json): resultados locales de web y portal demo a 360, 768 y 1280 px.
- [live-visual-check.json](live-visual-check.json): resultados locales del portal API con respuestas sintéticas en memoria; estados normal, vacío, error y carga.

Las capturas quedaron en el espacio de trabajo local. Este paquete publica únicamente texto y resultados sintéticos; no incluye el manual, capturas operativas anteriores, credenciales, configuración en vivo ni la reorganización del proyecto.

## Aplicación posterior

Cuando el monorepo esté versionado y sus archivos coincidan con las huellas `before_sha256_lf` del manifiesto, desde su raíz:

```sh
git apply --check review/brand-colors-20261101/brand-colors.patch
git apply review/brand-colors-20261101/brand-colors.patch
```

Se validó el parche sobre una copia aislada de los cuatro archivos anteriores al cambio: `git apply --check` pasó y los cuatro resultados coincidieron exactamente con las huellas posteriores. No se alteró la copia de trabajo para hacer esta comprobación.

## Verificación de la implementación local

- `pnpm exec vitest run apps/web/src/institutional.test.ts tests/navigation.test.ts tests/boundaries.test.ts`: 27 pruebas aprobadas.
- `pnpm build`: aprobado, incluidos typecheck y build de las cuatro aplicaciones.
- Build aislado del portal con `VITE_ACCESS_MODE=api`: aprobado.
- Revisión visual de web y portal a 360, 768 y 1280 px; sin desbordamiento horizontal ni errores JavaScript en los recorridos comprobados. Teclado y foco público comprobados.
- Contraste del texto blanco: 18,33:1 sobre morado base, 14,94:1 sobre púrpura y 8,50:1 sobre violeta.

Estas comprobaciones corresponden al monorepo local, no al código de la SPA antigua que permanece en el repositorio remoto.

## Límites conocidos

- Una ejecución ampliada dejó 33 pruebas aprobadas y una fallida en `apps/portal/src/live-workspace.test.ts`: `parseLiveSession` no rechaza la sesión administrativa de nivel `aal1` que la prueba espera rechazar. Función y prueba no modificadas por el parche visual.
- `pnpm smoke` quedó bloqueado por `connect EACCES 127.0.0.1` en el entorno de ejecución.
- Publicación exclusivamente en una rama de revisión. Sin merge a `main` ni despliegue.
