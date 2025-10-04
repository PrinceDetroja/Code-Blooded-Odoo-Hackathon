const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5500;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",        
    password: "Aadi@9473",       
    database: "ExpManagement"
});

db.connect(err => {
    if (err) console.error('Database connection failed:', err);
    else console.log('Connected to MySQL database');
});

// Company Signup Route
app.post('/signup', async (req, res) => {
    const { name, email, password, confirm, country} = req.body;

    //Validation
    if (!name || !email || !password || !confirm || !country) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirm) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Check if email already exists
        const [existingCompany] = await db.promise().query('SELECT * FROM Companies WHERE email = ?', [email]);
        if (existingCompany.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        //const hashedPassword = await bcrypt.hash(password, 10);

        // Insert company into DB
        await db.promise().query(
            'INSERT INTO Companies (name, email, password, country) VALUES (?, ?, ?, ? )',
            [name, email, confirm, country]
        );

        res.status(201).json({ message: 'Company registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
