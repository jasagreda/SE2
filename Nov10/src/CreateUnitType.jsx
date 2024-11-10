import React, { useState } from "react";
import axios from 'axios'
import { useNavigate} from 'react-router-dom'

function CreateUnitType () {
    const [unitType, setUnitType] = useState()
    const [customUnitType, setCustomUnitType] = useState('');
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')

    const Submit = (e) => {
        e.preventDefault();
        const finalUnitType = unitType === "Other" ? customUnitType : unitType;
        axios.get(`http://localhost:3001/unitExists/${finalUnitType}`)
            .then(response => {
                if (response.data.exists) {
                    setErrorMessage("Unit type already exists. Please create a new unit type.");
                } else {
                    axios.post("http://localhost:3001/createUnitType", { unitType: finalUnitType })
                    .then(result => {
                        console.log(result)
                        navigate('/units')
                    })
                    .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err));
    }

    const handleCancel = () => {
        navigate('/units');
    }

    return (
        <div className='user-container'>
            <div className='user-content'>
                <form onSubmit={Submit}>
                    <h2>New Unit Type</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                    <div className='mb-2'>
                        <label htmlFor="unitType">Unit Type</label>
                        <select id="unitType" className='form-control' onChange={(e) => setUnitType(e.target.value)} required>
                            <option value="">Select Type</option>
                            <option value="UpNDown">Up & Down</option>
                            <option value="StudioType">Studio-type</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {unitType === "Other" && (
                        <div className='mb-2'>
                            <label htmlFor="customUnitType">Enter Custom Unit Type</label>
                            <input
                                type="text"
                                id="customUnitType"
                                className='form-control'
                                value={customUnitType}
                                onChange={(e) => setCustomUnitType(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="button-group">
                        <button type="submit" className='btn btn-success me-2'>Save</button>
                        <button type="button" className='btn btn-secondary' onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateUnitType;