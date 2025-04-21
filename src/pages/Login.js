import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import googleAuthService from '../services/googleAuthService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await authService.login(username, password);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.error || 'Login failed, please try again later';
      setMessage(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage('');
    setGoogleLoading(true);
    
    try {
      await googleAuthService.signInWithGoogle();
      // The page will be redirected to Google's auth page
    } catch (error) {
      const errorMessage = error.error || 'Google login failed, please try again later';
      console.log("login error", error);
      setMessage(errorMessage);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Login</h2>
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
              
              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="px-3 text-secondary">OR</span>
                <hr className="flex-grow-1" />
              </div>
              
              <div className="d-grid">
                <button 
                  onClick={handleGoogleLogin} 
                  className="btn btn-outline-danger" 
                  disabled={googleLoading}
                >
                  {googleLoading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : <i className="bi bi-google me-2"></i>}
                  {googleLoading ? 'Connecting...' : 'Login with Google'}
                </button>
              </div>

              {message && (
                <div className="alert alert-danger mt-3" role="alert">
                  {message}
                </div>
              )}

              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/register" className="text-decoration-none">Register now</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 
