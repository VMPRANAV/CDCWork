import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

const defaultSessionState = { status: 'inactive' };

export function useAttendanceSession(roundId) {
  const [sessionState, setSessionState] = useState(defaultSessionState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = useCallback(async (isStudent = false) => {
    if (!roundId) return null;
    const token = localStorage.getItem('authToken');
    const headers = isStudent
      ? { Authorization: `Bearer ${token}` }
      : { Authorization: `Bearer ${token}`, role: 'admin' };
    const response = await axios.get(`${API_BASE}/attendance/${roundId}/attendance-session/status`, { headers });
    return response.data;
  }, [roundId]);

  const loadStatus = useCallback(async (isStudent = false) => {
    if (!roundId) {
      setSessionState(defaultSessionState);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const status = await fetchStatus(isStudent);
      setSessionState(status || defaultSessionState);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load session status';
      setError(message);
      setSessionState(defaultSessionState);
    } finally {
      setLoading(false);
    }
  }, [roundId, fetchStatus]);

  return { sessionState, setSessionState, loading, error, loadStatus };
}
