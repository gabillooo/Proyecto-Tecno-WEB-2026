# PermisosApp

Aplicación web de demostración para la administración municipal de permisos, licencias y patentes. El proyecto ofrece un acceso administrativo y tres vistas: bandeja de solicitudes, catálogo de permisos y estadísticas.

La aplicación está desarrollada con Angular 15 y TypeScript. En su estado actual utiliza datos de ejemplo en memoria y una autenticación simulada en el cliente; no requiere una API para ejecutarse.

## Contenido

- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Credenciales de demostración](#credenciales-de-demostración)
- [Funciones y alcance](#funciones-y-alcance)
- [Arquitectura](#arquitectura)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Design System](#design-system)
- [Convenciones de código](#convenciones-de-código)
- [Dependencias técnicas](#dependencias-técnicas)
- [Guía para nuevos integrantes](#guía-para-nuevos-integrantes)
- [Pruebas](#pruebas)

## Requisitos

- Node.js y npm compatibles con Angular CLI 15.
- Navegador moderno con soporte para APIs web como `localStorage` y `crypto.randomUUID()`.

## Instalación y ejecución

Desde la raíz del repositorio:

```bash
npm install -g @angular/cli@15
ng new (Nombre-Proyecto)
ng Serve (Ng s)
```

El servidor de desarrollo queda disponible en `http://localhost:4200/` y actualiza la aplicación al guardar cambios.

Comandos disponibles:

| Comando | Uso |
| --- | --- |
| `ng s` | Inicia el servidor Angular de desarrollo. |
| `ng g c (Nombre-Componente)` |  Crear un componente para desarrollo. |
| `ng g s (Nombre-Servicio)` | Crea un servicio para desarrollo. |
| `ng g guard (Nombre-Guard)` | Crea un Guard para desarrollo. |

## Credenciales de demostración

La autenticación se realiza con credenciales fijas en el frontend:

- Correo: `admin@municipal.cl`
- Contraseña: `1234`

## Funciones y alcance

- **Acceso administrativo:** formulario reactivo con validación de correo y campos obligatorios.
- **Solicitudes:** tabla con siete registros iniciales. Se puede cambiar su estado a aprobada o rechazada.
- **Catálogo:** consulta de tres tipos de permiso, incluyendo categoría, tarifa, plazo y estado activo.
- **Estadísticas:** conteo de solicitudes agrupadas por estado y tipo de permiso.
- **Navegación protegida:** acceso al panel condicionado por sesión y rol de administrador.

### Persistencia y limitaciones conocidas

- La sesión se conserva en `localStorage` bajo la clave `permisos_sesion`.
- Los permisos y solicitudes se guardan en `BehaviorSubject` dentro del proceso de la aplicación. Al recargar el navegador, vuelven a los datos iniciales.
- La autenticación y el token son de demostración; no existe validación en un servidor.
- Los métodos de servicio para alta/edición de permisos y para etapas del trámite están parcialmente preparados, pero no tienen pantallas funcionales asociadas.
- Los documentos y pagos son simulados; no hay carga de archivos ni pasarela de pago.
- Las estadísticas se muestran como listas, sin visualizaciones gráficas.

## Arquitectura

La aplicación usa módulos de Angular y separa las responsabilidades en tres áreas:

- **`app`**: módulo raíz, contenedor visual y enrutamiento general.
- **`auth`**: inicio de sesión.
- **`core`**: servicios singleton, guards, modelos y enums compartidos.
- **`features/admin`**: rutas, componentes y estilos de las vistas administrativas.

Flujo de navegación principal:

1. La ruta raíz y las rutas desconocidas usan `homeRedirectGuard`: envía a `/admin` si hay sesión y a `/auth/login` si no la hay.
2. La ruta `/admin` pasa por `AuthGuard` y `RoleGuard` y requiere el rol `ADMINISTRADOR`.
3. Las rutas hijas del módulo admin son `/admin/solicitudes`, `/admin/catalogo` y `/admin/estadisticas`.

## Estructura de carpetas

```text
src/
├── index.html
├── main.ts
├── styles.css
└── app/
    ├── app.module.ts
    ├── app-routing.module.ts
    ├── app.component.ts
    ├── app.component.html
    ├── app.component.css
    ├── app.component.spec.ts
    ├── auth/
    │   ├── auth.module.ts
    │   └── pages/login/
    │       ├── login.component.ts
    │       ├── login.component.html
    │       └── login.component.css
    ├── core/
    │   ├── enums/                 # Estados de solicitud, categorías y roles
    │   ├── guards/                # Guards de autenticación, rol y redirección
    │   ├── models/                # Interfaces y DTOs
    │   └── services/              # Autenticación, permisos y solicitudes
    └── features/admin/
        ├── admin.module.ts
        ├── admin-routing.module.ts
        ├── admin-shared.css
        └── pages/
            ├── solicitudes/
            ├── catalogo-permisos/
            └── estadisticas/
```

Archivos de configuración en la raíz:

- `angular.json`: opciones de build, servidor, estilos y pruebas.
- `package.json` y `package-lock.json`: scripts y versiones de dependencias.
- `tsconfig*.json`: opciones de compilación TypeScript para aplicación y pruebas.
- `.editorconfig`: formato básico compartido entre editores.
- `.gitignore`: archivos y directorios que Git debe ignorar.

## Design System

El proyecto usa un sistema visual propio construido con CSS. No depende de una biblioteca de componentes externa como Angular Material. Sus estilos se definen globalmente y se complementan con hojas de estilo específicas por componente.

### Tokens visuales

En `src/styles.css`, las variables CSS centralizan la paleta:

| Token | Valor | Uso principal |
| --- | --- | --- |
| `--navy` | `#133a61` | Encabezados, navegación, botones y títulos principales. |
| `--cyan` | `#00bde3` | Indicador visible de foco en controles. |
| `--red` | `#bd3933` | Acentos y jerarquía de encabezados secundarios. |
| `--pale` | `#e7f6f8` | Fondos suaves para formularios y bloques destacados. |
| `--ink` | `#1b1b1b` | Color de texto general. |

### Tipografía, componentes y adaptación

- **Tipografías:** Merriweather para encabezados y Source Sans 3 para texto y controles. Se importan desde Google Fonts; si no están disponibles, se aplican fuentes de respaldo.
- **Botones y campos:** reglas globales coherentes para tamaños, colores, bordes y foco visible mediante `outline`.
- **Tablas administrativas:** `admin-shared.css` agrupa los estilos comunes. Las páginas añaden reglas propias para columnas y acciones.
- **Login:** `login.component.css` define la tarjeta.
- **Estadísticas:** su CSS organiza las secciones en paneles flexibles que se apilan en pantallas pequeñas.

Al agregar una pantalla, conviene reutilizar variables y patrones existentes antes de definir colores, medidas o estilos duplicados.

## Convenciones de código

El código existente sigue estas pautas, que deben mantenerse al ampliarlo:

- **Nombres:** clases, interfaces, métodos y propiedades usan `PascalCase` para tipos y `camelCase` para miembros. Los componentes Angular terminan en `.component.ts`; los servicios, en `.service.ts`; los guards, en `.guard.ts`.
- **Idioma del dominio:** nombres del negocio y comentarios están mayormente en español (por ejemplo, `Solicitud`, `TipoPermiso`, `aprobar`). Mantener el idioma consistente en nuevas piezas.
- **Responsabilidades:** los componentes gestionan estado de vista y eventos; los servicios contienen acceso y transformación de datos; los modelos describen la forma de esos datos.
- **Tipado:** preferir interfaces, enums y tipos explícitos frente a valores ambiguos. Para operaciones de servicio se usan `Observable<T>` de RxJS.
- **Plantillas:** usar interpolación para texto, property binding para propiedades, event binding para acciones y directivas Angular para condicionar o repetir contenido.
- **Estilos:** usar tokens CSS globales y estilos encapsulados por componente. Los patrones compartidos de administración van en `admin-shared.css`.
- **Rutas:** las áreas funcionales se agrupan en módulos y las rutas protegidas declaran explícitamente sus guards y roles autorizados.

## Dependencias técnicas

### Dependencias de ejecución

| Paquete | Función |
| --- | --- |
| `@angular/core`, `common`, `compiler` | Framework, directivas comunes y compilación de la aplicación. |
| `@angular/router` | Enrutamiento y guards de navegación. |
| `@angular/forms` | Formularios reactivos del inicio de sesión. |
| `@angular/platform-browser`, `platform-browser-dynamic` | Integración de Angular con el navegador y arranque dinámico. |
| `@angular/animations` | Soporte de animaciones de Angular. |
| `rxjs` | Observables, `BehaviorSubject` y operadores usados por los servicios. |
| `zone.js` | Detección de cambios en la aplicación Angular. |
| `tslib` | Funciones auxiliares usadas por el código compilado de TypeScript. |

### Herramientas de desarrollo

| Paquete | Función |
| --- | --- |
| `@angular/cli`, `@angular-devkit/build-angular` | Comandos CLI, servidor y build. |
| `typescript`, `@angular/compiler-cli` | Tipado y compilación de plantillas Angular. |
| `jasmine-core`, `@types/jasmine` | Framework y tipos para pruebas. |
| `karma` y plugins | Ejecución de pruebas en navegador. |

## Guía para nuevos integrantes

1. **Instala dependencias** con `npm install -g @angular/cli@15`, crea un proyecto con `ng new (Nombre-Proyecto)`, pega todo del github a tu proyecto y ejecuta `ng s`.
2. **Prueba el acceso** con las credenciales de demostración indicadas arriba.
3. **Sigue el flujo de datos:** revisa primero la página en `features/admin/pages`, después el servicio correspondiente en `core/services` y finalmente su modelo en `core/models`.
4. **Al agregar una página**, crea su componente dentro de la feature correspondiente, declárala en su módulo e incorpora su ruta en el módulo de rutas de esa feature.
5. **Al agregar un estado o categoría**, actualiza el enum y las etiquetas que correspondan; evita introducir cadenas sueltas para estados del dominio.
6. **Al agregar estilos**, reutiliza los tokens de `styles.css` y comprueba el layout en escritorio y móvil.

