import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import "./Artifact.css";
import { useParams } from 'react-router-dom';

// Backend host + API base
const backend_host =
  process.env.REACT_APP_DJANGO_ENV === 'production'
    ? `https://${process.env.REACT_APP_URL}`
    : 'http://127.0.0.1:8000';

const backend_api = `${backend_host}/api/`;

function Artifact() {
  const { id } = useParams();
  const [artifactData, setArtifactData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        setError(null);

        // New GET endpoint
        const res = await fetch(`${backend_api}single_artifact/${id}/`);

        if (!res.ok) {
          throw new Error(`Failed to fetch artifact data: ${res.status}`);
        }

        const data = await res.json();

        if (!data.artifacts || data.artifacts.length === 0) {
          throw new Error("No artifact found with the specified ID");
        }


        const imageRes = await fetch(`${backend_api}image_table/${id}`);

        if (!imageRes.images) {
          throw new Error("Error fetching images");
        }
        data.artifacts[0].images = imageRes.images;
        setArtifactData(data.artifacts[0]);

      } catch (err) {
        console.error("Error fetching artifact:", err);
        setError(err.message);
      }
    };

    fetchArtifact();
  }, [id]);

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

  // Loading state
  if (!artifactData) {
    return (
      <>
        <Header />
        <div className="artifact-page">
          <div className="loading-container">
            <h2>Loading...</h2>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // If backend returns "/media/artifacts/xxx.png", convert to full URL
  const resolveImageUrl = (url) => {
    if (!url) return null;
    // If backend already returned full URL, use it
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // Otherwise, prefix Django host (8000)
    return `${backend_host}${url}`;
  };

  const makeImgs = (images) => {
    const imgs = [];
    for(let i = 0; i < images.length(); i++){
      imgs.push(<tr><img
            src={backend_host + "/" + images[i].filepath}
            alt={artifactData.object_name}
            className="artifact-image"
            onError={(e) => {
              console.error("Artifact image failed:", artifactData.images);
              e.target.style.display = "none";
            }
          }
          /></tr>);
      return <tbody>{imgs}</tbody>
    }
  }

  return (
    <>
      <Header />
      <div className="artifact-page">
        <header className="artifact-hero">
          <h1 className="hero-title">Artifact {artifactData.catalog_number}</h1>
        </header>

        <section className="artifact-container">
          <article className="artifact-card">
          {artifactData?.images && makeImgs(artifactData?.images
          )}
          {artifactData?.qr_code && (
          <div className="qr-section">
            <a
              href={artifactData.qr_code}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="qr-download-btn"
            >
              Download QR Code
            </a>
          </div>
          )}
            <div className="artifact-info">
              <h2 className="artifact-name">{artifactData?.object_name}</h2>

              <div className="artifact-section">
              <h3>General Information</h3>
                {artifactData.catalog_number && (
                  <p>Catalog Number: {artifactData.catalog_number}</p>
                )}
                {artifactData.object_description && (
                  <p>Description: {artifactData.object_description}</p>
                )}
                {artifactData.material_of_manufacture && (
                  <p>Material: {artifactData.material_of_manufacture}</p>
                )}
                {artifactData.object_dated_to && (
                  <p>Time Period: {artifactData.object_dated_to}</p>
                )}
              </div>

              <div className="artifact-section">
              <h3>Measurements</h3>
                <ul>
                  {artifactData?.length && <li>Length: {artifactData.length} mm</li>}
                  {artifactData?.width && <li>Width: {artifactData.width} mm</li>}
                  {artifactData?.height && <li>Height: {artifactData.height} mm</li>}
                  {artifactData?.measurement_diameter && (
                    <li>Diameter: {artifactData.measurement_diameter} mm</li>
                  )}
                  {artifactData?.weight && <li>Weight: {artifactData.weight} g</li>}
                  {artifactData?.measurement_notes && (
                    <li>Measurement Notes: {artifactData.measurement_notes}</li>
                  )}
                </ul>
              </div>

              <div className="artifact-section">
              <h3>Locations & Excavation</h3>
                {artifactData?.site_vague && (
                  <p>Site: {artifactData.siteVague}</p>
                )}
                {artifactData?.storage_location && (
                  <p>Storage Location: {artifactData.storage_location}</p>
                )}
                {artifactData?.platlot && <p>Platlot: {artifactData.platlot}</p>}
                {artifactData?.found_at_depth && (
                  <p>Found at Depth: {artifactData.found_at_depth} mm</p>
                )}
                {artifactData?.longitude && <p>Longitude: {artifactData.longitude}</p>}
                {artifactData?.latitude && <p>Latitude: {artifactData.latitude}</p>}
                {artifactData?.distance_from_datum && (
                  (typeof artifactData.distance_from_datum === 'number') ?
                  <p>Distance from Datum: {(artifactData.distance_from_datum ?? 0) / 10} cm</p> :
                  <p>Distance from Datum: Unknown</p>
                )}
                {artifactData?.found_in_grid && (
                  <p>Found in Grid: {artifactData.found_in_grid}</p>
                )}
              </div>

              <div className="artifact-section">
              <h3>Dates</h3>
                {artifactData?.date_excavated && (
                  <p>Date Excavated: {new Date(artifactData.date_excavated).toLocaleDateString()}</p>
                )}
                {artifactData?.date_collected && (
                  <p>Date Collected: {new Date(artifactData.date_collected).toLocaleDateString()}</p>
                )}
              </div>

              <div className="artifact-section">
              <h3>Other Details</h3>
                {artifactData?.conservation_condition && (
                  <p>Conservation Condition: {artifactData.conservation_condition}</p>
                )}
                {artifactData?.organic_inorganic && (
                  <p>Organic/Inorganic: {artifactData.organic_inorganic}</p>
                )}
                {artifactData?.species && <p>Species: {artifactData.species}</p>}
                {artifactData?.notes && <p>Notes: {artifactData.notes}</p>}
                {artifactData?.sources_for_id && (
                  <p>Source for ID: {artifactData.sources_for_id}</p>
                )}
                {artifactData?.qsconcerns && <p>QS Concerns: {artifactData.qsconcerns}</p>}
                {artifactData?.druhlcheck && <p>Druhl Check: {artifactData.druhlcheck}</p>}
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
