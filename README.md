# PermisosApp — Guía del proyecto y apoyo para la presentación

## ¿Qué hace esta aplicación?

PermisosApp es una demostración de un panel administrativo municipal para revisar solicitudes de permisos, consultar un catálogo de trámites y ver estadísticas sencillas. La idea es recorrer cómo se puede organizar una aplicación Angular por módulos, páginas, servicios y modelos.

La versión actual se centra en el **administrador**. No incluye todavía pantallas funcionales para ciudadanía ni un servidor conectado: la información de solicitudes y permisos se crea en el propio código y se mantiene en memoria mientras la aplicación está abierta. La sesión de administrador sí se guarda en el almacenamiento local del navegador.

> **Para contar en la presentación:** “Construimos el primer sprint del panel administrativo. Permite iniciar sesión en modo demostración, revisar solicitudes, cambiar su estado, consultar los tipos de permiso y ver un resumen de datos.”

## Cómo iniciar el proyecto

Se necesita Node.js y npm instalados. Desde la carpeta del proyecto:

```bash
npm install
npm start
```

Angular levanta el servidor de desarrollo en `http://localhost:4200/`. Para generar la versión compilada:

```bash
npm run build
```

### Acceso de demostración

- Correo: `admin@municipal.cl`
- Contraseña: `1234`

Estas credenciales están definidas en `AuthService`. El README anterior mostraba una contraseña distinta; para esta versión, la que acepta el código es `1234`.

## Recorrido de la aplicación

1. Al entrar, la ruta inicial redirige a la página de inicio de sesión.
2. El formulario revisa que el correo tenga formato válido y que ambos campos estén completos.
3. Si las credenciales coinciden, el servicio genera una sesión de demostración, la guarda en `localStorage` y el usuario llega al panel administrativo.
4. En el panel se puede abrir **Solicitudes**, **Catálogo** o **Estadísticas**.
5. En Solicitudes, los botones cambian el estado de la solicitud seleccionada a aprobada o rechazada.
6. El botón **Salir** elimina la sesión guardada y vuelve al acceso.

Las tres secciones administrativas leen datos de servicios compartidos. Por eso, cuando cambia el estado de una solicitud, las estadísticas pueden reflejar ese cambio mientras la aplicación sigue abierta.

## Cómo está organizado el código

```text
src/
├── main.ts                         # Arranque de Angular
├── index.html                      # Página HTML que contiene <app-root>
├── styles.css                      # Estilos generales
└── app/
    ├── app.module.ts               # Módulo principal
    ├── app-routing.module.ts       # Rutas generales y protección de admin
    ├── app.component.ts            # Encabezado, navegación y salida
    ├── auth/                       # Acceso y módulo de autenticación
    ├── core/
    │   ├── enums/                  # Estados, categorías y roles
    │   ├── guards/                 # Protección de rutas
    │   ├── models/                 # Formas de los datos
    │   └── services/               # Sesión, permisos y solicitudes
    └── features/admin/
        ├── admin.module.ts         # Módulo administrativo
        ├── admin-routing.module.ts # Páginas del administrador
        └── pages/                  # Solicitudes, catálogo y estadísticas
```

La carpeta `core` reúne piezas que comparten varias páginas. `features/admin` agrupa las pantallas de administración. `auth` mantiene separada la página de acceso. Esta separación hace más fácil encontrar cada responsabilidad y ampliar el proyecto.

## El código, parte por parte

### 1. Inicio y estructura de Angular

- **`src/index.html`** es el documento base que carga el navegador. El elemento `<app-root>` es el espacio donde Angular monta la aplicación.
- **`src/main.ts`** arranca Angular y carga `AppModule`. Si el arranque falla, muestra el error en la consola.
- **`src/app/app.module.ts`** es el módulo raíz. Registra el componente principal, el enrutamiento y las capacidades del navegador.
- **`src/app/app.component.ts`** dibuja el encabezado, los enlaces de navegación, el contenido de la página y el pie. El encabezado aparece cuando hay un usuario activo. Al pulsar **Salir**, llama al servicio de autenticación y navega al login.

**Para explicarlo:** “`main.ts` enciende la aplicación, `AppModule` reúne las piezas principales y `AppComponent` es el marco común que rodea cada pantalla.”

### 2. Rutas y acceso a las secciones

**`src/app/app-routing.module.ts`** define las rutas de nivel general:

- `/` redirige al login.
- `/auth` carga el módulo de autenticación bajo demanda.
- `/admin` carga el módulo administrativo bajo demanda y aplica dos protecciones.
- Cualquier ruta desconocida vuelve al login.

La carga bajo demanda significa que los módulos de login y administración se importan al entrar a sus secciones, en vez de declararlos juntos al inicio.

Dentro de administración, **`admin-routing.module.ts`** conecta las direcciones `/admin/solicitudes`, `/admin/catalogo` y `/admin/estadisticas` con sus respectivas páginas. Si se entra a `/admin` sin una página específica, se abre Solicitudes.

Los guards hacen dos comprobaciones:

- **`AuthGuard`** permite seguir si existe un usuario en sesión. Si no, devuelve al login.
- **`RoleGuard`** comprueba que el rol del usuario esté en la lista permitida. En la ruta administrativa se permite el rol `ADMINISTRADOR`.

**Para explicarlo:** “Las rutas deciden qué pantalla mostrar; los guards revisan primero si existe sesión y si el usuario tiene el rol requerido.”

### 3. Inicio de sesión

El módulo de acceso está en **`src/app/auth/`**. `auth.module.ts` declara la página y su ruta. El formulario se define en **`login.component.ts`** usando formularios reactivos de Angular: correo obligatorio con formato de email y contraseña obligatoria.

Al enviar el formulario, `onSubmit()` marca los campos como revisados si hay errores. Si está completo, muestra el estado de carga e invoca `AuthService.login()`. Cuando el servicio responde, navega a `/admin`; si falla, presenta un mensaje entendible. En **`login.component.html`**, `formGroup` conecta la vista al formulario, `formControlName` enlaza cada campo y `ngSubmit` llama al método al enviar. La referencia local `#passwordInput` permite que el botón secundario enfoque el campo de contraseña.

**`src/app/core/services/auth.service.ts`** contiene la lógica de sesión. Compara las credenciales con valores definidos en el propio código, simula una pequeña espera con RxJS, crea un token de demostración y guarda la sesión como JSON en `localStorage`. Un `BehaviorSubject` publica el usuario actual para que el encabezado pueda reaccionar a cambios. `logout()` borra la sesión y publica que ya no hay usuario. `perfil()` devuelve el usuario actual mediante una promesa.

**Para explicarlo:** “El formulario recoge y valida los datos; el servicio verifica el acceso y avisa al resto de la aplicación quién inició sesión.”

### 4. Modelos y enums: el vocabulario de los datos

Los archivos de `src/app/core/models/` describen qué forma tienen los datos. No son pantallas ni guardan información por sí mismos: ayudan a que los servicios y componentes trabajen con campos conocidos.

- **`usuario.model.ts`** describe al usuario y los datos de acceso/sesión (`LoginDto` y `SesionDto`). El RUT es opcional.
- **`permiso.model.ts`** describe los tipos de permiso del catálogo, sus requisitos documentales y el formulario de alta/edición (`TipoPermisoFormDto`).
- **`solicitud.model.ts`** describe una solicitud concreta, los documentos adjuntos, observaciones, comprobantes de pago y algunos datos previstos para el flujo completo.

En **`estado-solicitud.enum.ts`** se definen los estados de una solicitud, las categorías de permisos y los roles (`CIUDADANO` y `ADMINISTRADOR`). También hay etiquetas legibles para mostrar los estados. El flujo previsto es: borrador, revisión, posible observación y nueva revisión, aprobación o rechazo, y finalmente emisión. En la interfaz actual solo están conectadas las acciones de aprobar y rechazar.

**Para explicarlo:** “Los modelos dicen qué datos maneja el sistema y los enums evitan escribir estados o roles con valores distintos por error.”

### 5. Servicios y datos de demostración

Los servicios están en `src/app/core/services/`. Se encargan de manejar datos y reglas fuera de las pantallas.

#### Catálogo: `permisos.service.ts`

Comienza con tres tipos de permiso de ejemplo. `listar()` devuelve todos o solo los activos; `obtener()` busca uno por id. También implementa métodos para crear, actualizar y activar/desactivar tipos. Los cambios actualizan un `BehaviorSubject`, que notifica a quienes están suscritos.

Aunque están implementados los métodos de creación y edición, la pantalla actual solo muestra la tabla. Los botones **Nuevo tipo de permiso** y **Editar** son visuales por ahora y todavía no ejecutan esas operaciones.

#### Solicitudes: `solicitudes.service.ts`

Comienza con una solicitud de ejemplo. Centraliza el listado, la consulta de estadísticas y acciones como iniciar solicitud, avanzar pasos, adjuntar un documento, simular un pago, descargar un comprobante o resolver la solicitud. Varias de esas funciones preparan un flujo más amplio que aún no está expuesto en las páginas actuales.

En esta versión, la bandeja administrativa usa `listarTodas()` y permite resolver con las acciones de aprobar y rechazar. Los datos se comparten mediante un `BehaviorSubject` y se actualizan en memoria.

**Para explicarlo:** “Las páginas presentan los datos y los servicios aplican los cambios. Así evitamos repetir la misma lógica en distintos componentes.”

### 6. Páginas administrativas

#### Solicitudes

`features/admin/pages/solicitudes/solicitudes.component.ts` pide la lista al servicio y define los métodos para aprobar o rechazar. Su HTML dibuja una tabla con folio, identificador del solicitante, permiso, estado y fecha. `*ngFor` genera una fila por solicitud, `*ngIf` muestra la tabla cuando hay datos y los eventos `(click)` conectan los botones con el componente.

La acción de rechazo usa un mensaje fijo de ejemplo (“Faltan antecedentes obligatorios.”). En esta pantalla todavía no hay filtros, diálogo de confirmación ni campo para redactar observaciones.

#### Catálogo de permisos

`catalogo-permisos.component.ts` obtiene todos los tipos del servicio y los expone como un `Observable`. La plantilla recorre la lista y muestra nombre, categoría, tarifa, plazo y vigencia. El pipe `currency` presenta la tarifa como moneda y el operador `async` se suscribe al observable y actualiza la vista cuando llegan cambios.

La pantalla es una consulta del catálogo en su estado actual. Alta y edición aparecen como botones, pero aún no tienen formulario conectado.

#### Estadísticas

`estadisticas.component.ts` solicita al servicio un resumen agrupado por estado y tipo de permiso. El servicio cuenta los elementos con `reduce()`. La plantilla utiliza `keyvalue` para recorrer esos conteos y mostrarlos como listas. Por ahora no hay gráficos; los comentarios del componente dejan esa mejora como posible trabajo futuro.

### 7. Estilos y configuración

- **`src/styles.css`** define colores, tipografías, botones, tablas y distribución general. Incluye una regla adaptable a pantallas estrechas.
- **`login.component.css`** contiene estilos para el formulario de acceso. El componente no declara explícitamente `styleUrls` en su metadata, por lo que estos estilos no están conectados directamente a `LoginComponent` en la configuración actual.
- **`angular.json`** indica cómo Angular compila y sirve el proyecto, dónde está el HTML inicial, qué estilos globales incluir y a qué carpeta genera la compilación.
- **`package.json`** registra los comandos principales (`start`, `build`, `test`) y las dependencias, entre ellas Angular 15 y RxJS.
- Los archivos `tsconfig*.json` ajustan la compilación de TypeScript. `.editorconfig` mantiene convenciones de formato y `.gitignore` enumera archivos que Git no debería incluir.

## Conceptos de Angular que se pueden mostrar

- **Interpolación:** `{{ usuario.nombre }}` inserta un valor del componente en el HTML.
- **Property binding:** `[disabled]="cargando"` controla una propiedad del botón desde el estado del componente.
- **Event binding:** `(click)="aprobar(s.id)"` llama a una función al producirse un evento.
- **Directivas estructurales:** `*ngIf` y `*ngFor` muestran contenido condicional y repiten elementos.
- **Formularios reactivos:** `FormBuilder`, `Validators`, `formGroup` y `formControlName` organizan y validan el acceso.
- **Inyección de dependencias:** Angular entrega servicios como `AuthService` o `SolicitudesService` a los componentes.
- **Observables y RxJS:** `BehaviorSubject` comparte el estado y `async` consume observables en las plantillas.
- **Enrutamiento y guards:** las rutas cambian de página y los guards limitan el acceso.
- **Referencia local:** `#passwordInput` da acceso al campo desde la propia plantilla.

## Alcance actual y puntos a completar

Conviene presentar esta entrega como una **demo funcional de la navegación y la gestión básica administrativa**, no como un sistema municipal conectado a producción:

- La autenticación compara credenciales en el frontend; no hay backend que valide identidad ni emita un token real.
- Los permisos y solicitudes se guardan en memoria. Al recargar, los cambios en esos datos se reinician. Solo la sesión se conserva en `localStorage`.
- La URL de los documentos y el comprobante de pago son simulados; no se suben archivos ni se procesa un pago real.
- La pantalla de catálogo aún no conecta los botones de alta y edición con los métodos disponibles en el servicio.
- La pantalla de solicitudes aún no ofrece filtros ni captura un mensaje de rechazo escrito por el administrador.
- Las estadísticas se presentan en listas, sin gráficos.
- Hay modelos y métodos preparados para pasos de solicitud ciudadana, pero todavía no hay páginas ciudadanas dentro de esta entrega.

## Guion breve para exponer

1. **Problema y propósito:** “La aplicación reúne herramientas para que un administrador municipal revise permisos y solicitudes.”
2. **Organización:** mostrar `core`, `auth` y `features/admin`; contar que las responsabilidades están separadas.
3. **Acceso:** iniciar sesión con las credenciales de demo y explicar formulario reactivo, servicio y guard.
4. **Solicitudes:** mostrar el folio y cambiar su estado; explicar la relación entre componente y servicio.
5. **Catálogo y estadísticas:** mostrar qué información se consulta y cómo los observables alimentan la vista.
6. **Cierre:** explicar que es una base demostrativa y mencionar como siguientes pasos una API, persistencia real, alta/edición del catálogo y filtros.

## Nota sobre pruebas

El proyecto incluye la configuración de Angular para ejecutar `npm test`, pero esta entrega no contiene archivos de pruebas de componentes o servicios.
