/* ============================================================
   Inicio de sesión — control de acceso por RUT (solo puede
   entrar quien está en la lista de USUARIOS) y cambio entre la
   pantalla de login y la de la aplicación.
   Al iniciar o cerrar sesión, avisa a los otros módulos a través
   de su API pública (window.Header y window.Salas), definida en
   header.js y salas.js respectivamente.
============================================================ */

(function () {
  "use strict";

  /* ---------- Utilidades de RUT chileno (limpiar y formatear) ---------- */
  function cleanRut(v) {
    return (v || "").replace(/[^0-9kK]/g, "").toUpperCase();
  }

  function formatRut(raw) {
    const c = cleanRut(raw);
    if (c.length < 2) return c;
    const body = c.slice(0, -1);
    const dv = c.slice(-1);
    let out = "";
    for (let i = 0; i < body.length; i++) {
      const posFromEnd = body.length - i;
      out += body[i];
      if (posFromEnd > 1 && posFromEnd % 3 === 1) out += ".";
    }
    return out + "-" + dv;
  }

  /* ---------- Usuarios autorizados (array de objetos) ----------
     Solo puede iniciar sesión quien está en esta lista: es la
     "base de datos" simulada de personas con acceso al sistema.
     Cada persona es un objeto con rut (el RUT completo limpio,
     sin puntos ni guion, dígito verificador incluido), nombre y
     rol. Para agregar a alguien, se agrega otro objeto igual a
     este array. */
  const USUARIOS = [
    { rut: "216688392", name: "Zaid Isamit Alvial", role: "Docente" },
    { rut: "219931158", name: "Agustin Carmona", role: "Estudiante" },
    { rut: "218348246", name: "Jhon Rojas", role: "Organización Estudiantil" }
  ];

  // Busca a la persona dueña de ese RUT dentro de USUARIOS.
  // Devuelve undefined si el RUT no está autorizado.
  function buscarUsuario(rutClean) {
    return USUARIOS.find((u) => u.rut === rutClean);
  }

  /* ---------- Referencias al DOM ---------- */
  const viewLogin = document.getElementById("view-login");
  const viewApp = document.getElementById("view-app");
  const loginForm = document.getElementById("login-form");
  const rutInput = document.getElementById("rut-input");
  const rutError = document.getElementById("rut-error");

  /* ---------- Formulario de login ---------- */
  rutInput.addEventListener("input", () => {
    let c = cleanRut(rutInput.value);
    if (c.length > 9) c = c.slice(0, 9); // 8 dígitos + dígito verificador
    rutInput.value = c.length ? formatRut(c) : "";
    rutInput.classList.remove("is-invalid");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = rutInput.value.trim();

    const usuario = buscarUsuario(cleanRut(raw));
    if (!usuario) {
      rutInput.classList.add("is-invalid");
      rutError.textContent = "Este RUT no está autorizado para ingresar al sistema.";
      return;
    }

    loginAs(usuario);
  });

  function loginAs(usuario) {
    const user = {
      rut: usuario.rut,
      rutFormatted: formatRut(usuario.rut),
      name: usuario.name,
      role: usuario.role
    };

    window.Header.mostrarBarraUsuario(user);
    window.Salas.establecerUsuarioActual(user);

    viewLogin.classList.add("d-none");
    viewApp.classList.remove("d-none");

    window.Salas.renderizarDisponibilidad();
  }

  /* ---------- Cerrar sesión ----------
     El botón "Cerrar sesión" vive en header.js; cuando lo
     presionan, dispara este evento y acá se resuelve la lógica:
     simplemente se vuelve a la pantalla de login. No se guarda
     ninguna sesión, así que la próxima vez (recargar la página o
     cerrar sesión) siempre va a pedir el RUT de nuevo. */
  document.addEventListener("cerrar-sesion", () => {
    window.Header.ocultarBarraUsuario();
    window.Salas.establecerUsuarioActual(null);

    viewApp.classList.add("d-none");
    viewLogin.classList.remove("d-none");
    rutInput.value = "";
    rutInput.classList.remove("is-invalid");
    rutInput.focus();
  });
})();
