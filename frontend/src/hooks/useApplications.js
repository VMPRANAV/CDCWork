import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import * as api from '../services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

const FINAL_STATUSES = ['in_process', 'rejected', 'placed'];

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [jobRounds, setJobRounds] = useState([]);
  const [roundsLoading, setRoundsLoading] = useState(false);
  const abortController = useRef(null);

  const fetchApplications = useCallback(async () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
    setLoading(true);
    setError(null);
    try {
      const response = await api.fetchApplicationsAPI(abortController.current.signal);
      setApplications(response.data || []);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Failed to fetch applications', err);
        setError(err.response?.data?.message || 'Failed to fetch applications');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
    return () => abortController.current?.abort();
  }, [fetchApplications]);

  const refreshApplication = useCallback(
    (updated) => {
      setApplications((prev) => {
        const index = prev.findIndex((app) => app._id === updated._id);
        if (index === -1) {
          return prev;
        }
        const next = [...prev];
        next[index] = updated;
        return next;
      });
    },
    []
  );

  const updateApplicationStatus = useCallback(
    async (applicationId, payload) => {
      if (!payload.finalStatus || !FINAL_STATUSES.includes(payload.finalStatus)) {
        throw new Error('Invalid final status');
      }
      setUpdating(true);
      try {
        const response = await api.updateApplicationStatusAPI(applicationId, payload);
        toast.success('Application updated');
        refreshApplication(response.data);
        return response.data;
      } catch (err) {
        console.error('Failed to update application', err);
        toast.error('Failed to update application', {
          description: err.response?.data?.message
        });
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [refreshApplication]
  );

  const markAttendance = useCallback(
    async (applicationId, roundId, attended) => {
      try {
        const response = await api.markAttendanceAPI(applicationId, roundId, attended);
        toast.success('Attendance updated');
        refreshApplication(response.data);
        return response.data;
      } catch (err) {
        console.error('Failed to update attendance', err);
        toast.error('Failed to update attendance', {
          description: err.response?.data?.message
        });
        throw err;
      }
    },
    [refreshApplication]
  );

  const advanceToRound = useCallback(
    async (applicationId, nextRoundId) => {
      try {
        const response = await api.advanceToRoundAPI(applicationId, nextRoundId);
        toast.success('Application advanced to next round');
        refreshApplication(response.data);
        return response.data;
      } catch (err) {
        console.error('Failed to advance application', err);
        toast.error('Failed to advance application', {
          description: err.response?.data?.message
        });
        throw err;
      }
    },
    [refreshApplication]
  );

  const finalizeApplication = useCallback(
    async (applicationId, payload) => {
      try {
        const response = await api.finalizeApplicationAPI(applicationId, payload);
        toast.success('Application finalized');
        refreshApplication(response.data);
        return response.data;
      } catch (err) {
        console.error('Failed to finalize application', err);
        toast.error('Failed to finalize application', {
          description: err.response?.data?.message
        });
        throw err;
      }
    },
    [refreshApplication]
  );

  const fetchJobRounds = useCallback(
    async (jobId) => {
      if (!jobId) return;
      setRoundsLoading(true);
      try {
        const response = await api.fetchJobRoundsAPI(jobId);
        setJobRounds(response.data || []);
      } catch (err) {
        console.error('Failed to fetch job rounds', err);
        toast.error('Failed to fetch job rounds', {
          description: err.response?.data?.message
        });
      } finally {
        setRoundsLoading(false);
      }
    },
    []
  );

  const bulkAdvanceApplications = useCallback(
    async (payload) => {
      const { jobId, fromRoundId, toRoundId, emails, rollNos } = payload;
      try {
        const response = await api.bulkAdvanceApplicationsAPI(payload);

        toast.success('Bulk advance successful', {
          description: `${response.data.successCount} applications were advanced.`
        });

        await fetchApplications();

        return response.data;
      } catch (err) {
        console.error('Failed to bulk advance applications', err);
        toast.error('Bulk advance failed', {
          description: err.response?.data?.message
        });
        throw err;
      }
    },
    [fetchApplications]
  );

  return {
    applications,
    loading,
    error,
    updating,
    selectedApplication,
    setSelectedApplication,
    jobRounds,
    roundsLoading,
    fetchApplications,
    updateApplicationStatus,
    markAttendance,
    advanceToRound,
    finalizeApplication,
    fetchJobRounds,
    bulkAdvanceApplications
  };
}
