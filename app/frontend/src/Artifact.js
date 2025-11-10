import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

import Cookies from 'js-cookie'; 
import "./Artifact.css";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production'){ backend_url = `https://${process.env.REACT_APP_URL}/api/`;}
else{ backend_url = 'http://localhost:8000/api/';}

function Artifact() {
    const [artifactData, setArtifactData] = useState(null);
    const [error, setError] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
  
    useEffect(() => {
      const fetchArtifact = async () => {
        try {
          const artifactResponse = await fetch(backend_url + "single_artifact/", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: 1 }),
          });
  
          if (!artifactResponse.ok) {
            throw new Error(`Failed to fetch artifact data: ${artifactResponse.status}`);
          }
  
          const data = await artifactResponse.json();
          
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
            <h1 className="hero-title">{"Single Artifact"}</h1>
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
                <h2 className="artifact-name">{artifactData?.object_name}</h2>
                    <div className="artifact-section">
                    <h3>General Information</h3>
                        <p>Catalog Number: {artifactData?.catalog_number || "Unknown"}</p>
                        <p>Description: {artifactData?.object_description || "Unknown"}</p>
                        <p>Material: {artifactData?.material_of_manufacture || "Unknown"}</p>
                        <p>Form/Obeject Type: {artifactData?.form_object_type || "Unknown"}</p>
                        <p>Time Period: {artifactData?.object_dated_to || "Unknown"}</p>
                        <p>Quantity: {artifactData?.quantity || "Unknown"}</p>
                    </div>

                    <div className="artifact-section">
                        <h3>Measurements</h3>
                        <ul>
                            <li>Length: {artifactData?.length || "Unknown"} mm</li>
                            <li>Width: {artifactData?.width || "Unknown"} mm</li>
                            <li>Height: {artifactData?.height || "Unknown"} mm</li>
                            <li>Diameter: {artifactData?.measurement_diameter || "Unknown"} mm</li>
                            <li>Weight: {artifactData?.weight || "Unknown"} g</li>
                            <li>Measurement notes: {artifactData?.measurement_notes || "Unknown"}</li>
                        </ul>
                    </div>

                    <div className="artifact-section">
                        <h3>Locations & Excavation</h3>
                            <p>Repository Location: {artifactData?.location_in_repository || "Unknown"}</p>
                            <p>Storage Location: {artifactData?.storage_location || "Unknown"}</p>
                            <p>Platlot: {artifactData?.platlot || "Unknown"}</p>
                            <p>Found at Depth: {artifactData?.found_at_depth || "Unknown"}</p>
                            <p>Longitud: {artifactData?.longitude || "Unknown"}</p>
                            <p>Latitud: {artifactData?.latitude || "Unknown"}</p>
                            <p>Distance from Datum: {artifactData?.distance_from_datum || "Unknown"}</p>
                            <p>Found in Grid: {artifactData?.found_in_grid || "Unknown"}</p>
                    </div>

                    <div className="artifact-section">
                        <h3>People involved</h3>
                            <p>Owner: {artifactData?.owner || "Unknown"}</p>
                            <p>Excavator: {artifactData?.excavator || "Unknown"}</p>
                            <p>Scanned By: {artifactData?.scanned_by || "Unknown"}</p>
                            <p>Cataloger Name: {artifactData?.cataloguer_name || "Unknown"}</p>
                            <p>Data Double Checked By: {artifactData?.data_double_checked_by || "Unknown"}</p>
                    </div>

                    <div className="artifact-section">
                        <h3>Dates</h3>
                            <p>Date Excavated: {artifactData?.date_excavated || "Unknown"}</p>
                            <p>Date Catalogued: {artifactData?.date_catalogued || "Unknown"}</p>
                            <p>Date Collected: {artifactData?.date_catalogued || "Unknown"}</p>
                    </div>

                    <div className="artifact-section">
                        <h3>Other Details</h3>
                            <p>Conservation Condition: {artifactData?.conservation_condition || "Unknown"}</p>
                            <p>Oranic/Inorganic: {artifactData?.organic_inorganic || "Unknown"}</p>
                            <p>Species: {artifactData?.species || "Unknown"}</p>
                            <p>Notes: {artifactData?.notes || "Unknown"}</p>
                            <p>Source for ID: {artifactData?.sources_for_id || "Unknown"}</p>
                            <p>QS Concerns: {artifactData?.qsconcerns || "Unknown"}</p>
                            <p>Druhl Check: {artifactData?.druhlcheck || "Unknown"}</p>
                    </div>
              </div>
            </article>
          </section>
        </div>
        <Footer />
      </>
    );
  }
  
  export default Artifact;