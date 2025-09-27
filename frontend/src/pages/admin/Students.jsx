import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, X } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { StudentsTable } from '@/components/admin/dashboard/StudentsTable';
import { StudentDetails } from '@/components/admin/dashboard/StudentDetails';
import { Sort } from '@/components/admin/students/Sort';
import { filterAndSortStudents, calculateStudentStats, getUniqueDepartments, getUniquePassoutYears } from '@/lib/student-utils';

// Default filters
const DEFAULT_FILTERS = {
  searchTerm: '',
  departments: [],
  passoutYears: [],
  placementStatus: '',
  minCGPA: '',
  maxCGPA: '',
  hasArrears: undefined,
};

// Default sort
const DEFAULT_SORT = { key: 'fullName', order: 'asc' };

export function Students() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(DEFAULT_SORT);
  
  const {
    students,
    loading,
    studentDetails,
    detailsLoading,
    selectedStudent,
    selectStudent,
    clearSelectedStudent,
    refetch
  } = useStudents();
  
  // Handle viewing student details
  const handleViewDetails = useCallback((student) => {
    if (!student?._id) {
      console.error('No student ID found');
      return;
    }
    console.log('Selecting student:', student._id);
    selectStudent(student._id);
  }, [selectStudent]);

  // Apply filters and sorting
  const filteredStudents = useMemo(() => {
    return filterAndSortStudents(students, filters, sort);
  }, [students, filters, sort]);

  const departmentOptions = useMemo(() => getUniqueDepartments(students), [students]);
  const passoutYearOptions = useMemo(() => getUniquePassoutYears(students), [students]);

  // Calculate statistics from filtered students
  const stats = useMemo(() => {
    return calculateStudentStats(filteredStudents);
  }, [filteredStudents]);

  // Handle search input
  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setSort(DEFAULT_SORT);
  };

  // Count active filters
  const activeFilterCount = (() => {
    let count = 0;
    if (filters.departments?.length) count++;
    if (filters.passoutYears?.length) count++;
    if (filters.placementStatus) count++;
    if (filters.minCGPA !== '') count++;
    if (filters.maxCGPA !== '') count++;
    if (filters.hasArrears !== undefined && filters.hasArrears !== null) count++;
    return count;
  })();

  const toggleSelection = (key, value) => {
    setFilters(prev => {
      const existing = prev[key] || [];
      const nextValues = existing.includes(value)
        ? existing.filter(item => item !== value)
        : [...existing, value];
      return {
        ...prev,
        [key]: nextValues,
      };
    });
  };

  // Handle export
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting students data...', filteredStudents);
    // In a real app, this would generate a CSV or Excel file
  };
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            View and manage all registered students
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>

      {/* Stats Cards */}
      {!loading && students.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.placed} placed ({stats.placementRate.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average CGPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageCGPA.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Across all students
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Arrears</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalArrears}</div>
              <p className="text-xs text-muted-foreground">
                Total across all students
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.departments).length}</div>
              <p className="text-xs text-muted-foreground">
                Active departments
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students Table */}
      <Card className="overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="px-6 pt-6 pb-2 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email, or ID..."
                className="pl-9"
                value={filters.searchTerm || ''}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Sort sort={sort} setSort={setSort} />
              {activeFilterCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={clearAllFilters}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 pb-4 space-y-4">
          {departmentOptions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Departments</p>
              <div className="flex flex-wrap gap-2">
                {departmentOptions.map((dept) => {
                  const isActive = filters.departments?.includes(dept);
                  return (
                    <Button
                      key={dept}
                      variant={isActive ? 'secondary' : 'outline'}
                      size="sm"
                      className={`h-8 px-3 rounded-full border ${isActive ? 'border-primary/60' : 'border-muted-foreground/40'}`}
                      onClick={() => toggleSelection('departments', dept)}
                    >
                      {isActive && <span className="mr-2">✓</span>}
                      {dept}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {passoutYearOptions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Passout Years</p>
              <div className="flex flex-wrap gap-2">
                {passoutYearOptions.map((year) => {
                  const isActive = filters.passoutYears?.includes(year);
                  return (
                    <Button
                      key={year}
                      variant={isActive ? 'secondary' : 'outline'}
                      size="sm"
                      className={`h-8 px-3 rounded-full border ${isActive ? 'border-primary/60' : 'border-muted-foreground/40'}`}
                      onClick={() => toggleSelection('passoutYears', year)}
                    >
                      {isActive && <span className="mr-2">✓</span>}
                      {year}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-0">
            <StudentsTable 
              students={filteredStudents}
              loading={loading}
              onViewDetails={handleViewDetails}
              sort={sort}
            />
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <StudentDetails
        student={selectedStudent ? (studentDetails || { _id: selectedStudent }) : null}
        loading={detailsLoading}
        onClose={clearSelectedStudent}
      />
    </div>
  );
}

export default Students;
