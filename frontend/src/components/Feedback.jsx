import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import "../styles/Feedback.css";
import { FaComments, FaStar } from "react-icons/fa";

const feedbackData = [
  {
    text: "Amazing experience! The team managed everything smoothly and the event went beyond expectations.",
    name: "Rohit Sharma",
    role: "Corporate Client",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  {
    text: "Very professional and supportive. I loved how they customized everything for our college fest.",
    name: "Priya Mehta",
    role: "College Event",
    gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
  },
  {
    text: "Top-notch service and great coordination. Highly recommend for any private function.",
    name: "Arjun Verma",
    role: "Private Event",
    gradient: "linear-gradient(135deg, #0ea5e9, #6366f1)",
  },
];

// Get initials from full name
const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export default function Feedback() {
  return (
    <section
      id="feedback"
      className="py-5 text-center text-white position-relative"
      style={{ background: "#0d0d4d" }}
    >
      <div className="container">
        <h2 className="fw-bold text-uppercase mb-3 display-6 text-white d-flex justify-content-center align-items-center gap-2">
          <FaComments className="me-2" />
          What Our Customers Say
        </h2>

        <p className="text-light opacity-75 mb-5">
          Real experiences from people who trusted us with their events
        </p>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {feedbackData.map((f, i) => (
            <SwiperSlide key={i}>
              <div className="card border-0 shadow feedback-card mx-2">
                <div className="card-body text-start">

                  {/* Stars */}
                  <div className="mb-3 d-flex gap-1">
                    {[...Array(5)].map((_, s) => (
                      <FaStar key={s} style={{ color: "#f59e0b", fontSize: "0.8rem" }} />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="fst-italic text-dark mb-4">{f.text}</p>

                  {/* Avatar + name */}
                  <div className="d-flex align-items-center gap-3">

                    {/* Initials Avatar */}
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        background: f.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        fontWeight: "800",
                        color: "#fff",
                        flexShrink: 0,
                        letterSpacing: "0.5px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {getInitials(f.name)}
                    </div>

                    <div>
                      <h6 className="mb-0 fw-bold text-dark">{f.name}</h6>
                      <small className="text-primary fw-semibold">{f.role}</small>
                    </div>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}