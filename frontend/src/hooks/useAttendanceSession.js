import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';
const POLL_INTERVAL_MS = 5000;

const defaultSessionState = { status: 'inactive' };

export function useAttendanceSession(roundId) {
  const [sessionState, setSessionState] = useState(defaultSessionState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  const adminHeaders = {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    role: 'admin',
  };

  const studentHeaders = {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  };

  const clearPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const fetchStatus = useCallback(async (isStudent = false) => {
    if (!roundId) return null;
    const headers = isStudent ? studentHeaders : adminHeaders;
    const response = await axios.get(`${API_BASE}/attendance/${roundId}/attendance-session/status`, { headers });
    return response.data;
  }, [roundId, adminHeaders, studentHeaders]);

  const startPolling = useCallback((isStudent = false) => {
    clearPolling();
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
    }, POLL_INTERVAL_MS);
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
