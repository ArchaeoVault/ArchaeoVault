
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import "./Homepage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <Header />
      <section className="hero">
        <div className="hero-image">
          <img src="./placeholder.jpg" alt="Geometric artifact" />
        </div>
        <div className="hero-content">
          <h1>Explore the World of Archaeology</h1>
          <p>
            Discover the hidden treasures of Portsmouth and Newport, RI! Explore detailed 3D models of archaeological artifacts and dive into their rich history, origins, and craftsmanship. Unearth the past and let history come to life at your fingertips.
          </p>
          <Link to="/about">
            <button className="learn-more">Learn more</button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
