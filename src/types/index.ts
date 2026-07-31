export type Role = 'Super_HR' | 'CEO' | 'Accountant' | 'Employee';
export type Nationality = 'Omani' | 'Expat';
export type UserStatus = 'Active' | 'Inactive';
export type AttendanceStatus = 'Present' | 'Late' | 'On-Time' | 'Overtime' | 'Absent';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Yearly' | 'Sick' | 'Pregnancy' | 'Unpaid';
export type CompanyName = string;
export type AuthPolicy = 'email' | 'phone' | 'both';

export interface Company {
  id: string;
  name: CompanyName;
  created_at: string;
  auth_policy: AuthPolicy;
}

export interface LeaveBalances {
  yearly: number;
  sick: number;
  pregnancy: number;
}

export interface User {
  id: string; // matches auth.users.id
  name: string;
  email: string;
  phone?: string;
  role: Role;
  company_id: string;
  nationality: Nationality;
  gender?: 'Male' | 'Female';
  status: UserStatus;
  leave_balances: LeaveBalances;
}

export interface AttendanceLog {
  id: string;
  user_id: string;
  company_id: string;
  date: string; // YYYY-MM-DD
  clock_in_time: string | null;
  clock_out_time: string | null;
  break_start_time: string | null;
  break_end_time: string | null;
  exceptions: any[];
  ip_address: string | null;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  status: LeaveStatus;
  document_url?: string;
}
