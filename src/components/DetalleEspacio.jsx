import { useState } from "react";
import Modal from "./Modal.jsx";
import SelectorHorario from "./SelectorHorario.jsx";
import FormularioReserva from "./FormularioReserva.jsx";
import roles from "../data/roles.json";
import { fechaISO, formatearFechaLarga } from "../utils/fechas.js";
import { estadosDelDia, horasLibresConsecutivas } from "../utils/reservas.js";

export default function DetalleEspacio({
  espacio,
  fecha,
  onCambiarFecha,
  reservas,
  usuario,
  clima,
  personasSugeridas,
  onReservar,
  onCerrar
}) {
  const [seleccion, setSeleccion] = useState(null);

  const estados = estadosDelDia(reservas, espacio.id, fecha, usuario.rut);
  const maxPorRol = roles[usuario.rol].maxHorasPorReserva;
  const climaPorHora = clima.estado === "ok" ? clima.datos.porHora : null;

  const maxDuracion = seleccion
    ? Math.min(maxPorRol, horasLibresConsecutivas(reservas, espacio.id, fecha, seleccion.hora))
    : 1;

  function alCambiarFecha(nuevaFecha) {
    setSeleccion(null);
    onCambiarFecha(nuevaFecha);
  }

  function alConfirmar({ personas, motivo }) {
    onReservar({
      espacioId: espacio.id,
      fecha,
      hora: seleccion.hora,
      duracion: seleccion.duracion,
      personas,
      motivo,
      rutSolicitante: usuario.rut,
      nombreSolicitante: usuario.nombre
    });
  }

  return (
    <Modal
      titulo={espacio.nombre}
      subtitulo={`${espacio.tipo} · ${espacio.edificio} · Capacidad ${espacio.capacidad}`}
      onCerrar={onCerrar}
      tamano="modal-lg"
    >
      <div className="detail-toolbar">
        <div>
          <label htmlFor="detalle-fecha" className="form-label mb-1">Fecha</label>
          <input
            id="detalle-fecha"
            type="date"
            className="form-control"
            min={fechaISO()}
            value={fecha}
            onChange={(e) => e.target.value && alCambiarFecha(e.target.value)}
          />
        </div>
        <div className="legend">
          <span><i className="legend-dot dot-libre"></i>Libre</span>
          <span><i className="legend-dot dot-ocupado"></i>Ocupado</span>
          <span><i className="legend-dot dot-mio"></i>Tuya</span>
          <span><i className="legend-dot dot-pasado"></i>Pasada</span>
        </div>
      </div>

      <p className="detail-hint">
        <i className="bi bi-hand-index me-1" aria-hidden="true"></i>
        {formatearFechaLarga(fecha)} · Elige un bloque libre para comenzar tu reserva.
        {clima.estado === "cargando" && <span className="ms-1 text-muted">(cargando clima…)</span>}
      </p>

      <SelectorHorario
        estados={estados}
        climaPorHora={climaPorHora}
        seleccion={seleccion}
        onSeleccionarHora={(hora) => setSeleccion({ hora, duracion: 1 })}
      />

      {seleccion && (
        <FormularioReserva
          espacio={espacio}
          hora={seleccion.hora}
          duracion={seleccion.duracion}
          maxDuracion={maxDuracion}
          maxPorRol={maxPorRol}
          onCambiarDuracion={(duracion) => setSeleccion({ ...seleccion, duracion })}
          climaPorHora={climaPorHora}
          personasSugeridas={personasSugeridas}
          onConfirmar={alConfirmar}
          onCancelar={() => setSeleccion(null)}
        />
      )}
    </Modal>
  );
}
