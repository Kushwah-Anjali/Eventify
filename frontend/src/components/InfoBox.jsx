import React from "react";

// Supports Bootstrap icons (string) & React Icon components (JSX)
export default function InfoBox({ title, value, icon, isMissing }) {
  return (
    <div className="col-sm-6 col-md-4 mb-3">
      <div className="card shadow-sm h-100 p-3 d-flex align-items-center text-center">
        {icon &&
          (typeof icon === "string" ? (
            <i className={`${icon} fs-2 mb-2`}></i>
          ) : (
            <div className="fs-2 mb-2">{icon}</div>
          ))}

        <div className="small">{title}</div>
        <div className={isMissing ? "text-danger fst-italic" : "fw-bold"}>
          {value}
        </div>
      </div>
    </div>
  );
}
