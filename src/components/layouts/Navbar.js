import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img
            src="https://logodix.com/logo/799991.png"
            alt="Logo"
            height="40"
            width="40"
          />
        </div>
        <ul className={`navbar-links ${showMenu ? 'show' : ''}`}>
          <li>
            <a href="/" className="navbar-link">
              Home
            </a>
          </li>
          <li>
            <a href="/classes" className="navbar-link">
              Classes
            </a>
          </li>
          <li>
            <a href="/chapters" className="navbar-link">
              Chapters
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <button className="navbar-button">SignIn/Signup</button>
      </div>
      <button className="navbar-toggler" onClick={toggleMenu}>
        <span className="navbar-toggler-icon" />
      </button>
    </nav>
  );
};

export default Navbar;
