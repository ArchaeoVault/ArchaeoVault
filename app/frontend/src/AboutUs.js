// AboutUs.js
import React from "react";
import "./AboutUs.css";
import Header from "./Header";
import Footer from "./Footer";

const AboutUs = () => {
  return (
    <>
      <Header />
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">Who we are</h1>
        <p className="about-text">
          ArchaeoVault is a digital archive dedicated to preserving and
          showcasing archaeological artifacts from Portsmouth, RI, and Newport,
          RI. Designed as a resource for enthusiasts, researchers, and
          historians, ArchaeoVault provides a platform to explore detailed 3D
          models of artifacts accompanied by descriptions, precise measurements,
          general locations, origins, time periods, names, and material types.
        </p>
        <p className="about-text">
          Our site is a curated experience, where only authorized administrators
          can upload and manage artifacts to ensure the accuracy and integrity
          of the collection. ArchaeoVault is designed purely for discovery,
          education, and the appreciation of the rich cultural history of these
          iconic New England towns,
        </p>
      </div>
      <div className="about-image-container">
        <img src="./placeholder5.jpg" alt="Artifact bowl" className="about-image" />
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AboutUs;
