import { useState } from "react";
import logo from "../assets/images/logo-unab.jpg";
import usuarios from "../data/usuarios.json";
import { formatearRut, limpiarRut } from "../utils/rut.js";

export default function LoginPage({ onIniciarSesion }) {
  const [rut, setRut] = useState("");
  const [error, setError] = useState("");

  function alEscribir(e) {
    const limpio = limpiarRut(e.target.value);
    setRut(limpio ? formatearRut(limpio) : "");
    setError("");
  }

  function alEnviar(e) {
    e.preventDefault();
    const limpio = limpiarRut(rut);
    if (limpio.length < 8) {
      setError("Ingresa tu RUT completo, con dígito verificador.");
      return;
    }
    const usuario = usuarios.find((u) => u.rut === limpio);
    if (!usuario) {
      setError("Este RUT no está autorizado para ingresar al sistema.");
      return;
    }
    onIniciarSesion({ ...usuario, rutFormateado: formatearRut(usuario.rut) });
  }

  return (
    <div className="login-page">
      <section className="login-panel">
        <form className="login-card" onSubmit={alEnviar} noValidate>
          <img src={logo} alt="Universidad Andrés Bello" className="login-logo" />
          <h1 className="h4 mb-1">Iniciar sesión</h1>
          <p className="text-muted small mb-4">Ingresa con tu RUT institucional.</p>

          <label htmlFor="login-rut" className="form-label">RUT</label>
          <div className="input-icon mb-1">
            <i className="bi bi-person-vcard" aria-hidden="true"></i>
            <input
              id="login-rut"
              type="text"
              inputMode="text"
              autoComplete="off"
              placeholder="12.345.678-9"
              className={`form-control form-control-lg ${error ? "is-invalid" : ""}`}
              value={rut}
              onChange={alEscribir}
              aria-describedby="login-rut-error"
              autoFocus
            />
          </div>
          <div id="login-rut-error" className="invalid-feedback d-block mb-3" role="alert">{error}</div>

          <button type="submit" className="btn btn-primary btn-lg w-100">
            Continuar <i className="bi bi-arrow-right ms-1" aria-hidden="true"></i>
          </button>
        </form>
      </section>
    </div>
  );
}
