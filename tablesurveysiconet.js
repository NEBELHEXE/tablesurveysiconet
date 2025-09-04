window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('loading-overlay');
    const tableBody = document.querySelector('#tickets-table tbody');

    overlay.style.display = 'flex'; // mostrar overlay

    fetch('https://script.google.com/macros/s/AKfycbweQJOx0bh5whh0dJmjBoHyO8FDSPQfO-6q_a-S7soh85pT9o5_oMuZ7kLJb7faqYsx/exec') // reemplaza con tu URL
        .then(res => res.json())
        .then(data => {
            const hoy = new Date();

            data.forEach(ticket => {
                // Calcular días transcurridos
                const fechaTicket = new Date(ticket.Fecha);
                const diffDias = Math.floor((hoy - fechaTicket) / (1000 * 60 * 60 * 24));

                // Asignar emoji según días
                let estado = '🫡';
                if (diffDias <= 1) estado = '🫡';
                else if (diffDias <= 3) estado = '😐';
                else if (diffDias <= 7) estado = '☹️';
                else estado = '💀';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${ticket.Empresa}</td>
                    <td>${ticket.Fecha}</td>
                    <td>${ticket.ID}</td>
                    <td>${ticket.Urgencia}</td>
                    <td><textarea class="comment-box">${ticket.Anotaciones || ""}</textarea></td>
                    <td><input type="checkbox" class="completed-checkbox" ${ticket.Realizado ? "checked" : ""}></td>
                    <td>${estado}</td>
                `;
                tableBody.appendChild(tr);

                // Guardar cambios al marcar checkbox
                const checkbox = tr.querySelector('.completed-checkbox');
                const textarea = tr.querySelector('.comment-box');

                checkbox.addEventListener('change', () => {
                    const payload = new URLSearchParams();
                    payload.append('action', 'update');
                    payload.append('id', ticket.ID);
                    payload.append('realizado', checkbox.checked);
                    payload.append('comentarios', textarea.value);

                    fetch('TU_WEBAPP_URL', { 
                        method: 'POST',
                        body: payload
                    })
                    .then(res => res.json())
                    .then(resp => console.log(resp))
                    .catch(err => console.error(err));
                });

                // También puedes guardar cambios de textarea en otro evento si quieres
                // textarea.addEventListener('change', () => { ... });
            });
        })
        .catch(err => console.error(err))
        .finally(() => overlay.style.display = 'none');
});
