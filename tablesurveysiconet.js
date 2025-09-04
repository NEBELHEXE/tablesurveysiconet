const SHEET_URL = "https://script.google.com/macros/s/AKfycbweQJOx0bh5whh0dJmjBoHyO8FDSPQfO-6q_a-S7soh85pT9o5_oMuZ7kLJb7faqYsx/exec"; // Reemplaza con tu URL de Web App

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#tickets-table tbody");
  const overlay = document.getElementById("loading-overlay");

  overlay.style.display = "flex";

  fetch(SHEET_URL)
    .then(res => res.json())
    .then(data => {
      tableBody.innerHTML = ""; // Limpiar tabla antes de llenarla

      data.forEach(ticket => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${ticket.Empresa}</td>
          <td>${ticket.Fecha}</td>
          <td>${ticket.ID}</td>
          <td>${ticket.Urgencia}</td>
          <td>${ticket.Descripcion}</td>
          <td>${ticket.Estado || ""}</td>
          <td><input type="checkbox" class="completed-checkbox" ${ticket.Realizado === true ? "checked" : ""}></td>
          <td><textarea class="comment-box">${ticket.Anotaciones || ""}</textarea></td>
        `;

        // Checkbox: guardar al marcar/desmarcar
        const checkbox = tr.querySelector(".completed-checkbox");
        checkbox.addEventListener("change", () => {
          updateTicket(ticket.ID, checkbox.checked, tr.querySelector(".comment-box").value);
        });

        // Textarea: guardar al perder foco
        const textarea = tr.querySelector(".comment-box");
        textarea.addEventListener("blur", () => {
          updateTicket(ticket.ID, tr.querySelector(".completed-checkbox").checked, textarea.value);
        });

        tableBody.appendChild(tr);
      });
    })
    .catch(err => console.error(err))
    .finally(() => overlay.style.display = "none");
});

// Función para actualizar ticket
function updateTicket(id, realizado, anotaciones) {
  fetch(SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      action: "update",
      id,
      realizado,
      comentarios: anotaciones
    })
  })
    .then(res => res.json())
    .then(resp => {
      if(resp.status !== "ok") console.error(resp.message);
    })
    .catch(err => console.error(err));
}
