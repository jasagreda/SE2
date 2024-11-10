import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './BillingPayment.css';
import axios from 'axios';

function BillingPayment() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('tenants');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showBillForm, setShowBillForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showBillingLogsModal, setShowBillingLogsModal] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [billingLogs, setBillingLogs] = useState([]);
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [unittypes, setUnitTypes] = useState([]);
  const [balance, setBalance] = useState([]);
  const [balances, setBalances] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState("");
  const [amtPaid, setAmtPaid] = useState("");
  const [datePaid, setDatePaid] = useState("");

  useEffect(() => {
    axios.get('http://localhost:3001/contract')
    .then(result => {
      setContracts(result.data);
    })
    .catch(err => console.error('Error fetching contracts:', err));

    axios.get(`http://localhost:3001/users`)
    .then(result => {
        setTenants(result.data);
    })
    .catch(err => console.error('Error fetching tenants:', err));

    axios.get(`http://localhost:3001/unit`)
    .then(result => {
        setUnits(result.data);
    })
    .catch(err => console.error('Error fetching units:', err));

    axios.get(`http://localhost:3001/unittype`)
    .then(result => {
        setUnitTypes(result.data);
    })
    .catch(err => console.error('Error fetching unit types:', err));

    axios.get(`http://localhost:3001/balance`)
    .then(result => {
        setBalances(result.data || 0);
    })
    .catch(err => console.error('Error fetching balances:', err));

    axios.get(`http://localhost:3001/maintenance`)
    .then(result => {
        setMaintenance(result.data);
    })
    .catch(err => console.error('Error fetching maintenance:', err));
  }, []);

  const handleTenantClick = (contract) => {
    setSelectedTenant(contract);
    setShowBillForm(false);
    setShowPaymentForm(false);
    setShowBillingLogsModal(false);

    axios.get(`http://localhost:3001/getPayment/${contract._id}`)
    .then(response => {
      console.log("Payments retrieved:", response.data);
      setPaymentLogs(Array.isArray(response.data) ? response.data : []);
    })
    .catch(err => console.error('Error fetching payments:', err));

    axios.get(`http://localhost:3001/getBilling/${contract._id}`)
    .then(response => {
      console.log("Bills retrieved:", response.data);
      setBillingLogs(Array.isArray(response.data) ? response.data : []);
    })
    .catch(err => console.error('Error fetching bills:', err));

    axios.get(`http://localhost:3001/getBalance/${contract._id}`)
    .then(response => {
      console.log("Balance retrieved:", response.data);
      setBalance(response.data ? response.data : 0);
    })
    .catch(err => console.error('Error fetching balance:', err));
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    const { isLatePayment } = e.target.elements;
    const tenant = tenants.find((t) => t._id === selectedTenant.tenant);

    const currentMonth = new Date().getMonth();
    const existingBill = billingLogs.find(log =>
      log.contract === selectedTenant._id &&
      new Date(log.billDate).getMonth() === currentMonth
    );
    if (existingBill) {
      alert('A bill for this tenant and month already exists. Duplicate billing is not allowed.');
      return;
    }

    const currentBalance = balance.find(bal => bal.contract === selectedTenant._id)?.balance || 0;

    let totalAmount = parseFloat(currentBalance) + parseFloat(selectedTenant.monthlyRent);
    if (isLatePayment.checked) {
      totalAmount += totalAmount * 0.2; // Add 20% late fee
    }

    const billDate = new Date();
    const dueDate = new Date(billDate);
    dueDate.setDate(dueDate.getDate() + 30); // 30-day due date

    const newBill = {
      contract: selectedTenant._id,
      tenant: selectedTenant.tenant,
      rentAmount: parseFloat(selectedTenant.monthlyRent),
      totalAmount: totalAmount,
      billDate: billDate,
      dueDate: dueDate,
    };

    try {
      await axios.post("http://localhost:3001/createBill", newBill);
      console.log('Bill created successfully');

      const balanceForContract = balance.find(bal => bal.contract === selectedTenant._id);
      if (balanceForContract) {
        await axios.put(`http://localhost:3001/updateBalance/${selectedTenant._id}`, { contract: selectedTenant, balance: totalAmount });
        console.log('Balance updated successfully');
      } else {
        await axios.post("http://localhost:3001/createBalance", {
          contract: selectedTenant._id,
          balance: totalAmount
        });
        console.log('Balance created successfully');
        window.location.reload()
      }
    } catch (err) {
      console.error('Failed to create bill or update balance', err);
    }

    setShowBillForm(false);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    const { paymentAmount, paymentMode } = e.target.elements;

    const amount = parseFloat(paymentAmount.value);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount format. Please enter a number greater than zero.');
      return;
    }

    if (amount > balance.balance) {
      alert('Payment exceeds the balance due. Adjust the amount or proceed to record as credit.');
      return;
    }

    const mode = paymentMode.value;
    if (!['Cash', 'Check'].includes(mode)) {
      alert('Invalid payment mode selected.');
      return;
    }

    try {
      const newPayment = {
        contract: selectedTenant._id,
        tenant: selectedTenant.tenant,
        amount,
        date: new Date(),
        method: mode,
      };

      await axios.post("http://localhost:3001/createPayment", newPayment);

      const updatedBalance = parseFloat(balance.balance) - amount;

      await axios.put(`http://localhost:3001/updateBalance/${selectedTenant._id}`, { contract: selectedTenant, balance: updatedBalance });

      window.location.reload()
    } catch (err) {
      console.error('Failed to record payment or update balance', err);
    }

    setShowPaymentForm(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const amount = parseFloat(amtPaid);
    const today = new Date();
    const selectedDate = new Date(datePaid);

    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      alert("Date paid cannot precede current date.");
      return;
    }

    const paymentData = {
        maintenance: selectedMaintenance,
        amtPaid: parseFloat(amtPaid),
        datePaid: datePaid
    };

    axios.post('http://localhost:3001/maintenanceBal', paymentData)
        .then(() => {
            navigate('/maintenance');
        })
        .catch(err => console.log(err));
  };

  const handleViewSwitch = (view) => {
    setSelectedView(view);
    setSelectedTenant(null);
  };

  return (
    <div className="billing-payment tenant-container">
      <div className="view-toggle mb-3">
        <button
          className={`toggle-button ${selectedView === 'tenants' ? 'active' : ''}`}
          onClick={() => handleViewSwitch('tenants')}
        >
          Tenants
        </button>
        <button
          className={`toggle-button ${selectedView === 'maintenance' ? 'active' : ''}`}
          onClick={() => handleViewSwitch('maintenance')}
        >
          Maintenance
        </button>
      </div>
  
      {selectedView === 'tenants' ? (
        <div className="tenant-content unit-list">
          <h2>Tenants</h2>
          <ul className="list-unstyled mb-3">
            {contracts.map((contract) => {
              const tenant = tenants.find((t) => t._id === contract.tenant);
              const unit = units.find((u) => u._id === contract.unit);
              const unittype = unittypes.find((ut) => ut._id === unit?.unitType); // Using optional chaining
              const bal = balances.find((b) => b.contract === contract._id) || { balance: 0 };
  
              if (tenant && unit) {
                const unitDisplay = unittype?.unitType === 'UpNDown'
                  ? `U&D ${unit.unitNumber}`
                  : unittype?.unitType === 'StudioType'
                  ? `Studio ${unit.unitNumber}`
                  : unit.unitNumber;
  
                return (
                  <li key={contract._id} onClick={() => handleTenantClick(contract)} className="mb-2">
                    <strong>{tenant.firstName} {tenant.lastName}</strong> - {unitDisplay} (Balance: ₱{(bal.balance || 0).toFixed(2)})
                  </li>
                );
              }
              return null;
            })}
          </ul>
  
          {selectedTenant && (
            <div className="tenant-content tenant-details p-3">
              {(() => {
                const tenant = tenants.find((t) => t._id === selectedTenant.tenant);
                const unit = units.find((u) => u._id === selectedTenant.unit);
                const bal = balances.find((b) => b.contract === selectedTenant._id) || { balance: 0 };
                const unitDisplay = unit?.unitType === 'UpNDown'
                  ? `U&D ${unit.unitNumber}`
                  : unit?.unitType === 'StudioType'
                  ? `Studio ${unit.unitNumber}`
                  : unit?.unitNumber;
  
                return (
                  <>
                    <h2>{unitDisplay} - {tenant.firstName} {tenant.lastName}</h2>
                    <p><strong>Balance:</strong> ₱{(bal.balance || 0).toFixed(2)}</p>
  
                    <button onClick={() => setShowBillingLogsModal(true)} className="btn btn-primary mb-3">
                      View Billing Logs
                    </button>
  
                    {showBillingLogsModal && (
                      <div className="modal p-3">
                        <div className="modal-content">
                          <span className="close" onClick={() => setShowBillingLogsModal(false)}>&times;</span>
                          <h3>Billing Logs</h3>
                          <ul className="list-unstyled">
                            {billingLogs.filter(log => log.tenant === selectedTenant.tenant).map((log, index) => (
                              <li key={index}>
                                <strong>Rent:</strong> ₱{log.rentAmount} |
                                <strong> Total:</strong> ₱{log.totalAmount} |
                                <strong> Bill Date:</strong> {new Date(log.billDate).toLocaleDateString()} |
                                <strong> Due Date:</strong> {new Date(log.dueDate).toLocaleDateString()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
  
                    <div className="payment-logs p-3">
                      <h3>Payment Logs</h3>
                      <ul className="list-unstyled">
                        {paymentLogs.filter(log => log.tenant === selectedTenant.tenant).map((log, index) => (
                          <li key={index}>
                            <strong>Payment:</strong> ₱{log.amount} | <strong>Mode:</strong> {log.method} | <strong>Date:</strong> {log.date}
                          </li>
                        ))}
                      </ul>
                    </div>
  
                    <div className="form-buttons mb-3">
                      <button onClick={() => setShowBillForm(true)} className="btn btn-secondary me-2">Generate Bill</button>
                      <button onClick={() => setShowPaymentForm(true)} className="btn btn-secondary">Record Payment</button>
                    </div>
  
                    {showBillForm && (
                      <form onSubmit={handleCreateBill} className="p-3 border mb-3">
                        <h3>Create Bill</h3>
                        <div className="form-group mb-3">
                          <label>Monthly Rent: ₱{selectedTenant.monthlyRent}</label>
                        </div>
                        <div className="form-group mb-3">
                          <label>
                            <input type="checkbox" name="isLatePayment" /> Late Payment (Add 20%)
                          </label>
                        </div>
                        <button type="submit" className="btn btn-primary">Generate Bill</button>
                      </form>
                    )}
  
                    {showPaymentForm && (
                      <form onSubmit={handleRecordPayment} className="p-3 border">
                        <h3>Record Payment</h3>
                        <div className="form-group mb-3">
                          <label>Amount:</label>
                          <input type="number" name="paymentAmount" required />
                        </div>
                        <div className="form-group mb-3">
                          <label>Payment Mode:</label>
                          <select name="paymentMode" required>
                            <option value="Cash">Cash</option>
                            <option value="Check">Check</option>
                          </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Record Payment</button>
                      </form>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="maintenance-content p-3">
          <div className='tenant-content unit-list w-100'>
            <h2>Maintenance Payment</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label>Maintenance Record</label>
                    <select className='form-control' value={selectedMaintenance} onChange={(e) => setSelectedMaintenance(e.target.value)} required>
                        <option value="">Select Record</option>
                        {maintenance.map(record => {
                          const unit = units.find((u) => u._id === record.unit);
                          const unittype = unittypes.find((ut) => ut._id === unit?.unitType); // Safe access with optional chaining
                          const unitDisplay = unittype ? `${unittype.unitType}-${unit.unitNumber}` : unit ? unit.unitNumber : "Unknown Unit";
                            return (
                              <option key={record._id} value={record._id}>
                                {unitDisplay} {record.maintenanceType} (₱{record.cost.toFixed(2)})
                              </option>
                            )
                        })}
                    </select>
                </div>
                <div className="mb-2">
                    <label>Amount Paid</label>
                    <input type="number" className='form-control' value={amtPaid} onChange={(e) => setAmtPaid(e.target.value)} required />
                </div>
                <div className="mb-2">
                    <label>Date Paid:</label>
                    <input type="date" className='form-control' value={datePaid} onChange={(e) => setDatePaid(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}  

export default BillingPayment;
