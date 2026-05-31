const express = require('express');
const cors = require('cors');
app.use(cors()); // Ini akan benarkan mana-mana asal (origin) untuk request data
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 1. Sambungkan ke MySQL Database kau
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Username MySQL kau
    password: 'Hakim.061298', // ⚠️ TUKAR KEPADA PASSWORD MYSQL KAU
    database: 'mvp_barber'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal sambung database: ' + err.stack);
        return;
    }
    console.log('Berjaya sambung ke MySQL Database!');
});

// 2. Laluan (Route) untuk terima data dari borang HTML
app.post('/api/booking', (req, res) => {
    const { nama_pelanggan, no_telefon, barber_id, servis_id, tarikh, slot_masa } = req.body;

    const query = `INSERT INTO booking (nama_pelanggan, no_telefon, barber_id, servis_id, tarikh, slot_masa) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [nama_pelanggan, no_telefon, barber_id, servis_id, tarikh, slot_masa], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Gagal simpan tempahan' });
        }
        res.json({ success: true, message: 'Tempahan berjaya disimpan!' });
    });
});

// Run server kat port 3000

// 3. Laluan (Route) untuk Admin ambil semua senarai booking
app.get('/api/admin/bookings', (req, res) => {
    const query = `
        SELECT b.id, b.nama_pelanggan, b.no_telefon, br.nama AS nama_barber, 
               s.nama_servis, b.tarikh, b.slot_masa, b.status_booking
        FROM booking b
        JOIN barber br ON b.barber_id = br.id
        JOIN servis s ON b.servis_id = s.id
        ORDER BY b.tarikh DESC, b.slot_masa DESC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Gagal ambil data' });
        }
        res.json(results);
    });
});

// Tukar bahagian app.listen kepada ini
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server backend berjalan di port ${PORT}`);
});