import logo from "../assets/images/logo-unab.jpg";
import BadgeRol from "./BadgeRol.jsx";

export default function Navbar({ usuario, onCerrarSesion }) {
  return (
    <header className="app-navbar sticky-top">
      <div className="container d-flex align-items-center gap-3">
        <div className="brand">
          <img src={logo} alt="" className="brand-logo" />
          <div className="lh-sm">
            <span className="brand-title">Reservas UNAB</span>
            <span className="brand-subtitle d-none d-sm-block">Espacios universitarios</span>
          </div>
        </div>

        <div className="ms-auto d-flex align-items-center gap-2 gap-sm-3">
          <div className="text-end d-none d-lg-block lh-sm">
            <div className="user-name">{usuario.nombre}</div>
            <div className="user-rut">{usuario.rutFormateado}</div>
          </div>
          <BadgeRol rol={usuario.rol} />
          <button type="button" className="btn btn-logout" onClick={onCerrarSesion} title="Cerrar sesión">
            <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
            <span className="d-none d-sm-inline ms-1">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
