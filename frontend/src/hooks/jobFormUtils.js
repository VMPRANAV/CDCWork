const initialJobForm = {
  companyName: '',
  jobTitle: '',
  companyDescription: '',
  jobDescription: '',
  salary: '',
  locations: [''],
  attachmentLinks: [''],
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
};

export function getInitialJobForm() {
  return JSON.parse(JSON.stringify(initialJobForm));
}
