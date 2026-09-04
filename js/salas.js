/* ============================================================
   Salas — espacios universitarios, filtros, grilla de horarios
   y formulario de reserva.
   Los espacios y las reservas son datos simulados (arrays y
   objetos JavaScript); las reservas se guardan además en
   localStorage solo para que la demo persista al recargar.
============================================================ */

(function () {
  "use strict";

  /* ---------- Espacios universitarios simulados ---------- */
  const SPACES = [
    { id: "A-101", name: "Sala A-101", type: "Sala de clases", building: "Edificio A", floor: 1, capacity: 40, features: ["Proyector", "Aire acondicionado"] },
    { id: "A-102", name: "Sala A-102", type: "Sala de clases", building: "Edificio A", floor: 1, capacity: 35, features: ["Proyector"] },
    { id: "A-201", name: "Laboratorio de Computación", type: "Laboratorio", building: "Edificio A", floor: 2, capacity: 25, features: ["PCs", "Proyector"] },
    { id: "A-202", name: "Laboratorio de Física", type: "Laboratorio", building: "Edificio A", floor: 2, capacity: 20, features: ["Mesones", "Instrumental"] },
    { id: "B-101", name: "Sala de estudio B-101", type: "Sala de estudio", building: "Edificio B", floor: 1, capacity: 6, features: ["Pizarra", "WiFi"] },
    { id: "B-102", name: "Sala de estudio B-102", type: "Sala de estudio", building: "Edificio B", floor: 1, capacity: 8, features: ["Pizarra", "WiFi", "Enchufes"] },
    { id: "B-201", name: "Sala B-201", type: "Sala de clases", building: "Edificio B", floor: 2, capacity: 50, features: ["Proyector", "Micrófono"] },
    { id: "B-301", name: "Sala de reunión B-301", type: "Sala de reunión", building: "Edificio B", floor: 3, capacity: 12, features: ["TV", "Videoconferencia"] },
    { id: "C-101", name: "Laboratorio de Química", type: "Laboratorio", building: "Edificio C", floor: 1, capacity: 22, features: ["Mesones", "Extractor de gases"] },
    { id: "C-102", name: "Sala de reunión C-102", type: "Sala de reunión", building: "Edificio C", floor: 1, capacity: 10, features: ["Pizarra", "TV"] },
    { id: "C-201", name: "Sala de estudio C-201", type: "Sala de estudio", building: "Edificio C", floor: 2, capacity: 4, features: ["WiFi"] },
    { id: "C-202", name: "Sala C-202", type: "Sala de clases", building: "Edificio C", floor: 2, capacity: 45, features: ["Proyector", "Aire acondicionado"] }
  ];

  const TYPES = ["Sala de clases", "Laboratorio", "Sala de estudio", "Sala de reunión"];

  // Bloques de horario que ofrece la grilla: 08:00 a 20:00
  const HOURS = [];
  for (let h = 8; h <= 20; h++) HOURS.push(h);

  function hourLabel(h) {
    return String(h).padStart(2, "0") + ":00";
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  /* ---------- Persistencia simulada de reservas (localStorage) ---------- */
  const STORAGE_KEY = "reservaunab_reservations_v1";

  function loadReservations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* localStorage no disponible: seguimos con datos semilla */ }

    // Reservas de ejemplo de "otros usuarios", para que la grilla
    // no se vea vacía la primera vez que se abre la página.
    const seedDate = todayISO();
    const seeded = [
      { id: "seed1", spaceId: "A-101", date: seedDate, hour: 10, ownerRut: "999999999", ownerName: "Otro usuario", motivo: "Clase regular", people: 30, createdAt: Date.now() },
      { id: "seed2", spaceId: "A-101", date: seedDate, hour: 11, ownerRut: "999999999", ownerName: "Otro usuario", motivo: "Clase regular", people: 30, createdAt: Date.now() },
      { id: "seed3", spaceId: "B-301", date: seedDate, hour: 15, ownerRut: "888888888", ownerName: "Otro usuario", motivo: "Reunión de coordinación", people: 8, createdAt: Date.now() },
      { id: "seed4", spaceId: "C-101", date: seedDate, hour: 9, ownerRut: "888888888", ownerName: "Otro usuario", motivo: "Laboratorio de Química Orgánica", people: 18, createdAt: Date.now() },
      { id: "seed5", spaceId: "A-201", date: seedDate, hour: 14, ownerRut: "999999999", ownerName: "Otro usuario", motivo: "Taller de programación", people: 20, createdAt: Date.now() }
    ];
    saveReservations(seeded);
    return seeded;
  }

  function saveReservations(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* modo solo-memoria */ }
  }

  let reservations = loadReservations();

  // Usuario con sesión activa. Lo entrega inicio-sesion.js llamando
  // a establecerUsuarioActual(); es null si nadie ha iniciado sesión.
  let currentUser = null;
  let selectedType = "";
  let pendingReserve = null; // { space, date, hour } — reserva que está en el modal

  /* ---------- Referencias al DOM ---------- */
  const typePicker = document.getElementById("type-picker");
  const peopleInput = document.getElementById("people-input");
  const buildingSelect = document.getElementById("building-select");
  const dateInput = document.getElementById("date-input");
  const searchInput = document.getElementById("search-input");

  const resultsCount = document.getElementById("results-count");
  const gridWrap = document.getElementById("grid-wrap");

  const reserveModalEl = document.getElementById("reserve-modal");
  const reserveModal = new bootstrap.Modal(reserveModalEl);
  const reserveSummary = document.getElementById("reserve-summary");
  const modalPeople = document.getElementById("modal-people");
  const modalPeopleError = document.getElementById("modal-people-error");
  const modalMotivo = document.getElementById("modal-motivo");
  const modalConfirmBtn = document.getElementById("modal-confirm-btn");

  /* ---------- Filtros: tipo, personas, edificio, fecha, búsqueda ---------- */
  function buildTypePicker() {
    const all = document.createElement("button");
    all.type = "button";
    all.className = "btn btn-outline-primary btn-sm type-chip active";
    all.textContent = "Todos";
    all.dataset.type = "";
    typePicker.appendChild(all);

    TYPES.forEach((t) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "btn btn-outline-primary btn-sm type-chip";
      chip.textContent = t;
      chip.dataset.type = t;
      typePicker.appendChild(chip);
    });

    typePicker.addEventListener("click", (e) => {
      const btn = e.target.closest(".type-chip");
      if (!btn) return;
      selectedType = btn.dataset.type;
      [...typePicker.children].forEach((c) => c.classList.toggle("active", c === btn));
      renderizarDisponibilidad();
    });
  }
  buildTypePicker();

  // Edificios se listan solos a partir de los datos de SPACES
  [...new Set(SPACES.map((s) => s.building))].sort().forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    buildingSelect.appendChild(opt);
  });

  dateInput.value = todayISO();
  dateInput.min = todayISO();

  [peopleInput, buildingSelect, dateInput, searchInput].forEach((el) => {
    el.addEventListener("input", renderizarDisponibilidad);
    el.addEventListener("change", renderizarDisponibilidad);
  });

  function getFilteredSpaces() {
    const people = Math.max(1, parseInt(peopleInput.value, 10) || 1);
    const building = buildingSelect.value;
    const q = searchInput.value.trim().toLowerCase();

    return SPACES.filter((s) => {
      if (selectedType && s.type !== selectedType) return false;
      if (s.capacity < people) return false;
      if (building && s.building !== building) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.type.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  /* ---------- Grilla de disponibilidad (horas x salas) ---------- */
  function reservationFor(spaceId, date, hour) {
    return reservations.find((r) => r.spaceId === spaceId && r.date === date && r.hour === hour);
  }

  function isPastSlot(date, hour) {
    const slot = new Date(date + "T" + String(hour).padStart(2, "0") + ":00:00");
    return slot.getTime() < Date.now();
  }

  function renderizarDisponibilidad() {
    const spaces = getFilteredSpaces();
    const date = dateInput.value || todayISO();

    resultsCount.textContent = spaces.length === 1 ? "1 espacio encontrado" : `${spaces.length} espacios encontrados`;
    gridWrap.innerHTML = "";

    if (spaces.length === 0) {
      gridWrap.innerHTML = `
        <div class="empty-state">
          <div class="big">🔍</div>
          <div>No hay espacios que cumplan estos filtros.<br>Prueba reduciendo el número de personas o cambiando el edificio.</div>
        </div>`;
      return;
    }

    const scrollDiv = document.createElement("div");
    scrollDiv.className = "grid-scroll";

    const table = document.createElement("table");
    table.className = "schedule";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const thSpace = document.createElement("th");
    thSpace.className = "space-col";
    thSpace.textContent = "Espacio";
    headRow.appendChild(thSpace);
    HOURS.forEach((h) => {
      const th = document.createElement("th");
      th.className = "hour-col";
      th.textContent = hourLabel(h);
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    spaces.forEach((space) => {
      const tr = document.createElement("tr");

      const tdSpace = document.createElement("td");
      tdSpace.className = "space-col";
      tdSpace.innerHTML = `
        <div class="space-name">${space.name}</div>
        <div class="space-meta">${space.building} · piso ${space.floor} · ${space.type}</div>
        <div class="space-meta">Capacidad: ${space.capacity} personas</div>
        <div class="space-features">${space.features.map((f) => `<span class="feature-chip">${f}</span>`).join("")}</div>
      `;
      tr.appendChild(tdSpace);

      HOURS.forEach((hour) => {
        const td = document.createElement("td");
        td.className = "slot";

        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell-slot";

        const existing = reservationFor(space.id, date, hour);
        const past = isPastSlot(date, hour);
        const isMine = existing && currentUser && existing.ownerRut === currentUser.rut;

        if (past) {
          cell.classList.add("cell-past");
          cell.textContent = "—";
          cell.disabled = true;
          cell.title = "Horario pasado";
        } else if (existing) {
          cell.classList.add(isMine ? "cell-mine" : "cell-occupied");
          cell.textContent = isMine ? "Tuya" : "Ocupado";
          cell.disabled = true;
          cell.title = isMine ? "Ya tienes una reserva en este horario" : "Espacio no disponible en este horario";
        } else {
          cell.classList.add("cell-available");
          cell.textContent = "Libre";
          cell.title = `Reservar ${space.name} · ${hourLabel(hour)}`;
          cell.addEventListener("click", () => openReserveModal(space, date, hour));
        }

        td.appendChild(cell);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    scrollDiv.appendChild(table);
    gridWrap.appendChild(scrollDiv);
  }

  /* ---------- Formulario de reserva (modal Bootstrap + validación) ---------- */
  function openReserveModal(space, date, hour) {
    const people = Math.max(1, parseInt(peopleInput.value, 10) || 1);
    pendingReserve = { space, date, hour };

    reserveSummary.innerHTML = `
      <div class="row-line"><span>Espacio</span><span>${space.name}</span></div>
      <div class="row-line"><span>Ubicación</span><span>${space.building} · piso ${space.floor}</span></div>
      <div class="row-line"><span>Fecha</span><span>${date}</span></div>
      <div class="row-line"><span>Horario</span><span>${hourLabel(hour)} – ${hourLabel(hour + 1)}</span></div>
      <div class="row-line"><span>Solicitante</span><span>${currentUser.name} (${currentUser.role})</span></div>
    `;

    modalPeople.value = Math.min(people, space.capacity);
    modalPeople.max = space.capacity;
    modalPeopleError.textContent = `Debe ser entre 1 y ${space.capacity} (capacidad del espacio).`;
    modalMotivo.value = "";
    modalPeople.classList.remove("is-invalid");
    modalMotivo.classList.remove("is-invalid");

    reserveModal.show();
  }

  modalConfirmBtn.addEventListener("click", () => {
    if (!pendingReserve) return;
    const { space, date, hour } = pendingReserve;

    let ok = true;
    const p = parseInt(modalPeople.value, 10);
    if (!p || p < 1 || p > space.capacity) {
      modalPeople.classList.add("is-invalid");
      ok = false;
    } else {
      modalPeople.classList.remove("is-invalid");
    }

    if (!modalMotivo.value.trim()) {
      modalMotivo.classList.add("is-invalid");
      ok = false;
    } else {
      modalMotivo.classList.remove("is-invalid");
    }

    if (!ok) return;

    // Verificación de disponibilidad al momento de confirmar
    // (por si alguien más tomó el mismo horario justo antes)
    if (reservationFor(space.id, date, hour)) {
      reserveModal.hide();
      renderizarDisponibilidad();
      return;
    }

    const record = {
      id: "r" + Date.now() + Math.floor(Math.random() * 1000),
      spaceId: space.id,
      date,
      hour,
      ownerRut: currentUser.rut,
      ownerName: currentUser.name,
      motivo: modalMotivo.value.trim(),
      people: p,
      createdAt: Date.now()
    };
    reservations.push(record);
    saveReservations(reservations);

    reserveModal.hide();
    renderizarDisponibilidad();
  });

  /* ---------- API pública del módulo ----------
     inicio-sesion.js llama a establecerUsuarioActual() al iniciar
     y cerrar sesión, y a renderizarDisponibilidad() para pintar
     la grilla apenas alguien entra. El resto de este archivo
     queda privado dentro del módulo. */
  function establecerUsuarioActual(user) {
    currentUser = user;
  }

  window.Salas = { establecerUsuarioActual, renderizarDisponibilidad };
})();
