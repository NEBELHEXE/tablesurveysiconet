document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#tickets-table tbody");
  const overlay = document.getElementById("loading-overlay");

  overlay.style.display = "flex";

  fetch("https://script.google.com/macros/s/AKfycbweQJOx0bh5whh0dJmjBoHyO8FDSPQfO-6q_a-S7soh85pT9o5_oMuZ7kLJb7faqYsx/exec")
    .then(res => res.json())
    .then(tickets => {
      tickets.forEach(ticket => {
        // Calcular estado según días transcurridos
        let estado = '🫡';
        const diffDias = (new Date() - new Date(ticket.Fecha)) / (1000 * 60 * 60 * 24);
        if (diffDias >= 0 && diffDias <= 1) estado = '🫡';
        else if (diffDias <= 3) estado = '😐';
        else if (diffDias <= 7) estado = '☹️';
        else estado = '💀';

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${ticket.Empresa}</td>
          <td>${ticket.Fecha}</td>
          <td>${ticket.ID}</td>
          <td>${ticket.Urgencia}</td>
          <td>${ticket.Descripcion}</td>
          <td>${estado}</td>
          <td>
            <input type="checkbox" class="completed-checkbox" ${ticket.Realizado ? "checked" : ""}>
          </td>
          <td>
            <textarea class="comment-box" placeholder="Anotaciones...">${ticket.Anotaciones || ""}</textarea>
          </td>
        `;
        tableBody.appendChild(tr);

        // Referencias a los elementos
        const checkbox = tr.querySelector(".completed-checkbox");
        const textarea = tr.querySelector(".comment-box");

        // Función para enviar actualización a la Web App
        const guardarCambios = () => {
          fetch("https://script.google.com/macros/s/TU_WEB_APP_ID/exec", {
            method: "POST",
            body: new URLSearchParams({
              action: "update",
              id: ticket.ID,
              realizado: checkbox.checked,
              anotaciones: textarea.value
            })
          }).catch(err => console.error("Error guardando ticket:", err));
        };

        // Guardar al marcar checkbox
        checkbox.addEventListener("change", guardarCambios);

        // Guardar automáticamente al escribir en textarea (debounce)
        let timeout;
        textarea.addEventListener("input", () => {
          clearTimeout(timeout);
          timeout = setTimeout(guardarCambios, 500); // espera 0.5s después de dejar de escribir
        });
      });
    })
    .catch(err => console.error(err))
    .finally(() => overlay.style.display = "none");
});
