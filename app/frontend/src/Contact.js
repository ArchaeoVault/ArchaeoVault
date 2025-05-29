import React, { useState } from "react";
import "./Contact.css";
import Header from "./Header";
import Footer from "./Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add form submission logic here (send to API)
  };

  return (
    <>
    <Header />
    <div className="contact-container">
      <div className="contact-content">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-text">
          If you’re interested in collaborating, please provide your
          information, and we will contact you soon. We look forward to
          connecting with you.
        </p>
        <a href="mailto:email@example.com" className="contact-email">
          email@example.com
        </a>
        <p className="contact-phone">(555) 555-5555</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Name <span className="required">(required)</span></label>
          <div className="name-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <label>Email <span className="required">(required)</span></label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Message <span className="required">(required)</span></label>
          <textarea
            name="message"
            placeholder="Your message..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="contact-button">SEND</button>
        </form>
      </div>
      <div className="contact-image-container">
        <img src="./about_us.png" alt="Several people, some in revolutionary war costumes, some with Battle of Rhode Island t-shirts." className="contact-image" />
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Contact;
