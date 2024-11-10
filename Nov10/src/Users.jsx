import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./User.css";
import { FaEdit } from 'react-icons/fa';

function Users() {
    const [units, setUnits] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [selectedType, setSelectedType] = useState("");

    useEffect(() => {
        axios.get('http://localhost:3001/unit')
            .then(result => {
                setUnits(result.data);
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:3001/unittype')
            .then(result => {
                setUnitTypes(result.data);
                if (result.data.length > 0) {
                    setSelectedType(result.data[0]._id);
                }
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:3001/contract')
            .then(result => {
                setContracts(result.data);
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:3001/users')
            .then(result => {
                setTenants(result.data);
            })
            .catch(err => console.log(err));
    }, []);

    const getTenantName = (unitId) => {
        const contract = contracts.find((contract) => contract.unit === unitId);
        if (contract) {
            const tenant = tenants.find((tenant) => tenant._id === contract.tenant);
            return tenant ? `${tenant.lastName}, ${tenant.firstName}` : "-";
        }
        return "-";
    };

    const getContractId = (unitId) => {
        const contract = contracts.find((contract) => contract.unit === unitId);
        return contract ? contract._id : null;
    };

    const hasTenant = (unitId) => {
        return contracts.some((contract) => contract.unit === unitId);
    };

    const displayedUnitTypeName = (unitType) => {
        return unitType === "UpNDown" ? "Up & Down" : unitType === "StudioType" ? "Studio-type" : unitType;
    };

    const groupedUnits = unitTypes.reduce((acc, unitType) => {
        const typeName = displayedUnitTypeName(unitType.unitType);
        const unitsForType = units.filter(unit => unit.unitType.toString() === unitType._id.toString());
        
        acc[typeName] = {
            units: unitsForType,
            id: unitType._id
        };
        return acc;
    }, {});

    return (
        <div className="user-container">
            <div className='user-content'>
                <div className="btn-group mb-3">
                    {unitTypes.map(unitType => (
                        <button
                            key={unitType._id}
                            className={`btn ${selectedType === unitType._id ? "btn-primary" : "btn-secondary"}`}
                            onClick={() => setSelectedType(unitType._id)}
                        >
                            {displayedUnitTypeName(unitType.unitType)}
                        </button>
                    ))}
                </div>
                <table className='table mt-2'>
                    <thead>
                        <tr>
                            <th>Unit Number</th>
                            <th>Tenant</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedUnits).map(([typeName, group]) => {
                            if (group.id === selectedType) {
                                return (
                                    <React.Fragment key={group.id}>
                                        {group.units.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="text-center">No units found for this type.</td>
                                            </tr>
                                        ) : (
                                            group.units.sort((a, b) => a.unitNumber - b.unitNumber).map(unit => {
                                                const contractId = getContractId(unit._id);
                                                return (
                                                    <tr key={unit._id}>
                                                        <td>{unit.unitNumber}</td>
                                                        <td>{getTenantName(unit._id)}</td>
                                                        <td>
                                                            {hasTenant(unit._id) ? (
                                                                <>
                                                                    <Link to={`/details/${unit._id}`} className='btn btn-success me-2'>Details</Link>
                                                                    <Link to={`/updateContract/${contractId}`} className='btn btn-success me-2'> <FaEdit /> </Link>
                                                                </>
                                                            ) : (
                                                                <Link to={`/contract/${unit._id}`} className='btn btn-success me-2'>Register</Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </React.Fragment>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
