import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STATUS_COLORS = {
  hired: 'success',
  rejected: 'destructive',
  shortlisted: 'default',
  in_process: 'secondary',
  applied: 'secondary',
};

const FALLBACK_TEXT = {
  jobTitle: 'Job title not available',
  company: 'Company name not available',
  currentRound: 'Round information not available',
  description: 'No description shared for this application.',
};

export function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendanceInputs, setAttendanceInputs] = useState({});
  const [attendanceFeedback, setAttendanceFeedback] = useState({});
  const [attendanceSubmitting, setAttendanceSubmitting] = useState({});
  const [scannerVisible, setScannerVisible] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('updated-desc');

  const headers = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'student',
    };
  }, []);

  const fetchRoundStatus = useCallback(
    async (roundId) => {
      if (!roundId) {
        return { status: 'inactive' };
      }
      try {
        const { data } = await axios.get(
          `http://localhost:3002/api/rounds/${roundId}/attendance-session/status`,
          { headers }
        );
        return data;
      } catch (fetchError) {
        return { status: 'inactive' };
      }
    },
    [headers]
  );

  const enrichApplicationsWithAttendance = useCallback(
    async (apps) => {
      const requests = apps.map(async (application) => {
        const roundId = application.currentRound?._id;
        const attendanceSession = await fetchRoundStatus(roundId);
        return { ...application, attendanceSession };
      });
      return Promise.all(requests);
    },
    [fetchRoundStatus]
  );

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:3002/api/applications/my-applications', {
        headers,
      });
      const enriched = await enrichApplicationsWithAttendance(Array.isArray(data) ? data : []);
      setApplications(enriched);
      setError('');
    } catch (fetchError) {
      setError('Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  }, [headers, enrichApplicationsWithAttendance]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateAttendanceFeedback = (applicationId, type, message) => {
    setAttendanceFeedback((prev) => ({
      ...prev,
      [applicationId]: { type, message },
    }));
  };

  const handleInputChange = (applicationId, value) => {
    setAttendanceInputs((prev) => ({
      ...prev,
      [applicationId]: value.toUpperCase(),
    }));
  };

  const toggleScanner = (applicationId) => {
    setScannerVisible((prev) => ({
      ...prev,
      [applicationId]: !prev[applicationId],
    }));
    updateAttendanceFeedback(applicationId, 'info', 'Use the scanner or enter the code manually.');
  };

  const handleSubmitAttendance = async (applicationId, roundId) => {
    const code = (attendanceInputs[applicationId] || '').trim();
    if (!code) {
      updateAttendanceFeedback(applicationId, 'error', 'Enter the code shared by the coordinator.');
      return;
    }

    try {
      setAttendanceSubmitting((prev) => ({ ...prev, [applicationId]: true }));
      updateAttendanceFeedback(applicationId, 'info', 'Submitting attendance...');

      await axios.post(
        `http://localhost:3002/api/rounds/${roundId}/attendance-checkin`,
        { code },
        { headers }
      );

      toast.success('Attendance recorded successfully');
      updateAttendanceFeedback(applicationId, 'success', 'Attendance recorded successfully.');
      setAttendanceInputs((prev) => ({ ...prev, [applicationId]: '' }));
      setScannerVisible((prev) => ({ ...prev, [applicationId]: false }));
      fetchApplications();
    } catch (submitError) {
      const message = submitError.response?.data?.message || 'Failed to record attendance.';
      updateAttendanceFeedback(applicationId, 'error', message);
    } finally {
      setAttendanceSubmitting((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleScanDecode = (applicationId, roundId, text) => {
    if (!text) {
      return;
    }

    const decodedText = text.trim();
    if (!decodedText) {
      return;
    }

    let capturedCode = '';

    try {
      const payload = JSON.parse(decodedText);
      if (payload.roundId && payload.roundId !== roundId) {
        updateAttendanceFeedback(applicationId, 'error', 'This QR belongs to another round.');
        return;
      }
      capturedCode = (payload.code || payload.currentCode || '').toString().trim();
      if (!capturedCode && typeof payload === 'string') {
        capturedCode = payload.trim();
      }
    } catch (parseError) {
      capturedCode = decodedText;
    }

    if (!capturedCode) {
      updateAttendanceFeedback(applicationId, 'error', 'The QR code did not contain a valid attendance code.');
      return;
    }

    setAttendanceInputs((prev) => ({ ...prev, [applicationId]: capturedCode.toUpperCase() }));
    updateAttendanceFeedback(applicationId, 'info', 'Code captured from QR. Review and submit.');
  };

  const handleScanError = (scannerError) => {
    if (scannerError) {
      // eslint-disable-next-line no-console
      console.debug('QR scan error', scannerError);
    }
  };

  const renderAttendanceSection = (application) => {
    const applicationId = application._id;
    const roundId = application.currentRound?._id;
    if (!roundId) {
      return null;
    }

    const currentRoundLabel = application.currentRound?.roundName || FALLBACK_TEXT.currentRound;
    const roundProgress = application.roundProgress || [];
    const normalizedProgress = roundProgress.map((progress) => {
      const progressRound = progress.round || progress.round?._id;
      const roundIdMatch = typeof progressRound === 'object' ? progressRound?._id : progressRound;
      return {
        ...progress,
        roundId: roundIdMatch,
        roundName: progress.round?.roundName || progress.roundName,
      };
    });

    const currentProgress = normalizedProgress.find((progress) => {
      const progressRoundId = progress.roundId;
      return progressRoundId === roundId;
    });
    const attendanceMarked = currentProgress?.attendance;
    const feedbackEntry = attendanceFeedback[applicationId];
    const attendanceCodeValue = attendanceInputs[applicationId] || '';
    const isSubmitting = Boolean(attendanceSubmitting[applicationId]);
    const scannerOpen = Boolean(scannerVisible[applicationId]);
    const sessionStatus = application.attendanceSession || { status: 'inactive' };
    const sessionActive = sessionStatus.status === 'active';
    const offlineEnabled = Boolean(sessionStatus.offlineCodeEnabled || sessionStatus.offlineCode);
    const offlineUsedAt = sessionStatus.offlineCodeUsedAt;

    if (attendanceMarked) {
      return (
        <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Attendance</CardTitle>
                <CardDescription>Round: {currentRoundLabel}</CardDescription>
              </div>
              <Badge variant="default">Recorded</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Your attendance for this round has already been recorded.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (!sessionActive) {
      return (
        <Card className="bg-muted/20">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Attendance</CardTitle>
                <CardDescription>Round: {currentRoundLabel}</CardDescription>
              </div>
              <Badge variant="secondary">Session not active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Attendance will be available once the coordinator starts the session. Check back later.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-muted/40">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Attendance</CardTitle>
              <CardDescription>Round: {currentRoundLabel}</CardDescription>
            </div>
            <Badge variant="default">Session live</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Enter the offline code provided by the coordinator or scan the QR shown at the venue.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
            <Input
              value={attendanceCodeValue}
              onChange={(event) => handleInputChange(applicationId, event.target.value)}
              maxLength={8}
              placeholder="Enter code"
              className="md:max-w-xs"
              disabled={isSubmitting || !sessionActive}
            />
            <Button
              type="button"
              onClick={() => handleSubmitAttendance(applicationId, roundId)}
              disabled={isSubmitting || !sessionActive}
            >
              {sessionActive ? (isSubmitting ? 'Submitting…' : 'Submit code') : 'Session idle'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toggleScanner(applicationId)}
              disabled={!sessionActive}
            >
              {scannerOpen ? 'Close QR scanner' : 'Scan QR instead'}
            </Button>
          </div>
          {offlineEnabled && (
            <p className="text-xs text-muted-foreground">
              Offline fallback enabled
              {offlineUsedAt && ` (used ${new Date(offlineUsedAt).toLocaleString()})`}
            </p>
          )}
          {scannerOpen && (
            <div className="rounded-md border border-dashed border-border/60">
              <QrScanner
                constraints={{ facingMode: 'environment' }}
                scanDelay={500}
                onDecode={(decodedText) => handleScanDecode(applicationId, roundId, decodedText)}
                onError={handleScanError}
                style={{ width: '100%' }}
              />
            </div>
          )}
          {feedbackEntry && (
            <p
              className={`text-xs ${
                feedbackEntry.type === 'error'
                  ? 'text-destructive'
                  : feedbackEntry.type === 'success'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground'
              }`}
            >
              {feedbackEntry.message}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const normalizedApplications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filteredBySearch = term
      ? applications.filter((application) => {
          const jobTitle = application.job?.jobTitle?.toLowerCase() ?? '';
          const company = application.job?.companyName?.toLowerCase() ?? '';
          const roundName = application.currentRound?.roundName?.toLowerCase() ?? '';
          return jobTitle.includes(term) || company.includes(term) || roundName.includes(term);
        })
      : applications;

    const filteredByStatus = statusFilter === 'all'
      ? filteredBySearch
      : filteredBySearch.filter((application) => {
          const statusRaw = application.currentRound?.roundName
            ? 'in_process'
            : application.finalStatus || application.status || 'in_process';
          return statusRaw.toLowerCase() === statusFilter;
        });

    const sorted = [...filteredByStatus].sort((a, b) => {
      switch (sortOption) {
        case 'applied-asc': {
          const aApplied = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bApplied = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return aApplied - bApplied;
        }
        case 'applied-desc': {
          const aApplied = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bApplied = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bApplied - aApplied;
        }
        case 'updated-asc': {
          const aUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return aUpdated - bUpdated;
        }
        case 'updated-desc':
        default: {
          const aUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bUpdated - aUpdated;
        }
      }
    });

    return sorted;
  }, [applications, searchTerm, statusFilter, sortOption]);

  const renderApplicationCard = (application) => {
    const statusRaw = application.currentRound?.roundName
      ? 'in_process'
      : application.finalStatus || application.status || 'in_process';
    const statusLabel = application.currentRound?.roundName
      ? `In ${application.currentRound.roundName}`
      : statusRaw.replace(/_/g, ' ');

    const statusVariant = STATUS_COLORS[statusRaw.toLowerCase()] || 'secondary';
    const appliedDate = application.createdAt
      ? new Date(application.createdAt).toLocaleDateString()
      : 'Not available';
    const lastUpdatedAt = application.updatedAt
      ? new Date(application.updatedAt).toLocaleString()
      : null;

    const jobTitle = application.job?.jobTitle || FALLBACK_TEXT.jobTitle;
    const companyName = application.job?.companyName || FALLBACK_TEXT.company;
    const description = application.job?.jobDescription || FALLBACK_TEXT.description;

    return (
      <Card key={application._id} className="border border-border/60 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl font-semibold">{jobTitle}</CardTitle>
              <CardDescription>{companyName}</CardDescription>
            </div>
            <Badge variant={statusVariant} className="text-xs capitalize">
              {statusLabel}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>Applied on: {appliedDate}</span>
            {lastUpdatedAt && <span>Last updated: {lastUpdatedAt}</span>}
            {application.currentRound?.roundName && (
              <span>Current round: {application.currentRound.roundName}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description.length > 220 ? `${description.slice(0, 220)}…` : description}
            </p>
          )}
          {renderAttendanceSection(application)}
        </CardContent>
        {application.roundProgress?.length ? (
          <CardFooter className="block space-y-2 text-xs text-muted-foreground">
            <Separator />
            <p className="font-medium text-foreground">Round progress</p>
            <div className="grid gap-2 md:grid-cols-2">
              {application.roundProgress.map((progress) => {
                const roundName = progress.round?.roundName || progress.roundName || 'Round';
                const attendance = progress.attendance ? 'Attendance recorded' : 'Attendance pending';
                const feedback = progress.feedback ? `Feedback: ${progress.feedback}` : null;
                return (
                  <div key={progress.round?._id || progress.round} className="rounded-md border border-border/60 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">{roundName}</span>
                      <Badge variant={progress.attendance ? 'default' : 'secondary'} className="text-[10px]">
                        {attendance}
                      </Badge>
                    </div>
                    {feedback && <p className="mt-1 text-xs text-muted-foreground">{feedback}</p>}
                  </div>
                );
              })}
            </div>
          </CardFooter>
        ) : null}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">
          Track your progress across recruitment rounds and mark attendance for live sessions.
        </p>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-3 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Card key={item} className="border border-border/50 shadow-sm">
              <CardHeader>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search applications by company, title, or round"
              className="md:max-w-sm"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="in_process">In process</SelectItem>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated-desc">Last updated (newest)</SelectItem>
                  <SelectItem value="updated-asc">Last updated (oldest)</SelectItem>
                  <SelectItem value="applied-desc">Applied date (newest)</SelectItem>
                  <SelectItem value="applied-asc">Applied date (oldest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            {normalizedApplications.length === 0 ? (
              <Card className="border border-dashed border-border/60 bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg">No matching applications</CardTitle>
                  <CardDescription>
                    Try adjusting your search or filters to find other results.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {normalizedApplications.map((application) => renderApplicationCard(application))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Applications;
