import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

export default function Contact({ isUserLoged, setIsUserLoged }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent successfully. We will get back to you soon.`);
    setFormData({ name: "", email: "", message: "" });
  };

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
                <h4>Contact Us</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <span>Contact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="map" style={{ width: "100%", height: "450px", overflow: "hidden" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!11m18!1m12!1m3!1d117223.77912078696!2d-74.07764264627118!3d40.71732049090626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1602741517454!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Google Map NYC Location"
        />
      </div>

      {/* Contact Form & details */}
      <section className="contact spad">
        <div className="container">
          <div className="row">
            {/* Info details Column */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__text">
                <div className="section-title" style={{ textAlign: "left", marginBottom: "35px" }}>
                  <span>Information</span>
                  <h2>Contact Us</h2>
                  <p style={{ marginTop: "15px" }}>
                    As you might expect of a modern luxury label, we are committed to exceptional customer care. You can reach us via phone, email or visit one of our flagship boutiques.
                  </p>
                </div>
                <ul className="contact__widget">
                  <li>
                    <i className="fa fa-map-marker" />
                    <div>
                      <h4>America</h4>
                      <p>
                        195 E Parker Rd, New York, NY 10002, United States <br />
                        +1 212-965-0941
                      </p>
                    </div>
                  </li>
                  <li>
                    <i className="fa fa-map-marker" />
                    <div>
                      <h4>France</h4>
                      <p>
                        109 Rue du Faubourg Saint-Honoré, 75008 Paris <br />
                        +33 1 42 68 53 00
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Input Form Column */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__form">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-lg-12">
                      <textarea
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                      <button type="submit" className="site-btn">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}