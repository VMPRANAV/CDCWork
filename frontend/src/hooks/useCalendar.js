import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const toISO = (date) => date.toISOString();

const resolveDefaultRange = (date = new Date()) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
};

export function useCalendar({
  initialScope = 'all',
  autoRefreshMs = 60_000
} = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scope, setScope] = useState(initialScope);
  const [{ start, end }, setRange] = useState(() => resolveDefaultRange());

  const refreshTimerRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  const token = useMemo(() => localStorage.getItem('authToken'), []);
  const role = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role || 'student';
    } catch {
      return 'student';
    }
  }, []);

  const headers = useMemo(() => ({
    Authorization: token ? `Bearer ${token}` : undefined,
    role
  }), [token, role]);

  const fetchEvents = useCallback(async () => {
    if (!token) {
      setEvents([]);
      setLoading(false);
      setError('Missing authentication. Please login again.');
      return;
    }

    setLoading(true);
    setError(null);

    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await axios.get(`${API_BASE}/calendar`, {
        signal: abortControllerRef.current.signal,
        headers,
        params: {
          start: toISO(start),
          end: toISO(end),
          scope
        }
      });
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (axios.isCancel(err)) return;
      console.error('Calendar fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load calendar data.');
      toast.error('Failed to load calendar', {
        description: err.response?.data?.message
      });
    } finally {
      setLoading(false);
    }
  }, [token, headers, start, end, scope]);

  useEffect(() => {
    fetchEvents();

    if (autoRefreshMs > 0) {
      refreshTimerRef.current = setInterval(fetchEvents, autoRefreshMs);
    }

    return () => {
      abortControllerRef.current.abort();
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [fetchEvents, autoRefreshMs]);

  const adminOnly = role === 'admin';

  const mutate = useCallback(async (request) => {
    if (!adminOnly) {
      throw new Error('Calendar modification is restricted to admins.');
    }
    try {
      const result = await request();
      await fetchEvents();
      return result?.data;
    } catch (err) {
      console.error('Calendar mutation failed:', err);
      const message = err.response?.data?.message || err.message || 'Operation failed';
      toast.error(message);
      throw err;
    }
  }, [adminOnly, fetchEvents]);

  const createEvent = useCallback((payload) => mutate(() =>
    axios.post(`${API_BASE}/calendar/events`, payload, { headers })
  ), [mutate, headers]);

  const updateEvent = useCallback((eventId, payload) => mutate(() =>
    axios.put(`${API_BASE}/calendar/events/${eventId}`, payload, { headers })
  ), [mutate, headers]);

  const deleteEvent = useCallback((eventId) => mutate(() =>
    axios.delete(`${API_BASE}/calendar/events/${eventId}`, { headers })
  ), [mutate, headers]);

  const updateVisibility = useCallback((eventId, visibility) => mutate(() =>
    axios.patch(`${API_BASE}/calendar/events/${eventId}/visibility`, { visibility }, { headers })
  ), [mutate, headers]);

  const changeRange = useCallback((nextStart, nextEnd) => {
    const startDate = nextStart instanceof Date ? nextStart : new Date(nextStart);
    const endDate = nextEnd instanceof Date ? nextEnd : new Date(nextEnd);
    setRange({
      start: startOfMonth(startDate),
      end: endOfMonth(endDate)
    });
  }, []);

  const shiftRange = useCallback((daysDelta) => {
    setRange(({ start: prevStart, end: prevEnd }) => ({
      start: new Date(prevStart.getTime() + daysDelta * DAY_IN_MS),
      end: new Date(prevEnd.getTime() + daysDelta * DAY_IN_MS)
    }));
  }, []);

  const resetRange = useCallback((date = new Date()) => {
    setRange(resolveDefaultRange(date));
  }, []);

  return {
    events,
    loading,
    error,
    scope,
    role,
    range: { start, end },
    setScope,
    setRange: changeRange,
    shiftRange,
    resetRange,
    refetch: fetchEvents,
    createEvent: adminOnly ? createEvent : undefined,
    updateEvent: adminOnly ? updateEvent : undefined,
    deleteEvent: adminOnly ? deleteEvent : undefined,
    updateVisibility: adminOnly ? updateVisibility : undefined
  };
}
