import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import * as api from '../services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

// Cache for storing student data to minimize API calls
const studentCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * Transforms student data from API to a consistent format
 */
const transformStudentData = (data) => ({
  ...data,
  // Ensure all expected fields have default values
  fullName: data.fullName?.trim() || 'N/A',
  collegeEmail: data.collegeEmail?.toLowerCase() || '',
  dept: data.dept?.toUpperCase() || 'N/A',
  ugCgpa: data.ugCgpa ? parseFloat(data.ugCgpa).toFixed(2) : 'N/A',
  isPlaced: Boolean(data.isPlaced),
  skills: Array.isArray(data.skills) ? data.skills : [],
  currentArrears: data.currentArrears || 0,
  historyOfArrears: data.historyOfArrears || 0,
  // Add any other transformations here
});

/**
 * Custom hook for managing student data
 */
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // Separate abort controllers for list and detail requests
  const listAbortController = useRef(new AbortController());
  const detailAbortController = useRef(new AbortController());

  /**
   * Fetches all students with caching
   */
  const fetchStudents = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'all-students';
    const cachedData = studentCache.get(cacheKey);
    
    // Return cached data if it exists and not forcing refresh
    if (cachedData && !forceRefresh && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
      setStudents(cachedData.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Cancel any pending requests
      listAbortController.current.abort();
      listAbortController.current = new AbortController();
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await api.fetchStudentsAPI(listAbortController.current.signal);
      
      // Transform and set data
      const transformedData = response.data.map(transformStudentData);
      setStudents(transformedData);
      
      // Update cache
      studentCache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });
      
    } catch (err) {
      // Ignore errors from aborted requests
      if (axios.isCancel(err)) return;
      
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again.');
      toast.error('Failed to load students', {
        description: err.response?.data?.message || 'Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches details for a specific student
   */
  const fetchStudentDetails = useCallback(async (studentId, { forceRefresh = false } = {}) => {
    if (!studentId) return;

    const cacheKey = `student-${studentId}`;
    const cachedData = studentCache.get(cacheKey);

    if (!forceRefresh && cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
      setStudentDetails(cachedData.data);
      return;
    }

    try {
      setDetailsLoading(true);

      // Cancel any pending requests
      detailAbortController.current.abort();
      detailAbortController.current = new AbortController();

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await api.fetchStudentDetailsAPI(studentId, detailAbortController.current.signal);

      const transformedData = transformStudentData(response.data);
      setStudentDetails(transformedData);

      studentCache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });

      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) return;

      console.error('Error fetching student details:', err);
      setStudentDetails({
        error: err.response?.data?.message || 'Failed to load student details.'
      });

      toast.error('Failed to load student details', {
        description: err.response?.data?.message || 'Please try again later.'
      });
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const selectStudent = useCallback((studentOrId) => {
    if (!studentOrId) {
      setSelectedStudent(null);
      return;
    }

    const id = typeof studentOrId === 'string' ? studentOrId : studentOrId._id;

    if (!id) {
      console.warn('selectStudent called without a valid student ID', studentOrId);
      setSelectedStudent(null);
      return;
    }

    setSelectedStudent(id);
  }, []);

  const clearSelectedStudent = useCallback(() => {
    setSelectedStudent(null);
    setStudentDetails(null);
    detailAbortController.current.abort();
    detailAbortController.current = new AbortController();
  }, []);

  /**
   * Updates a student's data
   */
  const updateStudent = useCallback(async (studentId, updates) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await api.updateStudentAPI(studentId, updates);
      
      // Invalidate cache
      studentCache.delete('all-students');
      studentCache.delete(`student-${studentId}`);
      
      // Refresh data
      await fetchStudents(true);
      
      toast.success('Student updated successfully');
      return response.data;
    } catch (err) {
      console.error('Error updating student:', err);
      toast.error('Failed to update student', {
        description: err.response?.data?.message || 'Please try again.'
      });
      throw err;
    }
  }, [fetchStudents]);

  // Initial data fetch
  useEffect(() => {
    fetchStudents();
    
    // Cleanup function
    return () => {
      listAbortController.current.abort();
      detailAbortController.current.abort();
    };
  }, [fetchStudents]);

  // Fetch student details when selected student changes
  useEffect(() => {
    if (!selectedStudent) {
      setStudentDetails(null);
      detailAbortController.current.abort();
      detailAbortController.current = new AbortController();
      return;
    }

    fetchStudentDetails(selectedStudent);
  }, [selectedStudent, fetchStudentDetails]);

  return {
    students,
    loading,
    error,
    studentDetails,
    detailsLoading,
    selectedStudent,
    selectStudent,
    clearSelectedStudent,
    fetchStudents,
    fetchStudentDetails,
    updateStudent,
    refetch: () => fetchStudents(true), // Force refresh
  };
}
