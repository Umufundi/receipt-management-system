import React, { useState } from 'react';
import './ReceiptUpload.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const ReceiptUpload = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    department: '',
    purchaseDate: '',
    vendor: '',
    amount: '',
    paymentMethod: '',
    category: '',
    projectCode: '',
    description: '',
    receipt: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!formData.receipt) {
      setError('Please select a receipt file');
      return false;
    }
    if (!formData.employeeName.trim()) {
      setError('Employee name is required');
      return false;
    }
    if (!formData.department.trim()) {
      setError('Department is required');
      return false;
    }
    if (!formData.purchaseDate) {
      setError('Purchase date is required');
      return false;
    }
    if (!formData.vendor.trim()) {
      setError('Vendor name is required');
      return false;
    }
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (!formData.paymentMethod) {
      setError('Payment method is required');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(`${API_URL}/api/receipts`, {
        method: 'POST',
        body: data
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload receipt');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        employeeName: '',
        department: '',
        purchaseDate: '',
        vendor: '',
        amount: '',
        paymentMethod: '',
        category: '',
        projectCode: '',
        description: '',
        receipt: null
      });
      // Reset file input
      const fileInput = document.getElementById('receipt');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="receipt-upload-container">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Receipt uploaded successfully!</div>}
      
      <form onSubmit={handleSubmit} className="receipt-form">
        <div className="form-group">
          <label htmlFor="employeeName">Employee Name *</label>
          <input
            type="text"
            id="employeeName"
            value={formData.employeeName}
            onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="purchaseDate">Purchase Date *</label>
          <input
            type="date"
            id="purchaseDate"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="vendor">Vendor *</label>
          <input
            type="text"
            id="vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({...formData, vendor: e.target.value})}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method *</label>
          <select
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            disabled={loading}
            required
          >
            <option value="">Select payment method</option>
            <option value="cash">Cash</option>
            <option value="credit card">Credit Card</option>
            <option value="debit card">Debit Card</option>
            <option value="bank transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectCode">Project Code</label>
          <input
            type="text"
            id="projectCode"
            value={formData.projectCode}
            onChange={(e) => setFormData({...formData, projectCode: e.target.value})}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="receipt">Receipt Image/PDF *</label>
          <input
            type="file"
            id="receipt"
            accept="image/*,.pdf"
            onChange={(e) => setFormData({...formData, receipt: e.target.files[0]})}
            disabled={loading}
            required
          />
          <small>Maximum file size: 5MB. Accepted formats: JPEG, PNG, GIF, PDF</small>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Receipt'}
        </button>
      </form>
    </div>
  );
};

export default ReceiptUpload; 