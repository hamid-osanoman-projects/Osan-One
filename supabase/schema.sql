-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type user_role as enum ('Super_HR', 'CEO', 'Accountant', 'Employee');
create type user_nationality as enum ('Omani', 'Expat');
create type user_status as enum ('Active', 'Inactive');
create type attendance_status as enum ('Present', 'Late', 'On-Time', 'Overtime', 'Absent');
create type leave_status as enum ('Pending', 'Approved', 'Rejected');
create type leave_type as enum ('Yearly', 'Sick', 'Pregnancy', 'Unpaid');

-- Companies Table
create table public.companies (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    created_at timestamptz default now() not null
);

-- Users Table (Extends Auth)
create table public.users (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    email text unique not null,
    role user_role default 'Employee'::user_role not null,
    company_id uuid references public.companies on delete set null,
    nationality user_nationality not null,
    status user_status default 'Active'::user_status not null,
    leave_balances jsonb default '{"yearly": 30, "sick": 14, "pregnancy": 0}'::jsonb not null,
    created_at timestamptz default now() not null
);

-- Attendance Logs Table
create table public.attendance_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users on delete cascade not null,
    company_id uuid references public.companies on delete cascade not null,
    date date not null default current_date,
    clock_in_time timestamptz,
    clock_out_time timestamptz,
    break_start_time timestamptz,
    break_end_time timestamptz,
    exceptions jsonb default '[]'::jsonb,
    ip_address text,
    status attendance_status,
    created_at timestamptz default now() not null,
    unique(user_id, date)
);

-- Leave Requests Table
create table public.leave_requests (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users on delete cascade not null,
    leave_type leave_type not null,
    start_date date not null,
    end_date date not null,
    status leave_status default 'Pending'::leave_status not null,
    document_url text,
    created_at timestamptz default now() not null
);

-- Row Level Security (RLS) Policies
alter table public.companies enable row level security;
alter table public.users enable row level security;
alter table public.attendance_logs enable row level security;
alter table public.leave_requests enable row level security;

-- Helper function to avoid infinite recursion in RLS
create or replace function public.get_user_role()
returns user_role
language sql
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

-- basic RLS (will need refinement for roles)
create policy "Anyone can read companies" on public.companies for select using (true);
create policy "Users can read own profile" on public.users for select using (auth.uid() = id);
create policy "HR and CEO can read all users" on public.users for select using (
    public.get_user_role() in ('Super_HR', 'CEO')
);

create policy "Users can read own attendance" on public.attendance_logs for select using (auth.uid() = user_id);
create policy "Users can insert own attendance" on public.attendance_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own attendance" on public.attendance_logs for update using (auth.uid() = user_id);
create policy "HR and CEO can read all attendance" on public.attendance_logs for select using (
    public.get_user_role() in ('Super_HR', 'CEO', 'Accountant')
);

create policy "Users can read own leaves" on public.leave_requests for select using (auth.uid() = user_id);
create policy "Users can insert own leaves" on public.leave_requests for insert with check (auth.uid() = user_id);
create policy "HR can manage leaves" on public.leave_requests for all using (
    public.get_user_role() = 'Super_HR'
);

-- Company Settings Table
create table public.company_settings (
    id uuid default uuid_generate_v4() primary key,
    company_id uuid references public.companies on delete cascade unique not null,
    office_latitude double precision,
    office_longitude double precision,
    office_ip text,
    updated_at timestamptz default now() not null
);

alter table public.company_settings enable row level security;

create policy "Anyone can read company settings" on public.company_settings for select using (true);
create policy "HR can manage company settings" on public.company_settings for all using (
    public.get_user_role() = 'Super_HR'
);
