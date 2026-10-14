# Verificación de esta entrega

## Actualización visual y perfiles · 14 de octubre de 2026

- Se reemplazaron los dibujos por fotografías locales de Pexels: docente con estudiantes, entrega comunitaria de alimentos y personas cultivando.
- Se verificó con navegación real la ficha de educación y el formulario de aporte: 29% alcanzado, $4.350.000 COP recaudados, $10.650.000 COP pendientes y dos aportantes únicos.
- Mateo Rojas y Sofía Martínez muestran verificación aprobada, seis aportes confirmados, seis constancias y seis filas en Últimos aportes.
- Luna Restrepo se comprobó sin aportes y con el perfil pendiente. La migración v3 prepara ese perfil inicial sin duplicar el historial de los otros donantes.
- Vitest: 20 pruebas aprobadas, incluidas tres verificaciones adicionales de semilla, migración y progreso por causa.
- Se mantiene el aviso general de demo y la advertencia legal/tributaria de los PDFs; los textos de los proyectos y del portal usan etiquetas naturales.

Los resultados siguientes documentan la primera versión y sus datos originales.

## Automatizadas

- TypeScript: `tsc -b`, sin errores.
- Compilación de producción: Vite, correcta. Paquetes separados de React, aplicación y documentos.
- Vitest: 17 pruebas aprobadas. Reglas del recorrido, bloqueo de documentos/pagos/constancias, roles demo, notas obligatorias, reenvío observado, rechazo, fallo/reintento, conciliación de pendientes, siete escenarios, moneda segura y periodos separados.
- Generación jsPDF: encabezado PDF válido, una página A4, advertencias visibles, referencias y datos ficticios. Constancias bloqueadas sin pago confirmado.
- El servidor local respondió HTTP 200.

En este equipo npm no estaba disponible en PATH. Se instalaron dependencias con pnpm y se ejecutaron los mismos comandos de los scripts mediante Node. El lanzador PowerShell permite ejecutar la demo con las dependencias instaladas.

## En navegador de Codex

Recorrido comprobado con clics reales en la UI:

1. Inicio → configurar un aporte de $100.000 COP para Aprender para crecer → acceso de Luna.
2. Guardar perfil y consentimiento → enviar verificación → estado Pendiente.
3. Administrador → iniciar revisión y aprobar con nota.
4. Donante → generar y descargar PDF de intención → aceptar documento → checkout habilitado.
5. Pago fallido → reintento → pago pendiente.
6. Administrador → Donaciones → detalle → confirmar pago demo.
7. Donante → generar y descargar constancia PDF → Constancia disponible.
8. Dashboard: $350.000 → $450.000 COP; cuatro pagos confirmados; dos constancias.
9. Cargar escenario observado con confirmación → reenvío deshabilitado hasta guardar de nuevo el perfil → reenviar a Pendiente.
10. Rechazar con nota → botón de generar documento y aceptación deshabilitados.

Revisión responsive con viewport móvil de 390 × 844 solicitado al navegador. En este equipo el escalado del navegador aplica una superficie CSS aproximada de 487 × 1055. Se comprobaron navegación del portal, formularios, reenvío observado y ausencia de desbordamiento horizontal. Diseño público y dashboard revisados en escritorio.

Las descargas de intención y constancia se renderizaron con Poppler y se inspeccionaron visualmente: acentos correctos, texto sin superposición, información legible y advertencia legal/tributaria clara. La extracción de texto confirmó una página y los campos esperados.

## Límites

- No se ha hecho auditoría formal WCAG, pruebas multibrowser ni pruebas de seguridad para producción.
- Durante cambios de código con Fast Refresh fue necesaria una recarga; la versión final y la persistencia se verificaron después de ella.
- No se prueban proveedores reales ni operaciones financieras: no están implementados.
- Los datos persistidos son locales, editables por el usuario del navegador y no ofrecen integridad ni control de acceso reales.
