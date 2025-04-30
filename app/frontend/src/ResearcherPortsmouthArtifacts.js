import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./ResearcherPage.css";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production') {
  backend_url = 'https://www.archaeovault.com/api/';
} else {
  backend_url = 'http://localhost:8000/api/';
}
const addressMap = {
  1: "Null",
  2: "RI; Portsmouth; 66 Freeborn Street",
  3: "Newport Spring Site; 48 Touro/Spring St. Newport; RI",
  4: "Butts Hill Fort; Portsmouth; RI",
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

const scannedMap = { 1: "Yes", 2: "No" };
const organicMap = { 1: "Organic", 2: "Inorganic" };

const ResearcherPortsmouthArtifacts = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedArtifactIndex, setExpandedArtifactIndex] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [materialFilter, setMaterialFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [scannedFilter, setScannedFilter] = useState("All");
  const [organicFilter, setOrganicFilter] = useState("All");

  const [csrfToken, setCsrfToken] = useState('');
  const [newArtifact, setNewArtifact] = useState({
    name: '', location: '', material: '', age: '', description: '', catalog_number: '',
  });

  const artifactsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(backend_url + "portsmouth_artifacts/");
      const data = await res.json();
      const processed = data.artifacts.map((a) => ({
        ...a,
        material: materialMap[a.material_of_manufacture__id] || "Unknown",
        scanned: scannedMap[a.scanned_3d__id] || "Unknown",
        organic: organicMap[a.organic_inorganic__id] || "Unknown",
        year: a.date_excavated?.split("-")[0] || "Unknown",
        address: a.address__countyorcity || "Unknown",
      }));
      setArtifacts(processed);

      const materialSet = new Set();
      const yearSet = new Set();
      processed.forEach((a) => {
        materialSet.add(a.material);
        yearSet.add(a.year);
      });
      setMaterialOptions([...materialSet].sort());
      setYearOptions([...yearSet].sort());
    };

    const fetchCsrf = async () => {
      const res = await fetch(backend_url + "get_csrf_token/", { credentials: "include" });
      const data = await res.json();
      setCsrfToken(data.csrfToken);
    };

    fetchData();
    fetchCsrf();
  }, []);

  useEffect(() => {
    let filtered = [...artifacts];
    if (materialFilter !== "All") filtered = filtered.filter((a) => a.material === materialFilter);
    if (yearFilter !== "All") filtered = filtered.filter((a) => a.year === yearFilter);
    if (scannedFilter !== "All") filtered = filtered.filter((a) => a.scanned === scannedFilter);
    if (organicFilter !== "All") filtered = filtered.filter((a) => a.organic === organicFilter);
    setFilteredArtifacts(filtered);
    setCurrentPage(0);
  }, [artifacts, materialFilter, yearFilter, scannedFilter, organicFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArtifact({ ...newArtifact, [name]: value });
  };

  const handleAddArtifact = async () => {
    if (!newArtifact.name || !newArtifact.description || !newArtifact.age || !newArtifact.location) {
      alert('Please fill in required fields: name, description, date, and location.');
      return;
    }

    const payload = {
      object_name: newArtifact.name,
      object_description: newArtifact.description,
      date_excavated: newArtifact.age,
      location: parseInt(newArtifact.location),
      material_of_manufacture: parseInt(newArtifact.material),
      catalog_number: newArtifact.catalog_number,
    };
    console.log(payload);
    try {
      const response = await fetch(backend_url + 'add_artifact/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        alert("Artifact added successfully!");
        setNewArtifact({ name: '', location: '', material: '', age: '', description: '' });
      } else {
        alert('Failed to add artifact: ' + data.error);
      }
    } catch (error) {
      alert('There was an error adding the artifact.');
    }
  };

  const startIndex = currentPage * artifactsPerPage;
  const displayedArtifacts = filteredArtifacts.slice(startIndex, startIndex + artifactsPerPage);

  return (
    <div className="researcher-page">
      <Header />
      <div className="researcher-container">
        <h1>Researcher Dashboard</h1>

        <div className="add-artifact-form">
          <h2>Add New Artifact</h2>
          <input type="text" name="name" placeholder="Artifact Name" value={newArtifact.name} onChange={handleInputChange} />
          <input type="text" name="catalog_number" placeholder="Catalog Number" value={newArtifact.catalog_number} onChange={handleInputChange}/>
          <select name="location" value={newArtifact.location} onChange={handleInputChange}>
            <option value="">Select Location</option>
            {Object.entries(addressMap).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          <select name="material" value={newArtifact.material} onChange={handleInputChange}>
            <option value="">Select Material</option>
            {Object.entries(materialMap).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          <input type="date" name="age" value={newArtifact.age} onChange={handleInputChange} />
          <textarea name="description" placeholder="Description" value={newArtifact.description} onChange={handleInputChange} />
          <button onClick={handleAddArtifact}>Add Artifact</button>
        </div>

        <div className="filters-container">
          <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide Filters ▲" : "Show Filters ▼"}
          </button>

          {showFilters && (
            <div className="filters">
              <label>Material:
                <select value={materialFilter} onChange={(e) => setMaterialFilter(e.target.value)}>
                  <option value="All">All</option>
                  {materialOptions.map((mat, idx) => <option key={idx} value={mat}>{mat}</option>)}
                </select>
              </label>
              <label>Year:
                <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                  <option value="All">All</option>
                  {yearOptions.map((year, idx) => <option key={idx} value={year}>{year}</option>)}
                </select>
              </label>
              <label>3D Scanned:
                <select value={scannedFilter} onChange={(e) => setScannedFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
              <label>Organic/Inorganic:
                <select value={organicFilter} onChange={(e) => setOrganicFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Organic">Organic</option>
                  <option value="Inorganic">Inorganic</option>
                </select>
              </label>
            </div>
          )}
        </div>

        <div className="artifact-list">
          {displayedArtifacts.map((artifact, index) => {
            const globalIndex = startIndex + index;
            return (
              <div key={globalIndex} className="artifact-item" onClick={() =>
                setExpandedArtifactIndex(expandedArtifactIndex === globalIndex ? null : globalIndex)}>
                <h3>{artifact.object_name}</h3>
                <p>{artifact.object_description}</p>
                {expandedArtifactIndex === globalIndex && (
                  <div className="artifact-details">
                    <p><strong>Location:</strong> {artifact.address}</p>
                    <p><strong>Material:</strong> {artifact.material}</p>
                    <p><strong>Year:</strong> {artifact.year}</p>
                    <p><strong>Organic:</strong> {artifact.organic}</p>
                    <p><strong>3D Scanned:</strong> {artifact.scanned}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>Previous</button>
          <button onClick={() => setCurrentPage((prev) =>
            Math.min(prev + 1, Math.floor(filteredArtifacts.length / artifactsPerPage)))} disabled={startIndex + artifactsPerPage >= filteredArtifacts.length}>Next</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResearcherPortsmouthArtifacts;
