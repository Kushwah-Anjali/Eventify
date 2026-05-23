import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterModal from "./RegisterModal";
import "../styles/EventCard.css";

const Base_url = process.env.REACT_APP_API_URL;

export default function EventsCard({ event }) {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const handleRegisterClick = () => setShowRegisterModal(true);
  const handleHistoryClick = () =>
    navigate("/event-history", { state: { eventId: event.id } });
  const handleCloseModal = () => setShowRegisterModal(false);
  const handleMapClick = (e) => {
    e.stopPropagation();
    navigate("/map", {
      state: { lat: event.latitude, lng: event.longitude, venue: event.venue },
    });
  };

  return (
    <div className={`ec-card ${event.isPastEvent ? "ec-past" : ""}`}>
      <div className="ec-img-wrap">
        {event.image ? (
          <img
            src={`${Base_url}/events/${event.image}`}
            alt={event.title || "Event"}
            className="ec-img"
          />
        ) : (
          <div className="ec-img-placeholder">
            <i className="bi bi-image fs-1 text-muted" />
            <span>No Image</span>
          </div>
        )}
        <div className="ec-img-gradient" />
        {event.isPastEvent && <div className="ec-ended-ribbon">Ended</div>}

        <div className="ec-date-pill">
          <i className="bi bi-calendar3 me-1" />
          {event.date || "TBD"}
        </div>
        <button
          className="ec-location-pill"
          onClick={handleMapClick}
          title="View on Map"
        >
          <i className="bi bi-geo-alt-fill" />
          <span className="ec-loc-label">{event.venue || "View Map"}</span>
        </button>
        <div className="ec-hover-overlay">
          <p className="ec-hover-desc">
            {event.isPastEvent
              ? "This event has ended. View the history below."
              : event.description || "No description available."}
          </p>
        </div>
      </div>

      <div className="ec-body">
        <div className="ec-meta-row">
          {event.category ? (
            <span className="ec-category">
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>
          ) : (
            <span />
          )}
          {event.isPastEvent ? (
            <button
              className="ec-action-btn ec-history-btn"
              onClick={handleHistoryClick}
            >
              <i className="bi bi-clock-history me-1" />
              History
            </button>
          ) : (
            <button
              className="ec-action-btn ec-register-btn"
              onClick={handleRegisterClick}
            >
              <i className="bi bi-pencil-square me-1" />
              Register
            </button>
          )}
        </div>

        <h5 className="ec-title">{event.title || "Event Title"}</h5>

        <div className="ec-footer"></div>
      </div>

      <RegisterModal
        key={showRegisterModal}
        show={showRegisterModal}
        handleClose={handleCloseModal}
        eventId={event.id}
      />
    </div>
  );
}
