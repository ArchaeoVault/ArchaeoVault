import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
// import "./Artifact.css";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production'){ backend_url = `https://${process.env.REACT_APP_URL}/api/`;}
else{ backend_url = 'http://localhost:8000/api/';}

function Artifact() {
    const [artifactData, setArtifactData] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchArtifact = async () => {
        try {
          const response = await fetch(backend_url + "single_artifact/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: 1 }),
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch artifact data: ${response.status}`);
          }
  
          const data = await response.json();
          
          if (!data.artifacts || data.artifacts.length === 0) {
            throw new Error("No artifact found with the specified ID");
          }
  
          setArtifactData(data.artifacts[0]);
        } catch (error) {
          console.error("Error fetching artifact:", error);
          setError(error.message);
        }
      };
      
      fetchArtifact();
    }, []);
  
    // Error state
    if (error) {
      return (
        <>
          <Header />
          <div className="artifact-page">
            <div className="error-container">
              <h2>Error Loading Artifact</h2>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          </div>
          <Footer />
        </>
      );
    }
  
    // Main content - only render when artifactData exists
    return (
      <>
        <Header />
        <div className="artifact-page">
          <header className="artifact-hero">
            <h1 className="hero-title">
              {artifactData?.object_name || "Artifact Details"}
            </h1>
          </header>
  
          <section className="artifact-container">
            <article className="artifact-card">
              {artifactData?.images && (
                <img
                  src={artifactData.images}
                  alt={artifactData.object_name || "Artifact image"}
                  className="artifact-image"
                />
              )}
              <div className="artifact-info">
                <h2>{artifactData?.object_name || "Unnamed Artifact"}</h2>
                <p className="artifact-location">
                  Location: {artifactData?.location || "Unknown"}
                </p>
                <p className="artifact-timePeriod">
                  Time Period: {artifactData?.timePeriod || "Unknown"}
                </p>
                <p className="artifact-description">
                  {artifactData?.description || "No description available."}
                </p>
              </div>
            </article>
          </section>
        </div>
        <Footer />
      </>
    );
  }
  
  export default Artifact;