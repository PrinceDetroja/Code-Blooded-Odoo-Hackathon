const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5500;

app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'Aadi@9473', 
    database: 'ExpManagement'
});

db.connect(err => {
    if (err) console.error('DB connection failed:', err);
    else console.log('Connected to MySQL');
});

// --- Submit Expense ---
app.post('/request', (req, res) => {
    const { employee_id, amount, currency, category, description, expense_date } = req.body;

    if (!employee_id || !amount || !currency || !category || !expense_date) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const query = `INSERT INTO Expenses (employee_id, amount, currency, category, description, expense_date)
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [employee_id, amount, currency, category, description, expense_date], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'Expense submitted successfully', expense_id: result.insertId });
    });
});

// --- Get Employee Expense History ---
app.get('/expense/:employee_id', (req, res) => {
    const employeeId = req.params.employee_id;
    const query = `SELECT * FROM Expenses WHERE employee_id = ? ORDER BY created_at DESC`;

    db.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
});

// --- Get Pending Requests for Manager/Admin ---
app.get('/expense/pending', (req, res) => {
    const query = `SELECT e.*, emp.name AS employee_name 
                   FROM Expenses e 
                   JOIN Employees emp ON e.employee_id = emp.employee_id
                   WHERE e.status = 'Pending' 
                   ORDER BY e.created_at ASC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
});

// --- Approve or Reject Expense ---
app.put('/expense/:expense_id', (req, res) => {
    const expenseId = req.params.expense_id;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const query = `UPDATE Expenses SET status = ? WHERE expense_id = ?`;

    db.query(query, [status, expenseId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: `Expense ${status.toLowerCase()} successfully` });
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
