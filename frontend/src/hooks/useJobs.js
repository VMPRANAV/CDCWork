import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getInitialJobForm } from './jobFormUtils';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

export function useJobs() {
  const [jobs, setJobs] = useState({ private: [], public: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobForm, setJobForm] = useState(getInitialJobForm());
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  const fetchAttendeesForRound = useCallback(
    async (roundId) => {
      if (!roundId) return;
      setAttendeesLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/attendance/${roundId}/attendees`, {
          headers: adminHeaders
        });
        setAttendees(response.data || []);
      } catch (err) {
        console.error('Failed to fetch attendees', err);
        toast.error('Failed to fetch attendees', {
          description: err.response?.data?.message
        });
      } finally {
        setAttendeesLoading(false);
      }
    },
    [adminHeaders]
  );
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
    setJobForm(getInitialJobForm());
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
   const deleteJob = useCallback(
    async (jobId) => {
      if (!jobId) return;
      try {
        await axios.delete(`${API_BASE}/jobs/${jobId}`, {
          headers: adminHeaders
        });
        toast.success('Job deleted successfully');
        await fetchJobs();
      } catch (err) {
        console.error('Failed to delete job', err);
        toast.error('Failed to delete job', {
          description: err.response?.data?.message
        });
        throw err;
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

  const downloadEligibleStudents = useCallback(
    async (jobId, companyName) => {
      try {
        const response = await axios.get(`${API_BASE}/jobs/${jobId}/eligible-students/download`, {
          headers: adminHeaders,
          responseType: 'blob' // Important for file downloads
        });

        // Get filename from response headers
        const contentDisposition = response.headers['content-disposition'];
        let filename = `Eligible_Students-${companyName.replace(/\s/g, '_')}.xlsx`;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Excel file downloaded successfully');
      } catch (err) {
        console.error('Failed to download Excel file', err);
        toast.error('Failed to download Excel file', {
          description: err.response?.data?.message
        });
        throw err;
      }
    },
    [adminHeaders]
  );

const handleFileUpload = async (files) => {
        // This function remains as is, in case it's used elsewhere
        if (!files || files.length === 0) return [];
        setUploadingFiles(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('jobFiles', file);
            });
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE}/jobs/upload-files`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, role: 'admin' },
                body: formData
            });
            if (!response.ok) throw new Error('File upload failed');
            const data = await response.json();
            toast.success('Files uploaded successfully');
            return data.files;
        } catch (error) {
            console.error('File upload error:', error);
            toast.error('File upload failed', { description: error.message || 'Please try again.' });
            throw error;
        } finally {
            setUploadingFiles(false);
        }
    };
const handleAttachmentFileUpload = async (files) => {
        if (!files || files.length === 0) return [];
        
        setUploadingAttachments(true);
        try {
            const formData = new FormData();
            Array.from(files).forEach(file => {
                // Use the correct field name: 'attachmentFiles'
                formData.append('attachmentFiles', file);
            });

            const token = localStorage.getItem('authToken');
            // Use the correct API endpoint: '/upload-attachment-files'
            const response = await fetch(`${API_BASE}/jobs/upload-attachment-files`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    role: 'admin'
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Attachment upload failed');
            }

            const data = await response.json();
            toast.success('Attachments uploaded successfully');
            return data.files; // This will contain the Cloudinary URLs
        } catch (error) {
            console.error('Attachment upload error:', error);
            toast.error('Attachment upload failed', {
                description: error.message || 'Please try again.'
            });
            throw error; // Re-throw to be caught by the component if needed
        } finally {
            setUploadingAttachments(false);
        }
    };

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
        deleteJob,
        publishJob,
        fetchJobs,
        selectedJob,
        setSelectedJob,
        fetchEligibleStudents,
        eligibleStudents,
        eligibleLoading,
        updateEligibleStudents,
        downloadEligibleStudents,
        addRound,
        removeRound,
        updateRound,
        handleFileUpload,
        uploadingFiles,
        // ADDED: Export the new function and its state
        handleAttachmentFileUpload,
        uploadingAttachments,
        fetchAttendeesForRound,
        attendees,
        attendeesLoading
    };
}

