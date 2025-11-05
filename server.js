const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DEMO_USER = {
    username: 'admin',
    password: 'password123'
};


function verifyUser(username, password, callback) {
    console.log("Memverifikasi user...");

    setTimeout(() => {
        if (username === DEMO_USER.username && password === DEMO_USER.password) {
            callback(null, username); // sukses → kirim data username
        } else {
            callback("Username atau password salah!"); // gagal → kirim error
        }
    }, 1000);
}

// =========================
// 2️⃣ PROMISE FUNCTION
// =========================
function generateKey(username) {
    return new Promise((resolve, reject) => {
        console.log("Membuat key...");

        setTimeout(() => {
            if (username === "admin") {
                const key = "KEY-" + Math.random().toString(36).substr(2, 6).toUpperCase();
                resolve(key);
            } else {
                reject("Gagal membuat key");
            }
        }, 1000);
    });
}

// =========================
// 3️⃣ ROUTE LOGIN (gunakan callback & promise)
// =========================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib di isi' });
    }

    // Panggil callback verifyUser
    verifyUser(username, password, async (err, user) => {
        if (err) {
            return res.status(401).json({ message: err });
        }

        try {
            // Panggil fungsi promise generateKey
            const key = await generateKey(user);

            // Buat laporan penghasilan (seperti di petunjuk soal)
            const report = {
                username: user,
                key: key,
                income: "Rp 5.000.000"
            };

            res.json({ message: 'Login berhasil', report });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    });
});

// =========================
// 4️⃣ ROUTE UTAMA
// =========================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =========================
// 5️⃣ MENJALANKAN SERVER
// =========================
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
