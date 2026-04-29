import React, { useState, useEffect, useMemo } from "react";
import EventsCard from "./EventsCard";
import dayjs from "dayjs";
import "../styles/Events.css";
import axios from "axios";
import { motion } from "framer-motion";
const Base_url = process.env.REACT_APP_API_URL;
const isMobile = window.innerWidth <= 768;
export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(`${Base_url}/api/events`);
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }
    fetchEvents();
  }, []);
  const today = dayjs().startOf("day");
  const formattedEvents = events.map((e) => {
    const dateObj = dayjs(e.date).startOf("day");

    return {
      ...e,
      dateObj,
      date: dateObj.format("D MMM"),
      isPastEvent: dateObj.isBefore(today),
    };
  });
  const upcoming = formattedEvents.filter((e) => e.dateObj.isAfter(today));
  const todayEvents = formattedEvents.filter((e) => e.dateObj.isSame(today));
  const past = formattedEvents.filter((e) => e.dateObj.isBefore(today));
  let filteredEvents;
  switch (filter) {
    case "upcoming":
      filteredEvents = upcoming;
      break;
    case "today":
      filteredEvents = todayEvents;
      break;
    case "past":
      filteredEvents = past;
      break;
    default:
      filteredEvents = formattedEvents;
  }
  return (
    <section className="events-section py-5" id="event-section">
      <div className="container">
        <div className="events-filter-section">
          <h2 className="filter-heading mb-4">Filter Your Events</h2>
          <div className="filter-dropdown d-md-none mb-4">
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="past">Past</option>
              <option value="all">Show All</option>
            </select>
          </div>

          <div className="d-none d-md-flex justify-content-center gap-3 flex-wrap">
            {["upcoming", "today", "past", "all"].map((item) => (
              <button
                key={item}
                className={`filter-btn ${filter === item ? "active" : ""}`}
                onClick={() => setFilter(item)}
              >
                {item === "all"
                  ? "Show All"
                  : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="row g-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="col-md-6 col-lg-4 d-flex"
                initial={{ opacity: 0, y: isMobile ? 30 : 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: isMobile ? 0.9 : 1.2,
                  delay: index * (isMobile ? 0.1 : 0.2),
                  ease: "easeOut",
                }}
              >
                <EventsCard event={event} />
              </motion.div>
            ))
          ) : (
            <p className="text-center text-white">No events found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
