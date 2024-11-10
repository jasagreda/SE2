import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import companylogo from './images/csaresidences.png';

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate('/login');
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="column">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li>
                                <Link to="/" className="nav-link text-white px-0 align-middle">
                                    <span className="title">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/tenants" className="nav-link text-white px-0 align-middle">
                                    <span className="title">Tenant Information</span>
                                </Link>
                            </li>
                            {/* <li>
                                <Link to="/history" className="nav-link text-white px-0 align-middle">
                                    <span className="title">Tenant History</span>
                                </Link>
                            </li> */}
                            <li>
                                <Link to="/billing" className="nav-link text-white px-0 align-middle">
                                    <span className="title">Billing & Payment</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/units" className="nav-link text-white px-0 align-middle">
                                    <span className="title">Unit Information</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/maintenance" className="nav-link text-white px-0 align-middle">
                                    <span className="title">Unit Maintenance</span>
                                </Link>
                            </li>
                            <button onClick={handleLogout} className="btn btn-danger mt-4">Logout</button>
                        </ul>
                    </div>
                </div>
                <div className="head">
                    <div className="logo">
                        <img src={companylogo} alt="Company Logo" />
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;