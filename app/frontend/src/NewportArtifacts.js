import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./NewportArtifacts.css";

const NewportArtifacts = () => {
  const [artifacts, setArtifacts] = useState([]);

  useEffect(() => {
    fetch("/api/artifacts?location=Newport,RI")
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setArtifacts(data);
        } else {
          setArtifacts(placeholderArtifacts);
        }
      })
      .catch((error) => {
        console.error("Error fetching artifacts:", error);
        setArtifacts(placeholderArtifacts);
      });
  }, []);

  // Placeholder artifacts (ensures grid is always filled)
  const placeholderArtifacts = [
    { id: 1, name: "Placeholder Artifact 1", image: "/placeholder1.jpg", description: "This is a placeholder artifact description." },
    { id: 2, name: "Placeholder Artifact 2", image: "/placeholder2.jpg", description: "This is a placeholder artifact description." },
    { id: 3, name: "Placeholder Artifact 3", image: "/placeholder3.jpg", description: "This is a placeholder artifact description." },
    { id: 4, name: "Placeholder Artifact 4", image: "/placeholder4.jpg", description: "This is a placeholder artifact description." }
  ];

  return (
    <>
      <Header />
      <div className="artifact-container">
        <h1>Newport, RI Artifacts</h1>
        <div className="artifact-grid">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="artifact-card">
              <img src={artifact.image} alt={artifact.name} className="artifact-image" />
              <h2 className="artifact-name">{artifact.name}</h2>
              <p className="artifact-description">{artifact.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewportArtifacts;
