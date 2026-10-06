import { useMemo, useState } from "react";
import FiltrosEspacios from "../components/FiltrosEspacios.jsx";
import PanelClima from "../components/PanelClima.jsx";
import TarjetaEspacio from "../components/TarjetaEspacio.jsx";
import DetalleEspacio from "../components/DetalleEspacio.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import espacios from "../data/espacios.json";
import sedes from "../data/sedes.json";
import { useClima } from "../hooks/useClima.js";
import { hayRiesgoLluvia } from "../utils/clima.js";
import { fechaISO } from "../utils/fechas.js";
import { estadosDelDia } from "../utils/reservas.js";

const filtrosIniciales = () => ({
  sedeId: sedes[0].id,
  tipo: "",
  personas: "1",
  fecha: fechaISO(),
  busqueda: ""
});

function coincideBusqueda(espacio, texto) {
  const campos = [espacio.nombre, espacio.edificio, espacio.tipo, ...espacio.equipamiento];
  return campos.some((c) => c.toLowerCase().includes(texto));
}

// Catálogo de espacios: filtros + clima de la sede + tarjetas + detalle para reservar.
export default function EspaciosPage({ usuario, reservas, onCrearReserva }) {
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [espacioAbierto, setEspacioAbierto] = useState(null);

  const sede = sedes.find((s) => s.id === filtros.sedeId);
  const clima = useClima(sede, filtros.fecha);

  // Solo se recalcula cuando cambian los filtros (no al abrir/cerrar el modal).
  const espaciosFiltrados = useMemo(() => {
    const personas = Math.max(1, Number(filtros.personas) || 1);
    const texto = filtros.busqueda.trim().toLowerCase();
    return espacios.filter(
      (e) =>
        e.sedeId === filtros.sedeId &&
        (filtros.tipo === "" || e.tipo === filtros.tipo) &&
        e.capacidad >= personas &&
        (texto === "" || coincideBusqueda(e, texto))
    );
  }, [filtros]);

  // ¿Hay alguna hora del día con riesgo de lluvia? Se usa para marcar los espacios exteriores.
  const lluviaEnElDia =
    clima.estado === "ok" && Object.values(clima.datos.porHora).some(hayRiesgoLluvia);

  function cambiarFiltro(campo, valor) {
    setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
  }

  function alReservar(datos) {
    onCrearReserva(datos);
    setEspacioAbierto(null);
  }

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">Hola, {usuario.nombre.split(" ")[0]}</span>
          <h1 className="page-title">¿Qué espacio necesitas?</h1>
          <p className="page-lead">Filtra por sede, tipo y capacidad, y reserva el bloque que te acomode.</p>
        </div>
      </div>

      <div className="row g-3 g-lg-4 align-items-stretch mb-4">
        <div className="col-12 col-xl-8">
          <FiltrosEspacios filtros={filtros} onCambiar={cambiarFiltro} onLimpiar={() => setFiltros(filtrosIniciales())} />
        </div>
        <div className="col-12 col-xl-4">
          <PanelClima clima={clima} sede={sede} fecha={filtros.fecha} />
        </div>
      </div>

      <div className="results-head">
        <h2 className="h5 mb-0">Espacios disponibles</h2>
        <span className="results-count">
          {espaciosFiltrados.length} {espaciosFiltrados.length === 1 ? "resultado" : "resultados"}
        </span>
      </div>

      {espaciosFiltrados.length === 0 ? (
        <EstadoVacio icono="bi-search" titulo="No encontramos espacios con esos filtros">
          Prueba con menos personas, otro tipo de espacio u otra sede.
        </EstadoVacio>
      ) : (
        <div className="space-grid">
          {espaciosFiltrados.map((espacio) => (
            <TarjetaEspacio
              key={espacio.id}
              espacio={espacio}
              estados={estadosDelDia(reservas, espacio.id, filtros.fecha, usuario.rut)}
              riesgoLluvia={espacio.exterior && lluviaEnElDia}
              onVerHorarios={setEspacioAbierto}
            />
          ))}
        </div>
      )}

      {espacioAbierto && (
        <DetalleEspacio
          espacio={espacioAbierto}
          fecha={filtros.fecha}
          onCambiarFecha={(fecha) => cambiarFiltro("fecha", fecha)}
          reservas={reservas}
          usuario={usuario}
          clima={clima}
          personasSugeridas={Math.max(1, Number(filtros.personas) || 1)}
          onReservar={alReservar}
          onCerrar={() => setEspacioAbierto(null)}
        />
      )}
    </>
  );
}
