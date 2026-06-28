
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">DevHub</Link>

          <button className="navbar-toggle" onClick={() => setMenuOpen(o => !o)}>☰</button>

          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/developers" onClick={() => setMenuOpen(false)}>Developers</Link>
            <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>

            {!user ? (
              <>
                <Link to="/login" className="btn-link" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-link btn-link-primary" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
                ) : (
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                )}
                <Link to={`/profile/${user._id}`} onClick={() => setMenuOpen(false)}>
                  <span className="navbar-avatar">{user.name[0].toUpperCase()}</span>
                </Link>
                <button className="btn-link btn-link-danger" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}