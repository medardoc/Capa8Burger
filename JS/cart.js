/*Este archivo engloba toda la funcionalidad de la compra del carrito, de como interactua dentro del sistema*/

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <h3>${item.product}</h3>
                    <p>Precio: $${item.price}</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <button class="remove-item" data-product="${item.product}">Eliminar</button>
                `;

                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }

        cartTotalElement.textContent = total.toFixed(2);
    }

    updateCart();

    cartItemsContainer.addEventListener('click', event => {
        if (event.target.classList.contains('remove-item')) {
            const product = event.target.getAttribute('data-product');
            const cartIndex = cart.findIndex(item => item.product === product);

            if (cartIndex > -1) {
                cart.splice(cartIndex, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        }
    });

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío.');
        } else {
            window.location.href = '/index/Formulario.html'; // Redirige a formulario.html
        }
    });
});
// Cart functionality
const cart = JSON.parse(localStorage.getItem('cart')) || [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const product = button.getAttribute('data-product');
        const price = parseFloat(button.getAttribute('data-price'));

        const cartItem = cart.find(item => item.product === product);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ product, price, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product} ha sido agregado al carrito.`);
    });
});

// Modal functionality
const modal = document.getElementById('emailModal');
const closeButton = document.querySelector('.close-button');
const emailForm = document.getElementById('emailForm');

document.querySelector('.cart-button').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('El carrito está vacío.');
    } else {
        modal.style.display = 'block';
    }
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

emailForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;

    fetch('/process-purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, cart })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Compra completada. Se ha enviado un correo de confirmación.');
            localStorage.removeItem('cart');
            modal.style.display = 'none';
        } else {
            alert('Hubo un problema al procesar su compra. Intente nuevamente.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al procesar su compra. Intente nuevamente.');
    });
});
