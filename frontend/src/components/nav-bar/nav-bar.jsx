import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
    // You might want to add a toast notification here instead of alert
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" style={{ 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="container">
        <Link 
          className="navbar-brand d-flex align-items-center" 
          to="/"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            letterSpacing: '1px'
          }}
        >
          <span style={{ color: '#00d4ff' }}>Learn</span>
          <span style={{ color: '#fff' }}>X</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item mx-2">
              <Link 
                className="nav-link position-relative" 
                to="/"
                style={{
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="nav-link-text">Home</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link 
                className="nav-link position-relative" 
                to="/posts"
                style={{
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="nav-link-text">🔥Trending Posts</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link 
                className="nav-link position-relative" 
                to="/learning-progress"
                style={{
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="nav-link-text">Learning Progress</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link 
                className="nav-link position-relative" 
                to="/learning-plans"
                style={{
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="nav-link-text">Learning Plans</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link 
                className="nav-link position-relative" 
                to="/about"
                style={{
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="nav-link-text">About</span>
                <span className="nav-link-underline"></span>
              </Link>
            </li>
          </ul>
          
          <div className="d-flex">
            <ul className="navbar-nav">
              {isAuthenticated ? (
                <>
                  <li className="nav-item mx-2">
                    <Link 
                      className="btn btn-outline-light btn-sm mx-1" 
                      to="/profile"
                      style={{
                        borderRadius: '20px',
                        padding: '0.35rem 1.25rem',
                        fontWeight: 500,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <button 
                      className="btn btn-danger btn-sm mx-1" 
                      onClick={handleLogout}
                      style={{
                        borderRadius: '20px',
                        padding: '0.35rem 1.25rem',
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        border: 'none'
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item mx-2">
                    <Link 
                      className="btn btn-outline-info btn-sm mx-1" 
                      to="/login"
                      style={{
                        borderRadius: '20px',
                        padding: '0.35rem 1.25rem',
                        fontWeight: 500,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link 
                      className="btn btn-info btn-sm mx-1" 
                      to="/register"
                      style={{
                        borderRadius: '20px',
                        padding: '0.35rem 1.25rem',
                        fontWeight: 500,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;