import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCandidate } from '../api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRegex = /^[0-9+\-\s]{7,20}$/;

export default function ReferralForm({ onSuccess }) {
  const { authFetch } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', jobTitle: '' });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    setError('');
    const f = e.target.files?.[0];
    if (!f) {
      setResume(null);
      return;
    }
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF resumes are allowed.');
      e.target.value = null;
      return;
    }
    setResume(f);
  };

  const reset = () => {
    setForm({ name: '', email: '', phone: '', jobTitle: '' });
    setResume(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!emailRegex.test(form.email)) {
      setError('Invalid email format.');
      return;
    }
    if (form.phone && !phoneRegex.test(form.phone)) {
      setError('Invalid phone number.');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('jobTitle', form.jobTitle);
      if (resume) fd.append('resume', resume);

      const res = await createCandidate(authFetch, fd);
      onSuccess && onSuccess(res);
      reset();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form" style={{ padding: 20 }}>
      <h3 style={{ margin: 0 }}>Refer a candidate</h3>
      <p className="small" style={{ marginTop: 6 }}>
        Add candidate details and optionally upload a PDF resume.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
        
        {/* Standard row style */}
        <div className="row" style={{ marginBottom: 14 }}>
          <label style={{ marginBottom: 6, display: 'block' }}>Candidate Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: '1px solid #d1d5db'
            }}
          />
        </div>

        <div className="row" style={{ marginBottom: 14 }}>
          <label style={{ marginBottom: 6, display: 'block' }}>Email *</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="name@example.com"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: '1px solid #d1d5db'
            }}
          />
        </div>

        <div className="row" style={{ marginBottom: 14 }}>
          <label style={{ marginBottom: 6, display: 'block' }}>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            placeholder="+91 98765 43210"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: '1px solid #d1d5db'
            }}
          />
        </div>

        <div className="row" style={{ marginBottom: 14 }}>
          <label style={{ marginBottom: 6, display: 'block' }}>Job Title</label>
          <input
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="Frontend Developer"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: '1px solid #d1d5db'
            }}
          />
        </div>

        <div className="row" style={{ marginBottom: 14 }}>
          <label style={{ marginBottom: 6, display: 'block' }}>
            Resume (PDF only, optional)
          </label>
          <input
            className="file-input"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFile}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: '1px solid #d1d5db'
            }}
          />
          {resume && (
            <div className="small" style={{ marginTop: 6 }}>
              {resume.name}
            </div>
          )}
        </div>

        {error && (
          <div style={{ color: '#b00020', marginTop: 8 }}>
            {error}
          </div>
        )}

        <div className="controls" style={{ marginTop: 12, display: 'flex', gap: 10 }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Referral'}
          </button>

          <button
            type="button"
            onClick={reset}
            className="btn secondary"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
