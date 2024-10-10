import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.css';
import companylogo from './images/csaresidences.png';

function Dashboard() {
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
                            <li>
                                <Link to="/history" className="nav-link text-white px-0 align-middle">
                                    <span className="title">Tenant History</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/billing" className="nav-link text-white px-0 align-middle">
                                    <span className="title">Billing & Payment</span>
                                </Link>
                            </li>
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
