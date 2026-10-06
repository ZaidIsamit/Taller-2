import { useEffect } from "react";

function Notificacion({ notificacion, onCerrar }) {
  useEffect(() => {
    const temporizador = setTimeout(() => onCerrar(notificacion.id), 4000);
    return () => clearTimeout(temporizador);
  }, [notificacion.id, onCerrar]);

  const icono = notificacion.tipo === "exito" ? "bi-check-circle-fill" : "bi-info-circle-fill";
  return (
    <div className={`app-toast toast-${notificacion.tipo}`} role="status">
      <i className={`bi ${icono}`} aria-hidden="true"></i>
      <div className="flex-grow-1">
        <div className="fw-semibold">{notificacion.titulo}</div>
        {notificacion.detalle && <div className="small opacity-75">{notificacion.detalle}</div>}
      </div>
      <button
        type="button"
        className="btn-close btn-close-white btn-sm"
        aria-label="Cerrar"
        onClick={() => onCerrar(notificacion.id)}
      ></button>
    </div>
  );
}

export default function Notificaciones({ notificaciones, onCerrar }) {
  return (
    <div className="toast-area" aria-live="polite">
      {notificaciones.map((n) => (
        <Notificacion key={n.id} notificacion={n} onCerrar={onCerrar} />
      ))}
    </div>
  );
}
