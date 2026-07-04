import { Link } from "react-router-dom";

export default function NotFound({ isUserLoged, setIsUserLoged }) {
  return (
    <div className="container spad" style={{ textAlign: "center", padding: "120px 0" }}>
      <h1 style={{ fontSize: "120px", fontWeight: "900", color: "#e53637", lineHeight: 1, marginBottom: "20px" }}>404</h1>
      <h3 style={{ fontWeight: "700", marginBottom: "15px" }}>Page Not Found</h3>
      <p style={{ maxWidth: "480px", margin: "0 auto 30px" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="site-btn">
        Go Back Home
      </Link>
    </div>
  );
}