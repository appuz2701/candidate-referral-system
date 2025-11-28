import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import CandidateCard from "./CandidateCard";
import {
  getCandidates,
  updateCandidateStatus,
  deleteCandidate,
} from "../api";

export default function Dashboard() {
  const { authFetch } = useAuth();

  const [items, setItems] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  useEffect(() => {
    fetchList();
    
  }, [authFetch]);

  async function fetchList() {
    setPhase("loading");
    setError("");

    try {
      const list = await getCandidates(authFetch);
      setItems(Array.isArray(list) ? list : []);
      setPhase("ready");
      setPage(1);
    } catch (err) {
      setError(err?.message || String(err) || "Failed to load");
      setPhase("error");
    }
  }

  async function handleStatusChange(id, newStatus) {
    const prev = [...items];

    setItems((cur) =>
      cur.map((c) =>
        c._id === id || c.id === id ? { ...c, status: newStatus } : c
      )
    );

    try {
      const updated = await updateCandidateStatus(authFetch, id, newStatus);

      setItems((cur) =>
        cur.map((c) => (c._id === id || c.id === id ? updated : c))
      );
    } catch (err) {
      setItems(prev);
      setError(err?.message || "Failed to update status");
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm("Delete this candidate?");
    if (!confirmDelete) return;

    const prev = [...items];

    setItems((cur) => cur.filter((c) => !(c._id === id || c.id === id)));

    try {
      await deleteCandidate(authFetch, id);
    } catch (err) {
      setItems(prev);
      setError(err?.message || "Failed to delete candidate");
    }
  }

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return items;

    return items.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const hasDataReady = phase === "ready" && filtered.length > 0;
  const noDataReady = phase === "ready" && filtered.length === 0;

  return (
    <div className="dashboard card" style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Candidates</h3>
          <div
            style={{
              color: "#64748b",
              marginTop: 4,
              fontSize: 13,
            }}
          >
            Manage referred candidates
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="search"
            placeholder="Search by name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid #e6e9ef",
              minWidth: 220,
            }}
          />
          <button type="button" className="btn" onClick={fetchList}>
            Refresh
          </button>
        </div>
      </div>

      {phase === "loading" && (
        <div className="muted" style={{ padding: 12 }}>
          Loading candidates…
        </div>
      )}

      {phase === "error" && (
        <div
          style={{
            background: "#fff0f0",
            color: "#b00020",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <strong>Error:</strong> {error}
            </div>
            <div>
              <button
                type="button"
                className="btn secondary"
                onClick={fetchList}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {noDataReady && (
        <div className="muted" style={{ padding: 12 }}>
          No candidates found.
        </div>
      )}

      {hasDataReady && (
        <div>
          <div className="cards-grid" style={{ marginTop: 8 }}>
            {pageItems.map((candidate) => {
              const candidateId = candidate._id || candidate.id;

              return (
                <CandidateCard
                  key={candidateId}
                  candidate={candidate}
                  onStatusChange={(newStatus) =>
                    handleStatusChange(candidateId, newStatus)
                  }
                  onDelete={() => handleDelete(candidateId)}
                />
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 14,
            }}
          >
            <div style={{ color: "#64748b", fontSize: 13 }}>
              Showing{" "}
              {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filtered.length)} of{" "}
              {filtered.length}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                className="btn secondary"
                onClick={() => setPage(1)}
                disabled={currentPage === 1}
              >
                « First
              </button>

              <button
                type="button"
                className="btn"
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  background: "#f1f5f9",
                  minWidth: 60,
                  textAlign: "center",
                }}
              >
                Page {currentPage} / {totalPages}
              </div>

              <button
                type="button"
                className="btn"
                onClick={() =>
                  setPage((previous) =>
                    Math.min(totalPages, previous + 1)
                  )
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>

              <button
                type="button"
                className="btn secondary"
                onClick={() => setPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last »
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          color: "#94a3b8",
          fontSize: 12,
        }}
      >
        Last refreshed:{" "}
        {phase === "ready" ? new Date().toLocaleString() : "—"}
      </div>
    </div>
  );
}
