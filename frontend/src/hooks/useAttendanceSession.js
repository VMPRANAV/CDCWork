import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';
const ADMIN_POLL_INTERVAL_MS = 5000;
const STUDENT_POLL_INTERVAL_MS = 15000;

const defaultSessionState = { status: 'inactive' };

export function useAttendanceSession(roundId) {
  const [sessionState, setSessionState] = useState(defaultSessionState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  const clearPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // Headers built inside fetchStatus — NOT as render-level objects,
  // which would cause new references every render and trigger infinite loops.
  const fetchStatus = useCallback(async (isStudent = false) => {
    if (!roundId) return null;
    const token = localStorage.getItem('authToken');
    const headers = isStudent
      ? { Authorization: `Bearer ${token}` }
      : { Authorization: `Bearer ${token}`, role: 'admin' };
    const response = await axios.get(`${API_BASE}/attendance/${roundId}/attendance-session/status`, { headers });
    return response.data;
  }, [roundId]);

  const startPolling = useCallback((isStudent = false) => {
    clearPolling();
    const interval = isStudent ? STUDENT_POLL_INTERVAL_MS : ADMIN_POLL_INTERVAL_MS;
    pollRef.current = setInterval(() => {
      fetchStatus(isStudent)
        .then(status => {
          if (!status) return;
          setSessionState(status);
          setError('');
          if (status.status !== 'active') {
            clearPolling();
          }
        })
        .catch(() => {
          setError('Failed to refresh session status.');
          clearPolling();
        });
    }, interval);
  }, [clearPolling, fetchStatus]);

  const loadStatus = useCallback(async (isStudent = false) => {
    if (!roundId) {
      setSessionState(defaultSessionState);
      clearPolling();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const status = await fetchStatus(isStudent);
      setSessionState(status || defaultSessionState);
      if (status?.status === 'active') {
        startPolling(isStudent);
      } else {
        clearPolling();
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load session status';
      setError(message);
      setSessionState(defaultSessionState);
      clearPolling();
    } finally {
      setLoading(false);
    }
  }, [roundId, fetchStatus, startPolling, clearPolling]);

  useEffect(() => {
    // Initial load is triggered manually by the component
    return () => clearPolling();
  }, [roundId, clearPolling]);

  return { sessionState, loading, error, loadStatus };
}
