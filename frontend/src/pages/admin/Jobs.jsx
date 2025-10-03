import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useJobs, getInitialJobForm } from '@/hooks/useJobs';
import { useStudents } from '@/hooks/useStudents';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Users, Eye, Send, Calendar as CalendarIcon, X, CircleDot } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const DEPARTMENTS = [
  'AIDS',
  'AIML',
  'BME',
  'CHEM',
  'CIVIL',
  'CSE',
  'CSBS',
  'Cyber Security',
  'ECE',
  'EEE',
  'IT',
  'Mechanical',
  'Mechatronics'
];

const ROUND_MODES = ['online', 'offline', 'hybrid'];

const ROUND_STATUS = [
  { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'postponed', label: 'Postponed', color: 'bg-orange-100 text-orange-800' }
];

const MONTHS = [
  { name: 'January', value: 0 },
  { name: 'February', value: 1 },
  { name: 'March', value: 2 },
  { name: 'April', value: 3 },
  { name: 'May', value: 4 },
  { name: 'June', value: 5 },
  { name: 'July', value: 6 },
  { name: 'August', value: 7 },
  { name: 'September', value: 8 },
  { name: 'October', value: 9 },
  { name: 'November', value: 10 },
  { name: 'December', value: 11 }
];

const blankRound = () => ({
  roundName: '',
  type: '',
  mode: '',
  status: 'scheduled',
  scheduledAt: null,
  venue: '',
  instructions: '',
  sequence: undefined,
  isAttendanceMandatory: true,
  autoAdvanceOnAttendance: false
});

function sanitizeJobPayload(form) {
  const locations = (form.locations || []).map((loc) => loc.trim()).filter(Boolean);
  const eligibility = {
    minTenthPercent: form.eligibility.minTenthPercent ? Number(form.eligibility.minTenthPercent) : 0,
    minTwelfthPercent: form.eligibility.minTwelfthPercent ? Number(form.eligibility.minTwelfthPercent) : 0,
    passoutYear: form.eligibility.passoutYear ? Number(form.eligibility.passoutYear) : undefined,
    allowedDepartments: form.eligibility.allowedDepartments || [],
    maxArrears: form.eligibility.maxArrears ? Number(form.eligibility.maxArrears) : 0
  };

  return {
    companyName: form.companyName,
    jobTitle: form.jobTitle,
    jobDescription: form.jobDescription,
    salary: form.salary,
    locations,
    fileLink: form.fileLink,
    eligibility
  };
}

function sanitizeRoundsPayload(rounds) {
  return (rounds || []).map((round, index) => ({
    roundName: round.roundName,
    type: round.type,
    mode: round.mode ?? '',
    status: round.status ?? 'scheduled',
    scheduledAt: round.scheduledAt ? new Date(round.scheduledAt).toISOString() : null,
    venue: round.venue,
    instructions: round.instructions,
    sequence: round.sequence ?? index + 1,
    isAttendanceMandatory: round.isAttendanceMandatory ?? true,
    autoAdvanceOnAttendance: round.autoAdvanceOnAttendance ?? false
  }));
}

function buildFormFromJob(job) {
  const base = getInitialJobForm();
  if (!job) return base;
  return {
    ...base,
    companyName: job.companyName || '',
    jobTitle: job.jobTitle || '',
    jobDescription: job.jobDescription || '',
    salary: job.salary || '',
    locations: job.locations && job.locations.length ? job.locations : [''],
    fileLink: job.fileLink || '',
    eligibility: {
      minCgpa: job.eligibility?.minCgpa ?? '',
      minTenthPercent: job.eligibility?.minTenthPercent ?? '',
      minTwelfthPercent: job.eligibility?.minTwelfthPercent ?? '',
      passoutYear: job.eligibility?.passoutYear ?? '',
      allowedDepartments: job.eligibility?.allowedDepartments || [],
      maxArrears: job.eligibility?.maxArrears ?? ''
    }
  };
}

export function Jobs() {
  const {
    jobs,
    loading,
    saving,
    publishing,
    createJob,
    updateJob,
    publishJob,
    fetchJobs,
    fetchEligibleStudents,
    eligibleStudents,
    eligibleLoading,
    updateEligibleStudents
  } = useJobs();

  const { students: allStudents } = useStudents();

  // Changed: Set default tab to 'public' instead of 'private'
  const [activeTab, setActiveTab] = useState('public');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('created-desc');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showMonthGrid, setShowMonthGrid] = useState(false);
  const [isJobDialogOpen, setJobDialogOpen] = useState(false);
  const [isRoundsDialogOpen, setRoundsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [roundsEditingJob, setRoundsEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState(getInitialJobForm());
  const [roundsForm, setRoundsForm] = useState([]);
  const [eligibleDialogJob, setEligibleDialogJob] = useState(null);
  const [studentToAdd, setStudentToAdd] = useState('');

  const filteredSortedJobs = useMemo(() => {
    const list = jobs[activeTab] || [];
    const query = searchQuery.trim().toLowerCase();

    // First filter by search query
    const filtered = query
      ? list.filter((job) =>
          [job.jobTitle, job.companyName, job.salary]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query))
        )
      : list;

    // Then filter by selected month if applicable
    const monthFiltered = selectedMonth !== null
      ? filtered.filter((job) => {
          if (!job.createdAt) return false;
          const jobMonth = new Date(job.createdAt).getMonth();
          return jobMonth === selectedMonth;
        })
      : filtered;

    // Finally sort the results
    const sorted = [...monthFiltered].sort((a, b) => {
      switch (sortOption) {
        case 'eligible-desc':
          return (b.eligibleCount ?? 0) - (a.eligibleCount ?? 0);
        case 'eligible-asc':
          return (a.eligibleCount ?? 0) - (b.eligibleCount ?? 0);
        case 'title-asc':
          return a.jobTitle.localeCompare(b.jobTitle);
        case 'title-desc':
          return b.jobTitle.localeCompare(a.jobTitle);
        case 'created-asc':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'created-desc':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    return sorted;
  }, [jobs, activeTab, searchQuery, sortOption, selectedMonth]);

  // Get job counts by month for the current tab
  const jobCountsByMonth = useMemo(() => {
    const list = jobs[activeTab] || [];
    const counts = {};
    
    MONTHS.forEach(month => {
      counts[month.value] = list.filter(job => {
        if (!job.createdAt) return false;
        return new Date(job.createdAt).getMonth() === month.value;
      }).length;
    });
    
    return counts;
  }, [jobs, activeTab]);

  const availableStudentsToAdd = useMemo(() => {
    if (!eligibleDialogJob) return [];
    const eligibleIds = new Set((eligibleStudents || []).map((student) => student._id));
    return (allStudents || []).filter((student) => !eligibleIds.has(student._id));
  }, [allStudents, eligibleStudents, eligibleDialogJob]);

  const handleSortChange = (value) => {
    if (value === 'by-month') {
      setShowMonthGrid(true);
    } else {
      setSortOption(value);
      setSelectedMonth(null);
      setShowMonthGrid(false);
    }
  };

  const handleMonthSelect = (monthValue) => {
    setSelectedMonth(monthValue);
    setShowMonthGrid(false);
    setSortOption('created-desc'); // Default sort within the month
  };

  const clearMonthFilter = () => {
    setSelectedMonth(null);
    setSortOption('created-desc');
  };

  const handleOpenCreate = () => {
    setEditingJob(null);
    setJobForm(getInitialJobForm());
    setJobDialogOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setJobForm(buildFormFromJob(job));
    setJobDialogOpen(true);
  };

  const handleOpenRounds = (job) => {
    setRoundsEditingJob(job);
    setRoundsForm(job.rounds ? job.rounds.map((round) => ({
      roundName: round.roundName || '',
      type: round.type || '',
      mode: round.mode || '',
      status: round.status || 'scheduled',
      scheduledAt: round.scheduledAt ? new Date(round.scheduledAt) : null,
      venue: round.venue || '',
      instructions: round.instructions || '',
      sequence: round.sequence,
      isAttendanceMandatory: round.isAttendanceMandatory ?? true,
      autoAdvanceOnAttendance: round.autoAdvanceOnAttendance ?? false
    })) : []);
    setRoundsDialogOpen(true);
  };

  const handleJobFormChange = (field, value) => {
    setJobForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEligibilityChange = (field, value) => {
    setJobForm((prev) => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        [field]: value
      }
    }));
  };

  const toggleDepartment = (dept) => {
    setJobForm((prev) => {
      const exists = prev.eligibility.allowedDepartments.includes(dept);
      return {
        ...prev,
        eligibility: {
          ...prev.eligibility,
          allowedDepartments: exists
            ? prev.eligibility.allowedDepartments.filter((d) => d !== dept)
            : [...prev.eligibility.allowedDepartments, dept]
        }
      };
    });
  };

  const handleLocationChange = (index, value) => {
    setJobForm((prev) => {
      const next = [...prev.locations];
      next[index] = value;
      return {
        ...prev,
        locations: next
      };
    });
  };

  const addLocationField = () => {
    setJobForm((prev) => ({
      ...prev,
      locations: [...prev.locations, '']
    }));
  };

  const removeLocationField = (index) => {
    setJobForm((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const addRoundField = () => {
    setRoundsForm((prev) => [...prev, blankRound()]);
  };

  const updateRoundField = (index, field, value) => {
    setRoundsForm((prev) => 
      prev.map((round, i) => (i === index ? { ...round, [field]: value } : round))
    );
  };

  const removeRoundField = (index) => {
    setRoundsForm((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitJob = async (event) => {
    event?.preventDefault();
    const payload = sanitizeJobPayload(jobForm);
    if (!payload.eligibility.passoutYear) {
      return;
    }
    if (editingJob) {
      await updateJob(editingJob._id, payload);
    } else {
      await createJob(payload);
    }
    setJobDialogOpen(false);
    setEditingJob(null);
    setJobForm(getInitialJobForm());
  };

  const handleSubmitRounds = async (event) => {
    event?.preventDefault();
    if (!roundsEditingJob) return;
    
    const payload = {
      rounds: sanitizeRoundsPayload(roundsForm)
    };
    
    await updateJob(roundsEditingJob._id, payload);
    setRoundsDialogOpen(false);
    setRoundsEditingJob(null);
    setRoundsForm([]);
  };

  const handleOpenEligibleDialog = useCallback(
    async (job) => {
      setEligibleDialogJob(job);
      setStudentToAdd('');
      await fetchEligibleStudents(job._id);
    },
    [fetchEligibleStudents]
  );

  const handleCloseEligibleDialog = () => {
    setEligibleDialogJob(null);
    setStudentToAdd('');
  };

  const handleAddEligibleStudent = async () => {
    if (!eligibleDialogJob || !studentToAdd) return;
    await updateEligibleStudents(eligibleDialogJob._id, { add: [studentToAdd] });
    setStudentToAdd('');
    await fetchEligibleStudents(eligibleDialogJob._id);
  };

  const handleRemoveEligibleStudent = async (studentId) => {
    if (!eligibleDialogJob) return;
    await updateEligibleStudents(eligibleDialogJob._id, { remove: [studentId] });
    await fetchEligibleStudents(eligibleDialogJob._id);
  };

  const handlePublishJob = async (job) => {
    if (!job.rounds || job.rounds.length === 0) {
      return;
    }
    await publishJob(job._id);
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
          <p className="text-muted-foreground">
            Create, review, and publish job opportunities for students.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New Job
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Jobs Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Changed: Switched order - Published Jobs first, Draft Jobs second */}
            <TabsList className="grid grid-cols-2 max-w-sm">
              <TabsTrigger value="public">Published Jobs ({jobs.public?.length ?? 0})</TabsTrigger>
              <TabsTrigger value="private">Draft Jobs ({jobs.private?.length ?? 0})</TabsTrigger>
            </TabsList>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:max-w-sm">
                <Input
                  placeholder="Search jobs"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase text-muted-foreground">Sort by</span>
                <Select value={selectedMonth !== null ? `month-${selectedMonth}` : sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="by-month">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Sort by Month
                      </div>
                    </SelectItem>
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

            {/* Month filter indicator */}
            {selectedMonth !== null && (
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  {MONTHS[selectedMonth]?.name} jobs ({filteredSortedJobs.length})
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={clearMonthFilter}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </div>
            )}

            {/* Month Grid Overlay */}
            {showMonthGrid && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Select Month</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowMonthGrid(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {MONTHS.map((month) => (
                    <Button
                      key={month.value}
                      variant="outline"
                      className="flex flex-col items-center justify-center h-20 hover:bg-primary/10"
                      onClick={() => handleMonthSelect(month.value)}
                    >
                      <span className="font-medium">{month.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {jobCountsByMonth[month.value]} jobs
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Changed: Switched TabsContent order - public first */}
            <TabsContent value="public" className="mt-4 grid md:grid-cols-2 gap-x-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading jobs...</p>
              ) : filteredSortedJobs.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20 md:col-span-2">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-3 text-base font-semibold">
                    {selectedMonth !== null ? `No published jobs in ${MONTHS[selectedMonth]?.name}` : 'No published jobs'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMonth !== null ? 'Try selecting a different month or publish a job.' : 'Publish a job to make it visible to students.'}
                  </p>
                </div>
              ) : (
                filteredSortedJobs.map((job) => (
                  <Card key={job._id} className="border border-muted">
                    <CardHeader className="flex flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{job.companyName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{job.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          Eligible students: <span className="font-semibold">{job.eligibleCount ?? 0}</span>
                        </p>
                        {job.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            Created: {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                      {/* Modified: Show badges in top right corner */}
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant="default">Published</Badge>
                        {/* Added: Show current round status */}
                        {job.rounds && job.rounds.length > 0 && (
                          (() => {
                            // Find the current active round (in-progress) or the latest scheduled round
                            const currentRound = job.rounds.find(round => round.status === 'in-progress') ||
                                                job.rounds.find(round => round.status === 'scheduled') ||
                                                job.rounds.sort((a, b) => (b.sequence ?? 0) - (a.sequence ?? 0))[0];
                            
                            if (currentRound) {
                              return (
                                <Badge 
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    ROUND_STATUS.find(s => s.value === currentRound.status)?.color || "bg-gray-100 text-gray-800"
                                  )}
                                >
                                  {currentRound.roundName || 'Round'}: {ROUND_STATUS.find(s => s.value === currentRound.status)?.label || currentRound.status || 'Scheduled'}
                                </Badge>
                              );
                            }
                            return null;
                          })()
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {job.jobDescription}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2 text-sm">
                        <div>
                          <span className="font-medium">Salary:</span> {job.salary || 'Not specified'}
                        </div>
                        <div>
                          <span className="font-medium">Passout Year:</span> {job.eligibility?.passoutYear || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">CGPA Required:</span> {job.eligibility?.minCgpa ?? 0}
                        </div>
                        <div>
                          <span className="font-medium">Max Arrears:</span> {job.eligibility?.maxArrears ?? 0}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(job.eligibility?.allowedDepartments || []).map((dept) => (
                          <Badge key={dept}>{dept}</Badge>
                        ))}
                      </div>
                      
                      {/* Removed: Round status display section */}

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handleOpenEdit(job)}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Job
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => handleOpenRounds(job)}>
                          <CircleDot className="h-4 w-4" />
                          Rounds Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handleOpenEligibleDialog(job)}
                        >
                          <Eye className="h-4 w-4" />
                          Eligible Students
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="private" className="mt-4 grid md:grid-cols-2">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading jobs...</p>
              ) : filteredSortedJobs.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20 md:col-span-2">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-3 text-base font-semibold">
                    {selectedMonth !== null ? `No draft jobs in ${MONTHS[selectedMonth]?.name}` : 'No draft jobs'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMonth !== null ? 'Try selecting a different month or create a new job.' : 'Create a job to start assigning students.'}
                  </p>
                </div>
              ) : (
                filteredSortedJobs.map((job) => (
                  <Card key={job._id} className="border border-muted">
                    <CardHeader className="flex flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{job.companyName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{job.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          Eligible students: <span className="font-semibold">{job.eligibleCount ?? 0}</span>
                        </p>
                        {job.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            Created: {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                      {/* Modified: Show badges in top right corner for draft jobs too */}
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant="secondary">Draft</Badge>
                        {/* Added: Show current round status for draft jobs */}
                        {job.rounds && job.rounds.length > 0 && (
                          (() => {
                            // Find the current active round (in-progress) or the latest scheduled round
                            const currentRound = job.rounds.find(round => round.status === 'in-progress') ||
                                                job.rounds.find(round => round.status === 'scheduled') ||
                                                job.rounds.sort((a, b) => (b.sequence ?? 0) - (a.sequence ?? 0))[0];
                            
                            if (currentRound) {
                              return (
                                <Badge 
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    ROUND_STATUS.find(s => s.value === currentRound.status)?.color || "bg-gray-100 text-gray-800"
                                  )}
                                >
                                  {currentRound.roundName || 'Round'}: {ROUND_STATUS.find(s => s.value === currentRound.status)?.label || currentRound.status || 'Scheduled'}
                                </Badge>
                              );
                            }
                            return null;
                          })()
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {job.jobDescription}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2 text-sm">
                        <div>
                          <span className="font-medium">Salary:</span> {job.salary || 'Not specified'}
                        </div>
                        <div>
                          <span className="font-medium">Passout Year:</span> {job.eligibility?.passoutYear || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">CGPA Required:</span> {job.eligibility?.minCgpa ?? 0}
                        </div>
                        <div>
                          <span className="font-medium">Max Arrears:</span> {job.eligibility?.maxArrears ?? 0}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(job.eligibility?.allowedDepartments || []).map((dept) => (
                          <Badge key={dept}>{dept}</Badge>
                        ))}
                      </div>

                      {/* Removed: Round status display section */}

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => handleOpenEdit(job)}>
                          <Pencil className="h-4 w-4" />
                          Edit Job
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => handleOpenRounds(job)}>
                          <CircleDot className="h-4 w-4" />
                          Rounds Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => handleOpenEligibleDialog(job)}
                        >
                          <Eye className="h-4 w-4" />
                          Eligible Students
                        </Button>
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => handlePublishJob(job)}
                          disabled={publishing || !job.rounds || job.rounds.length === 0}
                        >
                          <Send className="h-4 w-4" />
                          Publish Job
                        </Button>
                      </div>
                      {(!job.rounds || job.rounds.length === 0) && (
                        <p className="text-xs text-red-500">
                          Add at least one round before publishing this job.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Job Dialog - without rounds */}
      <Dialog open={isJobDialogOpen} onOpenChange={setJobDialogOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Create Job'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSubmitJob}>
            <section className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    value={jobForm.companyName}
                    onChange={(e) => handleJobFormChange('companyName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    value={jobForm.jobTitle}
                    onChange={(e) => handleJobFormChange('jobTitle', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Salary / Package</label>
                  <Input
                    placeholder="Ex: 6 LPA"
                    value={jobForm.salary}
                    onChange={(e) => handleJobFormChange('salary', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Attachment Link</label>
                  <Input
                    placeholder="Drive / PDF link"
                    value={jobForm.fileLink}
                    onChange={(e) => handleJobFormChange('fileLink', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Job Description</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                  value={jobForm.jobDescription}
                  onChange={(e) => handleJobFormChange('jobDescription', e.target.value)}
                  required
                />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">Locations</h3>
                <Button type="button" size="sm" variant="outline" onClick={addLocationField}>
                  Add Location
                </Button>
              </div>
              <div className="space-y-3">
                {jobForm.locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={location}
                      placeholder="City / Location"
                      onChange={(e) => handleLocationChange(index, e.target.value)}
                    />
                    {jobForm.locations.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLocationField(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Eligibility Criteria</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Minimum CGPA</label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={jobForm.eligibility.minCgpa}
                    onChange={(e) => handleEligibilityChange('minCgpa', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Maximum Arrears</label>
                  <Input
                    type="number"
                    min="0"
                    value={jobForm.eligibility.maxArrears}
                    onChange={(e) => handleEligibilityChange('maxArrears', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">10th Percentage</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={jobForm.eligibility.minTenthPercent}
                    onChange={(e) => handleEligibilityChange('minTenthPercent', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">12th Percentage</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={jobForm.eligibility.minTwelfthPercent}
                    onChange={(e) => handleEligibilityChange('minTwelfthPercent', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Passout Year</label>
                  <Input
                    type="number"
                    required
                    value={jobForm.eligibility.passoutYear}
                    onChange={(e) => handleEligibilityChange('passoutYear', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Allowed Departments</p>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((dept) => {
                    const isActive = jobForm.eligibility.allowedDepartments.includes(dept);
                    return (
                      <Button
                        key={dept}
                        type="button"
                        size="sm"
                        variant={isActive ? 'secondary' : 'outline'}
                        className={cn('rounded-full px-3 h-8', isActive && 'border-primary/60')}
                        onClick={() => toggleDepartment(dept)}
                      >
                        {dept}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setJobDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {editingJob ? 'Save Changes' : 'Save Draft'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rounds Update Dialog */}
      <Dialog open={isRoundsDialogOpen} onOpenChange={setRoundsDialogOpen}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Update Rounds - {roundsEditingJob?.jobTitle} ({roundsEditingJob?.companyName})
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSubmitRounds}>
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">Rounds</h3>
                <Button type="button" size="sm" variant="outline" onClick={addRoundField}>
                  Add Round
                </Button>
              </div>
              {roundsForm.length === 0 ? (
                <p className="text-xs text-muted-foreground">No rounds added yet.</p>
              ) : (
                <div className="space-y-4">
                  {roundsForm.map((round, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className="text-sm font-semibold">Round {index + 1}</h4>
                            {round.status && (
                              <Badge 
                                className={cn(
                                  "text-xs font-medium",
                                  ROUND_STATUS.find(s => s.value === round.status)?.color || "bg-gray-100 text-gray-800"
                                )}
                              >
                                {ROUND_STATUS.find(s => s.value === round.status)?.label || round.status}
                              </Badge>
                            )}
                          </div>
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeRoundField(index)}>
                            Remove
                          </Button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <label className="text-xs font-medium">Round Name</label>
                            <Input
                              value={round.roundName}
                              onChange={(e) => updateRoundField(index, 'roundName', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium">Type</label>
                            <Input
                              placeholder="Ex: Technical, HR"
                              value={round.type}
                              onChange={(e) => updateRoundField(index, 'type', e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium">Mode</label>
                            <Select
                              value={round.mode || undefined}
                              onValueChange={(value) => updateRoundField(index, 'mode', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select mode" />
                              </SelectTrigger>
                              <SelectContent>
                                {ROUND_MODES.map((mode) => (
                                  <SelectItem key={mode} value={mode}>
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium">Status</label>
                            <Select
                              value={round.status || 'scheduled'}
                              onValueChange={(value) => updateRoundField(index, 'status', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {ROUND_STATUS.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    <div className="flex items-center gap-2">
                                      <div className={cn("w-2 h-2 rounded-full", status.color.replace('text-', 'bg-').replace('100', '500'))} />
                                      {status.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium">Schedule</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    'justify-start text-left font-normal',
                                    !round.scheduledAt && 'text-muted-foreground'
                                  )}
                                >
                                  {round.scheduledAt ? format(round.scheduledAt, 'PPP') : 'Pick a date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={round.scheduledAt ?? undefined}
                                  onSelect={(date) => updateRoundField(index, 'scheduledAt', date ?? null)}
                                  disabled={(date) => date < new Date('2000-01-01')}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <label className="text-xs font-medium">Venue</label>
                            <Input
                              value={round.venue}
                              onChange={(e) => updateRoundField(index, 'venue', e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-xs font-medium">Instructions</label>
                            <textarea
                              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                              rows={2}
                              value={round.instructions}
                              onChange={(e) => updateRoundField(index, 'instructions', e.target.value)}
                            />
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-dashed border-border/60 px-3 py-2">
                            <div>
                              <p className="text-xs font-medium">Attendance mandatory</p>
                              <p className="text-[11px] text-muted-foreground">Absent students are automatically rejected</p>
                            </div>
                            <Switch
                              checked={round.isAttendanceMandatory}
                              onCheckedChange={(checked) => updateRoundField(index, 'isAttendanceMandatory', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-dashed border-border/60 px-3 py-2">
                            <div>
                              <p className="text-xs font-medium">Auto-advance when attended</p>
                              <p className="text-[11px] text-muted-foreground">Marks attendees as selected automatically</p>
                            </div>
                            <Switch
                              checked={round.autoAdvanceOnAttendance}
                              onCheckedChange={(checked) => updateRoundField(index, 'autoAdvanceOnAttendance', checked)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setRoundsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                Update Rounds
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Eligible Students Dialog - remains the same */}
      <Dialog open={Boolean(eligibleDialogJob)} onOpenChange={(open) => !open && handleCloseEligibleDialog()}>
        <DialogContent className="max-w-4xl sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Eligible Students</DialogTitle>
          </DialogHeader>
          {eligibleDialogJob && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{eligibleDialogJob.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">{eligibleDialogJob.companyName}</p>
                </div>
                <div className="flex gap-2">
                  <Select value={studentToAdd} onValueChange={setStudentToAdd}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Add student..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {availableStudentsToAdd.map((student) => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.fullName || 'Unnamed'} ({student.rollNo || 'N/A'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddEligibleStudent} disabled={!studentToAdd}>
                    Add
                  </Button>
                </div>
              </div>
              {eligibleLoading ? (
                <p className="text-sm text-muted-foreground">Loading eligible students...</p>
              ) : eligibleStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No eligible students yet.</p>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>CGPA</TableHead>
                        <TableHead>Placed</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eligibleStudents.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell>
                            <div className="font-medium">{student.fullName || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">{student.rollNo || 'N/A'}</div>
                          </TableCell>
                          <TableCell>{student.collegeEmail || 'N/A'}</TableCell>
                          <TableCell>{student.dept || 'N/A'}</TableCell>
                          <TableCell>{student.ugCgpa ?? 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={student.isPlaced ? 'default' : 'secondary'}>
                              {student.isPlaced ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell>{student.package ? `${student.package} LPA` : 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveEligibleStudent(student._id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Jobs;
