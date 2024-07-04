const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const nodemailer = require('nodemailer'); 

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

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'index', 'Cart.html'));
});

app.post('/send-email', (req, res) => {
    const { email, cart } = req.body;

    console.log('Datos del carrito:', cart); // Agregado para depuración

    // Calcular el total de la compra
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'trabajo_tony@hotmail.com',
            pass: 'Ivanna2@2@'
        }
    });

    const mailOptions = {
        from: 'trabajo_tony@hotmail.com',
        to: email,
        subject: 'Compra Confirmada',
        text: `Su compra ha sido confirmada. Detalles del carrito: ${JSON.stringify(cart)}\n\nMonto total: $${totalAmount.toFixed(2)}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ success: false });
        } else {
            console.log('Correo enviado:', info.response);
            res.status(200).json({ success: true });
        }
    });
});

app.post('/process-purchase', (req, res) => {
    const { name, lastname, email } = req.body;

    const query = 'INSERT INTO UsuariosCompra (Nombre, Apellido, Email) VALUES (?, ?, ?)';
    connection.execute(query, [name, lastname, email], (err, results) => {
        if (err) {
            console.error('Error saving user:', err);
            res.status(500).json({ success: false });
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'trabajo_tony@hotmail.com',
                pass: 'Ivanna2@2@'
            }
        });

        const mailOptions = {
            from: 'trabajo_tony@hotmail.com',
            to: email,
            subject: 'Compra realizada con éxito',
            text: `Gracias por su compra, en las proxima hora uno de nuestros ejecutivos se contactara con usted para coordinar la entrega.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ success: false });
            } else {
                console.log('Email sent: ' + info.response);
                res.redirect(303, '/'); // Redirigir a la página principal después de procesar la compra
            }
        });
    });
});

// Endpoint para obtener usuarios
app.get('/get-usuarios', (req, res) => {
    const query = 'SELECT Nombre, Correo, Edad, Rol FROM usuarios';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching usuarios:', err);
            res.status(500).send('Error fetching usuarios');
        } else {
            res.json(results);
        }
    });
});

// Endpoint para obtener pedidos
app.get('/get-pedidos', (req, res) => {
    const query = 'SELECT Nombre, Apellido, Email FROM UsuariosCompra';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching pedidos:', err);
            res.status(500).send('Error fetching pedidos');
        } else {
            res.json(results);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
