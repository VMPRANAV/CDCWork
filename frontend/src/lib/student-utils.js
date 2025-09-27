/**
 * Filters and sorts student data based on the provided criteria
 * @param {Array} students - Array of student objects
 * @param {Object} filters - Filter criteria
 * @param {Object} sort - Sort configuration
 * @returns {Array} Filtered and sorted array of students
 */
export function filterAndSortStudents(students = [], filters = {}, sort = { key: 'fullName', order: 'asc' }) {
  if (!Array.isArray(students)) {
    console.error('Expected students to be an array', { students });
    return [];
  }

  // Apply filters
  const filteredStudents = students.filter(student => {
    // Search term filter (searches in name, email, and roll number)
    const searchTerm = (filters.searchTerm || '').toLowerCase();
    const matchesSearch = !searchTerm || 
      (student.fullName?.toLowerCase().includes(searchTerm)) ||
      (student.collegeEmail?.toLowerCase().includes(searchTerm)) ||
      (student.rollNo?.toLowerCase().includes(searchTerm));

    // Department filter
    const matchesDepartment = !Array.isArray(filters.departments) || filters.departments.length === 0
      ? true
      : filters.departments.map(dept => dept.toLowerCase()).includes(student.dept?.toLowerCase());

    const matchesPassoutYear = !Array.isArray(filters.passoutYears) || filters.passoutYears.length === 0
      ? true
      : filters.passoutYears.includes(student.passoutYear);

    // Placement status filter
    const placementFilter = filters.placementStatus;
    const matchesPlacement = !placementFilter ||
      (placementFilter === 'placed' && student.isPlaced) ||
      (placementFilter === 'notPlaced' && !student.isPlaced);

    // CGPA range filter
    const studentCGPA = parseFloat(student.ugCgpa) || 0;
    const minCGPA = parseFloat(filters.minCGPA) || 0;
    const maxCGPA = parseFloat(filters.maxCGPA) || 10;
    const matchesCGPA = studentCGPA >= minCGPA && studentCGPA <= maxCGPA;

    // Arrears filter
    const arrearsFilter = filters.hasArrears;
    const matchesArrears = arrearsFilter === undefined || arrearsFilter === null ||
      (arrearsFilter ? (student.currentArrears > 0) : (student.currentArrears <= 0));

    return matchesSearch && matchesDepartment && matchesPassoutYear && matchesPlacement && 
           matchesCGPA && matchesArrears;
  });

  // Apply sorting
  return [...filteredStudents].sort((a, b) => {
    let valueA = a[sort.key];
    let valueB = b[sort.key];

    // Handle undefined or null values
    if (valueA === undefined || valueA === null) return sort.order === 'asc' ? -1 : 1;
    if (valueB === undefined || valueB === null) return sort.order === 'asc' ? 1 : -1;

    // Convert to string for case-insensitive comparison if not a number
    if (typeof valueA === 'string') valueA = valueA.toLowerCase();
    if (typeof valueB === 'string') valueB = valueB.toLowerCase();

    // Special handling for boolean values (like isPlaced)
    if (typeof valueA === 'boolean') {
      return sort.order === 'asc' 
        ? (valueA === valueB ? 0 : valueA ? 1 : -1)
        : (valueA === valueB ? 0 : valueA ? -1 : 1);
    }

    // Numeric comparison
    if (!isNaN(valueA) && !isNaN(valueB)) {
      return sort.order === 'asc' 
        ? parseFloat(valueA) - parseFloat(valueB)
        : parseFloat(valueB) - parseFloat(valueA);
    }

    // String comparison
    if (valueA < valueB) return sort.order === 'asc' ? -1 : 1;
    if (valueA > valueB) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Gets unique departments from students array
 * @param {Array} students - Array of student objects
 * @returns {Array} Sorted array of unique department names
 */
export function getUniqueDepartments(students = []) {
  if (!Array.isArray(students)) return [];
  
  const departments = new Set(
    students
      .map(student => student.dept)
      .filter(Boolean)
      .map(dept => dept.toUpperCase())
  );
  
  return Array.from(departments).sort();
}

/**
 * Gets unique passout years from students array
 * @param {Array} students - Array of student objects
 * @returns {Array} Sorted array of unique passout years (descending)
 */
export function getUniquePassoutYears(students = []) {
  if (!Array.isArray(students)) return [];

  const years = new Set(
    students
      .map(student => student.passoutYear)
      .filter(year => typeof year === 'number' && !Number.isNaN(year))
  );

  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Calculates statistics for the student data
 * @param {Array} students - Array of student objects
 * @returns {Object} Statistics object
 */
export function calculateStudentStats(students = []) {
  if (!Array.isArray(students)) {
    return {
      total: 0,
      placed: 0,
      placementRate: 0,
      averageCGPA: 0,
      totalArrears: 0,
      departments: {}
    };
  }

  const stats = {
    total: students.length,
    placed: 0,
    totalCGPA: 0,
    totalArrears: 0,
    departments: {}
  };

  students.forEach(student => {
    if (student.isPlaced) stats.placed++;
    
    const cgpa = parseFloat(student.ugCgpa);
    if (!isNaN(cgpa)) stats.totalCGPA += cgpa;
    
    const arrears = parseInt(student.currentArrears) || 0;
    stats.totalArrears += arrears;
    
    // Department stats
    if (student.dept) {
      const dept = student.dept.toUpperCase();
      if (!stats.departments[dept]) {
        stats.departments[dept] = { count: 0, placed: 0, totalCGPA: 0, countWithCGPA: 0 };
      }
      stats.departments[dept].count++;
      if (student.isPlaced) stats.departments[dept].placed++;
      if (!isNaN(cgpa)) {
        stats.departments[dept].totalCGPA += cgpa;
        stats.departments[dept].countWithCGPA++;
      }
    }
  });

  // Calculate averages
  stats.placementRate = stats.total > 0 ? (stats.placed / stats.total) * 100 : 0;
  stats.averageCGPA = stats.total > 0 ? stats.totalCGPA / stats.total : 0;

  // Calculate department averages
  Object.keys(stats.departments).forEach(dept => {
    const deptStats = stats.departments[dept];
    deptStats.placementRate = deptStats.count > 0 
      ? (deptStats.placed / deptStats.count) * 100 
      : 0;
    deptStats.averageCGPA = deptStats.countWithCGPA > 0
      ? deptStats.totalCGPA / deptStats.countWithCGPA
      : 0;
  });

  return stats;
}
