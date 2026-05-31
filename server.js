const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(cors()); 
app.use(bodyParser.json());

const db = mysql.createPool({
    host: 'mysql-33891d37-barber.l.aivencloud.com',
    port: 13306,
    user: 'avnadmin',      
    password: process.env.DB_PASSWORD, // Ambil dari Render Settings
    database: 'defaultdb',
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000 // Beri masa lebih lama untuk sambungan pertama
});

// Uji sambungan pool
db.getConnection((err, connection) => {
    if (err) {
        console.error('DATABASE CONNECT ERROR: ' + err.message);
    } else {
        console.log('Berjaya sambung ke MySQL Database (Pool)!');
        connection.release();
    }
});
// 2. Laluan (Route) untuk terima data dari borang HTML (Dah disamakan dengan Workbench kau)
app.post('/api/bookings', (req, res) => {
    const { nama_pelanggan, no_telefon, barber_id, tarikh, slot_masa } = req.body;

    // Pastikan susunan ?,?,?,?,? sama dengan data di bawah
    const query = `INSERT INTO bookings (nama, no_telefon, barber, tarikh, masa) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [nama_pelanggan, no_telefon, barber_id, tarikh, slot_masa], (err, result) => {
        if (err) {
            console.error("DATABASE ERROR:", err);
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: 'Tempahan berjaya disimpan!' });
    });
});

// 3. Laluan (Route) untuk Admin ambil semua senarai booking (Dipermudahkan mengikut table bookings kau)
app.get('/api/admin/bookings', (req, res) => {
    // Query diubah suai mengikut satu table 'bookings' yang kau buat kat Workbench
    const query = `SELECT id, nama, no_telefon, barber, tarikh, masa FROM bookings ORDER BY tarikh DESC, masa DESC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Gagal ambil data' });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server backend berjalan di port ${PORT}`);
});

// test update 1