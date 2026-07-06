import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MapPin, TrendingUp, Clock, Users, Building2 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

// Enhanced Mock Data for CEO View
const MOCK_COMPANIES = [
  { name: 'Nameer', total: 12, active: 10, lateMinutes: 45 },
  { name: 'Masar', total: 8, active: 8, lateMinutes: 15 },
  { name: 'Osan Studio', total: 15, active: 11, lateMinutes: 120 },
  { name: 'Amer', total: 5, active: 5, lateMinutes: 5 },
  { name: 'Asas', total: 9, active: 7, lateMinutes: 60 },
  { name: 'Musk', total: 4, active: 2, lateMinutes: 10 },
  { name: 'Osbic', total: 6, active: 5, lateMinutes: 30 },
  { name: 'Maisarah', total: 3, active: 0, lateMinutes: 0 },
];

const MOCK_EMPLOYEES_BY_COMPANY: Record<string, { name: string; status: 'Active' | 'Out of Office' | 'On Break' }[]> = {
  'Nameer': [
    { name: 'Ali Ahmed', status: 'Active' },
    { name: 'Sara Khan', status: 'Out of Office' },
    { name: 'Omar Said', status: 'Active' },
  ],
};

const productivityTrend = [
  { day: 'Day 1', rate: 92 },
  { day: 'Day 2', rate: 88 },
  { day: 'Day 3', rate: 95 },
  { day: 'Day 4', rate: 85 },
  { day: 'Day 5', rate: 89 },
  { day: 'Day 6', rate: 94 },
  { day: 'Day 7', rate: 96 },
  { day: 'Day 8', rate: 91 },
  { day: 'Day 9', rate: 87 },
  { day: 'Day 10', rate: 93 },
];

const companyColors = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-white/10 p-3 rounded-lg shadow-xl shadow-black/50">
        <p className="font-bold text-white mb-2">{label}</p>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: payload[0].color || payload[0].fill }} />
          <span className="text-gray-300 capitalize">{payload[0].name}:</span>
          <span className="text-white font-bold">{payload[0].value}{payload[0].name.includes('Rate') ? '%' : ''}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function CeoDashboard() {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const totalEmployees = MOCK_COMPANIES.reduce((acc, c) => acc + c.total, 0);
  const activeEmployees = MOCK_COMPANIES.reduce((acc, c) => acc + c.active, 0);
  const totalLateMinutes = MOCK_COMPANIES.reduce((acc, c) => acc + c.lateMinutes, 0);
  const estimatedLostHours = (totalLateMinutes / 60).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500';
      case 'On Break': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout title="Executive Board">

      {/* High Impact KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MapPin className="w-16 h-16" />
          </div>
          <h2 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Office Density</h2>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-white">{activeEmployees}</span>
            <span className="text-gray-500 text-lg mb-1">/ {totalEmployees}</span>
          </div>
          <p className="text-emerald-400 text-xs mt-2 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Personnel On-Duty Now
          </p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16" />
          </div>
          <h2 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Productivity Rate</h2>
          <div className="text-4xl font-bold text-white">91.4%</div>
          <p className="text-emerald-400 text-xs mt-2 font-medium">
            ↑ 2.1% from last week
          </p>
        </div>

        <div className="glass p-6 rounded-2xl border border-red-500/20 bg-red-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-red-400/80 text-sm font-medium mb-2 uppercase tracking-wider">Est. Lost Hours</h2>
          <div className="text-4xl font-bold text-red-500">{estimatedLostHours}h</div>
          <p className="text-red-400 text-xs mt-2 font-medium">
            Due to late arrivals this week
          </p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-16 h-16" />
          </div>
          <h2 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Headcount Growth</h2>
          <div className="text-4xl font-bold text-white">+8</div>
          <p className="text-emerald-400 text-xs mt-2 font-medium">
            Month over Month
          </p>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Productivity Trend */}
        <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col h-[350px]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            30-Day On-Time Rate
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" name="On-Time Rate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company Performance Bar Chart */}
        <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col h-[350px]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Average Late Minutes by Company
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_COMPANIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#ffffff05' }} content={<CustomTooltip />} />
                <Bar dataKey="lateMinutes" name="Late Minutes" radius={[4, 4, 0, 0]}>
                  {MOCK_COMPANIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={companyColors[index % companyColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-400" />
        Real-Time Operations Matrices
      </h3>

      {/* Drill-down Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {MOCK_COMPANIES.map((company) => {
          const isExpanded = expandedCompany === company.name;
          const employees = MOCK_EMPLOYEES_BY_COMPANY[company.name] || [
            { name: 'Mock Emp 1', status: 'Active' },
            { name: 'Mock Emp 2', status: 'On Break' }
          ];

          return (
            <div key={company.name} className="glass rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10">
              <button
                onClick={() => setExpandedCompany(isExpanded ? null : company.name)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-lg text-white mb-1">{company.name}</h4>
                  <div className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {company.active} / {company.total} Active
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 bg-black/20"
                  >
                    <div className="p-4 space-y-2">
                      {employees.map((emp, idx) => (
                        <div key={idx} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="font-medium text-sm text-gray-200">{emp.name}</span>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold bg-white/5 border border-white/10 ${emp.status === 'Active' ? 'text-emerald-400' :
                              emp.status === 'On Break' ? 'text-amber-400' : 'text-gray-400'
                            }`}>
                            {emp.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
