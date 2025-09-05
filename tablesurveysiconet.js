document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#tickets-table tbody");
  const overlay = document.getElementById("loading-overlay");

  overlay.style.display = "flex";

  fetch("https://script.google.com/macros/s/AKfycbxBMzRtkIyZXca60sA9qiDnU3ZLqTtdFLtkM6MIlLp-M5CygegBf6nrZ-w9zxFZe21B/exec")
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
            <textarea class="comment-box" placeholder="Anotaciones..."></textarea>
            <div class="sending-feedback">Enviando Anotaciones...</div>
          </td>
        `;
        tableBody.appendChild(tr);

        // Referencias a los elementos
        const checkbox = tr.querySelector(".completed-checkbox");
        const textarea = tr.querySelector(".comment-box");
        const feedback = tr.querySelector(".sending-feedback");

        // Función para enviar actualización a la Web App
        const guardarCambios = () => {
          const anotacionTexto = textarea.value.trim();
          if (!anotacionTexto && !checkbox.checked) return; // nada que enviar

          feedback.classList.add("show"); // mostrar animación/feedback

          fetch("https://script.google.com/macros/s/AKfycbxBMzRtkIyZXca60sA9qiDnU3ZLqTtdFLtkM6MIlLp-M5CygegBf6nrZ-w9zxFZe21B/exec", {
            method: "POST",
            body: new URLSearchParams({
              action: "update",
              id: ticket.ID,
              realizado: checkbox.checked,
              anotaciones: anotacionTexto
            })
          })
          .then(res => res.json())
          .then(() => {
            // Feedback visible 1s y limpiar textarea
            setTimeout(() => {
              feedback.classList.remove("show");
              textarea.value = "";
            }, 1000);
          })
          .catch(err => {
            console.error("Error guardando ticket:", err);
            feedback.classList.remove("show");
          });
        };

        // Guardar al marcar checkbox
        checkbox.addEventListener("change", guardarCambios);

        // Guardar al salir del textarea
        textarea.addEventListener("blur", guardarCambios);
      });
    })
    .catch(err => console.error(err))
    .finally(() => overlay.style.display = "none");
});
