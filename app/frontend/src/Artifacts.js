import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./Artifacts.css";

const artifactsData = [
  {
    id: 2,
    name: "Portsmouth, RI",
    imageUrl: "/Portsmouth_placeholder.png",
    location: "Portsmouth, RI",
    timePeriod: "Late 1600s",
    material: "Earthenware",
    description:
      "Fragments of a Native American clay pot, showcasing intricate hand-etched designs.",
    path: "/portsmouth-artifacts"
  },
  {
    id: 3,
    name: "Newport, RI",
    imageUrl: "Newport_placeholder.jpg",
    location: "Newport, RI",
    timePeriod: "18th Century",
    material: "Brass",
    description:
      "A brass nautical compass from a merchant vessel that frequented Newport Harbor.",
    path: "/newport-artifacts"
  }
];

function ArtifactsPage() {
  return (
    <>
      <Header />
      <div className="artifacts-page">
        {/* Top banner/hero area */}
        <header className="artifacts-hero">
          <h1 className="hero-title">Locations</h1>
        </header>
        
        {/* Main content area */}
        <section className="artifacts-container">
          <div className="artifacts-grid">
            {artifactsData.map((artifact) => (
              <article className="artifact-card" key={artifact.id}>
                <img
                  src={artifact.imageUrl}
                  alt={artifact.name}
                  className="artifact-image"
                />
                <div className="artifact-info">
                  <h2 className="artifact-name">
                    <Link to={artifact.path}>{artifact.name}</Link>
                  </h2>
                  <p className="artifact-location">Location: {artifact.location}</p>
                  <p className="artifact-timePeriod">Time Period: {artifact.timePeriod}</p>
                  <p className="artifact-material">Material: {artifact.material}</p>
                  <p className="artifact-description">{artifact.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default ArtifactsPage;
