
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function fetcher(authFetch) {
  return typeof authFetch === 'function' ? authFetch : fetch;
}

export async function getCandidates(authFetch) {
  const f = fetcher(authFetch);
  const res = await f(`${API_BASE}/candidates`);
  if (!res.ok) throw new Error('Failed to get candidates');
  return res.json();
}

export async function updateCandidateStatus(...args) {
  let authFetch = null;
  let id;
  let newStatus;

  if (typeof args[0] === 'function') {
   
    authFetch = args[0];
    id = args[1];
    newStatus = args[2];
  } else {

    id = args[0];
    newStatus = args[1];
  }

  if (newStatus && typeof newStatus === 'object' && newStatus.status) {
    newStatus = newStatus.status;
  }

  const f = fetcher(authFetch);
  const res = await f(`${API_BASE}/candidates/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to update (${res.status})`);
  }
  return res.json();
}

export async function deleteCandidate(...args) {
  let authFetch = null;
  let id;

  if (typeof args[0] === 'function') {
   
    authFetch = args[0];
    id = args[1];
  } else {
   
    id = args[0];
  }

  const f = fetcher(authFetch);
  const res = await f(`${API_BASE}/candidates/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-role': 'admin' }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => null);
    throw new Error(body || `Delete failed (${res.status})`);
  }
  return true;
}

export async function createCandidate(authFetch, formData) {
  const f = fetcher(authFetch);
  const res = await f(`${API_BASE}/candidates`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Create failed');
  }
  return res.json();
}
