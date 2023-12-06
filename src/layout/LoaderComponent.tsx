import React from "react";

const LoaderComponent: React.FC = () => {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          fontSize: "24px",
        }}
      >
        Loading...
      </div>
    </>
  );
};

export default LoaderComponent;
