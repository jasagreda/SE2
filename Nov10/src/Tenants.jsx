import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Tenants.css";
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

function Tenants() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/users')
        .then(result => {
            const formattedUsers = result.data.map(user => ({
                ...user,
                dateOfBirth: new Date(user.dateOfBirth).toLocaleDateString('en-US')
            }));
            setUsers(formattedUsers);
        })
        .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/deleteUser/' + id)
        .then(res => {
            console.log(res);
            window.location.reload();
        })
        .catch(err => console.log(err));
    };

    const showDetails = (user) => {
        setSelectedUser(user);
    };

    const closeModal = () => {
        setSelectedUser(null);
    };

    return (
        <div className="tenant-container">
            <div className="tenant-content">
                <Link to="/create" className="btn btn-success"> <FaPlus/> </Link>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact No.</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.lastName}, {user.firstName}</td>
                                <td>{user.contactNumber}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Link to={`/update/${user._id}`} className="btn btn-success me-2"> <FaEdit/> </Link>
                                    <button className="btn btn-danger me-2"
                                        onClick={() => handleDelete(user._id)}> <FaTrash/> </button>
                                    <button className="btn btn-info"
                                        onClick={() => showDetails(user)}> Details </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedUser && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h3>Tenant Details</h3>
                            <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                            <p><strong>Date of Birth:</strong> {selectedUser.dateOfBirth}</p>
                            <p><strong>Gender:</strong> {selectedUser.gender}</p>
                            <p><strong>Contact Number:</strong> {selectedUser.contactNumber}</p>
                            <p><strong>Current Address:</strong> {selectedUser.currentAddress}</p>
                            <p><strong>Emergency Contact:</strong> {selectedUser.emergencyName} - {selectedUser.emergencyNumber}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tenants;
