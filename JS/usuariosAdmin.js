document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-usuarios')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#usuariosTable tbody');
            data.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.Nombre}</td>
                    <td>${usuario.Correo}</td>
                    <td>${usuario.Edad}</td>
                    <td>${usuario.Rol}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching usuarios:', error));
});
