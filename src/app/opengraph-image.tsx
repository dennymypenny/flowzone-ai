import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FlowZone AI — Done-For-You Business Automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top indigo accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "#4F46E5",
            display: "flex",
          }}
        />

        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          {/* Node dots icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#4F46E5",
                display: "flex",
              }}
            />
            <div
              style={{
                width: "32px",
                height: "2px",
                background: "#C7D2FE",
                display: "flex",
              }}
            />
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#4F46E5",
                opacity: 0.7,
                display: "flex",
              }}
            />
            <div
              style={{
                width: "32px",
                height: "2px",
                background: "#C7D2FE",
                display: "flex",
              }}
            />
            <div
              style={{
                width: "13px",
                height: "13px",
                borderRadius: "50%",
                background: "#4F46E5",
                opacity: 0.4,
                display: "flex",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
            FlowZone{" "}
            <span style={{ color: "#4F46E5" }}>AI</span>
          </span>
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "900",
            color: "#111827",
            lineHeight: 1.05,
            margin: "0 0 28px",
            letterSpacing: "-2px",
            maxWidth: "900px",
          }}
        >
          Automate Your Business{" "}
          <span style={{ color: "#4F46E5" }}>in 48 Hours.</span>
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: "26px",
            color: "#6B7280",
            margin: "0 0 48px",
            lineHeight: 1.4,
            maxWidth: "700px",
          }}
        >
          Done-for-you AI workflow systems. Free audit delivered in 24 hours.
        </p>

        {/* CTA pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#4F46E5",
            color: "white",
            borderRadius: "12px",
            padding: "16px 32px",
            fontSize: "22px",
            fontWeight: "700",
          }}
        >
          Get Your Free AI Audit →
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            right: "100px",
            fontSize: "20px",
            color: "#9CA3AF",
            fontWeight: "600",
            display: "flex",
          }}
        >
          flowzone.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
