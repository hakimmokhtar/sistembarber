const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname)); 
// Baris ni suruh Express cari fail (macam admin.html) dalam folder utama projek kau.
app.use(cors()); 
app.use(bodyParser.json());


// Ganti kod db pool kau dengan URL dari Railway tadi
const db = mysql.createPool('mysql://root:zPHrkTMEdRxBGHtsJyBuwtmxLpEkEDpw@zephyr.proxy.rlwy.net:12817/railway');

// Test sambungan
db.getConnection((err, conn) => {
    if (err) {
        console.error("❌ RAILWAY GAGAL: ", err.message);
    } else {
        console.log("✅ BERJAYA SAMBUNG KE RAILWAY!");
        conn.release();
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

app.get('/api/admin/bookings', (req, res) => {
    // Pastikan "FROM bookings" bukan nama table lama
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
