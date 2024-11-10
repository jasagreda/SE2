import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./User.css";
import { FaEdit, FaPlus } from 'react-icons/fa';

function Maintenance() {
    const [maintenance, setMaintenance] = useState([]);
    const [units, setUnits] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [balances, setBalances] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/unit')
            .then(result => setUnits(result.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:3001/unittype')
            .then(result => setUnitTypes(result.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:3001/maintenance')
            .then(result => setMaintenance(result.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:3001/maintenanceBal')
        .then(result => {
            const balanceMap = {};
            result.data.forEach(payment => {
                if (!balanceMap[payment.maintenance]) {
                    balanceMap[payment.maintenance] = 0;
                }
                balanceMap[payment.maintenance] += payment.amtPaid;
            });
            setBalances(balanceMap);
        })
        .catch(err => console.log(err));
    }, []);

    const getUnitInfo = (unitId) => {
        const unit = units.find(u => u._id === unitId);
        if (unit) {
            const unitType = unitTypes.find(type => type._id === unit.unitType);
            return `${unitType ? unitType.unitType : "Unknown"} - ${unit.unitNumber}`;
        }
        return "Unknown Unit";
    };

    const formatDueDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(date);
    };

    const calculateBalance = (maintenance) => {
        const totalPaid = balances[maintenance._id] || 0;
        return maintenance.cost - totalPaid;
    };

    return (
        <div className="user-container">
            <div className='user-content'>
                <Link to="/newmaintenance" className="btn btn-success"><FaPlus /></Link>
                <table className='table mt-2'>
                    <thead>
                        <tr>
                            <th>Unit</th>
                            <th>Maintenance</th>
                            <th>Cost</th>
                            <th>Due</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maintenance.map(record => (
                            <tr key={record._id}>
                                <td>{getUnitInfo(record.unit)}</td>
                                <td>{record.maintenanceType}</td>
                                <td>₱{record.cost.toFixed(2)}</td>
                                <td>{formatDueDate(record.dueDate)}</td>
                                <td>₱{calculateBalance(record).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Maintenance;