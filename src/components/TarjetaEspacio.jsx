import BarraOcupacion from "./BarraOcupacion.jsx";
import tiposEspacio from "../data/tiposEspacio.json";

export default function TarjetaEspacio({ espacio, estados, riesgoLluvia, onVerHorarios }) {
  const tipo = tiposEspacio[espacio.tipo];
  const libres = Object.values(estados).filter((e) => e === "libre").length;

  return (
    <article className="space-card">
      <div className="space-card-top">
        <span className={`space-icon tone-${tipo.color}`}>
          <i className={`bi ${tipo.icono}`} aria-hidden="true"></i>
        </span>
        <div className="flex-grow-1 min-w-0">
          <span className="space-type">{espacio.tipo}</span>
          <h3 className="space-title">{espacio.nombre}</h3>
          <div className="space-meta">
            <i className="bi bi-geo-alt" aria-hidden="true"></i> {espacio.edificio}
            {espacio.piso > 0 && ` · Piso ${espacio.piso}`}
          </div>
        </div>
        <span className="capacity-pill" title="Capacidad máxima">
          <i className="bi bi-person-fill" aria-hidden="true"></i> {espacio.capacidad}
        </span>
      </div>

      <div className="feature-list">
        {espacio.exterior && (
          <span className={`feature-chip chip-outdoor ${riesgoLluvia ? "is-risk" : ""}`}>
            <i className={`bi ${riesgoLluvia ? "bi-cloud-rain" : "bi-sun"}`} aria-hidden="true"></i>
            {riesgoLluvia ? "Exterior · riesgo de lluvia" : "Al aire libre"}
          </span>
        )}
        {espacio.equipamiento.map((item) => (
          <span key={item} className="feature-chip">{item}</span>
        ))}
      </div>

      <BarraOcupacion estados={estados} />

      <div className="space-card-footer">
        <span className={`availability ${libres === 0 ? "is-full" : ""}`}>
          {libres === 0 ? "Sin bloques libres" : `${libres} ${libres === 1 ? "bloque libre" : "bloques libres"}`}
        </span>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => onVerHorarios(espacio)}>
          Ver horarios <i className="bi bi-arrow-right ms-1" aria-hidden="true"></i>
        </button>
      </div>
    </article>
  );
}
