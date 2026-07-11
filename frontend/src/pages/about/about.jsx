import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

export default function About({ isUserLoged, setIsUserLoged }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  const teamMembers = [
    { name: "Kishore Kumar", role: "Full Stack Developer", img: "/img/about/team-1.png" },
  ];

  const counterItems = [
    { value: "102", label: "Our Clients" },
    { value: "30", label: "Total Categories" },
    { value: "102", label: "In Country" },
    { value: "98%", label: "Happy Customers" }
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Breadcrumb Header */}
      <section className="breadcrumb-option" style={{ padding: "30px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>About Us</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <span>About Us</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "50px" }}>
              <div className="about__pic">
                <img src="/img/about/about-us.jpg" alt="About us banner" style={{ width: "100%", height: "450px", objectFit: "cover" }} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="about__item" style={{ marginBottom: "30px" }}>
                <h4 style={{ fontWeight: "700", marginBottom: "15px" }}>Who We Are ?</h4>
                <p>Contextual advertising programs sometimes have strict policies that need to be adhered to. Let’s take Google as an example.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="about__item" style={{ marginBottom: "30px" }}>
                <h4 style={{ fontWeight: "700", marginBottom: "15px" }}>What We Do ?</h4>
                <p>In this digital generation where information can be easily obtained within seconds, business cards still have retained their importance.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6">
              <div className="about__item" style={{ marginBottom: "30px" }}>
                <h4 style={{ fontWeight: "700", marginBottom: "15px" }}>Why Choose Us</h4>
                <p>A two or three storey house is the ideal way to maximise the piece of earth on which our home sits, but for older or infirm people.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial" style={{ background: "var(--bg-secondary)", padding: "80px 0" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" style={{ paddingRight: "40px" }}>
              <div className="testimonial__text" style={{ padding: "40px 0" }}>
                <span className="icon_quotations" style={{ fontSize: "60px", color: "#e53637", display: "block", marginBottom: "20px" }}></span>
                <p style={{ fontStyle: "italic", fontSize: "18px", lineHeight: "30px", color: "var(--text-primary)" }}>
                  “Going out after work? Take your butane curling iron with you to the office, heat it up, style your hair before you leave the office and you won’t have to make a trip back home.”
                </p>
                <div className="testimonial__author" style={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
                  <img src="/img/about/testimonial-author.jpg" alt="Author" style={{ borderRadius: "50%", width: "60px", height: "60px", marginRight: "20px" }} />
                  <div>
                    <h5 style={{ fontWeight: "700", marginBottom: "5px" }}>Augusta Schultz</h5>
                    <p style={{ marginBottom: 0, fontSize: "14px", color: "var(--text-muted)" }}>Fashion Design</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="/img/about/testimonial-pic.jpg" alt="Testimonial background" style={{ width: "100%", height: "400px", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="counter spad" style={{ padding: "60px 0", borderBottom: "1px solid var(--bg-border)" }}>
        <div className="container">
          <div className="row">
            {counterItems.map((item, idx) => (
              <div key={idx} className="col-lg-3 col-md-6 col-sm-6 text-center">
                <div className="counter__item" style={{ padding: "20px 0" }}>
                  <h2 style={{ fontSize: "48px", fontWeight: "700", color: "var(--text-secondary)" }}>{item.value}</h2>
                  <span style={{ fontSize: "14px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span>Our Team</span>
                <h2>Meet Our Team</h2>
              </div>
            </div>
          </div>
          <div className="row" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {teamMembers.map((member, idx) => (
              <div key={idx} className="col-lg-3 col-md-6 col-sm-6 text-center">
                <div className="team__item" style={{ marginBottom: "30px" }}>
                  <img src={member.img} alt={member.name} style={{ width: "100%", marginBottom: "20px" }} />
                  <h4 style={{ fontWeight: "700", marginBottom: "5px" }}>{member.name}</h4>
                  <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}