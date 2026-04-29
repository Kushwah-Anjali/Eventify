import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InfoBox from "../components/InfoBox";
import MediaHistory from "../components/MediaHistory";
import { fetchEventHistory } from "../services/eventHistoryService";
import { fetchEvent } from "../services/fetchEventService";
import {
  FaUsers,
  FaRegClock,
  FaIdBadge,
  FaMoneyBill,
  FaWallet,
  FaMapMarkerAlt,
  FaPhone,
  FaArrowLeft,
  FaCalendarAlt,
} from "react-icons/fa";

import "../styles/History.css";

export default function EventHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = location.state || {};
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const NOT_RECORDED = "Not recorded by organizer";
  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchEvent(eventId);
        const history = await fetchEventHistory(eventId);
        setEvent({ ...data, history });
      } catch (err) {
        setError(err.message || "Failed to load event.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId]);

  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          });
        },
        { threshold: 0.15 }
      );
      document
        .querySelectorAll(".fade-in")
        .forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 50);
    return () => clearTimeout(timer);
  }, [event]);

  const formatEventDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  if (loading)
    return (
      <div className="history-wrapper dark-page-bg d-flex align-items-center justify-content-center">
        <div className="spinner-border text-info" role="status" />
      </div>
    );

  if (error)
    return (
      <div className="history-wrapper dark-page-bg d-flex align-items-center justify-content-center">
        <div className="text-danger text-center">Error: {error}</div>
      </div>
    );

  if (!event)
    return (
      <div className="history-wrapper dark-page-bg d-flex align-items-center justify-content-center">
        <div className="text-center text-white">
          <h3>No Event Data Found</h3>
          <button
            className="btn btn-outline-light mt-3"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const sections = [
    event.history?.summary && {
      title: "Summary",
      content: event.history.summary,
    },
    event.history?.long_summary && {
      title: "Long Summary",
      content: event.history.long_summary,
    },
    event.history?.highlights && {
      title: "Highlights",
      content: event.history.highlights,
    },
    event.history?.lessons && {
      title: "Lessons Learned",
      content: event.history.lessons,
    },
  ].filter(Boolean);

  const media = [
    ...(event.history?.photos || []),
    ...(event.history?.videos || []),
  ];

  return (
    <div className="history-wrapper dark-page-bg">
      <div className="container py-5">
        <div className="card shadow-lg rounded-4 overflow-hidden">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-info d-flex align-items-center gap-2 mb-0">
                <FaCalendarAlt />
                Event Report
              </h3>
              <button
                className="btn btn-outline-info icon-btn rounded-3"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft size={18} />
              </button>
            </div>

            <div className="row g-3 mb-4">
         <InfoBox
  title="Attendees"
  value={event.history?.attendees_count ?? NOT_RECORDED}
  isMissing={event.history?.attendees_count == null}
  icon={<FaUsers className="text-info" />}
/>

<InfoBox
  title="Guests"
  value={event.history?.guests ?? NOT_RECORDED}
  isMissing={event.history?.guests == null}
  icon={<FaIdBadge className="text-info" />}
/>

<InfoBox
  title="Budget Spent"
  value={event.history?.budget_spent ?? NOT_RECORDED}
  isMissing={event.history?.budget_spent == null}
  icon={<FaMoneyBill className="text-info" />}
/>
              <InfoBox 
                title="Entry Fee"
                value={event.fees}
                icon={<FaWallet className="text-info" />}
              />
              <InfoBox
                title="Venue"
                value={event.venue}
                icon={<FaMapMarkerAlt className="text-info" />}
              />
              <InfoBox
                title="Contact"
                value={event.contact}
                icon={<FaPhone className="text-info" />}
              />
            </div>

            <div className="card shadow-lg rounded-4 overflow-hidden mb-4">
              <div className="row g-0 flex-column flex-md-row">
                <div className="col-md-4">
                  <img
                    src={event.image || "/placeholder.jpg"}
                    alt={event.title}
                    className="img-fluid w-100 h-100 object-fit-cover"
                    style={{ minHeight: "180px", maxHeight: "250px" }}
                  />
                </div>

                <div className="col-md-8 d-flex align-items-stretch">
                  <div className="p-3 p-md-4 w-100 d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="fw-bold mb-2">{event.title}</h4>
                      <p
                        className="text-secondary lh-base mb-3"
                        style={{ fontSize: "0.95rem" }}
                      >
                        {event.description}
                      </p>

                      <hr
                        className="my-3"
                        style={{ borderColor: "rgba(255,255,255,0.15)" }}
                      />

                      <div className="row gy-3">
                        <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                          <FaRegClock className="text-info" />
                          <div>
                            <div className="small text-info">Event Date</div>
                            <div>{formatEventDate(event.date)}</div>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                          <FaMapMarkerAlt className="text-info" />
                          <div>
                            <div className="small text-info">Venue</div>
                            <div>{event.venue}</div>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                          <FaPhone className="text-info" />
                          <div>
                            <div className="small text-info">Contact</div>
                            <div>{event.contact}</div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {sections.map((s, idx) => (
              <div key={idx} className="card p-3 p-md-4 mb-3 fade-in">
                <h5 className="fw-bold mb-2">{s.title}</h5>
                <p
                  className="mb-0 lh-lg"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {s.content}
                </p>
              </div>
            ))}

            {media.length > 0 && (
              <div className="card p-4 mt-3 fade-in">
                <h5 className="fw-bold mb-3">Gallery</h5>
                <MediaHistory media={media} thumbnailWidth={200} />
              </div>
            )}
          </div>

          <div className="card-footer text-center py-3">
            <small className="text-info">
              © {new Date().getFullYear()} Eventify
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
