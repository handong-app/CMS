import React from "react";

export interface TopBannerProps {
  title: string;
  subtitle: string;
  image: string;
}

const TopBanner: React.FC<TopBannerProps> = ({ title, subtitle, image }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 200,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "#222",
      }}
    >
      <img
        src={image}
        alt="banner"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          opacity: 0.6,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, padding: "0 2rem" }}>
        <h1
          style={{
            color: "#fff",
            margin: 0,
            fontSize: "2rem",
            fontWeight: 700,
          }}
        >
          {title}
        </h1>
        <h2
          style={{
            color: "#fff",
            margin: 0,
            fontSize: "1.2rem",
            fontWeight: 400,
          }}
        >
          {subtitle}
        </h2>
      </div>
    </div>
  );
};

export default TopBanner;
