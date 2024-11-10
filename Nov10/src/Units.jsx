import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./User.css";
import { FaTrash, FaEdit, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Units() {
    const [units, setUnits] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [collapsedTypes, setCollapsedTypes] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3001/unit')
            .then(result => {
                setUnits(result.data);
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:3001/unittype')
            .then(result => {
                setUnitTypes(result.data);
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:3001/contract')
            .then(result => {
                setContracts(result.data);
            })
            .catch(err => console.log(err));
    }, []);

    const DeleteUnit = (id) => {
        axios.delete('http://localhost:3001/deleteUnit/' + id)
            .then(res => { console.log(res); window.location.reload(); })
            .catch(err => console.log(err));
    };

    const toggleCollapse = (unitType) => {
        setCollapsedTypes(prev => ({ ...prev, [unitType]: !prev[unitType] }));
    };

    const getContractId = (unitId) => {
        const contract = contracts.find(contract => contract.unit === unitId);
        return contract ? contract._id : null;
    };

    const hasTenant = (unitId) => {
        return contracts.some(contract => contract.unit === unitId);
    };

    const displayedUnitTypeName = (unitType) => {
        return unitType === "UpNDown" ? "Up & Down" : unitType === "StudioType" ? "Studio-type" : unitType;
    };

    const groupedUnits = unitTypes.reduce((acc, unitType) => {
        const typeName = displayedUnitTypeName(unitType.unitType);
        acc[typeName] = {
            units: units.filter(unit => unit.unitType === unitType._id),
            id: unitType._id
        };
        return acc;
    }, {});

    return (
        <div className="user-container">
            <div className="user-content">
                <Link to="/unittype" className="btn btn-success"><FaPlus /></Link>
                
                {Object.keys(groupedUnits).map(unitType => (
                    <div key={unitType} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <button
                                onClick={() => toggleCollapse(unitType)}
                                className="btn btn-secondary w-100 d-flex justify-content-between align-items-center"
                            >
                                <span>{unitType} - {groupedUnits[unitType].units.length} units</span>
                                {collapsedTypes[unitType] ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            <Link to={`/unit/${groupedUnits[unitType].id}`} className="btn btn-success ms-2"><FaPlus />
                            </Link>
                        </div>

                        {collapsedTypes[unitType] && (
                            <table className="table mt-2">
                                <thead>
                                    <tr>
                                        <th>Unit No.</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedUnits[unitType].units.sort((a, b) => a.unitNumber - b.unitNumber).map(unit => {
                                        const contractId = getContractId(unit._id);
                                        return (
                                            <tr key={unit._id}>
                                                <td>{unit.unitNumber}</td>
                                                <td>{unit.rentAmount}</td>
                                                <td>
                                                    {hasTenant(unit._id) ? (
                                                        <><Link to={`/editUnit/${unit._id}`} className="btn btn-primary me-2"><FaEdit /></Link></>
                                                    ) : (
                                                        <><Link to={`/editUnit/${unit._id}`} className="btn btn-primary me-2"><FaEdit /></Link>
                                                        <button className="btn btn-danger" onClick={() => DeleteUnit(unit._id)}><FaTrash /></button></>
                                                    )}
                                                    
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Units;
