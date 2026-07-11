const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

let lastScannedUID = null;

const db = new sqlite3.Database('./acessos_v2.sqlite', (err) => {
    if (err) console.error('Erro na BD:', err.message);
    else {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            uid TEXT,
            role TEXT,
            department TEXT,
            valid_until DATETIME,
            is_blocked BOOLEAN DEFAULT 0,
            is_deleted BOOLEAN DEFAULT 0,
            hash_esp32 TEXT
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS access_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT,
            nome TEXT,
            department TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            success INTEGER,
            method TEXT
        )`);
    }
});

// 1. Endpoint principal consumido pelo ESP32
app.post('/api/check-access', (req, res) => {
    const { uid, method } = req.body;

    /* [REMOVIDO - SENSOR REED SWITCH] Se for um alarme físico
    if (method === 'ALARME - INTRUSÃO FÍSICA') {
        db.run('INSERT INTO access_logs (uid, nome, department, success, method) VALUES (?, ?, ?, ?, ?)', 
            ['N/A', 'DESCONHECIDO', 'N/A', 0, method]);
        return res.json({ access: false });
    }
    */

    db.get('SELECT * FROM users WHERE uid = ? AND is_deleted = 0', [uid], (err, user) => {
        let success = 0;
        let logMethod = 'RFID';
        let isAuthorized = false;

        if (user) {
            const isExpired = user.valid_until && new Date() > new Date(user.valid_until);
            if (user.is_blocked) {
                logMethod = 'CARTÃO BLOQUEADO';
            } else if (isExpired) {
                logMethod = 'ACESSO EXPIRADO';
            } else {
                success = 1;
                isAuthorized = true;
            }
            db.run('INSERT INTO access_logs (uid, nome, department, success, method) VALUES (?, ?, ?, ?, ?)', 
                [uid, user.nome, user.department, success, logMethod]);
        } else {
            lastScannedUID = uid;
            logMethod = 'CARTÃO DESCONHECIDO';
            db.run('INSERT INTO access_logs (uid, nome, department, success, method) VALUES (?, ?, ?, ?, ?)', 
                [uid, 'Não Registado', '—', 0, logMethod]);
        }
        res.json({ access: isAuthorized });
    });
});

app.get('/api/last-scanned', (req, res) => res.json({ uid: lastScannedUID }));
app.delete('/api/last-scanned', (req, res) => { lastScannedUID = null; res.json({ success: true }); });

app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users ORDER BY is_deleted ASC, id DESC', [], (err, rows) => res.json(rows || []));
});

app.post('/api/users', (req, res) => {
    const { nome, role, department, valid_until } = req.body;
    db.run('INSERT INTO users (nome, role, department, valid_until) VALUES (?, ?, ?, ?)', 
        [nome, role, department, valid_until], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, success: true });
    });
});

app.put('/api/users/:id/card', (req, res) => {
    const { uid } = req.body;
    const hash_esp32 = crypto.createHash('sha256').update(uid).digest('hex').toUpperCase();
    db.run('UPDATE users SET uid = ?, hash_esp32 = ? WHERE id = ?', [uid, hash_esp32, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.put('/api/users/:id/block', (req, res) => {
    db.run('UPDATE users SET is_blocked = ? WHERE id = ?', [req.body.is_blocked ? 1 : 0, req.params.id], () => res.json({ success: true }));
});

app.delete('/api/users/:id', (req, res) => {
    db.run(`UPDATE users SET is_deleted = 1, uid = uid || '-REMOVIDO-' || id WHERE id = ?`, [req.params.id], () => res.json({ success: true }));
});

app.get('/api/access_logs', (req, res) => {
    db.all('SELECT * FROM access_logs ORDER BY timestamp DESC LIMIT 100', [], (err, rows) => res.json(rows || []));
});

app.listen(3000, () => console.log(`Backend ativo na porta 3000`));