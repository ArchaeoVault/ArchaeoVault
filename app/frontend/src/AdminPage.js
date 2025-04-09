import React, { useState, useEffect } from "react";
// import Papa from "papaparse";
import Header from "./Header";
import Footer from "./Footer";
// import "./NewportArtifacts.css";
import './AdminPage.css';

const AdminPage = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [newArtifact, setNewArtifact] = useState({
    name: '',
    location: '',
    material: '',
    age: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArtifact({ ...newArtifact, [name]: value });
  };

  const handleAddArtifact = () => {
    if (!newArtifact.name || !newArtifact.location || !newArtifact.material || !newArtifact.age || !newArtifact.description) {
      alert('Please fill in all fields.');
      return;
    }
    setArtifacts([...artifacts, newArtifact]);
    setNewArtifact({ name: '', location: '', material: '', age: '', description: '' });
  };

  const handleDeleteArtifact = (index) => {
    const updatedArtifacts = artifacts.filter((_, i) => i !== index);
    setArtifacts(updatedArtifacts);
  };

  const handleEditArtifact = (index) => {
    const artifactToEdit = artifacts[index];
    setNewArtifact(artifactToEdit);
    handleDeleteArtifact(index);
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <div className="add-artifact-form">
          <h2>Add New Artifact</h2>
          <input
            type="text"
            name="name"
            placeholder="Artifact Name"
            value={newArtifact.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location Found"
            value={newArtifact.location}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="material"
            placeholder="Material"
            value={newArtifact.material}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="age"
            placeholder="Estimated Age"
            value={newArtifact.age}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newArtifact.description}
            onChange={handleInputChange}
          />
          <button onClick={handleAddArtifact}>Add Artifact</button>
        </div>
        <div className="artifact-list">
          <h2>Manage Artifacts</h2>
          {artifacts.length === 0 ? (
            <p>No artifacts available.</p>
          ) : (
            artifacts.map((artifact, index) => (
              <div key={index} className="artifact-item">
                <h3>{artifact.name}</h3>
                <p><strong>Location:</strong> {artifact.location}</p>
                <p><strong>Material:</strong> {artifact.material}</p>
                <p><strong>Estimated Age:</strong> {artifact.age}</p>
                <p><strong>Description:</strong> {artifact.description}</p>
                <button onClick={() => handleEditArtifact(index)}>Edit</button>
                <button onClick={() => handleDeleteArtifact(index)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default AdminPage;