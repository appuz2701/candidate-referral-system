
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  updateCandidateStatus as apiUpdateStatus,
  deleteCandidate as apiDelete
} from '../api';

export default function CandidateCard({
  candidate,
  onUpdated,
  onDeleted,
  onStatusChange,
  onDelete,
  currentUser
}) {
  const { authFetch } = useAuth();
  const [status, setStatus] = useState(candidate.status || 'Pending');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    setStatus(candidate.status || 'Pending');
  }, [candidate.status]);

  const notifyUpdated = (updated) => {
    onUpdated && onUpdated(updated);
    onStatusChange &&
      onStatusChange(updated._id || updated.id, updated.status || status);
  };

  const notifyDeleted = (deleted) => {
    onDeleted && onDeleted(deleted);
    onDelete && onDelete(deleted._id || deleted.id);
  };

  const handleStatusChange = async (e) => {
    if (!isAdmin) return;
    const newStatus = e.target.value;
    setErr('');
    setBusy(true);
    try {
      const updated = await apiUpdateStatus(
        authFetch,
        candidate._id || candidate.id,
        newStatus
      );
      setStatus(updated.status || newStatus);
      notifyUpdated(updated);
    } catch (error) {
      setErr(error?.message || 'Failed to update');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    if (!window.confirm(`Delete candidate ${candidate.name}?`)) return;
    setBusy(true);
    setErr('');
    try {
      await apiDelete(authFetch, candidate._id || candidate.id);
      notifyDeleted(candidate);
    } catch (error) {
      setErr(error?.message || 'Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  const statusClass = (s) => {
    if (!s) return 'status-badge status-unknown';
    const k = s.toLowerCase();
    if (k.includes('pend')) return 'status-badge status-pending';
    if (k.includes('review')) return 'status-badge status-reviewed';
    if (k.includes('hire')) return 'status-badge status-hired';
    return 'status-badge status-unknown';
  };

  return (
    <div className="card candidate-card">
      <div className="card-main">
        <div className="candidate-info">
          <h3>{candidate.name}</h3>
          <div className="muted">{candidate.jobTitle}</div>
          <div className="muted small">
            {candidate.email} • {candidate.phone}
          </div>
        </div>

        <div className="card-actions">
          {isAdmin ? (
            <>
              <select
                value={status}
                onChange={handleStatusChange}
                disabled={busy}
                className="status-select"
              >
                <option>Pending</option>
                <option>Reviewed</option>
                <option>Hired</option>
              </select>

              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={busy}
              >
                Delete
              </button>
            </>
          ) : (
            <div className={statusClass(status)}>{status}</div>
          )}

          {candidate.resumeUrl && (
            <a
              className="btn-link"
              href={candidate.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Resume
            </a>
          )}
        </div>
      </div>

      {err && <div className="error">{err}</div>}
    </div>
  );
}
