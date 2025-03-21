import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Header from "./Header";
import Footer from "./Footer";
import "./list.css";

const List = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const artifactsPerPage = 5;

  useEffect(() => {
    fetch("/cleaned_data.csv")
      .then((response) => {
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          delimiter: ",",
          complete: (result) => {
            const filteredArtifacts = result.data.map((artifact) => ({
              name: artifact["Object Name"],
              description: artifact["Object Description"],
            }));
            setArtifacts(filteredArtifacts);
          },
        });
      })
  }, []);

  useEffect(() => {
    console.log("Artifacts State:", artifacts); // Check state updates
  }, [artifacts]);

  const startIndex = currentPage * artifactsPerPage;
  const displayedArtifacts = artifacts.slice(startIndex, startIndex + artifactsPerPage);
  return (
    <div className="artifact-page">
      <Header />
      <div className="artifact-list">
        <h2>Artifacts</h2>
        <div className="artifacts">
          {displayedArtifacts.length === 0 ? (
            <p>No artifacts available</p>
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
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.floor(artifacts.length / artifactsPerPage))
              )
            }
            disabled={startIndex + artifactsPerPage >= artifacts.length}
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