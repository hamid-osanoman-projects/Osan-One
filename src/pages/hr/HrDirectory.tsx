import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, UserCircle2 } from 'lucide-react';
import { AddEmployeeModal } from '../../components/hr/AddEmployeeModal';
import { MOCK_COMPANIES, MOCK_EMPLOYEES } from './mockData';
import type { UserStatus } from '../../types';

export function HrDirectory() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [nationalityFilter, setNationalityFilter] = useState<string>('All');

  const handleAddEmployee = async (data: any) => {
    const newEmp = {
      id: `emp-${employees.length + 1}`,
      name: data.name,
      email: data.email || `employee${employees.length + 1}@company.com`,
      phone: data.phone || `96891234${10 + employees.length}`,
      role: data.role,
      company: data.company,
      nationality: data.nationality,
      gender: data.gender || 'Male',
      status: 'Active' as UserStatus,
    };
    setEmployees([newEmp, ...employees]);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = companyFilter === 'All' || emp.company === companyFilter;
    const matchesGender = genderFilter === 'All' || emp.gender === genderFilter;
    const matchesNationality = nationalityFilter === 'All' || emp.nationality === nationalityFilter;

    return matchesSearch && matchesCompany && matchesGender && matchesNationality;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-background/50 p-1 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Employee Directory</h2>
          <p className="text-sm text-gray-400">Manage all personnel across the organization.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-64 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer transition-all hover:bg-white/10"
            >
              <option value="All" className="bg-background text-white">All Companies</option>
              {MOCK_COMPANIES.map(c => (
                <option key={c.name} value={c.name} className="bg-background text-white">{c.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer transition-all hover:bg-white/10"
            >
              <option value="All" className="bg-background text-white">All Genders</option>
              <option value="Male" className="bg-background text-white">Male</option>
              <option value="Female" className="bg-background text-white">Female</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={nationalityFilter}
              onChange={(e) => setNationalityFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer transition-all hover:bg-white/10"
            >
              <option value="All" className="bg-background text-white">All Nationalities</option>
              <option value="Omani" className="bg-background text-white">Omani</option>
              <option value="Expat" className="bg-background text-white">Expat</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors text-white">
            <Download className="w-4 h-4 text-gray-400" />
            Export CSV
          </button>

          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="bg-primary hover:bg-emerald-600 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors text-white shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <UserCircle2 className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Employee</th>
                <th className="p-4">Company</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Shift Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                        {getInitials(emp.name)}
                      </div>
                      <span className="font-medium text-white">{emp.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{emp.company}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-gray-300 shadow-sm">
                      {emp.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border shadow-sm ${emp.nationality === 'Omani' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                      {emp.nationality}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <button
                      onClick={() => navigate(`/hr/employee/${emp.id}`)}
                      className="text-sm font-medium text-primary hover:text-emerald-400 transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Search className="w-8 h-8 opacity-20" />
                      <p>No employees found matching your criteria.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setCompanyFilter('All');
                        }}
                        className="text-primary hover:underline text-sm"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        companies={MOCK_COMPANIES}
        onAdd={handleAddEmployee}
      />
    </div>
  );
}
