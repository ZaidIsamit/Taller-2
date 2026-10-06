(function () {
  "use strict";

  // Referencias a los elementos del navbar (ver index.html)
  const userBar = document.getElementById("user-bar");
  const userRoleBadge = document.getElementById("user-role-badge");
  const userNameEl = document.getElementById("user-name");
  const userRutEl = document.getElementById("user-rut");
  const logoutBtn = document.getElementById("logout-btn");

  // Traduce el nombre del rol a la clase CSS que define su color
  // (ver .role-badge.estudiante / .docente / .org / .admin en styles.css)
  function roleSlug(role) {
    if (role === "Estudiante") return "estudiante";
    if (role === "Docente") return "docente";
    if (role === "Organización Estudiantil") return "org";
    return "admin";
  }

  // Pinta los datos del usuario en la barra superior y la muestra
  function mostrarBarraUsuario(user) {
    userNameEl.textContent = user.name;
    userRutEl.textContent = user.rutFormatted;
    userRoleBadge.textContent = user.role;
    userRoleBadge.className = "badge role-badge " + roleSlug(user.role);
    userBar.classList.remove("d-none");
    userBar.classList.add("d-flex");
  }

  // Oculta la barra superior (se usa al cerrar sesión)
  function ocultarBarraUsuario() {
    userBar.classList.add("d-none");
    userBar.classList.remove("d-flex");
  }

  // El botón "Cerrar sesión" vive acá, pero volver a la pantalla
  // de login es trabajo de inicio-sesion.js. En vez de llamarlo
  // directamente, este archivo solo dispara un evento y que lo
  // escuche quien corresponda (así header.js no necesita conocer
  // al resto de los módulos).
  logoutBtn.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("cerrar-sesion"));
  });

  // API pública del módulo: lo único que los demás archivos
  // pueden usar de header.js.
  window.Header = { mostrarBarraUsuario, ocultarBarraUsuario };
})();
