import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <div className="layout-container">
      <header className="layout-header">
        <Link to="/" className="logo-text">
          WorldMap
        </Link>

        <button
          className="menu-button"
          onClick={() => setMenuVisible(!isMenuVisible)}
        >
          ☰
        </button>

        <nav className={`layout-nav ${isMenuVisible ? "active" : ""}`}>
          <Link to="/" className="layout-link">
            홈
          </Link>
          <Link to="/population" className="layout-link">
            인구
          </Link>
          <Link to="/areas" className="layout-link">
            면적
          </Link>
          <Link to="/review" className="layout-link">
            게시판
          </Link>
        </nav>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
