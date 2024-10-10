import React, { useState } from 'react';
import './BillingPayment.css';

function BillingPayment() {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showBillForm, setShowBillForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showBillingLogsModal, setShowBillingLogsModal] = useState(false);
  const [units, setUnits] = useState([
    { unit: 'Studio 1', tenant: 'John Doe', type: 'Studio', rate: 5000, balance: 0 },
    { unit: 'Studio 2', tenant: 'Jane Smith', type: 'Studio', rate: 5000, balance: 0 },
    { unit: 'Up and Down 6', tenant: 'Michael Johnson', type: 'Up&Down', rate: 12000, balance: 0 }
  ]);
  const [billingLogs, setBillingLogs] = useState([]);
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [maintenanceIncluded, setMaintenanceIncluded] = useState(false);
  const [maintenanceAmount, setMaintenanceAmount] = useState('');

  const handleTenantClick = (tenant) => {
    setSelectedTenant(tenant);
    setShowBillForm(false);
    setShowPaymentForm(false);
    setShowBillingLogsModal(false); // Ensure modal is hidden when tenant changes
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    const { isLatePayment } = e.target.elements;

    const currentMonth = new Date().getMonth();
    const existingBill = billingLogs.find(log =>
      log.tenant === selectedTenant.tenant &&
      new Date(log.billDate).getMonth() === currentMonth
    );
    if (existingBill) {
      alert('A bill for this tenant and month already exists. Duplicate billing is not allowed.');
      return;
    }

    let totalAmount = selectedTenant.rate;
    if (isLatePayment.checked) {
      totalAmount += totalAmount * 0.2; // Add 20% late fee
    }

    if (maintenanceIncluded) {
      if (!maintenanceAmount || maintenanceAmount <= 0) {
        alert('Please provide a valid maintenance amount.');
        const maintenanceInput = document.getElementsByName('maintenanceAmount')[0];
        maintenanceInput.classList.add('error');
        maintenanceInput.focus();
        return;
      }
      totalAmount += parseFloat(maintenanceAmount);
    }

    const billDate = new Date();
    const dueDate = new Date(billDate);
    dueDate.setDate(dueDate.getDate() + 30); // 30-day due date

    setBillingLogs([...billingLogs, {
      tenant: selectedTenant.tenant,
      unit: selectedTenant.unit,
      rentAmount: selectedTenant.rate,
      maintenanceAmount: maintenanceIncluded ? parseFloat(maintenanceAmount) : 'N/A',
      totalAmount: totalAmount,
      billDate: billDate.toLocaleDateString(),
      dueDate: dueDate.toLocaleDateString()
    }]);

    const updatedUnits = units.map(u => {
      if (u.tenant === selectedTenant.tenant) {
        return { ...u, balance: u.balance + totalAmount };
      }
      return u;
    });
    setUnits(updatedUnits);

    alert('Bill created successfully.');
    setShowBillForm(false);
    setMaintenanceIncluded(false);
    setMaintenanceAmount('');
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const { paymentAmount, paymentMode } = e.target.elements;

    const amount = parseFloat(paymentAmount.value);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount format. Please enter a number greater than zero.');
      return;
    }

    if (amount > selectedTenant.balance) {
      alert('Payment exceeds the balance due. Adjust the amount or proceed to record as credit.');
      return;
    }

    const mode = paymentMode.value;
    if (!['Cash', 'Check'].includes(mode)) {
      alert('Invalid payment mode selected.');
      return;
    }

    setPaymentLogs([...paymentLogs, {
      tenant: selectedTenant.tenant,
      unit: selectedTenant.unit,
      paymentAmount: amount,
      paymentMode: mode,
      paymentDate: new Date().toLocaleDateString()
    }]);

    const updatedUnits = units.map(u => {
      if (u.tenant === selectedTenant.tenant) {
        return { ...u, balance: u.balance - amount };
      }
      return u;
    });
    setUnits(updatedUnits);

    alert('Payment recorded successfully.');
    setShowPaymentForm(false);
  };

  const toggleMaintenance = () => {
    setMaintenanceIncluded(!maintenanceIncluded);
    setMaintenanceAmount('');
    const maintenanceInput = document.getElementsByName('maintenanceAmount')[0];
    if (maintenanceInput) {
      maintenanceInput.classList.remove('error');
    }
  };

  const openBillingLogsModal = () => {
    setShowBillingLogsModal(true);
  };

  const closeBillingLogsModal = () => {
    setShowBillingLogsModal(false);
  };

  return (
    <div className="billing-payment tenant-container">
      <div className="tenant-content unit-list">
        <h2>Tenants</h2>
        <ul>
          {units.map((tenant) => (
            <li key={tenant.unit} onClick={() => handleTenantClick(tenant)}>
              <strong>{tenant.tenant}</strong> - {tenant.unit} (Balance: ₱{tenant.balance.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>

      {selectedTenant && (
        <div className="tenant-content tenant-details">
          <h2>{selectedTenant.unit} - {selectedTenant.tenant}</h2>
          <p><strong>Balance:</strong> ₱{selectedTenant.balance.toFixed(2)}</p>

          {/* Billing Logs Button */}
          <button onClick={openBillingLogsModal}>View Billing Logs</button>

          {/* Billing Logs Modal */}
          {showBillingLogsModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeBillingLogsModal}>&times;</span>
                <h3>Billing Logs</h3>
                <ul>
                  {billingLogs
                    .filter(log => log.tenant === selectedTenant.tenant)
                    .map((log, index) => (
                      <li key={index}>
                        <strong>Rent:</strong> ₱{log.rentAmount} | <strong>Maintenance:</strong> ₱{log.maintenanceAmount} | <strong>Total:</strong> ₱{log.totalAmount} | <strong>Bill Date:</strong> {log.billDate} | <strong>Due Date:</strong> {log.dueDate}
                      </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Payment Logs */}
          <div className="payment-logs">
            <h3>Payment Logs</h3>
            <ul>
              {paymentLogs
                .filter(log => log.tenant === selectedTenant.tenant)
                .map((log, index) => (
                  <li key={index}>
                    <strong>Payment:</strong> ₱{log.paymentAmount} | <strong>Mode:</strong> {log.paymentMode} | <strong>Date:</strong> {log.paymentDate}
                  </li>
              ))}
            </ul>
          </div>

          {/* Buttons to show forms */}
          <div className="form-buttons">
            <button onClick={() => setShowBillForm(true)}>Generate Bill</button>
            <button onClick={() => setShowPaymentForm(true)}>Record Payment</button>
          </div>

          {/* Bill Creation Form */}
          {showBillForm && (
            <form onSubmit={handleCreateBill}>
              <h3>Create Bill</h3>

              <div className="form-group">
                <label>Monthly Rent: ₱{selectedTenant.rate}</label>
              </div>

              <div className="form-group">
                <label>
                  <input type="checkbox" name="isLatePayment" /> Late Payment (Add 20%)
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input type="checkbox" onChange={toggleMaintenance} /> Add Maintenance Bill
                </label>
              </div>

              {maintenanceIncluded && (
                <div className="form-group">
                  <input
                    type="number"
                    name="maintenanceAmount"
                    value={maintenanceAmount}
                    onChange={(e) => setMaintenanceAmount(e.target.value)}
                    placeholder="Maintenance Amount"
                    required
                  />
                </div>
              )}

              <button type="submit">Create Bill</button>
            </form>
          )}

          {/* Payment Recording Form */}
          {showPaymentForm && (
            <form onSubmit={handleRecordPayment}>
              <h3>Record Payment</h3>
              <div className="form-group">
                <input type="number" name="paymentAmount" placeholder="Payment Amount" required />
              </div>
              <div className="form-group">
                <select name="paymentMode" required>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                </select>
              </div>
              <button type="submit">Record Payment</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default BillingPayment;
