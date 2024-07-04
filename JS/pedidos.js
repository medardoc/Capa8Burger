document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-pedidos')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#pedidosTable tbody');
            data.forEach(pedido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pedido.Nombre}</td>
                    <td>${pedido.Apellido}</td>
                    <td>${pedido.Email}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching pedidos:', error));
});
