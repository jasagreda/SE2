import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

function CreateContract() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [unit, setUnit] = useState({});
    const [unitTypes, setUnitTypes] = useState();
    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState("");
    const [dateOfContract, setDateOfContract] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [monthlyRent, setMonthlyRent] = useState('');
    const [advance, setAdvance] = useState('');
    const [securityDeposit, setSecurityDeposit] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:3001/getUnit/${id}`)
            .then(result => {
                const unitData = result.data;
                setUnit(unitData);
                const rentAmount = unitData.rentAmount;
                    setMonthlyRent(rentAmount);
                    setAdvance(rentAmount);
                    setSecurityDeposit(rentAmount);
            })
            .catch(err => console.error('Error fetching unit:', err));

        axios.get(`http://localhost:3001/unittype`)
            .then(result => {
                const unitData = result.data;
                setUnitTypes(unitData);
            })
            .catch(err => console.error('Error fetching unit types:', err));

        axios.get(`http://localhost:3001/users`)
            .then(result => {
                setTenants(result.data);
            })
            .catch(err => console.error('Error fetching tenants:', err));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start < today) {
            setError('Start Date not allowed. Date must not precede the current day.');
            return;
        }

        if (end < start) {
            setError('End date cannot be before the start date.');
            return;
        }

        const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (diffInMonths < 6) {
            setError('Rental duration must be at least 6 months.');
            return;
        }

        if (!endDate) {
            setError('End date is required.');
            return;
        }

        setError('');
        const contractData = {
            unit: id,
            tenant: selectedTenant,
            dateOfContract,
            startDate,
            endDate,
            monthlyRent,
            advance,
            securityDeposit
        };

        axios.post("http://localhost:3001/createContract", contractData)
            .then(result => {
                console.log('Contract created:', result);
                navigate('/');
            })
            .catch(err => console.error('Error creating contract:', err));
    };

    return (
        <div className='user-container'>
            <div className='user-content'>
                <form onSubmit={handleSubmit}>
                    <h1>Contract Registration</h1>
                    <h2>Unit {unit.unitNumber}</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className='mb-2'>
                        <label htmlFor="tenant">Tenant</label>
                        <select
                            id="tenant"
                            className='form-control'
                            value={selectedTenant}
                            onChange={(e) => setSelectedTenant(e.target.value)} required
                        >
                            <option value="">Select Tenant</option>
                            {tenants.map((tenant) => (
                                <option key={tenant._id} value={tenant._id}>
                                    {tenant.lastName}, {tenant.firstName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="dateOfContract">Date of Contract</label>
                        <input
                            type="date"
                            id="dateOfContract"
                            className='form-control'
                            value={dateOfContract}
                            onChange={(e) => setDateOfContract(e.target.value)} required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="startDate">Rent Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            className='form-control'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)} required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="endDate">Rent End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            className='form-control'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)} required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="monthlyRent">Monthly Rent</label>
                        <input
                            type="text"
                            id="monthlyRent"
                            className='form-control'
                            value={monthlyRent}
                            readOnly
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="advance">Advance</label>
                        <input
                            type="text"
                            id="advance"
                            className='form-control'
                            value={advance}
                            readOnly
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="securityDeposit">Security Deposit</label>
                        <input
                            type="text"
                            id="securityDeposit"
                            className='form-control'
                            value={securityDeposit}
                            readOnly
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className='btn btn-success me-2'>Save</button>
                        <button type="button" className='btn btn-secondary' onClick={() => navigate('/')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateContract;