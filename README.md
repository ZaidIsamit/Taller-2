# Reservas UNAB — Sistema de Reservas de Espacios Universitarios

Taller Evaluado 2 — Desarrollo Web y Móvil — Segundo Semestre 2026
(continuación de la Actividad Evaluada 1, ahora con **React**)

## Integrantes

- Zaid Isamit Alvial
- Agustin Carmona
- Jhon Rojas

## Problemática

Una universidad tiene salas de clases, laboratorios, salas de estudio, salas de reunión y espacios
exteriores en varias sedes. Hoy es difícil saber qué espacio está libre y no hay un lugar
centralizado para solicitar una reserva. Además, quien reserva un espacio al aire libre (patio,
terraza, cancha) no tiene cómo saber si va a llover ese día.

**Reservas UNAB** centraliza la consulta de disponibilidad y la solicitud de
reservas, e incorpora el pronóstico del clima para planificar mejor.

## Usuarios objetivo

| Usuario | Necesidad |
|---|---|
| Estudiantes | Reservar salas de estudio o laboratorios para trabajar en grupo (máx. 2 h por reserva). |
| Docentes | Reservar salas y laboratorios para clases, ayudantías o reuniones (máx. 4 h). |
| Organizaciones estudiantiles | Reservar salas de reunión y espacios exteriores para actividades (máx. 3 h). |

## Funcionalidades principales

- **Inicio de sesión por RUT** con formato automático (`12.345.678-9`). Solo pueden entrar los RUT
  de `src/data/usuarios.json`; el rol se muestra en la barra superior.
- **Catálogo de espacios** en tarjetas, con tipo, edificio, capacidad, equipamiento y una barra
  de ocupación del día (08:00–21:00).
- **Filtros** por sede, tipo de espacio, fecha, número de personas y búsqueda por texto.
- **Disponibilidad simulada por hora**: bloques libres, ocupados, propios y pasados.
- **Solicitud de reserva** con formulario validado:
  - personas entre 1 y la capacidad del espacio,
  - motivo obligatorio (mínimo 5 caracteres),
  - duración limitada por el rol y por las horas libres consecutivas,
  - si el espacio es exterior y se pronostica lluvia, hay que confirmar que se revisó el aviso.
- **Clima (API pública)**: pronóstico del día por sede, clima por hora en cada bloque y aviso de
  lluvia en espacios exteriores.
- **Estados de carga y error**: skeleton mientras carga el clima, mensaje con botón *Reintentar*
  si la API falla y aviso cuando la fecha está fuera del rango del pronóstico.
- **Aviso de confirmación** (toast) al reservar.
- Las reservas propias quedan marcadas como **"Tuya"** en los bloques horarios y en la barra de ocupación.
- **Diseño responsive**: celular (modal a pantalla completa, bloques en 3
  columnas), tablet y escritorio.

## Tecnologías utilizadas

- React 19 (componentes, props, `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, hooks propios)
- Vite 8
- JavaScript (ES2022), JSX
- CSS3 propio (variables de diseño, grid, flexbox, media queries)
- Bootstrap 5 (grilla, formularios, modal y utilidades) + Bootstrap Icons
- Fuente Plus Jakarta Sans (instalada con `@fontsource`, sin CDN)
- Fetch API
- JSON y `localStorage` para los datos locales
- Git, GitHub y Git Flow

## Instrucciones para ejecutar

Requisitos: Node.js 20 o superior.

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo → http://localhost:5173
npm run build    # versión de producción en /dist
npm run preview  # sirve la versión de producción
```

Usuarios autorizados para probar la aplicación:

| RUT | Nombre | Rol |
|---|---|---|
| 21.668.839-2 | Zaid Isamit Alvial | Docente |
| 21.993.115-8 | Agustin Carmona | Estudiante |
| 21.834.824-6 | Jhon Rojas | Organización Estudiantil |

Para volver a los datos iniciales, borrar el `localStorage` del sitio (DevTools → Application →
Local Storage).

## Estructura de la aplicación

```
├── index.html                 Punto de entrada de Vite
├── public/favicon.jpg
├── src/
│   ├── main.jsx               Monta <App /> e importa estilos globales
│   ├── App.jsx                Sesión, vista activa, reservas y avisos → props a las páginas
│   ├── pages/
│   │   ├── LoginPage.jsx      Inicio de sesión por RUT
│   │   └── EspaciosPage.jsx   Filtros + clima + catálogo + detalle
│   ├── components/
│   │   ├── Navbar.jsx         Barra superior (usuario, rol, salir)
│   │   ├── BadgeRol.jsx
│   │   ├── FiltrosEspacios.jsx
│   │   ├── PanelClima.jsx     Resumen del clima (carga / error / datos)
│   │   ├── TarjetaEspacio.jsx
│   │   ├── BarraOcupacion.jsx
│   │   ├── DetalleEspacio.jsx Modal: selector de horario + formulario
│   │   ├── SelectorHorario.jsx
│   │   ├── FormularioReserva.jsx
│   │   ├── IconoClima.jsx
│   │   ├── Modal.jsx          Modal reutilizable controlado por React
│   │   ├── EstadoVacio.jsx
│   │   └── Notificaciones.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js useState que persiste en localStorage
│   │   ├── useReservas.js     Lista de reservas + crear
│   │   └── useClima.js        Consulta la API al cambiar sede o fecha
│   ├── services/
│   │   └── climaApi.js        fetch a Open-Meteo, transformación y caché
│   ├── data/                  Datos locales (JSON)
│   │   ├── usuarios.json  roles.json  sedes.json
│   │   ├── espacios.json  tiposEspacio.json
│   │   └── reservasIniciales.json
│   ├── utils/                 Funciones puras: rut, fechas, clima, reservas
│   ├── assets/images/         Logo
│   └── styles/                variables.css, base.css, layout.css, login.css,
│                              espacios.css (importados desde styles.css)
├── Documentacion/
│   └── Diseno.md              Diseño previo: navegación, wireframes, estilo, flujos
└── entrega-1/                 Versión HTML + JS de la Actividad Evaluada 1 (referencia)
```

### Gestión de datos sin backend

| Dato | Origen | Cómo cambia |
|---|---|---|
| Usuarios, roles, sedes, espacios | JSON en `src/data` | Solo lectura |
| Reservas | `reservasIniciales.json` (con `diasDesdeHoy` para que siempre queden cerca de hoy) | Estado de React en `useReservas`, guardado en `localStorage` |
| Sesión | Estado de React + `localStorage` | Al iniciar / cerrar sesión |
| Clima | API Open-Meteo (fetch) | Se consulta al cambiar sede o fecha; caché en memoria |

## API pública utilizada: Open-Meteo

| Punto | Detalle |
|---|---|
| Nombre | Open-Meteo — Weather Forecast API |
| Documentación oficial | https://open-meteo.com/en/docs |
| Endpoint | `https://api.open-meteo.com/v1/forecast` |
| Método HTTP | `GET` |
| Parámetros enviados | `latitude`, `longitude` (de la sede, en `sedes.json`), `hourly=temperature_2m,precipitation_probability,weather_code`, `timezone=America/Santiago`, `start_date` y `end_date` (fecha elegida) |
| Datos usados de la respuesta | `hourly.time`, `hourly.temperature_2m`, `hourly.precipitation_probability`, `hourly.weather_code` |
| Transformación | `services/climaApi.js` convierte los arreglos paralelos de 24 horas en un objeto por hora (solo 08–20 h) y calcula un resumen del día (mín., máx., prob. de lluvia máx., código a mediodía). El código WMO se traduce a ícono y texto en `utils/clima.js`. |
| Dónde se muestra | 1) Panel de clima en *Espacios*; 2) ícono y temperatura en cada bloque horario; 3) aviso de lluvia + confirmación obligatoria en el formulario de espacios exteriores; 4) marca "riesgo de lluvia" en las tarjetas de espacios exteriores. |
| Si la API falla | Se muestra "No pudimos obtener el clima" con botón **Reintentar**; la reserva sigue funcionando (el clima es complementario). Las peticiones se cancelan con `AbortController` si cambia la sede/fecha antes de responder. |
| Fuera de rango | El pronóstico cubre 16 días. Para fechas posteriores no se llama a la API y se informa "Pronóstico aún no disponible". |
| Autenticación / límites | No requiere clave. Uso gratuito no comercial, menos de 10.000 llamadas diarias. La app guarda en caché cada sede+fecha para no repetir llamadas. |
| Licencia / atribución | Datos bajo CC BY 4.0; se muestra la atribución "Datos: Open-Meteo.com" en el panel de clima. |

### Justificación funcional

La problemática 1 del enunciado (gestión de espacios universitarios) sugiere el clima para
complementar las reservas de espacios exteriores. Con Open-Meteo:

- quien reserva el **patio, la terraza o la cancha** se entera si va a llover **antes** de
  confirmar, y debe aceptar el riesgo de forma explícita;
- el clima por hora ayuda a **elegir el bloque** (por ejemplo, una hora con menos probabilidad de lluvia).

## Uso de Inteligencia Artificial

> ⚠️ **Completar por el equipo antes de entregar.** Las filas "Modificación humana" y
> "Aprendizaje" deben escribirlas ustedes con lo que realmente revisaron y entendieron.

| Elemento | Detalle |
|---|---|
| Herramienta | Claude Code (Anthropic), en VS Code |
| Propósito | Migrar la entrega 1 (HTML + JS) a React, mejorar el diseño y la responsividad (observaciones de la entrega 1), integrar la API de clima y redactar documentación. |
| Prompt representativo | "Haz lo del taller 2 y dime qué API vas a ocupar; cumple todo lo del taller 2. Lo que tengo me lo evaluaron en la entrega 1 y me dijeron que había que mejorar la responsividad y el diseño." |
| Resultado | Propuso usar Open-Meteo, generó la estructura en componentes, páginas, hooks, servicios y datos JSON, los estilos responsive, este README y el documento de diseño. |
| Modificación humana | _(Completar: qué revisaron, corrigieron, cambiaron o rechazaron.)_ |
| Aprendizaje | _(Completar: qué entendieron de React, `useEffect`, el consumo de la API, etc.)_ |

## Limitaciones conocidas

- No hay backend: las reservas viven en el `localStorage` de cada navegador, así que no se
  comparten entre usuarios ni dispositivos.
- El inicio de sesión es simulado (lista fija de RUT, sin contraseña).
- No se valida el dígito verificador del RUT; solo se acepta si está en la lista autorizada.
- No hay vista de "Mis reservas" ni opción para cancelar: una reserva confirmada solo se puede
  quitar borrando el `localStorage`.
- El pronóstico solo existe para los próximos 16 días y es una estimación.

## Flujo de trabajo Git Flow

- `main`: versión estable que se entrega.
- `develop`: rama de desarrollo, donde se integran las funcionalidades.
- `feature/*`: una rama por funcionalidad, creada desde `develop` e integrada mediante Pull Request.

| Rama | Contenido |
|---|---|
| `feature/estructura-base` | Proyecto Vite + React, estilos base, utilidades y la entrega 1 movida a `entrega-1/` |
| `feature/inicio-sesion` | Login por RUT, usuarios y roles, barra superior |
| `feature/catalogo-espacios` | Datos de sedes y espacios, filtros, tarjetas y barra de ocupación |
| `feature/reservas` | Selector de horario, formulario con validación, modal y avisos |
| `feature/api-clima` | Servicio Open-Meteo, hook `useClima` y panel de clima |
| `feature/documentacion` | README y documento de diseño |
