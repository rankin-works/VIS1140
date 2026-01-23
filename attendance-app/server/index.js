import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Database setup - store in /data for Docker volume persistence
const dbPath = process.env.DB_PATH || path.join(__dirname, 'attendance.db');
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_name, date)
  )
`);

app.use(cors());
app.use(express.json());

// Get all attendance records
app.get('/api/attendance', (req, res) => {
  try {
    const rows = db.prepare('SELECT student_name, date, status FROM attendance').all();
    // Transform to { date: { student: status } } format
    const attendance = {};
    for (const row of rows) {
      if (!attendance[row.date]) {
        attendance[row.date] = {};
      }
      attendance[row.date][row.student_name] = row.status;
    }
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance for a specific date
app.get('/api/attendance/:date', (req, res) => {
  try {
    const rows = db.prepare('SELECT student_name, status FROM attendance WHERE date = ?').all(req.params.date);
    const attendance = {};
    for (const row of rows) {
      attendance[row.student_name] = row.status;
    }
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set attendance for a student on a date
app.post('/api/attendance', (req, res) => {
  const { student_name, date, status } = req.body;

  if (!student_name || !date || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO attendance (student_name, date, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(student_name, date) DO UPDATE SET
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(student_name, date, status);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk set attendance for a date (mark all present)
app.post('/api/attendance/bulk', (req, res) => {
  const { date, records } = req.body;

  if (!date || !records) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO attendance (student_name, date, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(student_name, date) DO UPDATE SET
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    `);

    const insertMany = db.transaction((records) => {
      for (const [student_name, status] of Object.entries(records)) {
        stmt.run(student_name, date, status);
      }
    });

    insertMany(records);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset attendance for a date
app.delete('/api/attendance/:date', (req, res) => {
  try {
    db.prepare('DELETE FROM attendance WHERE date = ?').run(req.params.date);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Attendance API running on port ${PORT}`);
});
