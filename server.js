const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(cors()); 
app.use(bodyParser.json());

// 1. Sambungkan ke MySQL Database Aiven (Dah ditambah Port & SSL)
const db = mysql.createConnection({
    host: 'mysql-33891d37-barber.l.aivencloud.com',
    port: 13306, // <--- WAJIB UNTUK AIVEN
    user: 'avnadmin',      
    password: 'AVNS_FBYlNvXrV1JOJpAw6-P', 
    database: 'defaultdb',
    ssl: {
        rejectUnauthorized: false // <--- WAJIB UNTUK SECURITY AIVEN
    }
});

db.connect((err) => {
    if (err) {
        console.error('Gagal sambung database: ' + err.stack);
        return;
    }
    console.log('Berjaya sambung ke MySQL Database!');
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