import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./NewportArtifacts.css";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production') {
  backend_url = 'https://www.archaeovault.com/api/';
} else {
  backend_url = 'http://localhost:8000/api/';
}

const NewportArtifacts = () => {
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
  const [expandedArtifactIndex, setExpandedArtifactIndex] = useState(null);

  const artifactsPerPage = 9;

  useEffect(() => {
    fetch(backend_url + "newport_artifacts/")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        console.log("Newport data from backend:", data);
        const newportArtifacts = data.artifacts;
        const addressMap = {
          1: "Null",
          2: "RI; Portsmouth; 66 Freeborn Street",
          3: "Newport Spring Site; 48 Touro/Spring St. Newport; RI",
          4: "Butts Hill Fort; Portsmouth; RI",
        };

        const scannedMap = {
          1: "Yes",
          2: "No",
        };
        
        const organicMap = {
          1: "Organic",
          2: "Inorganic",
        };
        
        const materialMap = {
          1: "Animal Bone",
          2: "Ash",
          3:"Bone",
          4:"Brick",
          5:"Ceramic",
          6:"Pearlware; edged",
          7:"Ceramic; earthenware",
          8:"Charcoal",
          9:"China",
          10:"Chinese Hard Paste Porcelain",
          11:"Clay",
          12:"Clear Glass",
          13:"Coal",
          14:"Coarse Earthenware",
          15:"Creamware",
          16:"Earthenware",
          17:"Earthenware and Soft Paste Porcelain",
          18:"Embossed Edged Earthenware",
          19:"Expanded polystyrene (EPS)",
          20:"Glass",
          21:"Glazed earthenware",
          22:"Granite",
          23:"Greyware",
          24:"Iron",
          25:"Iron fragment",
          26:"Japanese Hard Paste Porcelain",
          27:"lead or pewter",
          28:"Majolica",
          29:"Metal",
          30:"Nut shell",
          31:"Pearlware",
          32:"Porcelain",
          33:"Possibly Lead",
          34:"Printed Underglaze Earthenware",
          35:"Printed Underglazed Earthenware",
          36:"Quartz",
          37:"Redware fragment",
          38:"Refined Earthenware",
          39:"Refined Earthenware and Flow Blue China",
          40:"Refined Earthenware and Printed Underglaze Earthenware",
          41:"Refined Earthenware; Printed Underglaze Earthenware",
          42:"Rhenish Stoneware",
          43:"Rock",
          44:"Salt-glazed Stoneware",
          45:"Salt-Glazed Stoneware",
          46:"Shell",
          47:"Soft Paste Porcelain",
          48:"Sponge Decorated Ware",
          49:"Stone",
          50:"STONEWARE",
          51:"Stoneware",
          52:"Stoneware (possible rhenish/salt glazed)",
          53:"Underglazed Painted Earthenware",
          54:"Unknown",
          55:"Very dark olive/Light black glass",
          56:"Walnut",
          57:"Whiledon Ware",
          58:"Wood",
          59:"Yellow Earthenware",
          60:"Yellowish olive green glass",
          61:"Unknown",
          62:"Pig",
          63:"Porcelin",
          64:"Lead",
          65:"Copper",
          66:"Metal; Iron",
          67:"Metal; Iron?",
          68:"Copper?"};
        
          if (Array.isArray(data.artifacts)) {
            const processedArtifacts = data.artifacts.map((artifact) => ({
              ...artifact,
              scanned_address_readable: addressMap[artifact.address] || "Unknown",
              scanned_3d_readable: scannedMap[artifact.scanned_3d] || "Unknown",
              organic_inorganic_readable: organicMap[artifact.organic_inorganic] || "Unknown",
              material_of_manufacture_readable: materialMap[artifact.material_of_manufacture] || "Unknown",
              year_excavated: artifact.date_excavated ? artifact.date_excavated.split("-")[0] : "Unknown",
            }));
    
            const materialSet = new Set();
            const yearSet = new Set();
    
            processedArtifacts.forEach((artifact) => {
              materialSet.add(artifact.material_of_manufacture_readable);
              yearSet.add(artifact.year_excavated);
            });
          

          
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
          }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching artifacts:", error);
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
      filtered = filtered.filter(
        (a) => a.organic?.toLowerCase() === organicFilter.toLowerCase()
      );
    }
    if (materialFilter !== "All") {
      filtered = filtered.filter(
        (a) => a.material?.toLowerCase() === materialFilter.toLowerCase()
      );
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
        <h2>Newport, RI Artifacts</h2>

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

        {loading ? (
          <p>Loading artifacts...</p>
        ) : (
          <div className="artifacts">
            {displayedArtifacts.length === 0 ? (
              <p>No artifacts match your filters.</p>
            ) : (
              displayedArtifacts.map((artifact, index) => {
                const globalIndex = startIndex + index;
                return (
                  <div
                    key={globalIndex}
                    className="artifact-item"
                    onClick={() =>
                      setExpandedArtifactIndex(
                        expandedArtifactIndex === globalIndex ? null : globalIndex
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <h3>{artifact.object_name}</h3>
                    <p>{artifact.object_description}</p>

                    {/* Expanded details */}
                    {expandedArtifactIndex === globalIndex && (
                      <div className="artifact-details">
                        {artifact.address && (
                          <p><strong>Address:</strong> {artifact.address}</p>
                        )}
                        {artifact.material && (
                          <p><strong>Material:</strong> {artifact.material}</p>
                        )}
                        {artifact.year && (
                          <p><strong>Year Excavated:</strong> {artifact.year}</p>
                        )}
                        {artifact.organic && (
                          <p><strong>Organic/Inorganic:</strong> {artifact.organic}</p>
                        )}
                        {artifact.scanned && (
                          <p><strong>3D Scanned:</strong> {artifact.scanned}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
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

export default NewportArtifacts;

