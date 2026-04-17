import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAttendanceSession } from '@/hooks/useAttendanceSession';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertCircle,
  Check,
  Loader2,
  QrCode,
  RefreshCw,
  StopCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';
const POLL_INTERVAL_MS = 5000;
const REFRESH_INTERVAL_OPTIONS = [30, 45, 60, 90];

export function Attendance() {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [jobQuery, setJobQuery] = useState('');
  const [jobSortOption, setJobSortOption] = useState('created-desc');

  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedRoundId, setSelectedRoundId] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [enableOfflineCode, setEnableOfflineCode] = useState(false);
  const [offlineCodeValue, setOfflineCodeValue] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

    const qrCodeContainerRef = useRef(null);

  const adminHeaders = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'admin',
    };
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((job) => job._id === selectedJobId) || null,
    [jobs, selectedJobId]
  );

  const selectedRound = useMemo(
    () => selectedJob?.rounds?.find((round) => round._id === selectedRoundId) || null,
    [selectedJob, selectedRoundId]
  );

  
  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    setJobsError('');
    try {
      const response = await axios.get(`${API_BASE}/jobs`, { headers: adminHeaders });
      const combined = [
        ...(response.data?.private ?? []),
        ...(response.data?.public ?? []),
      ].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
      setJobs(combined);
      if (combined.length > 0) {
        setSelectedJobId((prev) => {
          if (prev && combined.some((job) => job._id === prev)) {
            return prev;
          }
          return combined[0]._id;
        });
      } else {
        setSelectedJobId('');
        setSelectedRoundId('');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load jobs';
      setJobsError(message);
      toast.error('Unable to load jobs', { description: message });
    } finally {
      setJobsLoading(false);
    }
  }, [adminHeaders]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = useMemo(() => {
    const term = jobQuery.trim().toLowerCase();
    const filtered = term
      ? jobs.filter((job) => {
          const title = job.jobTitle?.toLowerCase() ?? '';
          const company = job.companyName?.toLowerCase() ?? '';
          return title.includes(term) || company.includes(term);
        })
      : jobs;

    const sorted = [...filtered].sort((a, b) => {
      switch (jobSortOption) {
        case 'eligible-desc':
          return (b.eligibleCount ?? 0) - (a.eligibleCount ?? 0);
        case 'eligible-asc':
          return (a.eligibleCount ?? 0) - (b.eligibleCount ?? 0);
        case 'title-asc':
          return (a.jobTitle ?? '').localeCompare(b.jobTitle ?? '');
        case 'title-desc':
          return (b.jobTitle ?? '').localeCompare(a.jobTitle ?? '');
        case 'created-asc':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'created-desc':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return sorted;
  }, [jobs, jobQuery, jobSortOption]);

  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedJobId('');
      setSelectedRoundId('');
      return;
    }
    const isSelectedVisible = filteredJobs.some((job) => job._id === selectedJobId);
    if (!isSelectedVisible) {
      setSelectedJobId(filteredJobs[0]._id);
    }
  }, [filteredJobs, selectedJobId]);

  useEffect(() => {
    if (!selectedJob) {
      setSelectedRoundId('');
      return;
    }
    setSelectedRoundId((prev) => {
      if (prev && selectedJob.rounds?.some((round) => round._id === prev)) {
        return prev;
      }
      return selectedJob.rounds?.[0]?._id ?? '';
    });
  }, [selectedJob]);

  const { sessionState, setSessionState, loading: sessionLoading, error: sessionError, loadStatus } = useAttendanceSession(selectedRoundId);

  useEffect(() => {
    if (selectedRoundId) {
      loadStatus();
      fetchAttendees();
    }
  }, [selectedRoundId, loadStatus]);

  const fetchAttendees = useCallback(async () => {
    if (!selectedRoundId) return;
    setAttendeesLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/attendance/${selectedRoundId}/attendees`, {
        headers: adminHeaders,
      });
      setAttendees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch attendees:', err);
    } finally {
      setAttendeesLoading(false);
    }
  }, [selectedRoundId, adminHeaders]);

  useEffect(() => {
    if (sessionState.status !== 'active') {
        setShowQrDialog(false);
    }
    if (sessionState.offlineCode) {
        setOfflineCodeValue(sessionState.offlineCode);
    }
  }, [sessionState]);

  const handleStartSession = useCallback(async () => {
    if (!selectedRoundId || actionLoading) return;
    setActionLoading(true);
    try {
      await axios.post(
        `${API_BASE}/attendance/${selectedRoundId}/attendance-session/start`,
        {
          refreshIntervalSeconds: Number(refreshInterval),
          enableOfflineCode,
        },
        { headers: adminHeaders }
      );
      toast.success('Attendance session started');
      loadStatus();
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to start session';
      toast.error('Unable to start session', { description: message });
    } finally {
      setActionLoading(false);
    }
  }, [selectedRoundId, actionLoading, refreshInterval, enableOfflineCode, adminHeaders, loadStatus]);

  const handleStopSession = useCallback(async () => {
    if (!selectedRoundId || actionLoading) return;
    setActionLoading(true);
    try {
      await axios.post(
        `${API_BASE}/attendance/${selectedRoundId}/attendance-session/stop`,
        {},
        { headers: adminHeaders }
      );
      toast.success('Attendance session stopped');
      loadStatus();
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to stop session';
      toast.error('Unable to stop session', { description: message });
    } finally {
      setActionLoading(false);
    }
  }, [selectedRoundId, actionLoading, adminHeaders, loadStatus]);

  // SSE for real-time updates; heartbeat timeout or onerror falls back to polling
  useEffect(() => {
    if (!selectedRoundId || sessionState.status !== 'active') return;

    let pollInterval = null;
    let heartbeatTimeout = null;
    const HEARTBEAT_TIMEOUT_MS = 25000;

    const startPollingFallback = () => {
      if (pollInterval) return;
      console.warn('SSE heartbeat lost — falling back to polling');
      pollInterval = setInterval(() => {
        fetchAttendees();
        loadStatus();
      }, POLL_INTERVAL_MS);
    };

    const resetHeartbeatTimer = () => {
      clearTimeout(heartbeatTimeout);
      heartbeatTimeout = setTimeout(startPollingFallback, HEARTBEAT_TIMEOUT_MS);
    };

    const token = localStorage.getItem('authToken');
    const eventSource = new EventSource(
      `${API_BASE}/attendance/${selectedRoundId}/attendance-session/stream?token=${token}`
    );

    eventSource.addEventListener('connected', () => resetHeartbeatTimer());

    eventSource.addEventListener('heartbeat', () => resetHeartbeatTimer());

    eventSource.addEventListener('codeRefresh', (event) => {
      try {
        const data = JSON.parse(event.data);
        setSessionState((prev) => ({
          ...prev,
          currentCode: data.currentCode,
          expiresAt: data.expiresAt,
        }));
      } catch (err) {
        console.error('codeRefresh parse error:', err);
      }
    });

    eventSource.addEventListener('attendance', (event) => {
      try {
        const data = JSON.parse(event.data);
        setAttendees((prev) => {
          const exists = prev.some(
            (a) => a._id === data.studentId || a.collegeEmail === data.collegeEmail
          );
          if (exists) return prev;
          toast.success(`${data.studentName} marked attendance`);
          return [...prev, { _id: data.studentId, fullName: data.studentName, collegeEmail: data.collegeEmail }];
        });
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    });

    eventSource.onerror = () => {
      console.warn('SSE connection error — falling back to polling');
      eventSource.close();
      clearTimeout(heartbeatTimeout);
      startPollingFallback();
    };

    return () => {
      eventSource.close();
      clearTimeout(heartbeatTimeout);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [selectedRoundId, sessionState.status, fetchAttendees, loadStatus, setSessionState]);

  useEffect(() => {
    if (sessionState.status === 'active' && sessionState.expiresAt) {
      const updateCountdown = () => {
        const expires = new Date(sessionState.expiresAt).getTime();
        if (Number.isNaN(expires)) {
          setCountdown('');
          return;
        }
        const diffMs = expires - Date.now();
        if (diffMs <= 0) {
          setCountdown('Expired');
          return;
        }
        const totalSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setCountdown(`${minutes}m ${seconds.toString().padStart(2, '0')}s`);
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
    setCountdown('');
    return () => {};
  }, [sessionState.status, sessionState.expiresAt]);

  useEffect(() => {
    if (sessionState.status === 'active' && qrCodeContainerRef.current) {
      qrCodeContainerRef.current.focus({ preventScroll: false });
    }
  }, [sessionState.status, sessionState.currentCode]);

  const noJobs = !jobsLoading && jobs.length === 0;
  const noRounds = selectedJob && (!selectedJob.rounds || selectedJob.rounds.length === 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Sessions</h1>
          <p className="text-sm text-muted-foreground">QR-based attendance management for placement rounds</p>
        </div>
        {sessionState.status === 'active' && (
          <Badge className="gap-1.5 bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Live
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">

        {/* ── Job sidebar ───────────────────────────────────────────── */}
        <Card className="flex flex-col lg:col-span-1 lg:max-h-[calc(100vh-10rem)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Jobs</CardTitle>
            <CardDescription className="text-xs">Select a job to manage attendance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2 overflow-hidden pb-2">
            <Input
              value={jobQuery}
              onChange={(e) => setJobQuery(e.target.value)}
              placeholder="Search..."
              className="h-8 text-sm"
            />
            <Select value={jobSortOption} onValueChange={setJobSortOption}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created-desc">Newest first</SelectItem>
                <SelectItem value="created-asc">Oldest first</SelectItem>
                <SelectItem value="title-asc">Title A–Z</SelectItem>
                <SelectItem value="title-desc">Title Z–A</SelectItem>
                <SelectItem value="eligible-desc">Most eligible</SelectItem>
                <SelectItem value="eligible-asc">Fewest eligible</SelectItem>
              </SelectContent>
            </Select>

            {jobsLoading ? (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : jobsError ? (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{jobsError}</span>
              </div>
            ) : noJobs ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No job postings found.</p>
            ) : filteredJobs.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No matches.</p>
            ) : (
              <ScrollArea className="flex-1">
                <div className="space-y-1.5 pb-2 pr-1">
                  {filteredJobs.map((job) => {
                    const isActive = selectedJobId === job._id;
                    return (
                      <button
                        key={job._id}
                        type="button"
                        onClick={() => setSelectedJobId(job._id)}
                        className={cn(
                          'w-full overflow-hidden rounded-lg border px-3 py-2.5 text-left transition-colors',
                          isActive
                            ? 'border-primary/60 bg-primary/10'
                            : 'border-border/40 hover:bg-muted/60'
                        )}
                      >
                        <p className="truncate text-sm font-semibold leading-tight">{job.jobTitle}</p>
                        <p className="truncate text-xs text-muted-foreground">{job.companyName}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge
                            variant={job.status === 'public' ? 'default' : 'secondary'}
                            className="px-1.5 py-0 text-[10px]"
                          >
                            {job.status === 'public' ? 'Live' : 'Draft'}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{job.eligibleCount ?? 0} eligible</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
          <CardFooter className="pb-3 pt-0">
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={fetchJobs} disabled={jobsLoading}>
              <RefreshCw className="mr-1.5 h-3 w-3" /> Refresh
            </Button>
          </CardFooter>
        </Card>

        {/* ── Main area ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:col-span-3">

          {/* Control bar */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Job + round */}
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="min-w-0 flex-1">
                    {selectedJob ? (
                      <>
                        <p className="truncate font-semibold">{selectedJob.jobTitle}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {selectedJob.companyName} · {selectedJob.eligibleCount ?? 0} eligible
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Select a job from the list</p>
                    )}
                  </div>
                  <div className="w-48 shrink-0">
                    <Select
                      value={selectedRoundId}
                      onValueChange={setSelectedRoundId}
                      disabled={!selectedJob || !!noRounds}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={noRounds ? 'No rounds' : 'Select round'} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedJob?.rounds?.map((round) => (
                          <SelectItem key={round._id} value={round._id}>
                            {round.roundName || 'Round'} · Seq {round.sequence ?? '–'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {sessionState.status !== 'active' && (
                    <>
                      <Select
                        value={String(refreshInterval)}
                        onValueChange={(v) => setRefreshInterval(Number(v))}
                        disabled={actionLoading}
                      >
                        <SelectTrigger className="h-9 w-24 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {REFRESH_INTERVAL_OPTIONS.map((v) => (
                            <SelectItem key={v} value={String(v)}>{v}s</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1.5">
                        <Label className="text-xs text-muted-foreground">Offline</Label>
                        <Switch
                          checked={enableOfflineCode}
                          onCheckedChange={setEnableOfflineCode}
                          disabled={actionLoading}
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={handleStartSession}
                        disabled={actionLoading || !selectedRoundId}
                      >
                        {actionLoading
                          ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          : <QrCode className="mr-1.5 h-4 w-4" />}
                        Start
                      </Button>
                    </>
                  )}
                  {sessionState.status === 'active' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleStopSession}
                      disabled={actionLoading}
                    >
                      {actionLoading
                        ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        : <StopCircle className="mr-1.5 h-4 w-4" />}
                      Stop
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => loadStatus()}
                    disabled={sessionLoading || !selectedRoundId}
                  >
                    <RefreshCw className={cn('h-4 w-4', sessionLoading && 'animate-spin')} />
                  </Button>
                </div>
              </div>

              {sessionError && (
                <div className="mt-3 flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {sessionError}
                </div>
              )}
              {!selectedRoundId && !noJobs && (
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  {noRounds ? 'Selected job has no rounds configured.' : 'Select a round to begin.'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* QR hero — only when active */}
          {sessionState.status === 'active' && (
            <Card
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <div ref={qrCodeContainerRef} tabIndex={-1} className="focus:outline-none">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center">
                    {/* QR */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-2xl border-2 border-border/60 bg-white p-5 shadow-md">
                        {sessionState.currentCode ? (
                          <QRCodeCanvas
                            size={220}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            value={`${window.location.origin}/student/attend?roundId=${selectedRoundId}&code=${sessionState.currentCode}`}
                          />
                        ) : (
                          <div className="flex h-[220px] w-[220px] items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowQrDialog(true)}
                        disabled={!sessionState.currentCode}
                      >
                        Present fullscreen
                      </Button>
                    </div>

                    {/* Code + meta */}
                    <div className="flex flex-col items-center gap-5 md:items-start md:pt-2">
                      <div className="text-center md:text-left">
                        <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Current Code</p>
                        <p className="font-mono text-5xl font-bold tracking-[0.25em]">
                          {sessionState.currentCode || '——'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        Refreshes in <span className="ml-1 font-semibold text-foreground">{countdown || '…'}</span>
                      </div>
                      {offlineCodeValue && (
                        <div className="rounded-xl border border-border/60 bg-muted/30 px-5 py-3 text-center md:text-left">
                          <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Offline Code</p>
                          <p className="font-mono text-2xl font-semibold tracking-widest">{offlineCodeValue}</p>
                          {sessionState.offlineCodeUsedAt && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Used {new Date(sessionState.offlineCodeUsedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}

          {/* Live attendance */}
          {selectedRoundId && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Live Attendance</CardTitle>
                    <CardDescription className="text-xs">
                      {sessionState.status === 'active'
                        ? 'Updates in real-time via stream'
                        : 'Start a session to track attendance'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {selectedJob?.eligibleCount ?? 0} eligible
                    </span>
                    <Badge className="px-3 text-sm">{attendees.length} present</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {attendeesLoading ? (
                  <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
                  </div>
                ) : attendees.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/60 py-12 text-center text-sm text-muted-foreground">
                    {sessionState.status === 'active'
                      ? 'Waiting for students to scan…'
                      : 'No attendance recorded yet'}
                  </div>
                ) : (
                  <ScrollArea className="max-h-[35vh]">
                    <div className="grid grid-cols-1 gap-2 pr-2 sm:grid-cols-2 lg:grid-cols-3">
                      {attendees.map((attendee, idx) => (
                        <div
                          key={attendee._id || idx}
                          className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-3 py-2.5"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <Check className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{attendee.fullName || 'Unknown'}</p>
                            <p className="truncate text-xs text-muted-foreground">{attendee.collegeEmail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Fullscreen QR dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Attendance QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-5">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <QRCodeCanvas
                size={300}
                bgColor="#ffffff"
                fgColor="#000000"
                value={`${window.location.origin}/student/attend?roundId=${selectedRoundId}&code=${sessionState.currentCode}`}
              />
            </div>
            <div className="text-center">
              <p className="font-mono text-3xl font-bold tracking-[0.25em]">
                {sessionState.currentCode || '—'}
              </p>
              {countdown && <p className="mt-1 text-sm text-muted-foreground">Expires in {countdown}</p>}
              {offlineCodeValue && (
                <p className="mt-1 text-sm text-muted-foreground">Offline: {offlineCodeValue}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowQrDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
