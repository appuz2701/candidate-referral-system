import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCandidates, updateCandidateStatus, deleteCandidate } from '../api';
import CandidateCard from '../components/CandidateCard';

export default function AdminPage() {
  const { currentUser, authFetch } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const fetchCandidates = async () => {
    setLoading(true);
    setErr('');
    try {
      const list = await getCandidates(authFetch);
      setCandidates(list || []);
    } catch (error) {
      setErr(error?.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [authFetch]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateCandidateStatus(authFetch, id, newStatus);
      setCandidates(prev =>
        prev.map(c => (c._id === id ? updated : c))
      );
    } catch (error) {
      setErr(error.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCandidate(authFetch, id);
      setCandidates(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      setErr(error.message || 'Failed to delete');
    }
  };

  const filteredCandidates = candidates.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-container app-root">
      <div className="app-header">
        <div>
          <h1>Admin Dashboard</h1>
          <div className="header-sub">Manage referred candidates</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ padding: 8, borderRadius: 8, border: '1px solid #e6e9ef' }}
          />
          <button onClick={fetchCandidates} className="muted">
            Refresh
          </button>
        </div>
      </div>

      {err && <div className="error">{err}</div>}

      {loading ? (
        <div className="muted">Loading...</div>
      ) : (
        <div className="cards-grid" style={{ marginTop: 16 }}>
          {filteredCandidates.length === 0 ? (
            <div className="muted">No candidates found.</div>
          ) : (
            filteredCandidates.map(candidate => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                currentUser={currentUser}
                readOnly={false}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
