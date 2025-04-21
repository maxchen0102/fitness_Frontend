import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (!currentUser) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* 側邊欄 */}
        <div className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse" style={{ minHeight: '100vh' }}>
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <h4 className="text-white">健身追蹤系統</h4>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active text-white" href="#dashboard">
                  <i className="bi bi-speedometer2 me-2"></i>
                  儀表板
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#workouts">
                  <i className="bi bi-activity me-2"></i>
                  訓練記錄
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#progress">
                  <i className="bi bi-graph-up me-2"></i>
                  進度追蹤
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#profile">
                  <i className="bi bi-person me-2"></i>
                  個人檔案
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 主要內容 */}
        <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">儀表板</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="d-flex align-items-center">
                <span className="me-3">歡迎, {currentUser.username}</span>
                <button onClick={handleLogout} className="btn btn-danger">登出</button>
              </div>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="card-title text-primary">本週訓練</h3>
                  <p className="display-4 fw-bold">0 次</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="card-title text-success">本月訓練</h3>
                  <p className="display-4 fw-bold">0 次</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="card-title text-info">累計訓練</h3>
                  <p className="display-4 fw-bold">0 次</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">最近活動</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted text-center py-5">尚無訓練記錄</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">目標</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted text-center py-5">尚未設定目標</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
