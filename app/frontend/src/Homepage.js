import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Homepage.css";

const HomePage = ({ setShowLogin }) => {
  return (
    <div className="homepage">
      {/* Pass the setShowLogin prop down to Header */}
      <Header setShowLogin={setShowLogin} />
      <section className="hero">
        <div className="hero-image">
          <img src="/placeholder.jpg" alt="Artifact Display" />
        </div>
        <div className="hero-content">
          <h1>Explore the World of Archaeology</h1>
          <p>
            Discover the hidden treasures of Portsmouth and Newport, RI! Explore detailed 3D models of archaeological artifacts and dive into their rich history, origins, and craftsmanship. Unearth the past and let history come to life at your fingertips.
          </p>
          <button className="learn-more">Learn more</button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
