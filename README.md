# Demo-Donaciones · Fundación Demo

Prototipo local en español de una plataforma de donaciones. Incluye web pública, portal de donante y panel de un único administrador de presentación.

**Todos los perfiles, iniciativas, pagos y verificaciones son ficticios. Los PDFs descargables no tienen validez legal, de firma ni tributaria.** No hay autenticación real, consultas KYC, pasarelas, Supabase ni envío de correos.

## Ejecutar

Requisitos: Node.js 22.12+ (o 20.19+) y npm. Se recomienda Node.js 24 LTS.

```bash
npm install
npm run dev
```

Abre http://127.0.0.1:5173. No hacen falta credenciales ni variables de entorno.

```bash
npm run test
npm run build
npm run preview
```

En el entorno de Codex utilizado para construir esta demo está disponible Node pero no npm en PATH. `./ARRANCAR_DEMO.ps1` usa npm si está instalado, o el runtime local de Codex cuando las dependencias ya están presentes. La instalación inicial se hizo con pnpm; se incluye su lockfile. Con pnpm puede usarse `pnpm install --frozen-lockfile` y `pnpm dev`. No se necesita pnpm para usar npm en otro equipo.

## Recorrido

1. `/donar`: selecciona causa, monto, COP/USD y método simulado.
2. `/acceso`: entra como Luna Restrepo.
3. Guarda el perfil ficticio y envía la verificación.
4. Entra como administrador; aprueba a Luna en `/admin/verificaciones`.
5. Vuelve como Luna; genera el documento de intención, descarga el PDF y acepta la simulación.
6. Simula un resultado de pago. Un pendiente se resuelve por el administrador.
7. Genera y descarga la constancia desde el historial tras confirmar el pago demo.

## Rutas

- Pública: `/`, `/causas`, `/causas/:slug`, `/como-funciona`, `/donar`, `/acceso`.
- Donante: `/donante/resumen`, `/donante/perfil`, `/donante/verificacion`, `/donante/documentos`, `/donante/pago`, `/donante/donaciones`.
- Admin: `/admin`, `/admin/donantes`, `/admin/verificaciones`, `/admin/donaciones`, `/admin/documentos`, `/admin/configuracion`.

## Arquitectura

- `src/domain`: contratos TypeScript, montos en centavos enteros, reglas y transiciones centralizadas; pruebas de negocio.
- `src/data`: marca provisional, tres causas ilustrativas y semilla segura.
- `src/services`: puertos `AuthRepository`, `DonorRepository`, `VerificationProvider`, `PaymentGateway`, `DocumentService`, `NotificationService` y `StateRepository`; adaptadores mock y generador cliente jsPDF.
- `src/features`: estado único, persistencia versionada y avisos; sincronización entre pestañas del mismo origen.
- `src/components`: navegación, sistema de UI e fotografías locales de Pexels y componentes de progreso.
- `src/pages`: experiencias pública, donante y administración.

Los puertos permiten sustituir las implementaciones por adaptadores de Supabase. Para operar de verdad será necesaria una arquitectura de servidor con autorización, RLS, validaciones y auditoría persistente. El selector actual no ofrece seguridad y no debe reutilizarse como autenticación real.

## Datos y demostración

La clave `fundacion-demo-v1` de localStorage guarda los datos en este navegador. Los cambios de rol y perfil son ficticios. Cambiar entre `localhost` y `127.0.0.1`, puerto o navegador crea un almacenamiento distinto. No introduzcas información personal real. La página no realiza solicitudes a servicios externos durante el recorrido; todas las fotografías se sirven localmente.

Luna Restrepo comienza sin aportes y con el perfil pendiente. Mateo Rojas y Sofía Martínez tienen verificación aprobada, seis aportes y seis constancias cada uno. Los escenarios observado y rechazado se preparan desde Configuración. Las instalaciones anteriores se actualizan automáticamente a la semilla de presentación v3; Luna vuelve al estado inicial solicitado. Una nueva intención requiere la verificación actual aprobada.

COP y USD nunca se suman ni se convierten entre sí. Los progresos públicos usan exclusivamente aportes COP confirmados de la misma fuente. El dashboard separa monedas. La aceptación es visual, y no es una firma electrónica jurídica.

Configuración permite cargar siete escenarios completos, ampliar el contenido en modo presentación y restablecer los datos con confirmación. La secuencia demo está modelada como verificación → documento → pago; cambiarla exige adaptar las reglas.

## Documentación

Consulta `GUIA_DEMO.md`, `DECISIONES_PENDIENTES.md`, `ROADMAP.md` y `NOTAS_PRUEBAS.md`.

Repositorio: [DuarCas-maker/Demo-Donaciones](https://github.com/DuarCas-maker/Demo-Donaciones).

La configuración de contenedor y dominio para Dokploy está documentada en `DESPLIEGUE_DOKPLOY.md`. `.gitignore` excluye dependencias, cachés, variables de entorno y salidas temporales.
