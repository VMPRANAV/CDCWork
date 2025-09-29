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
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FALLBACK_DESCRIPTION = 'No description provided for this job yet.';

export function AvailableJobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('posted-desc');

  const headers = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'student',
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobsResponse, applicationsResponse] = await Promise.all([
        axios.get('http://localhost:3002/api/jobs/eligible', { headers }),
        axios.get('http://localhost:3002/api/applications/my-applications', { headers }),
      ]);

      setJobs(Array.isArray(jobsResponse.data) ? jobsResponse.data : []);
      setApplications(Array.isArray(applicationsResponse.data) ? applicationsResponse.data : []);
    } catch (error) {
      toast.error('Failed to load available jobs', {
        description: error.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const appliedJobIds = useMemo(() => {
    return new Set(
      applications
        .filter((application) => application.job?._id)
        .map((application) => application.job._id)
    );
  }, [applications]);

  const normalizedJobs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = term
      ? jobs.filter((job) => {
          const title = job.jobTitle?.toLowerCase() ?? '';
          const company = job.companyName?.toLowerCase() ?? '';
          const location = job.location?.toLowerCase() ?? '';
          return title.includes(term) || company.includes(term) || location.includes(term);
        })
      : jobs;

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'posted-asc': {
          const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return aCreated - bCreated;
        }
        case 'company-desc':
          return (b.companyName ?? '').localeCompare(a.companyName ?? '');
        case 'company-asc':
          return (a.companyName ?? '').localeCompare(b.companyName ?? '');
        case 'title-desc':
          return (b.jobTitle ?? '').localeCompare(a.jobTitle ?? '');
        case 'title-asc':
          return (a.jobTitle ?? '').localeCompare(b.jobTitle ?? '');
        case 'posted-desc':
        default: {
          const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bCreated - aCreated;
        }
      }
    });

    return sorted;
  }, [jobs, searchTerm, sortOption]);

  const handleApply = async (jobId) => {
    if (!jobId || appliedJobIds.has(jobId)) {
      return;
    }

    try {
      setApplyingJobId(jobId);
      await axios.post(
        'http://localhost:3002/api/applications',
        { jobId },
        { headers }
      );

      toast.success('Application submitted successfully.');
      fetchData();
    } catch (error) {
      toast.error('Failed to apply for job', {
        description: error.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setApplyingJobId('');
    }
  };

  const renderJobCard = (job) => {
    const {
      _id,
      jobTitle,
      companyName,
      jobDescription,
      location,
      employmentType,
      createdAt,
    } = job;

    const description = jobDescription?.trim() || FALLBACK_DESCRIPTION;
    const createdLabel = createdAt ? new Date(createdAt).toLocaleDateString() : 'Recently posted';
    const hasApplied = appliedJobIds.has(_id);
    const isApplying = applyingJobId === _id;

    return (
      <Card key={_id} className="border border-border/60 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-semibold">{jobTitle || 'Untitled Position'}</CardTitle>
          <CardDescription>{companyName || 'Unknown company'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description.length > 240 ? `${description.slice(0, 240)}…` : description}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {employmentType && <Badge variant="secondary">{employmentType}</Badge>}
            {location && <Badge variant="outline">{location}</Badge>}
            <span className="text-muted-foreground">Posted: {createdLabel}</span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {hasApplied ? 'You have already applied to this job.' : 'This job matches your profile.'}
          </span>
          <Button
            onClick={() => handleApply(_id)}
            disabled={hasApplied || isApplying}
            variant={hasApplied ? 'outline' : 'default'}
            className="gap-2"
          >
            {hasApplied ? 'Applied' : isApplying ? 'Applying…' : 'Apply Now'}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Jobs</h1>
        <p className="text-muted-foreground">Discover roles you are eligible for and apply in one click.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="border border-border/50 shadow-sm">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : normalizedJobs.length === 0 ? (
        <Card className="border border-dashed border-border/60 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">No matching jobs right now</CardTitle>
            <CardDescription>
              Keep your profile updated and check back later for new opportunities that fit your criteria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={fetchData}>
              Refresh recommendations
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search job title, company, or location"
              className="md:max-w-sm"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase text-muted-foreground">Sort by</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="posted-desc">Newest first</SelectItem>
                  <SelectItem value="posted-asc">Oldest first</SelectItem>
                  <SelectItem value="company-asc">Company A-Z</SelectItem>
                  <SelectItem value="company-desc">Company Z-A</SelectItem>
                  <SelectItem value="title-asc">Job title A-Z</SelectItem>
                  <SelectItem value="title-desc">Job title Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {normalizedJobs.map((job) => renderJobCard(job))}
          </div>
        </>
      )}
    </div>
  );
}

export default AvailableJobs;
