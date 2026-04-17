import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import QrScanner from 'qr-scanner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  QrCode,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

function extractAttendanceCode(scannedText, expectedRoundId) {
  const rawText = scannedText?.trim();
  if (!rawText) {
    return { error: 'The QR code did not contain a valid attendance code.' };
  }

  try {
    const url = new URL(rawText);
    const roundId = url.searchParams.get('roundId');
    const code = url.searchParams.get('code') || url.searchParams.get('currentCode');

    if (roundId && expectedRoundId && roundId !== expectedRoundId) {
      return { error: 'This QR is for a different round.' };
    }

    if (code) {
      return { code: code.trim().toUpperCase() };
    }
  } catch {
    // Ignore and continue with other payload shapes.
  }

  try {
    const payload = JSON.parse(rawText);
    const roundId = payload.roundId;
    const code = (payload.code || payload.currentCode || '').toString().trim();

    if (roundId && expectedRoundId && roundId !== expectedRoundId) {
      return { error: 'This QR is for a different round.' };
    }

    if (code) {
      return { code: code.toUpperCase() };
    }
  } catch {
    // Fallback to plain text code.
  }

  return { code: rawText.toUpperCase() };
}

export function AttendancePage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [isInitializingScanner, setIsInitializingScanner] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const mountedRef = useRef(true);

  const studentHeaders = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'student',
    };
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/applications/my-applications`, {
        headers: studentHeaders,
      });
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }  finally {
      setLoading(false);
    }
  }, [studentHeaders]);

  const fetchSessionStatus = useCallback(async (roundId) => {
    if (!roundId) return;
    setSessionLoading(true);
    setError('');
    try {
      const { data } = await axios.get(
        `${API_BASE}/attendance/${roundId}/attendance-session/status`,
        { headers: studentHeaders }
      );
      setSessionStatus(data);
    } catch {
      setSessionStatus({ status: 'inactive' });
    } finally {
      setSessionLoading(false);
    }
  }, [studentHeaders]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    if (!selectedApp?.currentRound?._id) {
      setSessionStatus(null);
      return;
    }
    fetchSessionStatus(selectedApp.currentRound._id);
  }, [selectedApp, fetchSessionStatus]);

  useEffect(() => {
    setCodeInput('');
    setError('');
    setScannerVisible(false);
  }, [selectedApp?._id]);

  useEffect(() => {
    if (!scannerVisible || !selectedApp?.currentRound?._id) {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
      setIsInitializingScanner(false);
      return;
    }

    let cancelled = false;
    setHasCamera(false);
    setIsInitializingScanner(true);
    setError('');

    const initScanner = async () => {
      const cameraAvailable = await QrScanner.hasCamera().catch(() => false);

      if (cancelled || !mountedRef.current) {
        return;
      }

      if (!cameraAvailable) {
        setIsInitializingScanner(false);
        setError('No camera found on this device.');
        setScannerVisible(false);
        return;
      }

      setHasCamera(true);

      if (!videoRef.current) {
        setIsInitializingScanner(false);
        return;
      }

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          if (!mountedRef.current) {
            return;
          }

          const { code, error: scanError } = extractAttendanceCode(
            result.data,
            selectedApp.currentRound._id
          );

          if (scanError) {
            setError(scanError);
            return;
          }

          setCodeInput(code);
          setError('');
          setScannerVisible(false);
        },
        {
          onDecodeError: () => {},
          highlightScanRegion: false,
          highlightCodeOutline: false,
          preferredCamera: 'environment',
          maxScansPerSecond: 2,
        }
      );

      scannerRef.current = scanner;

      await scanner.start().catch(() => {
        if (mountedRef.current) {
          setError('Camera access denied.');
          setScannerVisible(false);
        }
      });

      if (!cancelled && mountedRef.current) {
        setIsInitializingScanner(false);
      }
    };

    initScanner();

    return () => {
      cancelled = true;
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [scannerVisible, selectedApp]);

  const handleSubmitCode = useCallback(async () => {
    if (!selectedApp?.currentRound?._id || !codeInput.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE}/attendance/${selectedApp.currentRound._id}/attendance-checkin`,
        { code: codeInput.trim() },
        { headers: studentHeaders }
      );
      toast.success('Attendance recorded!');
      setCodeInput('');
      fetchSessionStatus(selectedApp.currentRound._id);
      fetchApplications();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to record attendance';
      toast.error(message);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [selectedApp, codeInput, studentHeaders, fetchSessionStatus, fetchApplications]);

  const getMyAttendanceStatus = useCallback(() => {
    if (!selectedApp?.roundProgress || !selectedApp?.currentRound?._id) {
      return 'not_applicable';
    }
    const currentRoundId = selectedApp.currentRound._id;
    const progress = selectedApp.roundProgress.find(
      (p) => p.round?._id === currentRoundId || p.round === currentRoundId
    );
    return progress?.attendance ? 'attended' : 'not_attended';
  }, [selectedApp]);

  const liveSessions = useMemo(() => {
    return applications.filter((app) => app.currentRound?._id);
  }, [applications]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (liveSessions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            View and mark attendance for placement rounds
          </p>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              You have no active applications. Apply to jobs to track attendance.
            </p>
            <Button
              variant="link"
              onClick={() => navigate('/student/availableJob')}
              className="mt-2"
            >
              View available jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const myStatus = getMyAttendanceStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">
          View and mark attendance for placement rounds
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
            <CardDescription>Select an application to view attendance</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[50vh] space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-16rem)]">
            {liveSessions.map((app) => {
              const isSelected = selectedApp?._id === app._id;
              const hasAttended = app.roundProgress?.some(
                (p) =>
                  (p.round?._id === app.currentRound?._id || p.round === app.currentRound?._id) &&
                  p.attendance
              );
              return (
                <Button
                  key={app._id}
                  variant="ghost"
                  className={`h-auto w-full justify-between gap-3 px-3 py-3 ${
                    isSelected
                      ? 'bg-primary/10 hover:bg-primary/20'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-medium">
                      {app.job?.jobTitle || 'Job'}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {app.job?.companyName || 'Company'} •{' '}
                      {app.currentRound?.roundName || 'Round'}
                    </span>
                  </div>
                  {hasAttended ? (
                    <Badge variant="default" className="shrink-0 text-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" /> Present
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">Pending</Badge>
                  )}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>
                {selectedApp?.job?.jobTitle || 'Select an application'}
              </CardTitle>
              <CardDescription>
                {selectedApp
                  ? `${selectedApp.job?.companyName} • ${selectedApp.currentRound?.roundName}`
                  : 'Select from the list to view attendance session'}
              </CardDescription>
            </div>
            {selectedApp && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchSessionStatus(selectedApp.currentRound._id)}
                disabled={sessionLoading}
              >
                <RefreshCw className={`h-4 w-4 ${sessionLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!selectedApp ? (
              <div className="py-8 text-center text-muted-foreground">
                Select an application to view attendance details
              </div>
            ) : sessionLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading session...
              </div>
            ) : sessionStatus?.status !== 'active' ? (
              <div className="flex flex-col items-center justify-center py-8">
                <XCircle className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No active attendance session for this round
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check back when the coordinator starts the session
                </p>
                {myStatus === 'attended' && (
                  <div className="mt-4 flex items-center text-green-600">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <span className="font-medium">You have marked attendance</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center">
                  <Badge variant="default" className="bg-green-600">
                    <Clock className="mr-1 h-3 w-3" /> Session Live
                  </Badge>
                </div>

                <Separator />

                {myStatus === 'attended' ? (
                  <div className="flex items-center justify-center rounded-lg bg-green-100 py-6 dark:bg-green-900/30">
                    <CheckCircle className="mr-3 h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                        Attendance Recorded
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        You are marked present for this round
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Scan the QR shown by the coordinator, or enter the code manually
                      </Label>
                      <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <Input
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                          placeholder="Enter 6-digit code"
                          className="flex-1 text-center text-lg font-mono tracking-widest"
                          maxLength={6}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmitCode();
                          }}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSubmitCode}
                            disabled={submitting || codeInput.length < 6}
                          >
                            {submitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Submit'
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setScannerVisible((visible) => !visible)}
                          >
                            <QrCode className="mr-2 h-4 w-4" />
                            {scannerVisible ? 'Close Scanner' : 'Scan QR'}
                          </Button>
                        </div>
                      </div>

                      {scannerVisible && (
                        <div className="relative overflow-hidden rounded-lg border border-dashed border-border/60 bg-black">
                          <video
                            ref={videoRef}
                            className="h-64 w-full object-cover"
                            playsInline
                            muted
                            autoPlay
                          />
                          {isInitializingScanner && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                              <div className="text-center text-white">
                                <div className="mx-auto mb-2 h-7 w-7 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <p className="text-xs">Starting camera…</p>
                              </div>
                            </div>
                          )}
                          {!isInitializingScanner && hasCamera && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                              <div className="h-44 w-44 rounded-lg border-2 border-blue-400" />
                            </div>
                          )}
                        </div>
                      )}

                      {error && (
                        <p className="text-sm text-destructive">{error}</p>
                      )}
                    </div>

                    <Separator />

                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="mb-2 text-sm font-medium">How to mark attendance:</p>
                      <ol className="list-inside list-decimal text-sm text-muted-foreground space-y-1">
                        <li>Scan the QR code or read the 6-digit code from the coordinator's screen</li>
                        <li>Review the captured code or enter it manually</li>
                        <li>Click Submit to record your attendance</li>
                      </ol>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Round Progress</p>
                  <div className="space-y-2">
                    {selectedApp.roundProgress?.slice(0, 5).map((progress, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {progress.round?.roundName || `Round ${idx + 1}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Seq {progress.round?.sequence || idx + 1}
                          </p>
                        </div>
                        {progress.attendance ? (
                          <Badge variant="default" className="text-green-600">
                            <CheckCircle className="mr-1 h-3 w-3" /> Present
                          </Badge>
                        ) : progress.result ? (
                          <Badge
                            variant={
                              progress.result === 'selected'
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {progress.result}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => navigate('/student/applications')}
                    className="px-0"
                  >
                    View all applications
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ children, className }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  );
}

export default AttendancePage;
