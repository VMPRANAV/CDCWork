import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

const getAuthHeaders = (role = 'admin') => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : undefined,
    role
  };
};

// Job-related API calls
export const fetchJobsAPI = (signal) => {
  return axios.get(`${API_BASE}/jobs`, {
    headers: getAuthHeaders(),
    signal
  });
};

export const createJobAPI = (payload) => {
  return axios.post(`${API_BASE}/jobs`, payload, {
    headers: getAuthHeaders()
  });
};

export const updateJobAPI = (jobId, payload) => {
  return axios.put(`${API_BASE}/jobs/${jobId}`, payload, {
    headers: getAuthHeaders()
  });
};

export const deleteJobAPI = (jobId) => {
  return axios.delete(`${API_BASE}/jobs/${jobId}`, {
    headers: getAuthHeaders()
  });
};

export const publishJobAPI = (jobId) => {
  return axios.post(`${API_BASE}/jobs/${jobId}/publish`, {}, {
    headers: getAuthHeaders()
  });
};

export const fetchEligibleStudentsAPI = (jobId) => {
  return axios.get(`${API_BASE}/jobs/${jobId}/eligible-students`, {
    headers: getAuthHeaders()
  });
};

export const updateEligibleStudentsAPI = (jobId, { add = [], remove = [] }) => {
  return axios.put(`${API_BASE}/jobs/${jobId}/eligible-students`, { add, remove }, {
    headers: getAuthHeaders()
  });
};

export const downloadEligibleStudentsAPI = (jobId) => {
  return axios.get(`${API_BASE}/jobs/${jobId}/eligible-students/download`, {
    headers: getAuthHeaders(),
    responseType: 'blob'
  });
};

export const fetchAttendeesForRoundAPI = (roundId) => {
  return axios.get(`${API_BASE}/attendance/${roundId}/attendees`, {
    headers: getAuthHeaders()
  });
};

// Application-related API calls
export const fetchApplicationsAPI = (signal) => {
  return axios.get(`${API_BASE}/applications`, {
    headers: getAuthHeaders(),
    signal
  });
};

export const updateApplicationStatusAPI = (applicationId, payload) => {
  return axios.put(`${API_BASE}/applications/${applicationId}`, payload, {
    headers: getAuthHeaders()
  });
};

export const markAttendanceAPI = (applicationId, roundId, attended) => {
  return axios.put(`${API_BASE}/applications/${applicationId}/attendance`, { roundId, attended }, {
    headers: getAuthHeaders()
  });
};

export const advanceToRoundAPI = (applicationId, nextRoundId) => {
  return axios.post(`${API_BASE}/applications/${applicationId}/advance`, { nextRoundId }, {
    headers: getAuthHeaders()
  });
};

export const finalizeApplicationAPI = (applicationId, payload) => {
  return axios.post(`${API_BASE}/applications/${applicationId}/finalize`, payload, {
    headers: getAuthHeaders()
  });
};

export const bulkAdvanceApplicationsAPI = (payload) => {
  const { jobId, fromRoundId, toRoundId, emails, rollNos } = payload;
  const body = { fromRoundId, toRoundId };
  if (emails) body.emails = emails;
  if (rollNos) body.rollNos = rollNos;
  return axios.post(`${API_BASE}/applications/${jobId}/bulk-advance`, body, {
    headers: getAuthHeaders()
  });
};

// Student-related API calls
export const fetchStudentsAPI = (signal) => {
  const token = localStorage.getItem('authToken');
  return axios.get(`${API_BASE}/users`, {
    signal,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchStudentDetailsAPI = (studentId, signal) => {
  const token = localStorage.getItem('authToken');
  return axios.get(`${API_BASE}/users/${studentId}`, {
    signal,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchJobRoundsAPI = (jobId, signal) => {
  return axios.get(`${API_BASE}/jobs/${jobId}/rounds`, {
    headers: getAuthHeaders(),
    signal
  });
};

export const updateStudentAPI = (studentId, updates) => {
  const token = localStorage.getItem('authToken');
  return axios.put(`${API_BASE}/users/${studentId}`, updates, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
