import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

const students = [
  'Zaria Coleman',
  'Kate Flais',
  'Rian Floyd',
  'Arielle Hancock',
  'Amare Hardrick',
  'Diamond Jones',
  "Larry O'Neal"
];

// Generate all Tuesdays and Thursdays from Jan 13, 2026 to May 7, 2026
// Excluding Spring Break: March 9-15, 2026
function generateClassDates() {
  const dates = [];
  const end = new Date(2026, 4, 7); // May 7, 2026
  const springBreakStart = new Date(2026, 2, 9);
  const springBreakEnd = new Date(2026, 2, 15);

  let current = new Date(2026, 0, 13); // Jan 13, 2026 (Tuesday)

  while (current <= end) {
    const day = current.getDay();
    const isSpringBreak = current >= springBreakStart && current <= springBreakEnd;

    if ((day === 2 || day === 4) && !isSpringBreak) { // Tuesday or Thursday
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

const classDates = generateClassDates();

function formatDate(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
}

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

export default function AttendanceTracker() {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [attendanceByDate, setAttendanceByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedDate = classDates[selectedDateIndex];
  const dateKey = formatDateKey(selectedDate);
  const currentAttendance = attendanceByDate[dateKey] || {};

  // Load all attendance data on mount
  useEffect(() => {
    fetch(`${API_URL}/attendance`)
      .then(res => res.json())
      .then(data => {
        setAttendanceByDate(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load attendance:', err);
        setLoading(false);
      });
  }, []);

  const markAttendance = async (student, status) => {
    // Optimistic update
    setAttendanceByDate(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [student]: status
      }
    }));

    // Save to server
    try {
      await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_name: student, date: dateKey, status })
      });
    } catch (err) {
      console.error('Failed to save attendance:', err);
    }
  };

  const markAllPresent = async () => {
    const records = Object.fromEntries(students.map(s => [s, 'present']));

    // Optimistic update
    setAttendanceByDate(prev => ({
      ...prev,
      [dateKey]: records
    }));

    // Save to server
    setSaving(true);
    try {
      await fetch(`${API_URL}/attendance/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateKey, records })
      });
    } catch (err) {
      console.error('Failed to save attendance:', err);
    }
    setSaving(false);
  };

  const resetDay = async () => {
    // Optimistic update
    setAttendanceByDate(prev => ({
      ...prev,
      [dateKey]: {}
    }));

    // Delete from server
    setSaving(true);
    try {
      await fetch(`${API_URL}/attendance/${dateKey}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to reset attendance:', err);
    }
    setSaving(false);
  };

  const presentCount = Object.values(currentAttendance).filter(v => v === 'present').length;
  const absentCount = Object.values(currentAttendance).filter(v => v === 'absent').length;

  const hasAttendance = (date) => {
    const key = formatDateKey(date);
    return attendanceByDate[key] && Object.keys(attendanceByDate[key]).length > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-4 flex items-center justify-center">
        <div className="text-gray-400">Loading attendance data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Attendance</h1>
        <p className="text-gray-400 text-sm mb-4">26.SP.VIS.1140</p>

        {/* Date selector */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 block mb-2">Class Date</label>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setSelectedDateIndex(i => Math.max(0, i - 1))}
              disabled={selectedDateIndex === 0}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:hover:bg-gray-700 rounded transition"
            >
              ←
            </button>
            <select
              value={selectedDateIndex}
              onChange={(e) => setSelectedDateIndex(Number(e.target.value))}
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-center"
            >
              {classDates.map((date, idx) => (
                <option key={idx} value={idx}>
                  {formatDate(date)} {hasAttendance(date) ? '✓' : ''}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSelectedDateIndex(i => Math.min(classDates.length - 1, i + 1))}
              disabled={selectedDateIndex === classDates.length - 1}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:hover:bg-gray-700 rounded transition"
            >
              →
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Class {selectedDateIndex + 1} of {classDates.length}
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={markAllPresent}
            disabled={saving}
            className="px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded text-sm transition"
          >
            {saving ? 'Saving...' : 'All Present'}
          </button>
          <button
            onClick={resetDay}
            disabled={saving}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded text-sm transition"
          >
            Reset Day
          </button>
        </div>

        {/* Student list */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {students.map((student, idx) => (
            <div
              key={student}
              className={`flex items-center justify-between p-3 ${
                idx !== students.length - 1 ? 'border-b border-gray-700' : ''
              }`}
            >
              <span className="font-medium">{student}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => markAttendance(student, 'present')}
                  className={`px-3 py-1 rounded text-sm transition ${
                    currentAttendance[student] === 'present'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => markAttendance(student, 'absent')}
                  className={`px-3 py-1 rounded text-sm transition ${
                    currentAttendance[student] === 'absent'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Day summary */}
        <div className="mt-4 flex gap-4 text-sm text-gray-400">
          <span>Present: <span className="text-green-400 font-medium">{presentCount}</span></span>
          <span>Absent: <span className="text-red-400 font-medium">{absentCount}</span></span>
          <span>Unmarked: <span className="text-gray-300 font-medium">{students.length - presentCount - absentCount}</span></span>
        </div>
      </div>
    </div>
  );
}
