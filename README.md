# PermisosApp — explicación del código y guía para presentar

## 1. ¿Qué es este proyecto?

PermisosApp es una aplicación web de demostración para administrar permisos municipales. Incluye inicio de sesión para un administrador y tres secciones: una bandeja de solicitudes, un catálogo de tipos de permiso y un resumen estadístico.

La aplicación está construida con Angular 15 y TypeScript. Su propósito actual es mostrar la estructura y el flujo del panel en el navegador. No se conecta a un servidor: las solicitudes y los permisos de ejemplo viven en memoria, mientras que la sesión se guarda en el almacenamiento local del navegador.

**Una forma sencilla de presentarlo:** “Este proyecto organiza un panel para que personal municipal pueda revisar solicitudes, consultar los permisos disponibles y observar un resumen de los trámites. En esta etapa trabajamos con datos de demostración.”

## 2. Cómo ejecutar la aplicación

Desde la carpeta del proyecto, ejecutar:

```bash
npm install
npm start
```

Luego abrir `http://localhost:4200/` en el navegador. Para crear la compilación de producción:

```bash
npm run build
```

### Credenciales de demostración

- Correo: `admin@municipal.cl`
- Contraseña: `1234`

Estas credenciales son las que valida `AuthService`. La contraseña `Admin123!` que aparecía en un README anterior no coincide con el código actual.

## 3. Recorrido para mostrar en vivo

1. Al abrir la aplicación, la ruta principal decide a dónde enviar al visitante: al login si no hay sesión, o al panel si ya inició sesión.
2. En el login, completar correo y contraseña. El formulario valida los campos antes de llamar al servicio de autenticación.
3. Una vez dentro, el encabezado presenta los enlaces de Solicitudes, Catálogo y Estadísticas, además de la opción para salir.
4. En Solicitudes se ven siete registros de ejemplo con distintos estados. Los botones Aprobar y Rechazar actualizan el estado en la sesión actual de la aplicación.
5. En Catálogo se consultan tres tipos de permiso de ejemplo con su categoría, tarifa, plazo y estado de vigencia.
6. En Estadísticas se ve el conteo de solicitudes agrupado por estado y tipo de permiso.

## 4. Mapa del código

```text
src/
├── main.ts
├── index.html
├── styles.css
└── app/
    ├── app.module.ts
    ├── app-routing.module.ts
    ├── app.component.ts / .html / .css
    ├── app.component.spec.ts
    ├── auth/
    │   ├── auth.module.ts
    │   └── pages/login/          # Formulario de acceso y estilos
    ├── core/
    │   ├── enums/                # Estados, categorías y roles
    │   ├── guards/               # Protección y redirección de rutas
    │   ├── models/               # Estructuras de datos
    │   └── services/             # Autenticación, permisos y solicitudes
    └── features/admin/
        ├── admin.module.ts
        ├── admin-routing.module.ts
        ├── admin-shared.css
        └── pages/
            ├── solicitudes/
            ├── catalogo-permisos/
            └── estadisticas/
```

La carpeta `core` contiene elementos compartidos. `auth` agrupa el acceso. `features/admin` agrupa las páginas administrativas. Dentro de cada página, el archivo TypeScript maneja los datos y acciones; el HTML define lo que ve la persona y el CSS ajusta su presentación.

## 5. Explicación por partes

### 5.1 Arranque de Angular y marco de la aplicación

- **`src/index.html`** es la página HTML inicial. El elemento `<app-root>` es el espacio donde Angular monta la aplicación.
- **`src/main.ts`** inicia Angular cargando el módulo principal, `AppModule`.
- **`src/app/app.module.ts`** registra el componente raíz, las rutas y módulos de navegador.
- **`src/app/app.component.ts`** coordina el cierre de sesión y expone `AuthService` a la plantilla.
- **`src/app/app.component.html`** presenta el encabezado con navegación, el espacio de contenido (`router-outlet`) y el pie. El encabezado solo aparece cuando existe un usuario.
- **`src/app/app.component.css`** contiene estilos propios de ese marco.

**Para explicarlo:** “`main.ts` inicia Angular; el módulo principal prepara la aplicación; y el componente raíz sostiene la navegación y el espacio donde van cambiando las páginas.”

### 5.2 Rutas, navegación y protección

**`app-routing.module.ts`** describe las direcciones principales:

- `/` y las direcciones desconocidas usan `homeRedirectGuard` para enviar al usuario a la página adecuada.
- `/auth` carga el módulo de autenticación.
- `/admin` carga el módulo administrativo, después de aplicar `AuthGuard` y `RoleGuard`.

El guard de inicio consulta si hay una sesión: si existe, redirige a `/admin`; si no, a `/auth/login`. `AuthGuard` bloquea administración si no hay usuario. `RoleGuard` revisa `rolesPermitidos` y, para el panel, permite el rol administrador.

**`auth.module.ts`** declara la pantalla de login en `/auth/login`. **`admin-routing.module.ts`** conecta las rutas `/admin/solicitudes`, `/admin/catalogo` y `/admin/estadisticas` con sus componentes. Si se abre solo `/admin`, se redirige a Solicitudes.

**Para explicarlo:** “Las rutas muestran la página que corresponde y los guards revisan que haya una sesión válida y el rol adecuado antes de entrar al panel.”

### 5.3 Inicio de sesión

**`login.component.ts`** crea un formulario reactivo con Angular. El correo debe ser obligatorio y tener formato de email; la contraseña debe estar completada. `onSubmit()` revisa el formulario, activa el indicador de carga e invoca el servicio de autenticación. Si el acceso funciona, navega al panel; si falla, muestra el mensaje de credenciales inválidas.

**`login.component.html`** conecta el formulario con la vista usando `[formGroup]`, `formControlName` y `(ngSubmit)`. El botón se desactiva durante el inicio de sesión y cambia su etiqueta mientras espera. La referencia `#passwordInput` está declarada en el campo; en esta plantilla actual no hay botón que la use.

**`login.component.css`** da formato a la tarjeta del login y adapta sus márgenes a pantallas pequeñas.

### 5.4 Autenticación y sesión

**`core/services/auth.service.ts`** simula la autenticación. Comprueba el correo `admin@municipal.cl` y la contraseña `1234`; devuelve un error si no coinciden. Si coinciden, crea un usuario y un token de demostración, espera brevemente y guarda la sesión en `localStorage`.

El `BehaviorSubject` llamado `usuarioSubject` mantiene el usuario activo y `usuario$` permite que otras partes de la aplicación reciban los cambios. `logout()` elimina la sesión. `perfil()` devuelve el usuario actual con una promesa. `esRol()` comprueba el rol del usuario.

**Para explicarlo:** “El servicio de autenticación concentra el acceso y mantiene informado al resto de la aplicación sobre quién inició sesión.”

### 5.5 Modelos y enums

Los archivos de `core/models` definen la forma de los datos para que componentes y servicios compartan un vocabulario común:

- **`usuario.model.ts`** define `Usuario`, `LoginDto` y `SesionDto`: el perfil, los datos ingresados al iniciar sesión y la sesión resultante.
- **`permiso.model.ts`** define `TipoPermiso`, `RequisitoPermiso` y `TipoPermisoFormDto`. Un tipo de permiso es una entrada del catálogo; contiene categoría, descripción, requisitos, tarifa, plazo y si está activo.
- **`solicitud.model.ts`** define `Solicitud` y sus datos asociados: documentos, observaciones, comprobantes de pago, pasos del trámite, filtros y acciones para resolver.

**`core/enums/estado-solicitud.enum.ts`** define estados, categorías y roles. Los estados en el código actual son `BORRADOR`, `EN REVISION`, `OBSERVACION`, `APROBADA`, `RECHAZADA` y `EMITIDA`. También hay un mapa de etiquetas legibles para los estados. El enum establece un vocabulario consistente para las transiciones del trámite.

### 5.6 Servicio del catálogo: `permisos.service.ts`

El servicio comienza con tres permisos de muestra: Patente comercial, Autorización de eventos y Ocupación de vía pública. Un `BehaviorSubject` guarda la lista y permite emitir cambios. `listar()` entrega la lista completa o solo los tipos activos; `obtener()` busca un tipo por id.

También existen métodos para crear, actualizar y cambiar si un permiso está activo. Al crear, el servicio asigna identificadores y una fecha de inicio de vigencia. Al actualizar, reemplaza los datos del tipo. En la interfaz actual estos métodos aún no están conectados: los botones **Nuevo tipo de permiso** y **Editar** solo se muestran.

### 5.7 Servicio de solicitudes: `solicitudes.service.ts`

Este servicio contiene siete solicitudes de demostración con nombres, folios, fechas, permisos, estados y algunos datos u observaciones. El `BehaviorSubject` es la fuente de datos que consumen la bandeja y las estadísticas.

Entre los métodos implementados están:

- `listarTodas()` y `misSolicitudes()` entregan el flujo de solicitudes.
- `iniciarSolicitud()` crea una solicitud nueva en estado borrador.
- `avanzarPaso()` guarda datos de un paso y pasa a revisión al llegar a la confirmación.
- `adjuntarDocumento()` agrega metadatos del archivo; no sube el archivo a un servidor.
- `pagarSimulado()` genera un comprobante de pago ficticio.
- `resolver()` cambia el estado según la acción administrativa.
- `estadisticas()` calcula cantidades por estado y tipo de permiso.

En las pantallas disponibles, la bandeja usa `listarTodas()` y los botones llaman a `resolver()` para aprobar o rechazar. El mensaje de rechazo es fijo. Los otros métodos pertenecen a un flujo más amplio aún no conectado a páginas ciudadanas.

### 5.8 Bandeja de solicitudes

**`solicitudes.component.ts`** obtiene el observable de solicitudes al iniciar. Los métodos `aprobar()` y `rechazar()` mandan la acción al servicio.

**`solicitudes.component.html`** construye la tabla. `*ngIf` espera los datos del observable con el pipe `async`; `*ngFor` genera una fila por solicitud. Los valores se insertan con interpolación `{{ ... }}`, la fecha se presenta con el pipe `date` y `(click)` conecta los botones con los métodos del componente.

**`solicitudes.component.css`** comparte los estilos de tabla administrativa y destaca el estado y las acciones. La pantalla no tiene filtros ni un formulario para redactar observaciones.

### 5.9 Catálogo de permisos

**`catalogo-permisos.component.ts`** pide al servicio la lista incluyendo elementos activos e inactivos (`listar(false)`).

**`catalogo-permisos.component.html`** recorre los tipos de permiso y muestra nombre, categoría, tarifa, plazo y estado. Usa `currency:'CLP'` para dar formato a la tarifa y muestra “Sí” o “No” según el campo `activo`.

**`catalogo-permisos.component.css`** comparte los estilos de tabla y alinea los controles de esta pantalla. Los botones de alta y edición todavía no ejecutan acciones.

### 5.10 Estadísticas

**`estadisticas.component.ts`** se suscribe al resumen que prepara `SolicitudesService`. El servicio agrupa con `reduce()` el total por estado y por nombre de tipo de permiso.

**`estadisticas.component.html`** muestra los dos grupos en listas. `keyvalue` permite recorrer las claves y cantidades de cada objeto. **`estadisticas.component.css`** organiza las listas en dos paneles y permite que se apilen en pantallas estrechas. Todavía no hay gráficos.

### 5.11 Estilos globales y configuración

- **`src/styles.css`** define colores, tipografías, botones, campos de formulario, tablas, layout general y reglas para pantallas pequeñas.
- **`admin-shared.css`** reúne el formato compartido por las tablas administrativas.
- Cada sección administrativa tiene su propio CSS para los detalles de la tabla o distribución.
- **`angular.json`** configura la compilación, el servidor de desarrollo, los archivos de entrada, estilos globales y la configuración de pruebas.
- **`package.json`** lista Angular, RxJS y las dependencias de desarrollo, y define comandos como `npm start`, `npm run build` y `npm test`.
- **`tsconfig.json`, `tsconfig.app.json` y `tsconfig.spec.json`** configuran cómo TypeScript compila la aplicación y las pruebas.
- **`.editorconfig`** contiene convenciones de formato; **`.gitignore`** enumera archivos que Git no debería versionar.
- **`app.component.spec.ts`** es un archivo de prueba generado como plantilla. Sus expectativas aún mencionan un título “Proyecto” y un contenido que no corresponden al componente actual, por lo que debe actualizarse antes de usarlo como verificación válida.

## 6. Conceptos de Angular que aparecen en el código

- **Interpolación:** `{{ s.folio }}` muestra un valor de los datos en la página.
- **Enlace de propiedades:** `[disabled]="cargando"` desactiva un botón según el estado.
- **Enlace de eventos:** `(click)="aprobar(s.id)"` responde a una acción del usuario.
- **Directivas estructurales:** `*ngIf` y `*ngFor` muestran contenido o repiten filas.
- **Formularios reactivos:** `FormBuilder` y `Validators` organizan y validan el login.
- **Inyección de dependencias:** Angular entrega servicios como `AuthService` a los componentes.
- **Observables:** los servicios publican datos que se actualizan; el pipe `async` los consume en la plantilla.
- **Guards:** controlan la navegación según la sesión y el rol.
- **Pipes:** `date`, `currency` y `keyvalue` transforman datos para mostrarlos.

## 7. Alcance de la demostración

Para describir el estado del proyecto con precisión durante la exposición:

- El inicio de sesión se valida en el navegador con credenciales fijas; no hay autenticación real de servidor.
- La sesión se conserva en `localStorage`, pero las solicitudes y el catálogo vuelven a sus datos iniciales al recargar la página.
- Los documentos, pagos y comprobantes son simulados.
- Se pueden cambiar estados desde la bandeja, pero todavía no se capturan filtros ni motivos personalizados.
- El catálogo permite consultar, pero sus botones de alta y edición aún no tienen formularios conectados.
- Las estadísticas muestran listas en lugar de gráficos.
- Hay estructuras y métodos preparados para pasos ciudadanos, pero este proyecto no incluye pantallas de ciudadanía.

## 8. Guion sugerido para la presentación

1. **Objetivo:** explicar que el panel ayuda a organizar la revisión administrativa de permisos.
2. **Estructura:** mostrar `core`, `auth` y `features/admin` y contar qué responsabilidad tiene cada zona.
3. **Acceso:** iniciar sesión y explicar el formulario reactivo, el servicio y la protección de rutas.
4. **Solicitudes:** recorrer algunos registros y aprobar o rechazar uno para mostrar el cambio de estado.
5. **Catálogo:** explicar qué datos describe cada tipo de permiso.
6. **Estadísticas:** mostrar cómo el servicio cuenta las solicitudes por estado y por tipo.
7. **Cierre:** comentar que los datos son de demostración y que el siguiente paso sería conectarse a una API y completar las funciones de alta, filtros y flujo ciudadano.

## 9. Pruebas

El proyecto tiene configurado `npm test` con Karma y Jasmine. El archivo de prueba que está presente conserva expectativas de la plantilla inicial de Angular y no describe correctamente la pantalla raíz actual; conviene corregirlo antes de tomar sus resultados como prueba del comportamiento del panel.
