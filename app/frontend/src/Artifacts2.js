import React, { useState, useEffect, useRef } from "react";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/build/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/build/jsm/loaders/GLTFLoader.js";
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
    tibiawhole: "",
    tibiasmallpiece: "",
    tibiamediumpiece: "",
    tibialargepiece: "",
    stonewarehandlepiece: "Curved handle piece",
    rhenishstone: "Salt glazed Rhenish Stoneware",
    pipestem: "Brown smoking stem",
    pigtooth: "Pig; Molar 1; develops at 4-6 months; permenant; less wear; partially broken",
    leftwhitetaileddeermandible: "",
    largetooth: "Pre-molar; 2nd tooth; bovine; 18-30 months for the growth of said tooth",
    glassbottletop: "",
    earthenware: "A floral motif printed underglazed earthenware (deep blue with white accents) with the makers mark ADA",
    bridalboss: "",
    key: "",
    musketball: "",
  };

  useEffect(() => {
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
      containerRef.current.appendChild(renderer.domElement);

      const topLight = new THREE.DirectionalLight(0xffffff, 4);
      topLight.position.set(500, 500, 500);
      scene.add(topLight);

      const ambientLight = new THREE.AmbientLight(0x333333, 3);
      scene.add(ambientLight);

      const backLight = new THREE.DirectionalLight(0xffffff, 2);
      backLight.position.set(-500, -500, -500);
      scene.add(backLight);

      const sideLight = new THREE.DirectionalLight(0xffffff, 1.5);
      sideLight.position.set(500, -500, 500);
      scene.add(sideLight);

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      controlsRef.current = new OrbitControls(camera, renderer.domElement);

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    }

    const loadModel = (modelName) => {
      console.log(`Loading model from: ./models/${modelName}/scene.gltf`);

      const loader = new GLTFLoader();
      const scene = sceneRef.current;

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
            const desiredSize = 20;
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
  }, [selectedArtifact]);

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
            onChange={(e) => setSelectedArtifact(e.target.value)}
          >
            <option value="" disabled hidden>Select An Artifact!</option>
            <option value="stonewaresurfacefind">Stoneware Surface Find</option>
            <option value="tibiawhole">Tibia Whole</option>
            <option value="tibiasmallpiece">Tibia Small Piece</option>
            <option value="tibiamediumpiece">Tibia Medium Piece</option>
            <option value="tibialargepiece">Tibia Large Piece</option>
            <option value="stonewarehandlepiece">Stoneware Handle Piece</option>
            <option value="rhenishstone">Rhenish Stone</option>
            <option value="pipestem">Pipestem</option>
            <option value="pigtooth">Pig tooth</option>
            <option value="leftwhitetaileddeermandible">Left Whitetailed Deer Mandible</option>
            <option value="largetooth">Large Tooth</option>
            <option value="glassbottletop">Glass Bottle Top</option>
            <option value="earthenware">Earthenware</option>
            <option value="bridalboss">Bridal Boss</option>
            <option value="key">Key</option>
            <option value="musketball">Musket Ball</option>
          </select>
          <br />
          <br />
          <p id="modelDescription">{descriptions[selectedArtifact]}</p>
          {selectedArtifact && (
            <p id="movementInstructions">Click and drag the artifact to move.</p>
          )}
        </div>
        <div id="container3D" ref={containerRef}></div>
      </main>
      <Footer />
    </div>
  );
};

export default Artifacts2;
