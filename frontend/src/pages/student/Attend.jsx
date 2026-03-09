import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

export default function Attend() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('submitting'); // submitting | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const roundId = searchParams.get('roundId');
    const code = searchParams.get('code');

    if (!roundId || !code) {
      setStatus('error');
      setMessage('Invalid attendance link. Missing round or code.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      // Not logged in — redirect to login, then come back
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    axios
      .post(
        `${API_BASE}/attendance/${roundId}/attendance-checkin`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setStatus('success');
        setMessage('Attendance recorded successfully!');
        setTimeout(() => navigate('/student/applications'), 2500);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to record attendance.');
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-xl border border-border/60 bg-card p-8 text-center shadow-sm space-y-4">
        {status === 'submitting' && (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Marking your attendance…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-base font-semibold text-foreground">{message}</p>
            <p className="text-xs text-muted-foreground">Redirecting to your applications…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <svg className="h-6 w-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-base font-semibold text-foreground">Failed</p>
            <p className="text-sm text-muted-foreground">{message}</p>
            <button
              onClick={() => navigate('/student/applications')}
              className="mt-2 text-sm text-primary underline"
            >
              Go to my applications
            </button>
          </>
        )}
      </div>
    </div>
  );
}
