import sedes from "../data/sedes.json";
import tiposEspacio from "../data/tiposEspacio.json";
import { fechaISO } from "../utils/fechas.js";

const TIPOS = Object.keys(tiposEspacio);

// Formulario de filtros. No guarda estado propio: recibe los filtros
// desde la página y avisa cada cambio con onCambiar(campo, valor).
export default function FiltrosEspacios({ filtros, onCambiar, onLimpiar }) {
  return (
    <section className="filters-card" aria-label="Filtros de búsqueda">
      {/* Escritorio y tablet: chips. En celulares se reemplazan por un selector (más abajo). */}
      <div className="type-chips d-none d-md-flex" role="group" aria-label="Tipo de espacio">
        <button
          type="button"
          className={`type-chip ${filtros.tipo === "" ? "active" : ""}`}
          onClick={() => onCambiar("tipo", "")}
        >
          <i className="bi bi-grid" aria-hidden="true"></i> Todos
        </button>
        {TIPOS.map((tipo) => (
          <button
            key={tipo}
            type="button"
            className={`type-chip ${filtros.tipo === tipo ? "active" : ""}`}
            onClick={() => onCambiar("tipo", tipo)}
          >
            <i className={`bi ${tiposEspacio[tipo].icono}`} aria-hidden="true"></i> {tipo}
          </button>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-sm-6 d-md-none">
          <label htmlFor="filtro-tipo" className="form-label">Tipo de espacio</label>
          <select
            id="filtro-tipo"
            className="form-select"
            value={filtros.tipo}
            onChange={(e) => onCambiar("tipo", e.target.value)}
          >
            <option value="">Todos</option>
            {TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <label htmlFor="filtro-sede" className="form-label">Sede</label>
          <select
            id="filtro-sede"
            className="form-select"
            value={filtros.sedeId}
            onChange={(e) => onCambiar("sedeId", e.target.value)}
          >
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>{sede.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-lg-3">
          <label htmlFor="filtro-fecha" className="form-label">Fecha</label>
          <input
            id="filtro-fecha"
            type="date"
            className="form-control"
            min={fechaISO()}
            value={filtros.fecha}
            onChange={(e) => e.target.value && onCambiar("fecha", e.target.value)}
          />
        </div>
        <div className="col-6 col-lg-2">
          <label htmlFor="filtro-personas" className="form-label">Personas</label>
          <input
            id="filtro-personas"
            type="number"
            className="form-control"
            min="1"
            max="200"
            value={filtros.personas}
            onChange={(e) => onCambiar("personas", e.target.value)}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <label htmlFor="filtro-busqueda" className="form-label">Buscar</label>
          <div className="input-icon">
            <i className="bi bi-search" aria-hidden="true"></i>
            <input
              id="filtro-busqueda"
              type="search"
              className="form-control"
              placeholder="Nombre, edificio o equipamiento"
              value={filtros.busqueda}
              onChange={(e) => onCambiar("busqueda", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-2">
        <button type="button" className="btn btn-link btn-sm text-decoration-none px-0" onClick={onLimpiar}>
          <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true"></i>Limpiar filtros
        </button>
      </div>
    </section>
  );
}
