
// Este código maneja el slide y el formulario de acceso del lado del cliente
document.addEventListener('DOMContentLoaded', () => {
    // Slide functionality
    const slides = document.querySelector('.slides');
    const slideArray = Array.from(document.querySelectorAll('.slide'));
    let index = 0;

    function showNextSlide() {
        index++;
        if (index >= slideArray.length) {
            index = 0;
        }
        updateSlidePosition();
    }

    function updateSlidePosition() {
        slides.style.transform = `translateX(${-index * 100}%)`;
    }

    setInterval(showNextSlide, 3000);
});

document.getElementById("FormularioAcceso").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    
    var expcorreo = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    var correo = document.getElementById('correo').value;
    if (!expcorreo.test(correo)) {
        alert('El correo debe tener entre 5 y 100 caracteres alfanuméricos.');
        document.getElementById('correo').focus();
        return false;
    }
  
    var expcontraseña = /^[A-Za-z0-9\s]{6,100}$/;
    var contraseña = document.getElementById('contraseña').value;
    if (!expcontraseña.test(contraseña)) {
        alert('La contraseña debe tener entre 6 y 100 caracteres alfanuméricos.');
        document.getElementById('contraseña').focus();
        return false;
    }
  
    // Envío de datos al servidor
    fetch('/iniciar_sesion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo: correo, contraseña: contraseña })
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Correo o clave incorrectos');
        }
    })
    .then(data => {
        if (data.includes('administrador.html')) {
            window.location.href = '/index/administrador.html';
        } else if (data.includes('usuario.html')) {
            window.location.href = '/index/usuario.html';
        } else {
            alert('Correo o clave incorrectos');
        }
    })
    .catch(error => {
        console.error('Error al iniciar sesión:', error);
    });
});