import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./Artifacts.css";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV == 'production'){ backend_url = 'https://www.archaeovault.com/api/';}
else{ backend_url = 'http://localhost:8000/api/';}

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
    imageUrl: "/Newport_placeholder.jpg",
    location: "Newport, RI",
    timePeriod: "18th Century",
    material: "Brass",
    description:
      "A brass nautical compass from a merchant vessel that frequented Newport Harbor.",
    path: "/newport-artifacts"
  }
];

function ArtifactsPage() {
  const navigate = useNavigate(); // << useNavigate for redirects

  async function handleArtifactClick(artifact) {
    try {
      const response = await fetch(backend_url+"user_permission/", {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user permission");
      }

      const data = await response.json();
      const permission = data.upermission; // assuming your API returns { permission: 2 } or { permission: 3 }
      let targetPath = artifact.path.slice(1);

      if (permission === 3) {
        targetPath = `/researcher-${artifact.path.slice(1)}`;
      }
      
      navigate(targetPath);
    } catch (error) {
      console.error("Error checking permission:", error);
      alert("Error checking permission.");
    }
  }
  return (
    <>
      <Header />
      <div className="artifacts-page">
        <header className="artifacts-hero">
          <h1 className="hero-title">Locations</h1>
        </header>
        
        <section className="artifacts-container">
          <div className="artifacts-grid">
            {artifactsData.map((artifact) => (
              <article className="artifact-card" key={artifact.id}>
                <img
                  src={artifact.imageUrl}
                  alt={artifact.name}
                  className="artifact-image"
                  onClick={() => handleArtifactClick(artifact)} // << add click handler here
                  style={{ cursor: "pointer" }}
                />
                <div className="artifact-info">
                  <h2 className="artifact-name">
                    <button 
                      onClick={() => handleArtifactClick(artifact)} 
                      style={{ background: "none", border: "none", color: "blue", textDecoration: "underline", cursor: "pointer", fontSize: "inherit" }}
                    >
                      {artifact.name}
                    </button>
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
