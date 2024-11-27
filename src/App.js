import React, { useState } from 'react';

function LoanApp() {
  const [formData, setFormData] = useState({
    income: '',
    credit_score: '',
    loan_amount: '',
    borrower_description: '',
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Loan Underwriting System</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Income: </label>
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Credit Score: </label>
          <input
            type="number"
            name="credit_score"
            value={formData.credit_score}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Loan Amount: </label>
          <input
            type="number"
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Borrower Description: </label>
          <textarea
            name="borrower_description"
            value={formData.borrower_description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      {result && (
        <div>
          <h2>Prediction Result</h2>
          <p>Loan Risk: {result.prediction}</p>
          <p>LLM Risk Score: {result.risk_score}</p>
        </div>
      )}
    </div>
  );
}

export default LoanApp;
