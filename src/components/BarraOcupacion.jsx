import { HORAS, etiquetaHora } from "../utils/fechas.js";

const TEXTO_ESTADO = { libre: "Libre", ocupado: "Ocupado", mio: "Tu reserva", pasado: "Hora pasada" };

export default function BarraOcupacion({ estados }) {
  return (
    <div className="occupancy">
      <div className="occupancy-bar" role="img" aria-label="Ocupación del día">
        {HORAS.map((hora) => (
          <span
            key={hora}
            className={`occupancy-seg seg-${estados[hora]}`}
            title={`${etiquetaHora(hora)} · ${TEXTO_ESTADO[estados[hora]]}`}
          ></span>
        ))}
      </div>
      <div className="occupancy-scale" aria-hidden="true">
        <span>08</span>
        <span>14</span>
        <span>21</span>
      </div>
    </div>
  );
}
