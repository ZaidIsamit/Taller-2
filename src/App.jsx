import { useCallback, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Notificaciones from "./components/Notificaciones.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import EspaciosPage from "./pages/EspaciosPage.jsx";
import espacios from "./data/espacios.json";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useReservas } from "./hooks/useReservas.js";
import { formatearFechaLarga, rangoHorario } from "./utils/fechas.js";

// Componente raíz: guarda la sesión, las reservas y los avisos,
// y reparte esos datos a las páginas mediante props.
export default function App() {
  const [usuario, setUsuario] = useLocalStorage("unab_sesion_v2", null);
  const [notificaciones, setNotificaciones] = useState([]);
  const { reservas, crearReserva } = useReservas();

  function notificar(tipo, titulo, detalle) {
    setNotificaciones((actuales) => [...actuales, { id: Date.now(), tipo, titulo, detalle }]);
  }

  // useCallback: la misma función entre renders, para que el temporizador de
  // cada aviso (useEffect en Notificaciones) no se reinicie en cada render.
  const cerrarNotificacion = useCallback((id) => {
    setNotificaciones((actuales) => actuales.filter((n) => n.id !== id));
  }, []);

  function alCrearReserva(datos) {
    crearReserva(datos);
    const espacio = espacios.find((e) => e.id === datos.espacioId);
    notificar(
      "exito",
      "Reserva confirmada",
      `${espacio.nombre} · ${formatearFechaLarga(datos.fecha)}, ${rangoHorario(datos.hora, datos.duracion)}`
    );
  }

  if (!usuario) {
    return <LoginPage onIniciarSesion={setUsuario} />;
  }

  return (
    <>
      <Navbar usuario={usuario} onCerrarSesion={() => setUsuario(null)} />

      <main className="container app-main">
        <EspaciosPage usuario={usuario} reservas={reservas} onCrearReserva={alCrearReserva} />
      </main>

      <Notificaciones notificaciones={notificaciones} onCerrar={cerrarNotificacion} />
    </>
  );
}
