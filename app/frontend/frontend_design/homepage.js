import React from 'react';

const HomePage = () => {
  return (
    <div>
      <header>
        <h1>Welcome to ArcheoVault</h1>
        <nav>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#artifacts">Artifacts</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section id="about">
        <h2>About Us</h2>
        <p>ArcheoVault is a platform for uploading and viewing archaeology artifacts from Portsmouth and Newport, RI.</p>
      </section>

      <section id="artifacts">
        <h2>Artifacts</h2>
        <p>Explore 3D models, descriptions, and details of historical artifacts.</p>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>Email us at: <a href="mailto:info@archeovault.com">info@archeovault.com</a></p>
      </section>

      <footer>
        <p>&copy; 2025 ArcheoVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
