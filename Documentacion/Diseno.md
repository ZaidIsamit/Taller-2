# Diseño de la interfaz — Reservas UNAB

Documento de diseño del Taller Evaluado 2: navegación, wireframes, jerarquía visual,
componentes, estilo y flujos. Parte de las observaciones de la Actividad Evaluada 1:
**mejorar la responsividad y el aspecto visual**.

## 1. Qué cambiamos respecto de la entrega 1

| Entrega 1 | Problema | Taller 2 |
|---|---|---|
| Tabla gigante salas × 13 horas | En el celular había que desplazarse hacia los lados y era difícil de leer | Catálogo en **tarjetas** con una barra de ocupación compacta; los horarios se abren en un modal con bloques que se acomodan al ancho |
| Barra superior con solo el título | Poca identidad | Barra con logo, nombre, RUT, rol con color y botón Salir |
| Estilo genérico de Bootstrap | Poca identidad visual | Paleta basada en el logo UNAB, tipografía Plus Jakarta Sans, íconos y estados con color |

## 2. Mapa de navegación

```
┌──────────────┐     ┌──────────────────────┐   Ver horarios   ┌───────────────────┐
│    Login     │────►│      Espacios        │─────────────────►│ Modal detalle     │
│ (RUT válido) │     │ filtros + clima +    │                  │ bloques + form    │
└──────────────┘     │ tarjetas             │◄─────────────────└────────┬──────────┘
       ▲             └──────────┬───────────┘   Confirmar               │
       │   Salir                │                                       ▼
       └────────────────────────┘          Aviso "Reserva confirmada" → el bloque
                                           queda como "Tuya" en la tarjeta
```

## 3. Wireframes

### 3.1 Login

```
Fondo blanco, tarjeta centrada (igual en escritorio y celular)
              ┌──────────────────────┐
              │        [logo]        │
              │    Iniciar sesión    │
              │ Ingresa con tu RUT   │
              │         RUT          │
              │  [ 12.345.678-9  ]   │
              │  [   Continuar →  ]  │
              └──────────────────────┘
```

### 3.2 Espacios

```
Escritorio
┌─────────────────────────────────────────────────────────────────┐
│ [logo] Reservas UNAB                       Zaid [Docente][Salir]
├─────────────────────────────────────────────────────────────────┤
│ HOLA, ZAID                                                      │
│ ¿Qué espacio necesitas?                                         │
│ ┌──────────────────────────────────────────┐ ┌────────────────┐ │
│ │ (Todos)(Sala)(Lab)(Estudio)(Reunión)(Ext)│ │ SANTIAGO       │ │
│ │ Sede[▾] Fecha[ ] Personas[ ] Buscar[   ] │ │ ☁ 15° / 12°    │ │
│ └──────────────────────────────────────────┘ │ 💧 hasta 60%   │ │
│                                              └────────────────┘ │
│ Espacios disponibles                              5 resultados  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                          │
│ │[ic] Sala │ │[ic] Lab  │ │[ic] Est. │                          │
│ │ Edif · 40│ │ ...      │ │ ...      │                          │
│ │ ▮▮▮▯▯▮▮▮ │ │ ▮▮▮▮▯▯▮▮ │ │ ▮▮▮▮▮▮▮▮ │  ← barra de ocupación    │
│ │5 libres [Ver horarios]│ │          │                          │
│ └──────────┘ └──────────┘ └──────────┘                          │
└─────────────────────────────────────────────────────────────────┘

Celular: todo en una columna (filtros → clima → tarjetas), y el tipo de
espacio se elige con un selector (igual que la sede), con "Todos" por defecto.
```

### 3.3 Modal de horarios y reserva

```
┌───────────────────────────────────────────┐
│ Patio central                          [x]│
│ Espacio exterior · Campus · Capacidad 80  │
├───────────────────────────────────────────┤
│ Fecha [06-10-2026]   ■Libre ■Ocupado ■Tuya│
│ ☝ Elige un bloque libre                   │
│ [08:00][09:00][10:00][11:00][12:00]...    │  ← cada bloque: estado + ☁ 14°
│ ┌───────────────────────────────────────┐ │
│ │ TU SOLICITUD  18:00 – 20:00   ☁14° ☁13°│ │
│ │ Duración[2 h▾]   Personas[ 10 ]       │ │
│ │ Motivo [_____________________]  0/200 │ │
│ │ ⚠ Se pronostica lluvia ☐ Entiendo...  │ │  ← solo espacios exteriores
│ │          [Cambiar horario][Confirmar] │ │
│ └───────────────────────────────────────┘ │
└───────────────────────────────────────────┘
Celular: modal a pantalla completa y bloques en 3 columnas.
```

## 4. Jerarquía visual

1. **Título de página** grande (800, 1.5–2.1 rem según pantalla) con un antetítulo rojo en mayúsculas.
2. **Acción principal** en azul con sombra (Ver horarios, Confirmar reserva, Nueva reserva).
3. **Estado de disponibilidad** con color (verde libre, rojo ocupado, dorado tuya, gris pasada) y
   siempre con texto, para no depender solo del color.
4. **Panel de clima** en azul oscuro para separarlo de los filtros: es información complementaria.
5. Datos secundarios (edificio, equipamiento) en gris y tamaño menor.

## 5. Componentes repetibles

| Componente | Dónde se repite |
|---|---|
| `TarjetaEspacio` + `BarraOcupacion` | Una por cada espacio del catálogo |
| `SelectorHorario` (bloque) | 13 bloques por día |
| `Modal` | Detalle del espacio |
| `IconoClima` | Panel de clima, bloques, formulario |
| `BadgeRol` | Barra superior |
| `EstadoVacio` | Sin resultados |
| `Notificaciones` | Reserva creada |

## 6. Estilo visual

| Token | Valor | Uso |
|---|---|---|
| Azul marino | `#0b2545` | Barra superior, login, chips activos |
| Azul primario | `#1d4e89` | Botones y foco |
| Rojo UNAB | `#b3122e` | Antetítulos |
| Dorado UNAB | `#f2c230` | Íconos del clima, resaltes |
| Fondo | `#f4f6fb` | Fondo general |
| Libre / Ocupado / Tuya / Pasada | `#14935a` / `#d64550` / `#c99a06` / `#c3ccd9` | Estados de bloques |
| Lluvia | `#2563eb` | Avisos de lluvia |

- **Tipografía**: Plus Jakarta Sans (400–800), con números tabulares para horas y cifras.
- **Radios**: 8 / 14 / 20 px. **Sombras** suaves y fijas en las tarjetas.
- **Íconos**: Bootstrap Icons.
- **Breakpoints** (los de Bootstrap): `< 576` celular (modal a pantalla completa, bloques en 3
  columnas), `≥ 768` tablet, `≥ 1200` filtros y clima lado a lado.

## 7. Flujos de usuario

**Reservar (flujo principal)**
Login → Espacios → filtrar (sede, tipo, fecha, personas) → revisar clima → *Ver horarios* →
elegir bloque libre → completar formulario (validación) → *Confirmar* → aviso de confirmación →
la barra de ocupación se actualiza y el bloque queda como "Tuya".

**Reservar un espacio exterior con lluvia**
… → elegir bloque → aparece el aviso de lluvia → si no se marca "Entiendo el riesgo" el
formulario no se envía → marcar → confirmar.

**API sin conexión**
Espacios → el panel de clima muestra el error y el botón *Reintentar* → se puede reservar igual.
