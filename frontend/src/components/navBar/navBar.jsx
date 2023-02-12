import React from 'react'
import { Link } from 'react-router-dom'
import "./NavBar.css";

const navBar = () => {
  return (
    <div>
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/" className="navbar-link">Home</Link></li>
      </ul>
    </nav>
    </div>
  )
}

export default navBar
