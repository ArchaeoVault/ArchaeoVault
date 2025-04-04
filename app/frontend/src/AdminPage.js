import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Header from "./Header";
import Footer from "./Footer";
import "./NewportArtifacts.css";

const List = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const artifactsPerPage = 5;

  const [scannedFilter, setScannedFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [organicFilter, setOrganicFilter] = useState("All");
  const [materialFilter, setMaterialFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle for Add Artifact Form

  // Form state for adding a new artifact
  const [newArtifact, setNewArtifact] = useState({
    name: "",
    description: "",
    scanned: "No",
    year: "",
    organic: "inorganic",
    material: "",
    address: "Newport, RI",
  });

  useEffect(() => {
    fetch("/cleaned_data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          delimiter: ",",
          complete: (result) => {
            const data = result.data.map((artifact) => ({
              name: artifact["Object Name"],
              description: artifact["Object Description"],
              scanned: artifact["3D Scanned"],
              year: artifact["Date excavated (field bag date)"]?.split("/")[2] || "",
              organic: artifact["inorganic/organic"],
              material: artifact["Material of manufactur"],
              address: artifact["Address"],
            }));

            const newportArtifacts = data.filter(
              (a) => a.address && a.address.toLowerCase().includes("newport")
            );

            setArtifacts(newportArtifacts);
            setFilteredArtifacts(newportArtifacts);
          },
        });
      });
  }, []);

  useEffect(() => {
    let filtered = [...artifacts];
    if (scannedFilter !== "All") filtered = filtered.filter((a) => a.scanned === scannedFilter);
    if (yearFilter !== "All") filtered = filtered.filter((a) => a.year === yearFilter);
    if (organicFilter !== "All") filtered = filtered.filter((a) => a.organic?.toLowerCase() === organicFilter.toLowerCase());
    if (materialFilter !== "All") filtered = filtered.filter((a) => a.material?.toLowerCase() === materialFilter.toLowerCase());

    setFilteredArtifacts(filtered);
    setCurrentPage(0);
  }, [artifacts, scannedFilter, yearFilter, organicFilter, materialFilter]);

  const handleInputChange = (e) => {
    setNewArtifact({ ...newArtifact, [e.target.name]: e.target.value });
  };

  const handleAddArtifact = (e) => {
    e.preventDefault();

    if (!newArtifact.name || !newArtifact.description || !newArtifact.material) {
      alert("Please fill in all required fields.");
      return;
    }

    const updatedArtifacts = [newArtifact, ...artifacts];
    setArtifacts(updatedArtifacts);
    setFilteredArtifacts(updatedArtifacts);
    setShowForm(false);
    setNewArtifact({ name: "", description: "", scanned: "No", year: "", organic: "inorganic", material: "", address: "Newport, RI" });
  };

  const startIndex = currentPage * artifactsPerPage;
  const displayedArtifacts = filteredArtifacts.slice(startIndex, startIndex + artifactsPerPage);

  return (
    <div className="artifact-page">
      <Header />
      <div className="artifact-list">
        <h2>Newport, RI Artifacts</h2>

        <button className="toggle-form-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add New Artifact"}
        </button>

        {showForm && (
          <form onSubmit={handleAddArtifact} className="artifact-form">
            <label>Name: <input type="text" name="name" value={newArtifact.name} onChange={handleInputChange} required /></label>
            <label>Description: <textarea name="description" value={newArtifact.description} onChange={handleInputChange} required /></label>
            <label>3D Scanned: 
              <select name="scanned" value={newArtifact.scanned} onChange={handleInputChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>
            <label>Year: <input type="text" name="year" value={newArtifact.year} onChange={handleInputChange} /></label>
            <label>Material: <input type="text" name="material" value={newArtifact.material} onChange={handleInputChange} required /></label>
            <label>Organic/Inorganic:
              <select name="organic" value={newArtifact.organic} onChange={handleInputChange}>
                <option value="inorganic">Inorganic</option>
                <option value="organic">Organic</option>
              </select>
            </label>
            <button type="submit">Add Artifact</button>
          </form>
        )}

        <div className="artifacts">
          {displayedArtifacts.length === 0 ? (
            <p>No artifacts match your filters.</p>
          ) : (
            displayedArtifacts.map((artifact, index) => (
              <div key={index} className="artifact-item">
                <h3>{artifact.name}</h3>
                <p>{artifact.description}</p>
              </div>
            ))
          )}
        </div>

        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>Previous</button>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.floor(filteredArtifacts.length / artifactsPerPage)))} disabled={startIndex + artifactsPerPage >= filteredArtifacts.length}>Next</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;