# Build stage for frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev for building)
RUN npm install

# Copy source files
COPY . .

# Build the frontend
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy server code
COPY server ./server

# Copy built frontend from build stage
COPY --from=frontend-build /app/dist ./dist

# Create data directory for SQLite database
RUN mkdir -p /data

# Update server to serve static files
COPY <<EOF ./server/production.js
import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 80;

// Database setup - store in /data for Docker volume persistence
const dbPath = process.env.DB_PATH || '/data/attendance.db';
const db = new Database(dbPath);

// Initialize database
db.exec(\`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_name, date)
  )
\`);

app.use(express.json());

// API routes
app.get('/api/attendance', (req, res) => {
  try {
    const rows = db.prepare('SELECT student_name, date, status FROM attendance').all();
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

app.post('/api/attendance', (req, res) => {
  const { student_name, date, status } = req.body;
  if (!student_name || !date || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const stmt = db.prepare(\`
      INSERT INTO attendance (student_name, date, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(student_name, date) DO UPDATE SET
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    \`);
    stmt.run(student_name, date, status);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance/bulk', (req, res) => {
  const { date, records } = req.body;
  if (!date || !records) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const stmt = db.prepare(\`
      INSERT INTO attendance (student_name, date, status, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(student_name, date) DO UPDATE SET
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    \`);
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

app.delete('/api/attendance/:date', (req, res) => {
  try {
    db.prepare('DELETE FROM attendance WHERE date = ?').run(req.params.date);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Attendance app running on port \${PORT}\`);
});
EOF

EXPOSE 80

# Use volume for persistent data
VOLUME ["/data"]

CMD ["node", "server/production.js"]
