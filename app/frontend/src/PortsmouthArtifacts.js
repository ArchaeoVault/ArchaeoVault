import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./NewportArtifacts.css";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV == 'production'){ backend_url = 'https://www.archaeovault.com/api/';}
else{ backend_url = 'http://localhost:8000/api/';}

const List = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [scannedFilter, setScannedFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [organicFilter, setOrganicFilter] = useState("All");
  const [materialFilter, setMaterialFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const artifactsPerPage = 9;

  useEffect(() => {
    fetch(backend_url+"portsmouth_artifacts/")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        console.log("Portsmouth data from backend:", data);
        const newportArtifacts = data.artifacts;

        const materialSet = new Set();
        const yearSet = new Set();

        newportArtifacts.forEach((artifact) => {
          if (artifact.material) materialSet.add(artifact.material.trim().toLowerCase());
          if (artifact.year) yearSet.add(artifact.year);
        });

        const materials = Array.from(materialSet)
          .map((mat) => mat.charAt(0).toUpperCase() + mat.slice(1))
          .sort((a, b) => a.localeCompare(b));
        const years = Array.from(yearSet).sort();

        setArtifacts(newportArtifacts);
        setFilteredArtifacts(newportArtifacts);
        setMaterialOptions(materials);
        setYearOptions(years);
      });
  }, []);

  useEffect(() => {
    let filtered = [...artifacts];

    if (scannedFilter !== "All") {
      filtered = filtered.filter((a) => a.scanned === scannedFilter);
    }
    if (yearFilter !== "All") {
      filtered = filtered.filter((a) => a.year === yearFilter);
    }
    if (organicFilter !== "All") {
      filtered = filtered.filter((a) => a.organic?.toLowerCase() === organicFilter.toLowerCase());
    }
    if (materialFilter !== "All") {
      filtered = filtered.filter((a) => a.material?.toLowerCase() === materialFilter.toLowerCase());
    }

    setFilteredArtifacts(filtered);
    setCurrentPage(0);
  }, [artifacts, scannedFilter, yearFilter, organicFilter, materialFilter]);

  const startIndex = currentPage * artifactsPerPage;
  const displayedArtifacts = filteredArtifacts.slice(startIndex, startIndex + artifactsPerPage);

  return (
    <div className="artifact-page">
      <Header />
      <div className="artifact-list">
        <h2>Portsmouth, RI Artifacts</h2>

        <div className="filters-container">
          <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide Filters ▲" : "Show Filters ▼"}
          </button>

          {showFilters && (
            <div className="filters">
              <label>
                3D Scanned:
                <select onChange={(e) => setScannedFilter(e.target.value)} value={scannedFilter}>
                  <option value="All">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>

              <label>
                Year Collected:
                <select onChange={(e) => setYearFilter(e.target.value)} value={yearFilter}>
                  <option value="All">All</option>
                  {yearOptions.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Organic/Inorganic:
                <select onChange={(e) => setOrganicFilter(e.target.value)} value={organicFilter}>
                  <option value="All">All</option>
                  <option value="organic">Organic</option>
                  <option value="inorganic">Inorganic</option>
                </select>
              </label>

              <label>
                Material:
                <select onChange={(e) => setMaterialFilter(e.target.value)} value={materialFilter}>
                  <option value="All">All</option>
                  {materialOptions.map((mat, index) => (
                    <option key={index} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
        {loading ? <p>Loading artifacts...</p> : (
          <div className="artifacts">
            {displayedArtifacts.length === 0 ? (
              <p>No artifacts match your filters.</p>
            ) : (
              displayedArtifacts.map((artifact, index) => (
                <div key={index} className="artifact-item">
                  <h3>{artifact.object_name}</h3>
                  <p>{artifact.object_description}</p>
                </div>
              ))
            )}
          </div>
        )}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.floor(filteredArtifacts.length / artifactsPerPage))
              )
            }
            disabled={startIndex + artifactsPerPage >= filteredArtifacts.length}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
