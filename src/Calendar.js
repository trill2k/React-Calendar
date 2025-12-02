import React, { useState, useMemo } from "react";
import "./calendar.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getFirstDayOfWeek(year, monthIndex) {
  return new Date(year, monthIndex, 1).getDay();
}

// Convert YYYY-MM-DD to local date (no timezone shift)
function displayDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Format YYYY-MM-DD from year/month/day
function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

export default function Calendar({ events }) {
  const today = new Date();

  // Load current month/year by default
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");

  // 🔍 NEW: title-only search
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);

  // Build category options dynamically
  const categories = useMemo(() => {
    const s = new Set();
    events.forEach((e) => e.category && s.add(e.category));
    return ["All", ...Array.from(s)];
  }, [events]);

  // Build community group options dynamically
  const groups = useMemo(() => {
    const s = new Set();
    events.forEach((e) => e.communityGroup && s.add(e.communityGroup));
    return ["All", ...Array.from(s)];
  }, [events]);

  // 🔍 Filter events by category, group, AND title-only search
  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return events.filter((ev) => {
      const categoryOK =
        categoryFilter === "All" || ev.category === categoryFilter;

      const groupOK =
        groupFilter === "All" || ev.communityGroup === groupFilter;

      // Only search by TITLE
      const titleOK =
        term === "" || (ev.title && ev.title.toLowerCase().includes(term));

      return categoryOK && groupOK && titleOK;
    });
  }, [events, categoryFilter, groupFilter, searchTerm]);

  // Build calendar grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  // When clicking a day in the calendar
  const handleDayClick = (day) => {
    if (!day) return setSelectedDate(null);
    const key = formatDateKey(currentYear, currentMonth, day);
    setSelectedDate(key);
  };

  // Events for the selected date (after all filters/search)
  const selectedDayEvents = selectedDate
    ? filteredEvents.filter((ev) => ev.date === selectedDate)
    : [];

  return (
    <div className="calendar-layout">
      {/* LEFT: calendar */}
      <div className="calendar-main">
        <div className="controls">
          {/* Month + Today */}
          <div className="controls-left">
            <select
              className="control-select"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>

            <button
              className="btn btn-outline"
              onClick={() => {
                setCurrentYear(today.getFullYear());
                setCurrentMonth(today.getMonth());
              }}
            >
              Today
            </button>
          </div>

          {/* 🔍 Search + filters */}
          <div className="controls-center">
            {/* title-only search input */}
            <input
              type="text"
              className="search-input"
              placeholder="Search events by title…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="filters">
              <select
                className="control-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                className="control-select"
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
              >
                {groups.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Year navigation */}
          <div className="controls-right">
            <div className="year-nav">
              <button
                className="icon-btn"
                onClick={() => setCurrentYear((y) => y - 1)}
              >
                ‹
              </button>
              <span className="year-label">{currentYear}</span>
              <button
                className="icon-btn"
                onClick={() => setCurrentYear((y) => y + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="day-label">
              {d}
            </div>
          ))}

          {cells.map((day, i) => {
            const isToday =
              day &&
              today.getFullYear() === currentYear &&
              today.getMonth() === currentMonth &&
              today.getDate() === day;

            const dateKey = day
              ? formatDateKey(currentYear, currentMonth, day)
              : null;

            const dayEvents = dateKey
              ? filteredEvents.filter((e) => e.date === dateKey)
              : [];

            const hasEvents = dayEvents.length > 0;

            return (
              <div
                key={i}
                className={`cell ${!day ? "empty" : ""} ${
                  isToday ? "today" : ""
                }`}
                onClick={() => handleDayClick(day)}
              >
                {day && (
                  <div className="cell-header">
                    <span className="day-number">{day}</span>
                    {hasEvents && <span className="event-dot" />}
                  </div>
                )}

                {/* pills hidden on mobile via CSS */}
                {dayEvents.map((ev) => (
                  <div key={ev.id} className="event-pill">
                    <strong>{ev.title}</strong>
                    <span>
                      {ev.category}
                      {ev.communityGroup && ` • ${ev.communityGroup}`}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: event details panel */}
      <aside className="event-panel">
        {!selectedDate && (
          <p className="event-panel-placeholder">
            Select a day to view events that match your filters and search.
          </p>
        )}

        {selectedDate && (
          <>
            <h3 className="event-panel-title">{displayDate(selectedDate)}</h3>

            {selectedDayEvents.length === 0 ? (
              <p className="event-panel-placeholder">
                No events for this day with the current filters/search.
              </p>
            ) : (
              <ul className="event-list">
                {selectedDayEvents.map((ev) => (
                  <li key={ev.id} className="event-list-item">
                    <div className="event-list-name">{ev.title}</div>
                    <div className="event-list-meta">
                      <span>{ev.category}</span>
                      {ev.time && <span> • {ev.time}</span>}
                      {ev.communityGroup && <span> • {ev.communityGroup}</span>}
                    </div>

                    {ev.link && (
                      <a
                        href={ev.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="event-list-link"
                      >
                        Click here
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
