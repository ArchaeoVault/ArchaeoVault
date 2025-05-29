import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./Artifacts.css";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production'){ backend_url = `https://${process.env.REACT_APP_URL}/api/`;}
else{ backend_url = 'http://localhost:8000/api/';}

const artifactsData = [
  {
    id: 2,
    name: "Portsmouth, RI",
    imageUrl: "/Portsmouth.jpg",
    location: "Portsmouth, RI",
    timePeriod: "17th Century",
    description:
      "Portsmouth, Rhode Island is a historic town founded in 1638, known for its early colonial settlements, farmland, and important archaeological finds tied to Native American and early European history.",
    path: "/portsmouth-artifacts"
  },
  {
    id: 3,
    name: "Newport, RI",
    imageUrl: "/Newport.jpg",
    location: "Newport, RI",
    timePeriod: "18th Century",
    description:
      "Newport, Rhode Island is a coastal city famous for its colonial architecture, Gilded Age mansions, and centuries of maritime history that have contributed to rich archaeological discoveries.",
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
      let targetPath = artifact.path;

      if (permission === 3 || permission === 1) {
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
