import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import googleAuthService from '../services/googleAuthService';

const GoogleCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract authorization code from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (!code) {
          setError('No authorization code found');
          setLoading(false);
          return;
        }

        console.log('Received auth code:', code);

        // Send code to backend for authentication
        await googleAuthService.handleGoogleCallback(code);
        
        // Redirect to dashboard on success
        navigate('/dashboard');
      } catch (error) {
        console.error('Error during Google callback:', error);
        setError(error.error || 'Failed to authenticate with Google');
        setLoading(false);
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Completing Google login...</h4>
          <p className="text-muted">Please wait while we process your login</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback; 
