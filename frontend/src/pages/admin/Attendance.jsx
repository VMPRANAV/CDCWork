import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertCircle,
  Loader2,
  QrCode,
  RefreshCw,
  StopCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';
const POLL_INTERVAL_MS = 5000;
const REFRESH_INTERVAL_OPTIONS = [30, 45, 60, 90];

const defaultSessionState = { status: 'inactive' };

export function Attendance() {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [jobQuery, setJobQuery] = useState('');
  const [jobSortOption, setJobSortOption] = useState('created-desc');

  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedRoundId, setSelectedRoundId] = useState('');

  const [sessionState, setSessionState] = useState(defaultSessionState);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [enableOfflineCode, setEnableOfflineCode] = useState(false);
  const [offlineCodeValue, setOfflineCodeValue] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [showQrDialog, setShowQrDialog] = useState(false);

  const statusPollRef = useRef(null);
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

  const clearStatusPoll = useCallback(() => {
    if (statusPollRef.current) {
      clearInterval(statusPollRef.current);
      statusPollRef.current = null;
    }
  }, []);

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
    return () => clearStatusPoll();
  }, [fetchJobs, clearStatusPoll]);

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

  const fetchSessionStatus = useCallback(
    async (roundId) => {
      if (!roundId) return null;
      const response = await axios.get(
        `${API_BASE}/rounds/${roundId}/attendance-session/status`,
        { headers: adminHeaders }
      );
      return response.data;
    },
    [adminHeaders]
  );

  const startPollingStatus = useCallback(
    (roundId) => {
      clearStatusPoll();
      statusPollRef.current = setInterval(() => {
        fetchSessionStatus(roundId)
          .then((status) => {
            if (!status) return;
            setSessionState(status);
            setSessionError('');
            if (status.refreshIntervalSeconds) {
              setRefreshInterval(status.refreshIntervalSeconds);
            }
            setOfflineCodeValue(status.offlineCode || null);
            setEnableOfflineCode(Boolean(status.offlineCode));
            if (status.status !== 'active') {
              clearStatusPoll();
            }
          })
          .catch((error) => {
            const message = error.response?.data?.message || 'Failed to refresh session status';
            setSessionError(message);
            clearStatusPoll();
          });
      }, POLL_INTERVAL_MS);
    },
    [clearStatusPoll, fetchSessionStatus]
  );

  const loadSessionStatus = useCallback(
    async (roundId) => {
      if (!roundId) {
        setSessionState(defaultSessionState);
        setOfflineCodeValue(null);
        setEnableOfflineCode(false);
        clearStatusPoll();
        return;
      }
      setSessionLoading(true);
      setSessionError('');
      try {
        const status = await fetchSessionStatus(roundId);
        if (status) {
          setSessionState(status);
          if (status.refreshIntervalSeconds) {
            setRefreshInterval(status.refreshIntervalSeconds);
          }
          setOfflineCodeValue(status.offlineCode || null);
          setEnableOfflineCode(status.status === 'active' ? Boolean(status.offlineCode) : false);
          if (status.status === 'active') {
            startPollingStatus(roundId);
          } else {
            clearStatusPoll();
            setShowQrDialog(false);
          }
        } else {
          setSessionState(defaultSessionState);
          setOfflineCodeValue(null);
          setEnableOfflineCode(false);
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to load session status';
        setSessionError(message);
        toast.error('Attendance status error', { description: message });
        setSessionState(defaultSessionState);
        setOfflineCodeValue(null);
        setEnableOfflineCode(false);
        clearStatusPoll();
      } finally {
        setSessionLoading(false);
      }
    },
    [fetchSessionStatus, startPollingStatus, clearStatusPoll]
  );

  useEffect(() => {
    loadSessionStatus(selectedRoundId);
  }, [selectedRoundId, loadSessionStatus]);

  const handleStartSession = useCallback(async () => {
    if (!selectedRoundId || sessionLoading) return;
    setSessionLoading(true);
    setSessionError('');
    try {
      const response = await axios.post(
        `${API_BASE}/rounds/${selectedRoundId}/attendance-session/start`,
        {
          refreshIntervalSeconds: Number(refreshInterval),
          enableOfflineCode,
        },
        { headers: adminHeaders }
      );
      setSessionState(response.data);
      setOfflineCodeValue(response.data.offlineCode || null);
      setEnableOfflineCode(Boolean(response.data.offlineCode));
      toast.success('Attendance session started');
      startPollingStatus(selectedRoundId);
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to start session';
      setSessionError(message);
      toast.error('Unable to start session', { description: message });
    } finally {
      setSessionLoading(false);
    }
  }, [selectedRoundId, sessionLoading, refreshInterval, enableOfflineCode, adminHeaders, startPollingStatus]);

  const handleStopSession = useCallback(async () => {
    if (!selectedRoundId || sessionLoading) return;
    setSessionLoading(true);
    setSessionError('');
    try {
      await axios.post(
        `${API_BASE}/rounds/${selectedRoundId}/attendance-session/stop`,
        {},
        { headers: adminHeaders }
      );
      toast.success('Attendance session stopped');
      setSessionState(defaultSessionState);
      setOfflineCodeValue(null);
      setEnableOfflineCode(false);
      setShowQrDialog(false);
      clearStatusPoll();
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to stop session';
      setSessionError(message);
      toast.error('Unable to stop session', { description: message });
    } finally {
      setSessionLoading(false);
    }
  }, [selectedRoundId, sessionLoading, adminHeaders, clearStatusPoll]);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Sessions</h1>
        <p className="text-muted-foreground">
          Manage QR based attendance for each job round. Start a session to generate a code that students can scan to mark attendance.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[320px,minmax(0,1fr)]">
        <Card className="flex h-full border border-border/60 lg:max-h-[72vh] lg:flex-col">
          <CardHeader>
            <CardTitle>Job postings</CardTitle>
            <CardDescription>Select a job to view its rounds and manage attendance.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-hidden">
            {jobsLoading ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading jobs...
              </div>
            ) : jobsError ? (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{jobsError}</span>
              </div>
            ) : noJobs ? (
              <p className="text-sm text-muted-foreground">No job postings found yet.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Input
                    value={jobQuery}
                    onChange={(event) => setJobQuery(event.target.value)}
                    placeholder="Search job title or company"
                    className="h-9 sm:max-w-xs"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase text-muted-foreground">Sort by</span>
                    <Select value={jobSortOption} onValueChange={setJobSortOption}>
                      <SelectTrigger className="w-48 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created-desc">Newest first</SelectItem>
                        <SelectItem value="created-asc">Oldest first</SelectItem>
                        <SelectItem value="title-asc">Job title A-Z</SelectItem>
                        <SelectItem value="title-desc">Job title Z-A</SelectItem>
                        <SelectItem value="eligible-desc">Most eligible students</SelectItem>
                        <SelectItem value="eligible-asc">Fewest eligible students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {filteredJobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No jobs match your search.</p>
                ) : (
                  <ScrollArea className="max-h-[calc(60vh-4rem)] pr-1">
                    <div className="space-y-2 pb-4">
                      {filteredJobs.map((job) => {
                      const isActive = selectedJobId === job._id;
                      return (
                        <Button
                          key={job._id}
                          type="button"
                          variant="ghost"
                          className={cn(
                            'w-full justify-between gap-3 rounded-md border px-4 py-3 text-left',
                            isActive
                              ? 'border-primary/60 bg-primary/10 hover:bg-primary/20'
                              : 'border-border/60 hover:bg-muted'
                          )}
                          onClick={() => {
                            setSelectedJobId(job._id);
                            setSessionError('');
                          }}
                        >
                          <div className="flex flex-1 items-center gap-2">
                            <span className="text-sm font-semibold leading-tight">{job.jobTitle}</span>
                            <span className="text-xs text-muted-foreground">{job.companyName}</span>
                            <span className="text-xs text-muted-foreground">• {job.eligibleCount ?? 0} eligible</span>
                          </div>
                          <Badge variant={job.status === 'public' ? 'default' : 'secondary'}>
                            {job.status === 'public' ? 'Published' : 'Draft'}
                          </Badge>
                        </Button>
                      );
                    })}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" onClick={fetchJobs} disabled={jobsLoading}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex h-full border border-border/60 lg:max-h-[72vh] lg:flex-col">
          <CardHeader>
            <CardTitle>Session controls</CardTitle>
            <CardDescription>
              Choose a round and configure attendance settings. Sessions expire automatically once the code times out.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-hidden">
            <ScrollArea className="h-full pr-1">
              <div className="space-y-4 pb-4">
            <div className="rounded-lg border border-border/60 bg-muted/10 p-4">
              {selectedJob ? (
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">{selectedJob.jobTitle}</p>
                  <p className="text-xs text-muted-foreground">{selectedJob.companyName}</p>
                  <p className="text-xs text-muted-foreground">
                    Eligible students: <span className="font-semibold">{selectedJob.eligibleCount ?? 0}</span>
                  </p>
                  <Badge className="mt-1 w-fit" variant={selectedJob.status === 'public' ? 'default' : 'secondary'}>
                    {selectedJob.status === 'public' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a job from the list to begin.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">Round</Label>
              <Select
                value={selectedRoundId}
                onValueChange={(value) => setSelectedRoundId(value)}
                disabled={!selectedJob || noRounds}
              >
                <SelectTrigger>
                  <SelectValue placeholder={noRounds ? 'No rounds available' : 'Select round'} />
                </SelectTrigger>
                <SelectContent>
                  {selectedJob?.rounds?.map((round) => (
                    <SelectItem key={round._id} value={round._id}>
                      {round.roundName || 'Round'} • Seq {round.sequence ?? '-'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRound && (
              <div className="rounded-md border border-dashed border-border/60 bg-muted/10 p-4 text-sm">
                <p className="font-medium">{selectedRound.roundName || 'Round details'}</p>
                <p className="text-muted-foreground">
                  {selectedRound.mode ? selectedRound.mode.charAt(0).toUpperCase() + selectedRound.mode.slice(1) : 'Mode'} •
                  {' '}
                  Sequence {selectedRound.sequence ?? '-'}
                </p>
              </div>
            )}

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase text-muted-foreground">Refresh interval</Label>
                <Select
                  value={String(refreshInterval)}
                  onValueChange={(value) => setRefreshInterval(Number(value))}
                  disabled={sessionLoading || sessionState.status === 'active'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REFRESH_INTERVAL_OPTIONS.map((value) => (
                      <SelectItem key={value} value={String(value)}>
                        {value} seconds
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">Offline fallback code</p>
                  <p className="text-xs text-muted-foreground">Allow manual entry if QR cannot be scanned</p>
                </div>
                <Switch
                  checked={enableOfflineCode}
                  onCheckedChange={setEnableOfflineCode}
                  disabled={sessionLoading || sessionState.status === 'active'}
                />
              </div>
            </div>

            {sessionError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{sessionError}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleStartSession}
                disabled={sessionLoading || !selectedRoundId || sessionState.status === 'active'}
              >
                {sessionLoading && sessionState.status !== 'active' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <QrCode className="mr-2 h-4 w-4" />
                )}
                {sessionState.status === 'active' ? 'Session Active' : 'Start Session'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => loadSessionStatus(selectedRoundId)}
                disabled={sessionLoading || !selectedRoundId}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Check Status
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleStopSession}
                disabled={sessionLoading || sessionState.status !== 'active'}
              >
                {sessionLoading && sessionState.status === 'active' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <StopCircle className="mr-2 h-4 w-4" />
                )}
                Stop Session
              </Button>
            </div>

            {sessionState.status === 'active' && (
              <div
                ref={qrCodeContainerRef}
                tabIndex={-1}
                className="rounded-lg border border-border/60 bg-muted/10 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">QR Code</p>
                    <p className="text-xs text-muted-foreground">
                      Share this with students. A new code is generated every {sessionState.refreshIntervalSeconds || refreshInterval} seconds.
                    </p>
                  </div>
                  <Badge variant="secondary">{countdown || 'Active'}</Badge>
                </div>
                <div className="mt-4 flex flex-col items-center gap-4 md:flex-row md:items-start">
                  <div className="flex items-center justify-center rounded-md border border-border/60 bg-background p-4">
                    {sessionState.currentCode ? (
                      <QRCodeCanvas
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        value={JSON.stringify({
                          jobId: selectedJobId,
                          roundId: selectedRoundId,
                          code: sessionState.currentCode,
                        })}
                      />
                    ) : (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Waiting for code...
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 text-sm">
                    <div className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2">
                      <span className="font-medium">Current code</span>
                      <span className="text-muted-foreground">{sessionState.currentCode || '—'}</span>
                    </div>
                    {offlineCodeValue && (
                      <div className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2">
                        <span className="font-medium">Offline code</span>
                        <span className="text-muted-foreground">{offlineCodeValue}</span>
                      </div>
                    )}
                    {sessionState.offlineCodeUsedAt && (
                      <p className="text-xs text-muted-foreground">
                        Offline code used at {new Date(sessionState.offlineCodeUsedAt).toLocaleString()}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowQrDialog(true)}
                        disabled={!sessionState.currentCode}
                      >
                        Present fullscreen
                      </Button>
                      {offlineCodeValue && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setEnableOfflineCode((prev) => !prev)}
                          disabled={sessionLoading || sessionState.status !== 'active'}
                        >
                          {enableOfflineCode ? 'Disable offline code' : 'Enable offline code'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedRound && !noRounds && !noJobs && (
              <p className="text-sm text-muted-foreground">Select a round to view attendance controls.</p>
            )}
            {noRounds && !noJobs && (
              <p className="text-sm text-muted-foreground">The selected job has no rounds configured.</p>
            )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Attendance QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <QRCodeCanvas
              size={280}
              bgColor="#ffffff"
              fgColor="#000000"
              value={JSON.stringify({
                jobId: selectedJobId,
                roundId: selectedRoundId,
                code: sessionState.currentCode,
              })}
            />
            <div className="text-center text-sm text-muted-foreground">
              <p className="font-medium tracking-wide text-lg">{sessionState.currentCode || '—'}</p>
              {countdown && <p>Expires in {countdown}</p>}
              {offlineCodeValue && <p>Offline code: {offlineCodeValue}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowQrDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
