import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const SESSION_STATUS_LABELS = {
  active: 'Session live',
  inactive: 'Inactive',
  ended: 'Ended',
};

export function LiveAttendanceWidget() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'student',
    };
  }, []);

  const fetchLiveSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('http://localhost:3002/api/applications/my-applications', {
        headers,
      });

      const applications = Array.isArray(data) ? data : [];
      const withRound = applications.filter((application) => application.currentRound?._id);

      const enriched = await Promise.all(
        withRound.map(async (application) => {
          const roundId = application.currentRound._id;
          try {
            const { data: sessionStatus } = await axios.get(
              `http://localhost:3002/api/rounds/${roundId}/attendance-session/status`,
              { headers }
            );
            return { ...application, attendanceSession: sessionStatus };
          } catch (statusError) {
            return { ...application, attendanceSession: { status: 'inactive' } };
          }
        })
      );

      const liveSessions = enriched
        .filter((application) => application.attendanceSession?.status === 'active')
        .sort((a, b) => {
          const aTime = a.attendanceSession?.updatedAt || a.updatedAt || a.createdAt;
          const bTime = b.attendanceSession?.updatedAt || b.updatedAt || b.createdAt;
          return new Date(bTime || 0).getTime() - new Date(aTime || 0).getTime();
        })
        .slice(0, 4);

      setSessions(liveSessions);
    } catch (fetchError) {
      setError('Unable to load live sessions right now.');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchLiveSessions();
    const interval = setInterval(fetchLiveSessions, 60_000);
    return () => clearInterval(interval);
  }, [fetchLiveSessions]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((item) => (
          <div key={item} className="rounded-md border border-border/60 p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
        There are no live attendance sessions at the moment. Check back later.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const jobTitle = session.job?.jobTitle || 'Job title unavailable';
        const company = session.job?.companyName || 'Company unavailable';
        const roundName = session.currentRound?.roundName || 'Current round';
        const sessionStatus = session.attendanceSession?.status || 'inactive';
        const statusLabel = SESSION_STATUS_LABELS[sessionStatus] || sessionStatus;
        const offlineEnabled = Boolean(
          session.attendanceSession?.offlineCodeEnabled || session.attendanceSession?.offlineCode
        );

        return (
          <div key={session._id} className="rounded-md border border-border/60 p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{jobTitle}</p>
                <p className="text-xs text-muted-foreground">{company}</p>
                <p className="mt-1 text-xs text-muted-foreground">Round: {roundName}</p>
              </div>
              <Badge variant="default" className="text-[10px] uppercase">
                {statusLabel}
              </Badge>
            </div>
            {offlineEnabled && (
              <p className="mt-2 text-xs text-muted-foreground">Offline fallback available</p>
            )}
            <Button variant="link" size="sm" className="mt-2 px-0" asChild>
              <a href="/student/applications">Open attendance</a>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default LiveAttendanceWidget;
