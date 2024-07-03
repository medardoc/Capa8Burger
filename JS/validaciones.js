document.getElementById('formulario-registro').addEventListener('submit', function(e) {
    // Validacion Nombre
    var expnombre = /^[A-Za-z0-9\s]{6,100}$/;
    var nombre = document.getElementById('nombre').value;
    if (!expnombre.test(nombre)) {
        alert('El nombre debe tener entre 6 y 100 caracteres alfanuméricos.');
        document.getElementById('nombre').focus();
        e.preventDefault();
        return;
    }

    // Validación Contraseña
    var expcontraseña = /^[A-Za-z0-9\s]{6,100}$/;
    var contraseña = document.getElementById('contraseña').value;
    if (!expcontraseña.test(contraseña)) {
        alert('La contraseña debe tener entre 6 y 100 caracteres alfanuméricos.');
        document.getElementById('contraseña').focus();
        e.preventDefault();
        return;
    }

    // Validacion Correo
    var expcorreo = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    var correo = document.getElementById('correo').value;
    if (!expcorreo.test(correo)) {
        alert('El correo debe tener entre 5 y 100 caracteres alfanuméricos.');
        document.getElementById('correo').focus();
        e.preventDefault();
        return;
    }

    // Validación Edad
    var expedad = /^[0-9\s]{1,10}$/;
    var edad = document.getElementById('edad').value;
    if (!expedad.test(edad)) {
        alert('La edad solo puede tener valores numéricos.');
        document.getElementById('edad').focus();
        e.preventDefault();
        return;
    }

    // Validación Rol
    var rol = document.getElementById('rol').value;
    if (rol !== '1' && rol !== '2') {
        alert('Seleccione un rol válido.');
        document.getElementById('rol').focus();
        e.preventDefault();
        return;
    }
});
