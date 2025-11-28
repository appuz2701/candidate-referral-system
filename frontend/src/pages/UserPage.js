import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ReferralForm from '../components/ReferralForm';
import CandidateCard from '../components/CandidateCard';
import { getCandidates } from '../api';

export default function UserPage() {
  const { currentUser, authFetch } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSuccess = () => fetchCandidates();

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

  useEffect(() => { fetchCandidates(); }, [authFetch]);

  return (
    <div style={{ padding: 16 }}>
      <h2>User Dashboard</h2>
      

      <div style={{ maxWidth: 640, marginBottom: 24 }}>
        <ReferralForm onSuccess={handleSuccess} />
      </div>

      <h3>All Candidates</h3>

      {err && <div className="error">{err}</div>}
      {loading ? (
        <div className="muted">Loading candidates…</div>
      ) : (
        <div className="cards-grid" style={{ marginTop: 8 }}>
          {candidates.length === 0 ? (
            <div className="muted">No candidates yet.</div>
          ) : (
            candidates.map(c => (
              <CandidateCard
                key={c._id || c.id}
                candidate={c}
                currentUser={currentUser}
                readOnly={true}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
