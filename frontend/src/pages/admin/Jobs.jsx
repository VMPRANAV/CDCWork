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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useJobs } from '@/hooks/useJobs';
import { getInitialJobForm } from '@/hooks/jobFormUtils';
import { useStudents } from '@/hooks/useStudents';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Users, Eye, Send, Calendar as CalendarIcon, X, CircleDot, Download, Search, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

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

// Update the getLocalInitialJobForm function
const getLocalInitialJobForm = () => ({
  companyName: '',
  jobTitle: '',
  companyDescription: '',
  jobDescription: '',
  salary: '',
  locations: [''],
  attachmentLinks: [''], // Changed from fileLink and attachments
  eligibility: {
    minCgpa: '0',
    minTenthPercent: '0',
    minTwelfthPercent: '0',
    passoutYear: '0',
    allowedDepartments: [],
    maxArrears: '0',
    maxHistoryOfArrears: '0'
  },
  rounds: []
});

// Update sanitizeJobPayload function
const toNumberOrZero = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

function sanitizeJobPayload(form) {
  const locations = (form.locations || []).map((loc) => loc.trim()).filter(Boolean);
  const attachmentLinks = (form.attachmentLinks || []).map((link) => link.trim()).filter(Boolean);
  const eligibility = {
    minCgpa: toNumberOrZero(form.eligibility.minCgpa),
    minTenthPercent: toNumberOrZero(form.eligibility.minTenthPercent),
    minTwelfthPercent: toNumberOrZero(form.eligibility.minTwelfthPercent),
    passoutYear: toNumberOrZero(form.eligibility.passoutYear),
    allowedDepartments: form.eligibility.allowedDepartments || [],
    maxArrears: toNumberOrZero(form.eligibility.maxArrears),
    maxHistoryOfArrears: toNumberOrZero(form.eligibility.maxHistoryOfArrears)
  };

  return {
    companyName: form.companyName,
    jobTitle: form.jobTitle,
    companyDescription: form.companyDescription,
    jobDescription: form.jobDescription,
    salary: form.salary,
    locations,
    attachmentLinks,
    eligibility
  };
}

function sanitizeRoundsPayload(rounds) {
  return rounds.map(round => ({
    ...round,

    scheduledAt: round.scheduledAt ? new Date(round.scheduledAt) : null
  }));
}
// Update buildFormFromJob function
function buildFormFromJob(job) {
  const base = getLocalInitialJobForm();
  if (!job) return base;
  return {
    ...base,
    companyName: job.companyName || '',
    jobTitle: job.jobTitle || '',
    companyDescription: job.companyDescription || '',
    jobDescription: job.jobDescription || '',
    salary: job.salary || '',
    locations: job.locations && job.locations.length ? job.locations : [''],
    attachmentLinks: job.attachmentLinks && job.attachmentLinks.length ? job.attachmentLinks : [''],
    eligibility: {
      minCgpa: job.eligibility?.minCgpa !== undefined ? String(job.eligibility.minCgpa) : '0',
      minTenthPercent: job.eligibility?.minTenthPercent !== undefined ? String(job.eligibility.minTenthPercent) : '0',
      minTwelfthPercent: job.eligibility?.minTwelfthPercent !== undefined ? String(job.eligibility.minTwelfthPercent) : '0',
      passoutYear: job.eligibility?.passoutYear !== undefined ? String(job.eligibility.passoutYear) : '0',
      allowedDepartments: job.eligibility?.allowedDepartments || [],
      maxArrears: job.eligibility?.maxArrears !== undefined ? String(job.eligibility.maxArrears) : '0',
      maxHistoryOfArrears: job.eligibility?.maxHistoryOfArrears !== undefined ? String(job.eligibility.maxHistoryOfArrears) : '0'
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
    updateEligibleStudents,
    downloadEligibleStudents,
    uploadingFiles,
    handleFileUpload,
    handleAttachmentFileUpload,
    uploadingAttachments,
    deleteJob,
    fetchAttendeesForRound,
    attendees,
    attendeesLoading
  } = useJobs();

  const { students: allStudents } = useStudents();

  // Add the missing state variable

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
  const [isAttendeesDialogOpen, setAttendeesDialogOpen] = useState(false);
  const [selectedRoundForAttendees, setSelectedRoundForAttendees] = useState(null);

  // Add new state for student search
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(-1);

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

  // Replace availableStudentsToAdd with filtered search results
  const filteredStudentsToAdd = useMemo(() => {
    if (!eligibleDialogJob || !studentSearchQuery.trim()) return [];
    
    const query = studentSearchQuery.toLowerCase().trim();
    const eligibleIds = new Set((eligibleStudents || []).map((student) => student._id));
    
    return (allStudents || [])
      .filter((student) => !eligibleIds.has(student._id))
      .filter((student) => {
        const fullName = (student.fullName || '').toLowerCase();
        const rollNo = (student.rollNo || '').toLowerCase();
        const email = (student.collegeEmail || '').toLowerCase();
        const dept = (student.dept || '').toLowerCase();
        
        return fullName.includes(query) || 
               rollNo.includes(query) || 
               email.includes(query) || 
               dept.includes(query);
      })
      .slice(0, 10); // Limit to 10 suggestions
  }, [allStudents, eligibleStudents, eligibleDialogJob, studentSearchQuery]);

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
    setJobForm(getLocalInitialJobForm()); // Use local function
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

  // Add attachment link handlers
  const handleAttachmentLinkChange = (index, value) => {
    setJobForm((prev) => {
      const next = [...prev.attachmentLinks];
      next[index] = value;
      return {
        ...prev,
        attachmentLinks: next
      };
    });
  };

  const addAttachmentLinkField = () => {
    setJobForm((prev) => ({
      ...prev,
      attachmentLinks: [...prev.attachmentLinks, '']
    }));
  };

  const removeAttachmentLinkField = (index) => {
    setJobForm((prev) => ({
      ...prev,
      attachmentLinks: prev.attachmentLinks.filter((_, i) => i !== index)
    }));
  };

  // Update the job form submission
  const handleSubmitJob = async (event) => {
    event?.preventDefault();
    
    const payload = sanitizeJobPayload(jobForm);
    
    if (!payload.eligibility.passoutYear) {
      return;
    }
    if (!payload.companyDescription) {
      return;
    }
    
    if (editingJob) {
      await updateJob(editingJob._id, payload);
    } else {
      await createJob(payload);
    }
    
    setJobDialogOpen(false);
    setEditingJob(null);
    setJobForm(getLocalInitialJobForm());
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

  // Add keyboard navigation handler
  const handleStudentSearchKeyDown = (e) => {
    if (!showStudentSuggestions || filteredStudentsToAdd.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedStudentIndex(prev => 
          prev < filteredStudentsToAdd.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedStudentIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedStudentIndex >= 0 && selectedStudentIndex < filteredStudentsToAdd.length) {
          handleAddEligibleStudent(filteredStudentsToAdd[selectedStudentIndex]._id);
        }
        break;
      case 'Escape':
        setShowStudentSuggestions(false);
        setSelectedStudentIndex(-1);
        break;
    }
  };

  const handleCloseEligibleDialog = () => {
    setEligibleDialogJob(null);
    setStudentSearchQuery('');
    setShowStudentSuggestions(false);
    setSelectedStudentIndex(-1);
  };

  const handleAddEligibleStudent = async (studentId) => {
    if (!eligibleDialogJob || !studentId) return;
    
    await updateEligibleStudents(eligibleDialogJob._id, { add: [studentId] });
    setStudentSearchQuery('');
    setShowStudentSuggestions(false);
    setSelectedStudentIndex(-1);
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
  const handleDownloadExcel = async () => {
    if (!eligibleDialogJob) return;
    
    try {
      await downloadEligibleStudents(eligibleDialogJob._id, eligibleDialogJob.companyName);
    } catch (error) {
      // Error is already handled in the hook with toast
      console.error('Download failed:', error);
    }
  };
 
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Add handler for attachment file upload
  const handleAttachmentUpload = async (files) => {
    try {
      const uploadedFiles = await handleAttachmentFileUpload(files);
      
      // Add uploaded file URLs to attachment links
      const newLinks = uploadedFiles.map(file => file.url);
      setJobForm((prev) => ({
        ...prev,
        attachmentLinks: [...prev.attachmentLinks.filter(link => link.trim()), ...newLinks]
      }));
    } catch (error) {
      // Error already handled in the hook
    }
  };

  // Add a handler for deleting a job
  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Are you sure you want to delete the job "${job.jobTitle}" at "${job.companyName}"? This action cannot be undone.`)) {
      return;
    }
    await deleteJob(job._id);
  };

  const handleOpenAttendeesDialog = async (round) => {
    setSelectedRoundForAttendees(round);
    setAttendeesDialogOpen(true);
    fetchAttendeesForRound(round._id);
  };

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
                <div className="flex items-center justify-center mb-4">
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
                        {/* Add company description display */}
                        {job.companyDescription && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{job.companyDescription}</p>
                        )}
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
                        <div>
                          <span className="font-medium">Max History of Arrears:</span> {job.eligibility?.maxHistoryOfArrears ?? 0}
                        </div>
                        <div>
                          <span className="font-medium">Max History of Arrears:</span> {job.eligibility?.maxHistoryOfArrears ?? 0}
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
                          <Button
                          size="sm"
                          variant="destructive"
                          className="gap-2 ml-auto"
                          onClick={() => handleDeleteJob(job)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>

                    {/* Display attachment links */}
                    {job.attachmentLinks && job.attachmentLinks.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Attachment Links:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.attachmentLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                                </svg>
                                Link {index + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
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
                        {/* Add company description display */}
                        {job.companyDescription && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{job.companyDescription}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Eligible students: <span className="font-semibold">{job.eligibleCount ?? 0}</span>
                        </p>
                        {job.createdAt && (
                          <p className="text-xs text-muted-foreground">
                            Created: {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                      {/* Modified: Show badges in top right corner for draft jobs */}
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
                       
                        {/* Add Delete Button at the right bottom */}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-2 ml-auto"
                          onClick={() => handleDeleteJob(job)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                      {(!job.rounds || job.rounds.length === 0) && (
                        <p className="text-xs text-red-500">
                          Add at least one round before publishing this job.
                        </p>
                      )}
                    </CardContent>

                    {/* Display attachment links */}
                    {job.attachmentLinks && job.attachmentLinks.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Attachment Links:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.attachmentLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                                </svg>
                                Link {index + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Job Dialog - without rounds */}
      <Dialog open={isJobDialogOpen} onOpenChange={setJobDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Create Job'}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] pr-4">
            <form className="space-y-6" onSubmit={handleSubmitJob}>
            <section className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={jobForm.companyName}
                    onChange={(e) => handleJobFormChange('companyName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    value={jobForm.jobTitle}
                    onChange={(e) => handleJobFormChange('jobTitle', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="salary">Salary / Package</Label>
                  <Input
                    id="salary"
                    placeholder="Ex: 6 LPA"
                    value={jobForm.salary}
                    onChange={(e) => handleJobFormChange('salary', e.target.value)}
                  />
                </div>
               
             <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">Attachment Links</h3>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={addAttachmentLinkField}>
                    Add Link
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,text/plain"
                      onChange={(e) => handleAttachmentUpload(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingAttachments}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      disabled={uploadingAttachments}
                      className="gap-2"
                    >
                      {uploadingAttachments ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload Files
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {uploadingAttachments && (
                <p className="text-xs text-muted-foreground">Uploading files to cloud storage...</p>
              )}
              
              <div className="space-y-3">
                {jobForm.attachmentLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-medium" htmlFor={`attachment-link-${index}`}>Attachment Link</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`attachment-link-${index}`}
                          placeholder="Drive / PDF link or uploaded file URL"
                          value={link}
                          onChange={(e) => handleAttachmentLinkChange(index, e.target.value)}
                        />
                        {link && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a 
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    {jobForm.attachmentLinks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachmentLinkField(index)}
                        className="mt-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>
              </div>
              {/* Add Company Description field */}
              <div className="space-y-2">
                <Label htmlFor="company-description">Company Description</Label>
                <Textarea
                  id="company-description"
                  rows={3}
                  placeholder="Brief description about the company..."
                  value={jobForm.companyDescription}
                  onChange={(e) => handleJobFormChange('companyDescription', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  id="job-description"
                  rows={4}
                  placeholder="Detailed job description, responsibilities, requirements..."
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="eligibility-min-cgpa">Minimum CGPA</Label>
                  <Input
                    id="eligibility-min-cgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={jobForm.eligibility.minCgpa}
                    onChange={(e) => handleEligibilityChange('minCgpa', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="eligibility-max-arrears">Current Arrears</Label>
                  <Input
                    id="eligibility-max-arrears"
                    type="number"
                    min="0"
                    value={jobForm.eligibility.maxArrears}
                    onChange={(e) => handleEligibilityChange('maxArrears', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="eligibility-max-history-arrears">Max History of Arrears</Label>
                  <Input
                    id="eligibility-max-history-arrears"
                    type="number"
                    min="0"
                    value={jobForm.eligibility.maxHistoryOfArrears}
                    onChange={(e) => handleEligibilityChange('maxHistoryOfArrears', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="eligibility-tenth">10th Percentage</Label>
                  <Input
                    id="eligibility-tenth"
                    type="number"
                    min="0"
                    max="100"
                    value={jobForm.eligibility.minTenthPercent}
                    onChange={(e) => handleEligibilityChange('minTenthPercent', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="eligibility-twelfth">12th Percentage</Label>
                  <Input
                    id="eligibility-twelfth"
                    type="number"
                    min="0"
                    max="100"
                    value={jobForm.eligibility.minTwelfthPercent}
                    onChange={(e) => handleEligibilityChange('minTwelfthPercent', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="eligibility-passout">Passout Year</Label>
                  <Input
                    id="eligibility-passout"
                    type="number"
                    min="1900"
                    max="2100"
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

            {/* Replace the attachment links section with this file upload section */}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setJobDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {editingJob ? 'Save Changes' : 'Save Draft'}
              </Button>
            </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Rounds Update Dialog */}
      <Dialog open={isRoundsDialogOpen} onOpenChange={setRoundsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Update Rounds - {roundsEditingJob?.jobTitle} ({roundsEditingJob?.companyName})
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] pr-4">
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
                          <Button type="button" variant="outline" size="icon" onClick={() => handleOpenAttendeesDialog(roundsEditingJob.rounds[index])}>
                            <Users className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs font-medium" htmlFor={`round-name-${index}`}>Round Name</Label>
                            <Input
                              id={`round-name-${index}`}
                              value={round.roundName}
                              onChange={(e) => updateRoundField(index, 'roundName', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium" htmlFor={`round-type-${index}`}>Type</Label>
                            <Input
                              id={`round-type-${index}`}
                              placeholder="Ex: Technical, HR"
                              value={round.type}
                              onChange={(e) => updateRoundField(index, 'type', e.target.value)}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label className="text-xs font-medium">Mode</Label>
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
                            <Label className="text-xs font-medium">Status</Label>
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
                            <Label className="text-xs font-medium">Schedule</Label>
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
                          <div className="space-y-1">
                            <Label className="text-xs font-medium" htmlFor={`round-venue-${index}`}>Venue</Label>
                            <Input
                              id={`round-venue-${index}`}
                              value={round.venue}
                              onChange={(e) => updateRoundField(index, 'venue', e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label htmlFor={`round-instructions-${index}`}>Instructions</Label>
                            <Textarea
                              id={`round-instructions-${index}`}
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
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isAttendeesDialogOpen} onOpenChange={setAttendeesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attendees for {selectedRoundForAttendees?.roundName}</DialogTitle>
          </DialogHeader>
          {attendeesLoading ? (
            <p>Loading attendees...</p>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">Total Attendees: {attendees.length}</p>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendees.map((attendee) => (
                      <TableRow key={attendee._id}>
                        <TableCell>{attendee.fullName}</TableCell>
                        <TableCell>{attendee.collegeEmail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Eligible Students Dialog */}
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
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={handleDownloadExcel} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Excel
                  </Button>
                  
                  {/* Replace Select dropdown with search input */}
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search students to add..."
                            value={studentSearchQuery}
                            onChange={(e) => {
                              setStudentSearchQuery(e.target.value);
                              setShowStudentSuggestions(e.target.value.trim().length > 0);
                              setSelectedStudentIndex(-1);
                            }}
                            onKeyDown={handleStudentSearchKeyDown}
                            onFocus={() => {
                              if (studentSearchQuery.trim()) {
                                setShowStudentSuggestions(true);
                              }
                            }}
                            onBlur={() => {
                              // Delay hiding suggestions to allow clicking
                              setTimeout(() => setShowStudentSuggestions(false), 200);
                            }}
                            className="pl-10 w-[300px]"
                          />
                        </div>
                        
                        {/* Search Suggestions Dropdown */}
                        {showStudentSuggestions && filteredStudentsToAdd.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                            {filteredStudentsToAdd.map((student, index) => (
                              <div
                                key={student._id}
                                onClick={() => handleAddEligibleStudent(student._id)}
                                className={cn(
                                  "px-3 py-2 cursor-pointer hover:bg-muted/50 border-b border-border/50 last:border-b-0",
                                  selectedStudentIndex === index && "bg-muted"
                                )}
                              >
                                <div className="flex flex-col">
                                  <div className="font-medium text-sm">
                                    {student.fullName || 'Unnamed Student'}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span>{student.rollNo || 'N/A'}</span>
                                    <span>•</span>
                                    <span>{student.dept || 'N/A'}</span>
                                    <span>•</span>
                                    <span>CGPA: {student.ugCgpa || 'N/A'}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {student.collegeEmail || 'No email'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* No results message */}
                        {showStudentSuggestions && studentSearchQuery.trim() && filteredStudentsToAdd.length === 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 p-3">
                            <div className="text-sm text-muted-foreground text-center">
                              No students found matching "{studentSearchQuery}"
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Add Button - Added after search bar */}
                      <Button
                        variant="default"
                        onClick={() => {
                          if (selectedStudentIndex >= 0 && selectedStudentIndex < filteredStudentsToAdd.length) {
                            handleAddEligibleStudent(filteredStudentsToAdd[selectedStudentIndex]._id);
                          } else if (filteredStudentsToAdd.length === 1) {
                            handleAddEligibleStudent(filteredStudentsToAdd[0]._id);
                          }
                        }}
                        disabled={filteredStudentsToAdd.length === 0 || !studentSearchQuery.trim()}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Search help text */}
              {studentSearchQuery.trim() && (
                <div className="text-xs text-muted-foreground">
                  Search by name, roll number, email, or department. Use ↑↓ arrows to navigate, Enter to select, Esc to close.
                </div>
              )}
              
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
