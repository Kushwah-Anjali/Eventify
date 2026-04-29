import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentUploadModal from "../components/DocumentUploadModal";
import { getAddressFromLatLng } from "../services/locationService";
import {
  FaUpload,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaMoneyBill,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import InfoBox from "../components/InfoBox";
import { fetchEvent } from "../services/fetchEventService";
import "../styles/History.css";

function RegisterDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email, eventId, registered_at, status } = location.state || {};
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchEvent(eventId);
        setEvent(data);
        if (!data.venue && data.latitude != null && data.longitude != null) {
          try {
            const addr = await getAddressFromLatLng(data.latitude, data.longitude);
            setEvent((prev) => ({ ...prev, venue: addr }));
          } catch (err) {
            console.error("Address fetch failed", err);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId]);

  const formatEventDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="history-wrapper dark-page-bg">
      <div className="container py-5">
        <div className="card shadow-lg rounded-4 overflow-hidden">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-info d-flex align-items-center gap-2 mb-0">
                <FaUser />
                Registration Summary
              </h3>
              <button
                className="btn btn-outline-info icon-btn rounded-3"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft size={18} />
              </button>
            </div>

            <div className="row g-3 mb-4">
              <InfoBox title="Full Name"     value={name}  icon={<FaUser className="text-info" />} />
              <InfoBox title="Email"         value={email} icon={<FaEnvelope className="text-info" />} />
              <InfoBox
                title="Registered On"
                value={registered_at ? new Date(registered_at).toLocaleDateString() : "Not available"}
                icon={<FaCalendarAlt className="text-info" />}
              />
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-info" role="status" />
              </div>
            ) : event ? (
              <div className="card shadow-lg rounded-4 overflow-hidden">
                <div className="row g-0 flex-column flex-md-row">

                  <div className="col-md-4">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="img-fluid w-100 h-100 object-fit-cover"
                        style={{ minHeight: "180px", maxHeight: "250px" }}
                      />
                    )}
                  </div>

                  <div className="col-md-8 d-flex align-items-stretch">
                    <div className="p-3 p-md-4 w-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                          <div>
                            <h4 className="fw-bold mb-2">{event.title}</h4>
                            <p className="text-secondary lh-base mb-3" style={{ fontSize: "0.95rem" }}>
                              {event.description}
                            </p>
                          </div>
                          <div className="text-md-end flex-shrink-0">
                            <button
                              className="btn btn-info text-light px-3 py-2 d-inline-flex align-items-center gap-2"
                              onClick={() => setShowUploadModal(true)}
                            >
                              <FaUpload /> Upload Docs
                            </button>
                          </div>
                        </div>

                        <hr className="my-3" style={{ borderColor: "rgba(255,255,255,0.15)" }} />

                        <div className="row gy-3">
                          <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                            <FaCalendarAlt className="text-info" />
                            <div>
                              <div className="small text-info">Event Date</div>
                              <div>{formatEventDate(event.date)}</div>
                            </div>
                          </div>

                          <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                            <FaMapMarkerAlt className="text-info" />
                            <div>
                              <div className="small text-info">Location</div>
                              <div>{event.venue}</div>
                            </div>
                          </div>

                          <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                            <FaUser className="text-info" />
                            <div>
                              <div className="small text-info">Hosted By</div>
                              <div>{event.author}</div>
                            </div>
                          </div>

                          <div className="col-12 col-sm-6 d-flex align-items-center gap-3">
                            <FaMoneyBill className="text-info" />
                            <div>
                              <div className="small text-info">Entry Fee</div>
                              <div>{event.fees || "Free"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="alert alert-warning text-center mt-4">
                Event details not found.
              </div>
            )}

          </div>

          <div className="card-footer text-center py-3">
            <small className="text-info">
              © {new Date().getFullYear()} Eventify
            </small>
          </div>

        </div>

        {showUploadModal && (
          <DocumentUploadModal
            show={showUploadModal}
            handleClose={() => setShowUploadModal(false)}
            email={email}
            event_id={eventId}
            requiredDocs={event ? event.required_documents : []}
          />
        )}

      </div>
    </div>
  );
}

export default RegisterDetails;