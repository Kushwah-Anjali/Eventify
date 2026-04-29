import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterModal from "./RegisterModal";
import "../styles/Events.css";
const Base_url = process.env.REACT_APP_API_URL;
export default function EventsCard({ event }) {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const handleRegisterClick = () => setShowRegisterModal(true);
  const handleHistoryClick = () =>
    navigate("/event-history", { state: { eventId: event.id } });
  const handleCloseModal = () => setShowRegisterModal(false);
  const handleMapClick = () => {
    navigate("/map", {
      state: {
        lat: event.latitude,
        lng: event.longitude,
        venue: event.venue,
      },
    });
  };

  return (
    <div
      className={`card border-0 shadow-sm overflow-hidden position-relative event-card ${
        event.isPastEvent ? "past-event" : ""
      }`}
    >
      <div className="position-relative overflow-hidden">
        {event.image ? (
          <img
            src={`${Base_url}/events/${event.image}`}
            alt={event.title || "Event"}
            className={`card-img-top img-fluid event-img ${
              event.isPastEvent ? "img-dim" : ""
            }`}
          />
        ) : (
          <div className="bg-light d-flex align-items-center justify-content-center event-placeholder">
            <span className="text-muted fw-semibold">Image Coming Soon</span>
          </div>
        )}

        <div className="position-absolute bottom-0 start-0 w-100 px-3 pb-3 d-flex justify-content-between align-items-center text-white z-3">
          <h5 className="fw-bold mb-0 text-shadow">
            {event.title || "Event Title"}
          </h5>

          {event.isPastEvent ? (
            <button
              className="btn btn-gradient-circle border-0"
              onClick={handleHistoryClick}
              title="Event Ended"
            >
              <i className="bi bi-clock-history fs-5 text-dark"></i>
            </button>
          ) : (
            <button
              className="btn btn-gradient-circle border-0"
              onClick={handleRegisterClick}
              title="Register"
            >
              <i className="bi bi-pencil-square fs-5"></i>
            </button>
          )}
        </div>

        {/* Date Badge */}
        <div className="event-date-badge d-flex justify-content-center align-items-center">
          <span>{event.date || "Date TBD"}</span>
        </div>

        <div className="event-hover position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white text-center px-3">
          <small>
            {event.isPastEvent
              ? "Event Ended"
              : event.description || "No description available"}
          </small>
        </div>
      </div>

      <div
        className="location-chip d-flex align-items-center position-absolute top-0 end-0 m-2"
        onClick={handleMapClick}
      >
        <div className="icon-base d-flex justify-content-center align-items-center">
          <i className="bi bi-geo-alt-fill fs-6"></i>
        </div>

        <span className="expand-info text-white small ms-2">{event.venue}</span>
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
