# Sistema de Reservas de Espacios Universitarios

Actividad Evaluada 1 — Desarrollo Web y Móvil — Segundo Semestre 2026

## Integrantes

- Zaid Isamit Alvial — rol en el equipo
- Agustin Carmona — rol en el equipo
- Jhon Rojas — rol en el equipo

> Completar la columna "rol en el equipo" (qué hizo cada persona en el proyecto).

## Problemática

Una universidad cuenta con salas de clases, laboratorios, salas de estudio y espacios de reunión
utilizados por estudiantes, docentes y organizaciones estudiantiles. Actualmente la disponibilidad
de estos espacios es difícil de consultar y no existe una interfaz centralizada para solicitar reservas.

Esta aplicación permite consultar la disponibilidad de espacios y gestionar solicitudes de reserva
de forma centralizada.

## Tecnologías utilizadas

- HTML5 semántico
- CSS3 (propio, sobre la base de Bootstrap)
- [Bootstrap 5](https://getbootstrap.com/) (grillas, formularios, modales, badges)
- JavaScript (vanilla, sin frameworks)
- Git / GitHub / Git Flow

## Funcionalidades implementadas

- Inicio de sesión mediante RUT: solo pueden ingresar las personas de una lista autorizada
  (`USUARIOS` en `js/inicio-sesion.js`). Cualquier otro RUT queda fuera del sistema.
- El rol de cada persona (Estudiante, Docente u Organización Estudiantil) se muestra
  automáticamente en la barra superior al iniciar sesión.
- Selección de tipo de espacio y número de personas.
- Filtros por edificio, capacidad, tipo de espacio, fecha y búsqueda por nombre.
- Grilla de disponibilidad por sala y horario (08:00–21:00).
- Formulario de reserva con validación (motivo obligatorio, personas dentro de la capacidad).
- Las reservas propias quedan marcadas ("Tuya") directamente en la grilla de horarios.
- Validación de formularios con mensajes de error en línea (RUT no autorizado, campos obligatorios).
- Diseño responsive (computador, tablet y teléfono) usando el sistema de grillas de Bootstrap
  y CSS propio.

## Datos simulados

Todos los datos (usuarios, espacios y reservas) están simulados mediante arrays y objetos
JavaScript, repartidos en [`js/inicio-sesion.js`](js/inicio-sesion.js) (usuarios) y
[`js/salas.js`](js/salas.js) (espacios y reservas). Las reservas creadas durante el uso se
guardan en `localStorage` del navegador únicamente con fines de persistencia en la demo; no
existe backend ni base de datos real.

El acceso está restringido a estas personas (definidas en `USUARIOS`, dentro de
`js/inicio-sesion.js`):

| RUT              | Nombre                | Rol                          |
|-------------------|------------------------|-------------------------------|
| 21.668.839-2      | Zaid Isamit Alvial     | Docente                       |
| 21.993.115-8      | Agustin Carmona        | Estudiante                    |
| 21.834.824-6       | Jhon Rojas             | Organización Estudiantil      |

Cualquier otro RUT, aunque esté bien escrito, no puede iniciar sesión.

## Estructura del proyecto

```
TrabajoUnab/
├── index.html
├── css/
│   ├── styles.css         (variables de color y estilos base, comparte con los demás)
│   ├── header.css
│   ├── inicio-sesion.css
│   └── salas.css
├── js/
│   ├── header.js          (barra superior: datos de sesión y cerrar sesión)
│   ├── inicio-sesion.js   (RUT, control de acceso, login/logout)
│   └── salas.js           (espacios, filtros, grilla y formulario de reserva)
├── assets/
│   └── LogoUnab.jpg
├── Documentacion/         (enunciado de la actividad, guías de apoyo)
└── README.md
```

## Cómo ejecutar

No requiere instalación ni build. Basta con abrir `index.html` en un navegador
(o servirlo con una extensión tipo "Live Server").

## Flujo de trabajo Git / Git Flow

- `main`: versión estable del proyecto.
- `develop`: rama de integración, donde se juntan todas las funcionalidades.
- Una rama `feature/` por módulo, cada una con su propio Pull Request hacia `develop`:
  - `feature/header` — barra superior y cierre de sesión.
  - `feature/inicio-sesion` — RUT y control de acceso.
  - `feature/salas` — espacios, filtros, grilla y reservas.
- `develop` se integra a `main` una vez que todas las `feature/*` están fusionadas.
