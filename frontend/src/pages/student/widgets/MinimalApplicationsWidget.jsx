import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_VARIANTS = {
  placed: 'success',
  hired: 'success',
  rejected: 'destructive',
  in_process: 'secondary',
  shortlisted: 'default',
  applied: 'outline',
};

export function MinimalApplicationsWidget() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'student',
    };
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:3002/api/applications/my-applications', {
        headers,
      });
      setApplications(Array.isArray(data) ? data : []);
      setError('');
    } catch (fetchError) {
      setError('Unable to load applications right now.');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const topApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const aDate = a.updatedAt || a.createdAt;
        const bDate = b.updatedAt || b.createdAt;
        return new Date(bDate || 0).getTime() - new Date(aDate || 0).getTime();
      })
      .slice(0, 3);
  }, [applications]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-md border border-border/60 p-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {topApplications.length === 0 ? (
        <div className="rounded-md border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
          You have not applied to any jobs yet. Visit the Available Jobs page to start applying.
        </div>
      ) : (
        <ul className="space-y-3">
          {topApplications.map((application) => {
            const statusRaw = application.currentRound?.roundName
              ? 'in_process'
              : application.finalStatus || application.status || 'in_process';
            const statusVariant = STATUS_VARIANTS[statusRaw.toLowerCase()] || 'secondary';
            const statusLabel = application.currentRound?.roundName
              ? `In ${application.currentRound.roundName}`
              : statusRaw.replace(/_/g, ' ');
            const jobTitle = application.job?.jobTitle || 'Job title unavailable';
            const company = application.job?.companyName || 'Company unavailable';
            const updatedAt = application.updatedAt
              ? new Date(application.updatedAt).toLocaleString()
              : application.createdAt
              ? new Date(application.createdAt).toLocaleString()
              : null;

            return (
              <li key={application._id} className="rounded-md border border-border/60 p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{jobTitle}</p>
                    <p className="text-xs text-muted-foreground">{company}</p>
                  </div>
                  <Badge variant={statusVariant} className="text-[10px] uppercase">
                    {statusLabel}
                  </Badge>
                </div>
                {updatedAt && (
                  <p className="mt-2 text-xs text-muted-foreground">Updated {updatedAt}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Button variant="outline" size="sm" asChild>
        <Link to="/student/applications">View all applications</Link>
      </Button>
    </div>
  );
}

export default MinimalApplicationsWidget;
