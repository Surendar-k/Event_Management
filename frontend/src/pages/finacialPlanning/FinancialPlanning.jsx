import React, { useState, useEffect } from 'react';
import './FinancialPlanning.css';

const fundingSources = [
  "Management Funding",
  "Department Funding",
  "Participant Contribution / Registration Fees",
  "Industry / Companies Funding",
  "Government Grants",
  "Alumni Funding",
  "Professional Societies / Student Chapters",
  "Tech Clubs / Innovation Cells",
  "Event Collaborations",
  "Others"
];

const estimatedBudgetItems = [
  "Resource Person Honorarium",
  "Travel Allowance",
  "Banners / Flex / Backdrop",
  "Printing - Certificates, Brochures, Posters",
  "Ceremonial Arrangements / Mementos / Gifts",
  "Technical Arrangements",
  "Stationery & Event Materials",
  "Accommodation & Hospitality",
  "Food & Refreshments",
  "Logistics & Venue",
  "Photography / Videography",
  "Digital Promotion & Media",
  "Miscellaneous / Contingency"
];

const FinancialPlanning = () => {
  const [fundingData, setFundingData] = useState(
    fundingSources.map(() => ({ amount: '', remarks: '' }))
  );

  const [budgetData, setBudgetData] = useState(
    estimatedBudgetItems.map(() => ({ amount: '', remarks: '' }))
  );

  const [userId, setUserId] = useState('');
  const [eventId, setEventId] = useState('');

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const storedEventId = localStorage.getItem('eventId');
    setUserId(storedData?.user?._id || '');
    setEventId(storedEventId || '');
  }, []);

  const handleFundingChange = (index, field, value) => {
    const updated = [...fundingData];
    updated[index][field] = value;
    setFundingData(updated);
  };

  const handleBudgetChange = (index, field, value) => {
    const updated = [...budgetData];
    updated[index][field] = value;
    setBudgetData(updated);
  };

  const fundingTotal = fundingData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const budgetTotal = budgetData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const handleSubmit = async (e) => {
  e.preventDefault(); // optional, or just remove this line

  if (!userId || !eventId) {
    alert("Missing user or event ID");
    return;
  }
 
  const payload = {
  userId,
  eventId,
  fundingSources: fundingData.map((item, index) => ({
    particulars: fundingSources[index],  // 'particulars' in backend schema
    amount: parseFloat(item.amount) || 0,
    remarks: item.remarks || ""
  })),
  estimatedBudget: budgetData.map((item, index) => ({
    particulars: estimatedBudgetItems[index],  // 'particulars' in backend schema
    amount: parseFloat(item.amount) || 0,
    remarks: item.remarks || ""
  })),
    totals: {
      fundingTotal: fundingTotal.toFixed(2),
      budgetTotal: budgetTotal.toFixed(2),
      balance: (fundingTotal - budgetTotal).toFixed(2)
    }
  };

  try {
    const response = await fetch('http://localhost:1045/event/financial-planning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    console.log('Form submitted successfully:', responseData);
    alert(responseData.message || 'Financial plan saved successfully.');
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Error submitting form');
  }
};


  return (
    <div className="financial-planning">
      <div>
        <h1>Financial Planning</h1>
      </div>

      <h2>Funding Sources</h2>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Particulars</th>
            <th>Amount</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {fundingSources.map((source, index) => (
            <tr key={`funding-${index}`}>
              <td>{index + 1}</td>
              <td>{source}</td>
              <td>
                <input
                  type="number"
                  value={fundingData[index].amount}
                  onChange={(e) => handleFundingChange(index, 'amount', e.target.value)}
                  placeholder="Enter amount"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={fundingData[index].remarks}
                  onChange={(e) => handleFundingChange(index, 'remarks', e.target.value)}
                  placeholder="Remarks"
                />
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="2"><strong>Total Estimated Amount</strong></td>
            <td><strong>{fundingTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <h2>Estimated Budget</h2>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Particulars</th>
            <th>Estimated Amount</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {estimatedBudgetItems.map((item, index) => (
            <tr key={`budget-${index}`}>
              <td>{index + 1}</td>
              <td>{item}</td>
              <td>
                <input
                  type="number"
                  value={budgetData[index].amount}
                  onChange={(e) => handleBudgetChange(index, 'amount', e.target.value)}
                  placeholder="Enter amount"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={budgetData[index].remarks}
                  onChange={(e) => handleBudgetChange(index, 'remarks', e.target.value)}
                  placeholder="Remarks"
                />
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="2"><strong>Total Estimated Budget</strong></td>
            <td><strong>{budgetTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div className="submit-button-container">
        <button 
          onClick={handleSubmit}
          disabled={fundingTotal === 0 && budgetTotal === 0}
        >
          Save Financial Plan
        </button>
      </div>
    </div>
  );
};

export default FinancialPlanning;
