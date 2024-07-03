const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');

// Middleware para parsear el body de las solicitudes en formato JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: '127.0.1.1',
    user: 'root',
    password: '',
    database: 'tiendavirtual'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = connection;

// Endpoint para iniciar sesión
app.post('/iniciar_sesion', (req, res) => {
    const { correo, contraseña } = req.body;

    const query = 'SELECT Rol FROM usuarios WHERE Correo = ? AND Contraseña = ?';
    connection.query(query, [correo, contraseña], (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            res.status(500).send('Error al iniciar sesión');
        } else if (results.length > 0) {
            const rol = results[0].Rol;
            if (rol === 1) {
                res.send('/index/administrador.html');
            } else if (rol === 2) {
                res.send('/index/usuario.html');
            }
        } else {
            res.status(401).send('Correo o clave incorrectos');
        }
    });
});

// Endpoint para guardar usuarios
app.post('/guardar_usuarios', (req, res) => {
    const { nombre, contraseña, correo, edad, rol } = req.body;

    // Verificación de datos recibidos
    console.log('Datos recibidos:', req.body);

    if (!nombre || !contraseña || !correo || !edad || !rol) {
        console.error('Uno o más campos están vacíos');
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const sql = 'INSERT INTO usuarios (Nombre, Contraseña, Correo, Edad, Rol) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [nombre, contraseña, correo, edad, rol], (err, result) => {
        if (err) {
            console.error('Error al insertar usuario:', err);
            return res.status(500).send('Error al insertar usuario');
        }
        console.log('Usuario registrado correctamente.');
        res.redirect('/index/iniciarSesion.html');
    });
});

// Configuración para servir archivos estáticos desde directorios específicos
app.use('/CSS', express.static(path.join(__dirname, 'CSS')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/JS', express.static(path.join(__dirname, 'JS')));
app.use('/index', express.static(path.join(__dirname, 'index')));

// Rutas para servir archivos HTML específicos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'panel.html'));
});

app.get('/bebidas', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'bebidas.html'));
});

app.get('/combos', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'combos.html'));
});

app.get('/hamburguesas', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'hamburguesas.html'));
});

app.get('/iniciarSesion', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'iniciarSesion.html'));
});

app.get('/registrar', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'registrar.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
