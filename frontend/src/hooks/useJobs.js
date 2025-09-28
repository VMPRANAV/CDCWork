import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

const initialJobForm = {
  companyName: '',
  jobTitle: '',
  jobDescription: '',
  salary: '',
  locations: [''],
  fileLink: '',
  eligibility: {
    minCgpa: '',
    minTenthPercent: '',
    minTwelfthPercent: '',
    passoutYear: '',
    allowedDepartments: [],
    maxArrears: ''
  },
  rounds: []
};

export function useJobs() {
  const [jobs, setJobs] = useState({ private: [], public: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);
  const abortController = useRef(null);

  const adminHeaders = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'admin'
    };
  }, []);

  const fetchJobs = useCallback(async () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/jobs`, {
        headers: adminHeaders,
        signal: abortController.current.signal
      });
      const mapJobs = (list = []) => list.map((job) => ({
        ...job,
        eligibleCount: typeof job.eligibleCount === 'number'
          ? job.eligibleCount
          : Array.isArray(job.eligibleStudents)
            ? job.eligibleStudents.length
            : 0
      }));

      setJobs({
        private: mapJobs(response.data?.private),
        public: mapJobs(response.data?.public)
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Failed to fetch jobs', err);
        setError(err.response?.data?.message || 'Failed to fetch jobs');
        toast.error('Failed to fetch jobs', {
          description: err.response?.data?.message
        });
      }
    } finally {
      setLoading(false);
    }
  }, [adminHeaders]);

  useEffect(() => {
    fetchJobs();
    return () => abortController.current?.abort();
  }, [fetchJobs]);

  const resetJobForm = useCallback(() => {
    setJobForm(initialJobForm);
  }, []);

  const createJob = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        const response = await axios.post(`${API_BASE}/jobs`, payload, {
          headers: adminHeaders
        });
        toast.success('Job drafted', {
          description: `${response.data?.jobTitle || 'Job'} saved as private`
        });
        await fetchJobs();
        return response.data;
      } catch (err) {
        console.error('Failed to create job', err);
        toast.error('Failed to create job', {
          description: err.response?.data?.message
        });
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [adminHeaders, fetchJobs]
  );

  const updateJob = useCallback(
    async (jobId, payload) => {
      setSaving(true);
      try {
        await axios.put(`${API_BASE}/jobs/${jobId}`, payload, {
          headers: adminHeaders
        });
        toast.success('Job updated');
        await fetchJobs();
      } catch (err) {
        console.error('Failed to update job', err);
        toast.error('Failed to update job', {
          description: err.response?.data?.message
        });
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [adminHeaders, fetchJobs]
  );

  const publishJob = useCallback(
    async (jobId) => {
      setPublishing(true);
      try {
        const response = await axios.post(`${API_BASE}/jobs/${jobId}/publish`, {}, {
          headers: adminHeaders
        });
        toast.success('Job published');
        await fetchJobs();
        return response.data;
      } catch (err) {
        console.error('Failed to publish job', err);
        toast.error('Failed to publish job', {
          description: err.response?.data?.message
        });
        throw err;
      } finally {
        setPublishing(false);
      }
    },
    [adminHeaders, fetchJobs]
  );

  const fetchEligibleStudents = useCallback(
    async (jobId) => {
      if (!jobId) return;
      setEligibleLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/jobs/${jobId}/eligible-students`, {
          headers: adminHeaders
        });
        setEligibleStudents(response.data || []);
      } catch (err) {
        console.error('Failed to fetch eligible students', err);
        toast.error('Failed to fetch eligible students', {
          description: err.response?.data?.message
        });
      } finally {
        setEligibleLoading(false);
      }
    },
    [adminHeaders]
  );

  const updateEligibleStudents = useCallback(
    async (jobId, { add = [], remove = [] }) => {
      try {
        const response = await axios.put(
          `${API_BASE}/jobs/${jobId}/eligible-students`,
          { add, remove },
          { headers: adminHeaders }
        );
        toast.success('Eligible students updated');
        setEligibleStudents(response.data || []);
        await fetchJobs();
        return response.data;
      } catch (err) {
        console.error('Failed to update eligible students', err);
        toast.error('Failed to update eligible students', {
          description: err.response?.data?.message
        });
        throw err;
      }
    },
    [adminHeaders, fetchJobs]
  );

  const addRound = useCallback((round) => {
    setJobForm((prev) => ({
      ...prev,
      rounds: [...prev.rounds, round]
    }));
  }, []);

  const removeRound = useCallback((index) => {
    setJobForm((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index)
    }));
  }, []);

  const updateRound = useCallback((index, updates) => {
    setJobForm((prev) => ({
      ...prev,
      rounds: prev.rounds.map((round, i) => (i === index ? { ...round, ...updates } : round))
    }));
  }, []);

  return {
    jobs,
    loading,
    error,
    jobForm,
    setJobForm,
    resetJobForm,
    saving,
    publishing,
    createJob,
    updateJob,
    publishJob,
    fetchJobs,
    selectedJob,
    setSelectedJob,
    fetchEligibleStudents,
    eligibleStudents,
    eligibleLoading,
    updateEligibleStudents,
    addRound,
    removeRound,
    updateRound
  };
}

export function getInitialJobForm() {
  return JSON.parse(JSON.stringify(initialJobForm));
}
