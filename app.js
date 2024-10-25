const express = require('express');
const sql = require('mssql');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de conexión a SQL Server
const dbConfig = {
    user: 'sa', // Reemplaza con tu usuario de SQL Server
    password: 'Password123', // Reemplaza con tu contraseña
    server: 'localhost', // Cambia si usas un servidor remoto
    database: 'login_db',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

// Conectar a la base de datos
sql.connect(dbConfig, err => {
    if (err) {
        console.error('Error conectando a la base de datos SQL Server:', err);
    } else {
        console.log('Conexión a SQL Server establecida correctamente.');
    }
});

// Ruta para mostrar el formulario de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'));
});

// Ruta para procesar el login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = @username AND password = @password`;

    const request = new sql.Request();
    request.input('username', sql.VarChar, username);
    request.input('password', sql.VarChar, password);
    
    request.query(query, (err, result) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else if (result.recordset.length > 0) {
            res.send('¡Inicio de sesión exitoso y CR7 ES MEJOR QUE EL PUTO DE MESSI!');
        } else {
            res.send('Credenciales inválidas.');
        }
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
