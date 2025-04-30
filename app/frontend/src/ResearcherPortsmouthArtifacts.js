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
const printedMap = { 1: "Yes", 2: "No" };
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
  const [showForm, setShowForm] = useState(false);
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [editingArtifact, setEditingArtifact] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const artifactsPerPage = 9;
  const [newArtifact, setNewArtifact] = useState({
    name: '', age: '', description: '', catalog_number: '', address: '', owner: '', accessor_number: '', catalog_day: '', object_name: '',
    scanned_3d: '', printed_3d: '', scanned_by: '', date_excavated: '',
    object_dated_to: '', object_description: '', organic_inorganic: '',
    species: '', material_of_manufacture: '', quantity: '',
    measurements: '', length_mm: '', width_mm: '', height_mm: '',
    measurement_notes: '', weight_grams: '', weight_notes: '', sivilich_diameter_in: '',
    deformation_index: '', condition: '', cataloger_name: '', date_catalogued: '',
    location_repository: '', plat_lot: '', depth: '', longitude: '',
    latitude: '', distance_from_datum: '', grid: '', excavator: '',
    notes: '', image: '', image2: '', image3: '', double_checked_by: '',
    questions: '', uhl_check: '', sources: '', location_general: '',
    storage_location: '', uhl_flags: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name}, New value: ${value}`);
    setEditingArtifact({
      ...editingArtifact,
      [name]: value,
    });
  };
  const handleEditClick = (artifact) => {
    setEditingArtifact({
      ...artifact,
      name: artifact.object_name || artifact.name || '',
      description: artifact.object_description || artifact.description || '',
      material_of_manufacture: artifact.material_of_manufacture || '',
      organic_inorganic: artifact.organic_inorganic || '',
      scanned_3d: artifact.scanned_3d || '',
      printed_3d: artifact.printed_3d || '',
      address: artifact.address_id || artifact.address || '',
    });
    setShowEditForm(true);
  };
  const handleEditSave = async () => {
    try {
      const response = await fetch(backend_url+'edit_artifact/', {
        method: 'POST',  // <== CHANGED TO POST
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          id: editingArtifact.id,
          name: editingArtifact.name,
          description: editingArtifact.description,
          address: editingArtifact.address,
          age: editingArtifact.age,
          material_of_manufacture: editingArtifact.material_of_manufacture,
          organic_inorganic: editingArtifact.organic_inorganic,
          scanned_3d: editingArtifact.scanned_3d,
          printed_3d: editingArtifact.printed_3d,
          length_mm: editingArtifact.length_mm,
          width_mm: editingArtifact.width_mm,
          height_mm: editingArtifact.height_mm,
          measurement_notes: editingArtifact.measurement_notes,
          weight_grams: editingArtifact.weight_grams,
          weight_notes: editingArtifact.weight_notes,
          sivilich_diameter_in: editingArtifact.sivilich_diameter_in,
          deformation_index: editingArtifact.deformation_index,
          condition: editingArtifact.condition,
          cataloger_name: editingArtifact.cataloger_name,
          date_catalogued: editingArtifact.date_catalogued,
          location_repository: editingArtifact.location_repository,
          plat_lot: editingArtifact.plat_lot,
          depth: editingArtifact.depth,
          longitude: editingArtifact.longitude,
          latitude: editingArtifact.latitude,
          distance_from_datum: editingArtifact.distance_from_datum,
          grid: editingArtifact.grid,
          excavator: editingArtifact.excavator,
          notes: editingArtifact.notes,
          image: editingArtifact.image,
          double_checked_by: editingArtifact.double_checked_by,
          questions: editingArtifact.questions,
          uhl_check: editingArtifact.uhl_check,
          sources: editingArtifact.sources,
          location_general: editingArtifact.location_general,
          storage_location: editingArtifact.storage_location,
          uhl_flags: editingArtifact.uhl_flags,
          owner: editingArtifact.owner,
          accessor_number: editingArtifact.accessor_number,
          catalog_number: editingArtifact.catalog_number
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Artifact updated successfully!");
        setArtifacts(prev =>
          prev.map(a => a.id === editingArtifact.id ? editingArtifact : a)
        );
        setShowEditForm(false);
      } else {
        alert("Failed to update artifact: " + data.error);
      }
    } catch (error) {
      alert("Error updating artifact");
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(backend_url + "portsmouth_artifacts/");
      const data = await res.json();
      const processed = data.artifacts.map((a) => ({
        ...a,
        material: materialMap[a.material_of_manufacture] || "Unknown",
        scanned: scannedMap[a.scanned_3d] || "Unknown",
        organic: organicMap[a.organic_inorganic] || "Unknown",
        year: a.date_excavated?.split("-")[0] || "Unknown",
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

  const handleNewArtifactInputChange = (e) => {
    const { name, value } = e.target;
    setNewArtifact({ ...newArtifact, [name]: value });
  };

  const handleAddArtifact = async () => {
    if (!newArtifact.name || !newArtifact.description || !newArtifact.age || !newArtifact.address) {
      alert('Please fill in required fields: name, description, date, and location.');
      return;
    }

    const payload = {
      object_name: newArtifact.name,
      object_description: newArtifact.description,
      date_excavated: newArtifact.age,
      address: parseInt(newArtifact.address),
      material_of_manufacture: parseInt(newArtifact.material),
      catalog_number: newArtifact.catalog_number,
      owner: newArtifact.owner,
      accessor_number: newArtifact.accessor_number,
      scanned_3d: newArtifact.scanned_3d,
      printed_3d: newArtifact.printed_3d,
      length_mm: newArtifact.length_mm,
      weight_grams: newArtifact.weight_grams,
      weight_notes: newArtifact.weight_notes, sivilich_diameter_in: newArtifact.sivilich_diameter_in,
      deformation_index: newArtifact.deformation_index, condition: newArtifact.condition, cataloger_name: newArtifact.cataloger_name, date_catalogued: newArtifact.date_catalogued,
      location_repository: newArtifact.location_repository, plat_lot: newArtifact.plat_lot, depth: newArtifact.depth, longitude: newArtifact.longitude,
      latitude: newArtifact.latitude, distance_from_datum: newArtifact.distance_from_datum, grid: newArtifact.grid, excavator: newArtifact.excavator,
      notes: newArtifact.notes, image: newArtifact.image, double_checked_by: newArtifact.double_checked_by,
      questions: newArtifact.questions, uhl_check: newArtifact.uhl_check, sources: newArtifact.sources, location_general: newArtifact.location_general,
      storage_location: newArtifact.storage_location, uhl_flags: newArtifact.uhl_flags,
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
        setNewArtifact({
          name: '', location: '', material: '', age: '',
          catalog_number: '', owner: '',
          scanned_3d: '', printed_3d: '', scanned_by: '', date_excavated: '',
          object_dated_to: '', object_description: '', organic_inorganic: '',
          species: '', material_of_manufacture: '', quantity: '',
          measurements: '', length_mm: '', width_mm: '', height_mm: '',
          measurement_notes: '', weight_grams: '', weight_notes: '', sivilich_diameter_in: '',
          deformation_index: '', condition: '', cataloger_name: '', date_catalogued: '',
          location_repository: '', plat_lot: '', depth: '', longitude: '',
          latitude: '', distance_from_datum: '', grid: '', excavator: '',
          notes: '', image: '', double_checked_by: '',
          questions: '', uhl_check: '', sources: '', location_general: '',
          storage_location: '', uhl_flags: '',
        });        
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
        <button className="add-toggle-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form ▲" : "Add New Artifact ▼"}
        </button>
        {showForm && (
          <div className="add-artifact-form">
            <h2>Add New Artifact</h2>
            <div className="form-card">
              <div className = "field-class">
                <div className="form-group">
                  <label>Artifact Name </label>
                  <input type="text" name="name" value={newArtifact.name} onChange={handleNewArtifactInputChange} placeholder="e.g., Ceramic Shard" />
                </div>
                <div className="form-group">
                  <label>Catalog Number</label>
                  <input type="text" name="catalog_number" value={newArtifact.catalog_number} onChange={handleNewArtifactInputChange} placeholder="e.g., CAT123" />
                </div>
                <div className="form-group">
                  <label>Address </label>
                  <select name="address" value={newArtifact.address} onChange={handleNewArtifactInputChange}>
                    <option value="">Select Address</option>
                    {Object.entries(addressMap).map(([id, label]) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Material</label>
                  <select name="material" value={newArtifact.material} onChange={handleNewArtifactInputChange}>
                    <option value="">Select Material</option>
                    {Object.entries(materialMap).map(([id, label]) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date Excavated </label>
                  <input type="date" name="age" value={newArtifact.age} onChange={handleNewArtifactInputChange} />
                </div>
                <div className="form-group">
                  <label>Description </label>
                  <textarea name="description" value={newArtifact.description} onChange={handleNewArtifactInputChange} placeholder="Describe the artifact..." rows="4" />
                </div>
                <button className="add-toggle-button" onClick={() => setShowMoreFields(!showMoreFields)}>
                  {showMoreFields ? "Hide Extra Fields ▲" : "Add More Description ▼"}
                </button>
              </div>
              {showMoreFields && (
                <div className="more-fields">
                  <div className="form-group"><label>Owner</label><input type="text" name="owner" value={newArtifact.owner} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Accessor Number (Date Collected)</label><input type="text" name="accessor_number" value={newArtifact.accessor_number} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>3D Scanned</label><input type="text" name="scanned_3d" value={newArtifact.scanned_3d} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>3D Printed</label><input type="text" name="printed_3d" value={newArtifact.printed_3d} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Length (mm)</label><input type="number" name="length_mm" value={newArtifact.length_mm} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Width (mm)</label><input type="number" name="width_mm" value={newArtifact.width_mm} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Height (mm)</label><input type="number" name="height_mm" value={newArtifact.height_mm} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Measurement Notes</label><input type="text" name="measurement_notes" value={newArtifact.measurement_notes} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Weight (grams)</label><input type="number" name="weight_grams" value={newArtifact.weight_grams} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Weight Notes</label><input type="text" name="weight_notes" value={newArtifact.weight_notes} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Sivilich Diameter (in)</label><input type="text" name="sivilich_diameter_in" value={newArtifact.sivilich_diameter_in} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Deformation Index</label><input type="text" name="deformation_index" value={newArtifact.deformation_index} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Condition</label><input type="text" name="condition" value={newArtifact.condition} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Cataloger Name</label><input type="text" name="cataloger_name" value={newArtifact.cataloger_name} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Date Catalogued</label><input type="date" name="date_catalogued" value={newArtifact.date_catalogued} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Location Repository</label><input type="text" name="location_repository" value={newArtifact.location_repository} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Plat/Lot</label><input type="text" name="plat_lot" value={newArtifact.plat_lot} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Depth</label><input type="text" name="depth" value={newArtifact.depth} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Longitude</label><input type="text" name="longitude" value={newArtifact.longitude} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Latitude</label><input type="text" name="latitude" value={newArtifact.latitude} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Distance from Datum</label><input type="text" name="distance_from_datum" value={newArtifact.distance_from_datum} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Grid</label><input type="text" name="grid" value={newArtifact.grid} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Excavator</label><input type="text" name="excavator" value={newArtifact.excavator} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Notes</label><textarea name="notes" value={newArtifact.notes} onChange={handleNewArtifactInputChange} rows="2" /></div>
                  <div className="form-group"><label>Image URL</label><input type="text" name="image" value={newArtifact.image} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Double Checked By</label><input type="text" name="double_checked_by" value={newArtifact.double_checked_by} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Questions</label><input type="text" name="questions" value={newArtifact.questions} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>UHL Check</label><input type="text" name="uhl_check" value={newArtifact.uhl_check} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Sources</label><input type="text" name="sources" value={newArtifact.sources} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Location (General)</label><input type="text" name="location_general" value={newArtifact.location_general} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>Storage Location</label><input type="text" name="storage_location" value={newArtifact.storage_location} onChange={handleNewArtifactInputChange} /></div>
                  <div className="form-group"><label>UHL Flags</label><input type="text" name="uhl_flags" value={newArtifact.uhl_flags} onChange={handleNewArtifactInputChange} /></div>                </div>
                )}
                <button className="button add-button" onClick={handleAddArtifact}>Add Artifact</button>
            </div>
          </div>
        )}
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
        {showEditForm && editingArtifact && (
          <div className="edit-artifact-form-modal">
            <div className="edit-artifact-form">
              <button className="close-button" onClick={() => setShowEditForm(false)}>&times;</button>
              <h2>Edit Artifact</h2>
              <div className="form-group"><label>Name</label><input type="text" name="name" value={editingArtifact.name} onChange={handleInputChange} /></div>
              <div className="form-group"><label>description</label><input type="text" name="description" value={editingArtifact.description} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Owner</label><input type="text" name="owner" value={editingArtifact.owner} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Accessor Number (Date Collected)</label><input type="text" name="accessor_number" value={editingArtifact.accessor_number} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Address</label><select name="address" value={editingArtifact.address} onChange={handleInputChange}>
                  <option value="">Select Address</option>
                  {Object.entries(addressMap).map(([key, label]) => (
                  <option key={key} value={key}>{label}
                  </option>))}</select>
              </div>
              <div className="form-group"><label>Material</label><select name="material_of_manufacture" value={editingArtifact.material_of_manufacture} onChange={handleInputChange}>
                <option value="">Select Material</option>
                {Object.entries(materialMap).map(([key, label]) => (
                <option key={key} value={key}>{label}
                </option>))}</select>
              </div>
              <div className="form-group"><label>3D Scanned</label><select name="scanned_3d" value={editingArtifact.scanned_3d} onChange={handleInputChange}>
                <option value="">Select Option</option>
                {Object.entries(scannedMap).map(([key, label]) => (
                <option key={key} value={key}>{label}
                </option>))}</select>
              </div>
              <div className="form-group"><label>3D Printed</label><select name="printed_3d" value={editingArtifact.printed_3d} onChange={handleInputChange}>
                <option value="">Select Option</option>
                {Object.entries(printedMap).map(([key, label]) => (
                <option key={key} value={key}>{label}
                </option>))}</select>
              </div>              
              <div className="form-group"><label>Length (mm)</label><input type="number" name="length_mm" value={editingArtifact.length_mm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Width (mm)</label><input type="number" name="width_mm" value={editingArtifact.width_mm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Height (mm)</label><input type="number" name="height_mm" value={editingArtifact.height_mm} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Measurement Notes</label><input type="text" name="measurement_notes" value={editingArtifact.measurement_notes} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Weight (grams)</label><input type="number" name="weight_grams" value={editingArtifact.weight_grams} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Weight Notes</label><input type="text" name="weight_notes" value={editingArtifact.weight_notes} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Sivilich Diameter (in)</label><input type="text" name="sivilich_diameter_in" value={editingArtifact.sivilich_diameter_in} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Deformation Index</label><input type="text" name="deformation_index" value={editingArtifact.deformation_index} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Condition</label><input type="text" name="condition" value={editingArtifact.condition} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Cataloger Name</label><input type="text" name="cataloger_name" value={editingArtifact.cataloger_name} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Date Catalogued</label><input type="date" name="date_catalogued" value={editingArtifact.date_catalogued} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Location Repository</label><input type="text" name="location_repository" value={editingArtifact.location_repository} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Plat/Lot</label><input type="text" name="plat_lot" value={editingArtifact.plat_lot} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Depth</label><input type="text" name="depth" value={editingArtifact.depth} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Longitude</label><input type="text" name="longitude" value={editingArtifact.longitude} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Latitude</label><input type="text" name="latitude" value={editingArtifact.latitude} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Distance from Datum</label><input type="text" name="distance_from_datum" value={editingArtifact.distance_from_datum} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Grid</label><input type="text" name="grid" value={editingArtifact.grid} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Excavator</label><input type="text" name="excavator" value={editingArtifact.excavator} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Notes</label><textarea name="notes" value={editingArtifact.notes} onChange={handleInputChange} rows="2" /></div>
              <div className="form-group"><label>Image URL</label><input type="text" name="image" value={editingArtifact.image} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Double Checked By</label><input type="text" name="double_checked_by" value={editingArtifact.double_checked_by} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Questions</label><input type="text" name="questions" value={editingArtifact.questions} onChange={handleInputChange} /></div>
              <div className="form-group"><label>UHL Check</label><input type="text" name="uhl_check" value={editingArtifact.uhl_check} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Sources</label><input type="text" name="sources" value={editingArtifact.sources} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Location (General)</label><input type="text" name="location_general" value={editingArtifact.location_general} onChange={handleInputChange} /></div>
              {/* Add more fields as needed */}
              <button className = "save-button" onClick={handleEditSave}>Save</button>
              <button className = "cancel-button" onClick={() => setShowEditForm(false)}>Cancel</button>
            </div>
          </div>
        )}
        <div className ="artifacts">
          {displayedArtifacts.map((artifact, index) => {
            const globalIndex = startIndex + index;
            return (
              <div key={globalIndex} className="artifact-item" onClick={() =>
                setExpandedArtifactIndex(expandedArtifactIndex === globalIndex ? null : globalIndex)}>
                <h3>{artifact.object_name}</h3>
                <p>{artifact.object_description}</p>
                <button onClick={() => handleEditClick(artifact)}>Edit</button>
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
