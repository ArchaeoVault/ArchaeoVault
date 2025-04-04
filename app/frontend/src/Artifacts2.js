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
    stonewaresurfacefind: "Stoneware; brown salt glaze; rim; with various rows of lines",
    tibiawhole: "description2",
    tibiasmallpiece: "description3",
    tibiamediumpiece: "description4",
    tibialargepiece: "description5",
    stonewarehandlepiece: "Curved handle piece",
    rhenishstone: "Salt glazed Rhenish Stoneware",
    pipestem: "Brown smoking stem",
    pigtooth: "Pig; Molar 1; develops at 4-6 months; permenant; less wear; partially broken",
    leftwhitetaileddeermandible: "description10",
    largetooth: "Pre-molar; 2nd tooth; bovine; 18-30 months for the growth of said tooth",
    glassbottletop: "description12",
    earthenware: "A floral motif printed underglazed earthenware (deep blue with white accents) with the makers mark ADA",

    bridalboss: "description14",
    key: "description15",
    musketball: "description16",
    fort: "description17",
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
      const topLight = new THREE.DirectionalLight(0xffffff, 4);
      topLight.position.set(500, 500, 500);
      scene.add(topLight);

      const ambientLight = new THREE.AmbientLight(0x333333, 3);
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
          if (["stonewaresurfacefind", "fort"].includes(modelName)) {
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            box.getSize(size);
            const center = new THREE.Vector3();
            box.getCenter(center);
            gltf.scene.position.sub(center);
      
            const maxDim = Math.max(size.x, size.y, size.z);
            const desiredSize = 20; // adjust this to fit your preferred size
            const scale = desiredSize / maxDim;
            gltf.scene.scale.setScalar(scale);
          }
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
          <label htmlFor="modelSelect"></label>
          <select
            id="modelSelect"
            className="dropdown-select"
            value={selectedArtifact}
            onChange={(e) => setSelectedArtifact(e.target.value)}>
            <option value="stonewaresurfacefind">stonewaresurfacefind</option>
            <option value="tibiawhole">tibiawhole</option>
            <option value="tibiasmallpiece">tibiasmallpiece</option>
            <option value="tibiamediumpiece">tibiamediumpiece</option>
            <option value="tibialargepiece">tibialargepiece</option>
            <option value="stonewarehandlepiece">stonewarehandlepiece</option>
            <option value="rhenishstone">rhenishstone</option>
            <option value="pipestem">pipestem</option>
            <option value="pigtooth">pigtooth</option>
            <option value="leftwhitetaileddeermandible">leftwhitetaileddeermandible</option>
            <option value="largetooth">largetooth</option> 
            <option value="glassbottletop">glassbottletop</option>
            <option value="earthenware">earthenware</option>

            <option value="bridalboss">Bridal Boss</option>
            <option value="key">Key</option>
            <option value="musketball">Musket Ball</option>
            <option value="fort">Fort</option>
          </select>
          <br />
          <br />
          <p id="modelDescription">{descriptions[selectedArtifact]}</p>
        </div>
        <div id="container3D" ref={containerRef}></div>
      </main>
      <Footer />
    </div>
  );
};

export default Artifacts2;
