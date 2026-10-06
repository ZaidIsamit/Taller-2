import { useEffect } from "react";

// Modal controlado por React: se muestra mientras el padre lo renderiza.
// Usa las clases de Bootstrap para el aspecto, pero no su JavaScript.
export default function Modal({ titulo, subtitulo, onCerrar, children, pie, tamano = "" }) {
  useEffect(() => {
    // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto.
    function alPresionarTecla(e) {
      if (e.key === "Escape") onCerrar();
    }
    document.addEventListener("keydown", alPresionarTecla);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.body.classList.remove("modal-open");
    };
  }, [onCerrar]);

  return (
    <>
      <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" onClick={onCerrar}>
        <div
          className={`modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down ${tamano}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2 className="modal-title h5" id="modal-titulo">{titulo}</h2>
                {subtitulo && <div className="modal-subtitle">{subtitulo}</div>}
              </div>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
            </div>
            <div className="modal-body">{children}</div>
            {pie && <div className="modal-footer">{pie}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}
