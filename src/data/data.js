// Synthetic demo data. No real people. Records 1 and 2 are the original
// seed records from the first version of the project; the rest were added
// so the dashboard, filters and exports have something meaningful to show.

export const initialCompanies = [
  { name: 'Company A', positions: ['SDE', 'Intern', 'Manager'] },
  { name: 'Company B', positions: ['QA', 'Research', 'Marketing'] },
];

export const initialApplicants = [
  { id: 1, name: 'Aman Singh', company: 'Company A', position: 'SDE', email: 'aman@company.com', currentRound: 'OA', status: 'In Process' },
  { id: 2, name: 'Priya Ramesh', company: 'Company B', position: 'QA', email: 'priya@company.com', currentRound: 'Applied', status: 'In Process' },
  { id: 3, name: 'Rohan Verma', company: 'Company A', position: 'SDE', email: 'rohan.verma@example.com', currentRound: 'Technical Interview', status: 'In Process' },
  { id: 4, name: 'Meera Nair', company: 'Company A', position: 'SDE', email: 'meera.nair@example.com', currentRound: 'Final Offer', status: 'Selected' },
  { id: 5, name: 'Karan Malhotra', company: 'Company A', position: 'SDE', email: 'karan.m@example.com', currentRound: 'Coding Round', status: 'Rejected' },
  { id: 6, name: 'Sneha Iyer', company: 'Company A', position: 'Intern', email: 'sneha.iyer@example.com', currentRound: 'Applied', status: 'In Process' },
  { id: 7, name: 'Vikram Rao', company: 'Company A', position: 'Intern', email: 'vikram.rao@example.com', currentRound: 'OA', status: 'In Process' },
  { id: 8, name: 'Divya Menon', company: 'Company A', position: 'Manager', email: 'divya.menon@example.com', currentRound: 'HR', status: 'In Process' },
  { id: 9, name: 'Arjun Kapoor', company: 'Company B', position: 'QA', email: 'arjun.kapoor@example.com', currentRound: 'Coding Round', status: 'In Process' },
  { id: 10, name: 'Lakshmi Pillai', company: 'Company B', position: 'Research', email: 'lakshmi.pillai@example.com', currentRound: 'Technical Interview', status: 'In Process' },
  { id: 11, name: 'Farhan Sheikh', company: 'Company B', position: 'Research', email: 'farhan.sheikh@example.com', currentRound: 'Final Offer', status: 'In Process' },
  { id: 12, name: 'Isha Gupta', company: 'Company B', position: 'Marketing', email: 'isha.gupta@example.com', currentRound: 'Applied', status: 'Rejected' },
];
