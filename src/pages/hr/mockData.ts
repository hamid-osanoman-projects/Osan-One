import type { Role, Nationality, UserStatus, AuthPolicy } from '../../types';

export interface CompanyData {
  name: string;
  count: number;
  location?: string;
  contactEmail?: string;
  theme?: string;
  logoUrl?: string;
  authPolicy?: AuthPolicy;
}

export const MOCK_COMPANIES: CompanyData[] = [
  { name: 'Nameer', count: 12, location: 'Muscat, Oman', theme: 'emerald', authPolicy: 'both' },
  { name: 'Masar', count: 8, location: 'Dubai, UAE', theme: 'blue', authPolicy: 'phone' },
  { name: 'Osan Studio', count: 15, location: 'Muscat, Oman', theme: 'indigo', authPolicy: 'email' },
  { name: 'Amer', count: 5, location: 'Doha, Qatar', theme: 'amber', authPolicy: 'both' },
  { name: 'Asas', count: 9, location: 'Riyadh, KSA', theme: 'rose', authPolicy: 'phone' },
  { name: 'Musk', count: 4, location: 'Muscat, Oman', theme: 'emerald', authPolicy: 'email' },
  { name: 'Osbic', count: 6, location: 'Manama, Bahrain', theme: 'blue', authPolicy: 'both' },
  { name: 'Maisarah', count: 3, location: 'Kuwait City, Kuwait', theme: 'amber', authPolicy: 'phone' },
];

export const MOCK_EMPLOYEES = Array.from({ length: 12 }).map((_, i) => ({
  id: `emp-${i}`,
  name: `Employee ${i + 1}`,
  email: `employee${i + 1}@${MOCK_COMPANIES[i % 8].name.toLowerCase().replace(/\s+/g, '')}.com`,
  phone: `96891234${(10 + i).toString()}`,
  role: (i === 0 ? 'Super_HR' : i === 1 ? 'CEO' : i === 2 ? 'Accountant' : 'Employee') as Role,
  company: MOCK_COMPANIES[i % 8].name,
  nationality: (i % 3 === 0 ? 'Expat' : 'Omani') as Nationality,
  gender: (i % 2 === 0 ? 'Male' : 'Female') as 'Male' | 'Female',
  status: 'Active' as UserStatus,
}));

export interface MockLeave {
  id: string;
  employee: string;
  type: string;
  start: string;
  end: string;
  status: string;
  balances: { yearly: number; sick: number; };
  documentUrl?: string;
}

export const MOCK_LEAVES: MockLeave[] = [
  { id: '1', employee: 'Employee 4', type: 'Yearly', start: '2026-07-10', end: '2026-07-14', status: 'Pending', balances: { yearly: 15, sick: 14 } },
  { id: '2', employee: 'Employee 7', type: 'Sick', start: '2026-07-05', end: '2026-07-06', status: 'Pending', balances: { yearly: 30, sick: 12 } },
];

export const MOCK_EXCEPTIONS = [
  { id: '1', employee: 'Employee 3', type: 'Severe Late', date: 'Today', details: 'Arrived at 9:15 AM (45m late)', status: 'Pending Deduction', severity: 'high' },
  { id: '2', employee: 'Employee 5', type: 'Over-Break', date: 'Yesterday', details: 'Break lasted 1h 20m', status: 'Pending Deduction', severity: 'high' },
  { id: '3', employee: 'Employee 8', type: 'Late Warning', date: 'Today', details: 'Arrived at 8:50 AM', status: 'Warning Logged', severity: 'medium' },
  { id: '4', employee: 'Employee 11', type: 'Early Departure', date: 'Yesterday', details: 'Left at 4:15 PM', status: 'Pending Deduction', severity: 'high' },
];
