import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BulkAdvanceDialog } from '@/components/admin/BulkAdvanceDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs'
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Eye,RotateCcw, UserCheck, Users } from 'lucide-react';
const STATUS_LABELS = {
  in_process: 'In Process',
  rejected: 'Rejected',
  placed: 'Placed'
};

const STATUS_VARIANTS = {
  in_process: 'secondary',
  rejected: 'destructive',
  placed: 'default'
};

function StatusBadge({ value }) {
  const label = STATUS_LABELS[value] || value;
  const variant = STATUS_VARIANTS[value] || 'outline';
  return <Badge variant={variant}>{label}</Badge>;
}

function ApplicationDetailsDialog({
  open,
  onOpenChange,
  application,
  jobRounds,
  roundsLoading,
  onUpdateStatus,
  onToggleAttendance,
  onAdvance,
  onFinalize
}) {
  const [finalStatus, setFinalStatus] = useState('in_process');
  const [notes, setNotes] = useState('');
  const [selectedRoundId, setSelectedRoundId] = useState('');
  const [finalizeOutcome, setFinalizeOutcome] = useState('placed');
  const [finalizeNotes, setFinalizeNotes] = useState('');

  useEffect(() => {
    if (application) {
      setFinalStatus(application.finalStatus || 'in_process');
      setNotes(application.notes || '');
    }
  }, [application]);

  useEffect(() => {
    if (!application || jobRounds.length === 0) {
      setSelectedRoundId('');
      return;
    }
    const currentSequence = application.currentRoundSequence ?? 0;
    const next = jobRounds
      .filter((round) => (round.sequence ?? 0) > currentSequence)
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    setSelectedRoundId(next[0]?._id || '');
  }, [application, jobRounds]);

  const roundProgress = application?.roundProgress || [];
  const currentSequence = application?.currentRoundSequence ?? 0;
  const nextRoundOptions = useMemo(() => {
    return jobRounds
      .filter((round) => (round.sequence ?? 0) > currentSequence)
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  }, [jobRounds, currentSequence]);

  if (!application) {
    return null;
  }

  const handleStatusSubmit = async (event) => {
    event.preventDefault();
    await onUpdateStatus(finalStatus, notes);
  };

  const handleFinalize = async (event) => {
    event.preventDefault();
    await onFinalize(finalizeOutcome, finalizeNotes, application.currentRound);
    setFinalizeNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:max-w-5xl">
        <DialogHeader className="pb-2">
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="grid grid-cols-1 gap-4 pr-1 md:grid-cols-2">
            <div className="space-y-4">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-md">Applicant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm pt-0">
                <div>
                  <p className="font-medium">{application.student?.fullName || 'Unknown Student'}</p>
                  <p className="text-muted-foreground">{application.student?.collegeEmail}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{application.student?.dept || 'N/A'}</Badge>
                  <Badge variant="outline">CGPA: {application.student?.ugCgpa || 'N/A'}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-base">Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm pt-0">
                <div>
                  <p className="font-medium">{application.job?.jobTitle || 'Unknown Role'}</p>
                  <p className="text-muted-foreground">{application.job?.companyName || 'Unknown Company'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={application.finalStatus || 'in_process'} />
                  {application.currentRound && (
                    <Badge variant="outline">
                      Current Round: {application.currentRound?.roundName || application.currentRoundSequence}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Applied on {format(new Date(application.createdAt), 'PPp')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-base">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <form className="space-y-3" onSubmit={handleStatusSubmit}>
                  <p className="text-xs text-muted-foreground">
                    Setting status to <strong>Placed</strong> or <strong>Rejected</strong> will close this application and
                    remove its current round. Keep it <strong>In Process</strong> if you intend to advance the candidate.
                  </p>
                  <div className="space-y-1">
                    <Label htmlFor="final-status">Final Status</Label>
                    <Select value={finalStatus} onValueChange={setFinalStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_process">In Process</SelectItem>
                        <SelectItem value="placed">Placed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="status-notes">Notes</Label>
                    <Textarea
                      id="status-notes"
                      className="min-h-[80px]"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full justify-center">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-base">Finalize Outcome</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <form className="space-y-3" onSubmit={handleFinalize}>
                  <div className="space-y-1">
                    <Label htmlFor="finalize-outcome">Outcome</Label>
                    <Select value={finalizeOutcome} onValueChange={setFinalizeOutcome}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placed">Placed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="finalize-notes">Notes</Label>
                    <Textarea
                      id="finalize-notes"
                      className="min-h-[80px]"
                      value={finalizeNotes}
                      onChange={(event) => setFinalizeNotes(event.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="outline" className="w-full justify-center">
                    Finalize Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

            <div className="space-y-4">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-base">Round Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0  mr-4 max-h-[24rem] overflow-y-auto pr-1">
                {roundProgress.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No rounds recorded yet.</p>
                ) : (
                  roundProgress.map((entry) => {
                    const roundId = entry.round?._id || entry.round;
                    const roundName = entry.round?.roundName || entry.roundName || 'Round';
                    const sequence = entry.round?.sequence ?? entry.sequence;
                    const attended = Boolean(entry.attendance);

                    return (
                      <div key={`${roundId}-${entry.result}`} className="rounded-lg border p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold">{roundName}</p>
                            {sequence !== undefined && (
                              <p className="text-xs text-muted-foreground">Round {sequence}</p>
                            )}
                          </div>
                          <Badge variant={attended ? 'default' : 'outline'}>
                            {attended ? 'Attended' : 'Pending Attendance'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>Result: {entry.result}</span>
                          {entry.decidedAt && <span>Decided {format(new Date(entry.decidedAt), 'PP')}</span>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={attended ? 'destructive' : 'outline'}
                            onClick={() => onToggleAttendance(roundId, !attended)}
                          >
                            {attended ? 'Mark Absent' : 'Mark Attended'}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Advance to Next Round</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {!application.currentRound ? (
                  <p className="text-sm text-muted-foreground">
                    This application is no longer assigned to a round. Set status back to <strong>In Process</strong>
                    before advancing, or finalize the outcome instead.
                  </p>
                ) : roundsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading rounds...</p>
                ) : nextRoundOptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming rounds available.</p>
                ) : (
                  <>
                    <Select value={selectedRoundId} onValueChange={setSelectedRoundId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select next round" />
                      </SelectTrigger>
                      <SelectContent>
                        {nextRoundOptions.map((round) => (
                          <SelectItem key={round._id} value={round._id}>
                            Round {round.sequence}: {round.roundName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => onAdvance(selectedRoundId)}
                      disabled={!selectedRoundId}
                    >
                      Move to Selected Round
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function Applications() {
  const {
    applications,
    loading,
    error,
    setSelectedApplication,
    selectedApplication,
    jobRounds,
    roundsLoading,
    updateApplicationStatus,
    markAttendance,
    advanceToRound,
    finalizeApplication,
    fetchJobRounds,
    bulkAdvanceApplications
  } = useApplications();
 const { jobs, loading: jobsLoading } = useJobs();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
const [bulkAdvanceDialogOpen, setBulkAdvanceDialogOpen] = useState(false);
  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesQuery =
        !query ||
        application.student?.fullName?.toLowerCase().includes(query) ||
        application.job?.jobTitle?.toLowerCase().includes(query) ||
        application.job?.companyName?.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all' || application.finalStatus === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [applications, search, statusFilter]);
const simplifiedJobs = useMemo(() => {
    if (jobsLoading || !jobs) return [];
    return [
      ...(jobs.private || []),
      ...(jobs.public || [])
    ].map(j => ({ _id: j._id, jobTitle: j.jobTitle, companyName: j.companyName }));
  }, [jobs, jobsLoading]);

  const handleOpenDialog = async (application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
    await fetchJobRounds(application.job?._id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleUpdateStatus = async (finalStatus, notes) => {
    if (!selectedApplication) return;
    const updated = await updateApplicationStatus(selectedApplication._id, { finalStatus, notes });
    setSelectedApplication(updated);
  };

  const handleAttendanceToggle = async (roundId, attended) => {
    if (!selectedApplication || !roundId) return;
    const updated = await markAttendance(selectedApplication._id, roundId, attended);
    setSelectedApplication(updated);
  };

  const handleAdvance = async (nextRoundId) => {
    if (!selectedApplication || !nextRoundId) return;
    const updated = await advanceToRound(selectedApplication._id, nextRoundId);
    setSelectedApplication(updated);
    await fetchJobRounds(updated.job?._id);
  };

  const handleFinalize = async (outcome, notes, roundId) => {
    if (!selectedApplication) return;
    const payload = {
      outcome,
      notes,
      roundId: roundId?._id || roundId || undefined
    };
    const updated = await finalizeApplication(selectedApplication._id, payload);
    setSelectedApplication(updated);
  };
 const handleBulkAdvance = async (payload) => {
    return await bulkAdvanceApplications(payload);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Management</h1>
          <p className="text-muted-foreground">Review and manage student applications across all job postings.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by student or job"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full md:w-64"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in_process">In Process</SelectItem>
              <SelectItem value="placed">Placed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setBulkAdvanceDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Bulk Advance
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 max-w-lg">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in_process">In Process</TabsTrigger>
          <TabsTrigger value="placed">Placed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        {['all', 'in_process', 'placed', 'rejected'].map((tab) => {
          const items = filteredApplications.filter((app) => tab === 'all' || app.finalStatus === tab);
          return (
            <TabsContent value={tab} key={tab} className="mt-4">
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {tab === 'all' ? 'All Applications' : `${STATUS_LABELS[tab]} Applications`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading applications...</p>
                  ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                  ) : items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No applications match the current filters.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Job</TableHead>
                            <TableHead>Current Round</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((application) => (
                            <TableRow key={application._id}>
                              <TableCell>
                                <div className="font-medium">{application.student?.fullName || 'Unknown Student'}</div>
                                <div className="text-xs text-muted-foreground">{application.student?.collegeEmail}</div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{application.job?.jobTitle || 'Unknown Role'}</div>
                                <div className="text-xs text-muted-foreground">{application.job?.companyName}</div>
                              </TableCell>
                              <TableCell>
                                {application.currentRound ? (
                                  <span className="text-sm">
                                    {application.currentRound?.roundName || `Round ${application.currentRoundSequence}`}
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <StatusBadge value={application.finalStatus || 'in_process'} />
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(application.createdAt), 'PP')}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => handleOpenDialog(application)}
                                >
                                  <Eye className="h-4 w-4" />
                                  Manage
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <ApplicationDetailsDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDialog();
          } else {
            setDialogOpen(true);
          }
        }}
        application={selectedApplication}
        jobRounds={jobRounds}
        roundsLoading={roundsLoading}
        onUpdateStatus={handleUpdateStatus}
        onToggleAttendance={handleAttendanceToggle}
        onAdvance={handleAdvance}
        onFinalize={handleFinalize}
      />
       <BulkAdvanceDialog 
        open={bulkAdvanceDialogOpen}
        onOpenChange={setBulkAdvanceDialogOpen}
        jobs={simplifiedJobs}
        jobRounds={jobRounds}
        onFetchRounds={fetchJobRounds}
        onBulkAdvance={handleBulkAdvance}
      />
    </div>
  );
}

export default Applications;
