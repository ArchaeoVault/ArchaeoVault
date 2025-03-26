import React, { useState, useEffect, useRef } from "react";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import Header from "./Header";
import Footer from "./Footer";
import "./Artifacts2.css";

const Artifacts2 = () => {
  const [selectedArtifact, setSelectedArtifact] = useState("");
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const objectRef = useRef(null);
  const controlsRef = useRef(null);

  const descriptions = {
    bridalboss: "description1",
    key: "description2",
    musketball: "description3",
    fort: "description4",
  };

  useEffect(() => {
    // Initialize Three.js Scene (only once)
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 50);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Attach renderer to the container
      containerRef.current.appendChild(renderer.domElement);

      // Lights
      const topLight = new THREE.DirectionalLight(0xffffff, 10);
      topLight.position.set(500, 500, 500);
      scene.add(topLight);

      const ambientLight = new THREE.AmbientLight(0x333333, 5);
      scene.add(ambientLight);

      // Store references
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      controlsRef.current = new OrbitControls(camera, renderer.domElement);

      // Handle resize
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    }

    // Function to load a model
    const loadModel = (modelName) => {
      console.log(`Loading model from: ./models/${modelName}/scene.gltf`);

      const loader = new GLTFLoader();
      const scene = sceneRef.current;

      // Remove previous model
      if (objectRef.current) {
        scene.remove(objectRef.current);
        objectRef.current.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
        objectRef.current = null;
      }

      // Load new model
      loader.load(
        `./models/${modelName}/scene.gltf`,
        (gltf) => {
          objectRef.current = gltf.scene;
          scene.add(gltf.scene);
          console.log(`Model "${modelName}" loaded successfully.`);
        },
        (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
        (error) => console.error(`Error loading model "${modelName}":`, error)
      );
    };

    loadModel(selectedArtifact);
  }, [selectedArtifact]); // Runs every time the selected artifact changes

  return (
    <div className="artifacts-page">
      <Header />
      <main>
        <div id="infoSection">
          <label htmlFor="modelSelect">Select Artifact:</label>
          <select
            id="modelSelect"
            value={selectedArtifact}
            onChange={(e) => setSelectedArtifact(e.target.value)}>
            <option value="bridalboss">Bridal Boss</option>
            <option value="key">Key</option>
            <option value="musketball">Musket Ball</option>
            <option value="fort">Fort</option>
          </select>
          <p id="modelDescription">{descriptions[selectedArtifact]}</p>
        </div>
        <div id="container3D" ref={containerRef}></div>
      </main>
      <Footer />
    </div>
  );
};

export default Artifacts2;
