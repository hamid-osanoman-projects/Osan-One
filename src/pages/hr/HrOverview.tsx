import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { Users, Building2, CalendarX, AlertCircle, Activity, CheckCircle2 } from 'lucide-react';
import { MOCK_COMPANIES, MOCK_EMPLOYEES, MOCK_LEAVES, MOCK_EXCEPTIONS } from './mockData';

// Generate dynamic chart data based on our mock data where possible
const attendanceData = [
  { day: 'Mon', onTime: 45, late: 12, absent: 5 },
  { day: 'Tue', onTime: 50, late: 8, absent: 4 },
  { day: 'Wed', onTime: 48, late: 10, absent: 4 },
  { day: 'Thu', onTime: 52, late: 5, absent: 5 },
  { day: 'Fri', onTime: 40, late: 15, absent: 7 },
  { day: 'Sat', onTime: 5, late: 1, absent: 1 },
  { day: 'Sun', onTime: 55, late: 4, absent: 3 },
];

const demographicsData = [
  { name: 'Omani Male', count: MOCK_EMPLOYEES.filter(e => e.nationality === 'Omani' && e.gender === 'Male').length },
  { name: 'Omani Female', count: MOCK_EMPLOYEES.filter(e => e.nationality === 'Omani' && e.gender === 'Female').length },
  { name: 'Expat Male', count: MOCK_EMPLOYEES.filter(e => e.nationality === 'Expat' && e.gender === 'Male').length },
  { name: 'Expat Female', count: MOCK_EMPLOYEES.filter(e => e.nationality === 'Expat' && e.gender === 'Female').length },
];

const companyColors = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-white/10 p-3 rounded-lg shadow-xl shadow-black/50">
        <p className="font-bold text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300 capitalize">{entry.name}:</span>
            <span className="text-white font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function HrOverview() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">

      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Organization Overview</h2>
        <p className="text-sm text-gray-400">Real-time metrics and analytics for the entire workforce.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Personnel</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{MOCK_EMPLOYEES.length}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <span>+2 this week</span>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Active Companies</h3>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Building2 className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{MOCK_COMPANIES.length}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <span>Stable</span>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Pending Leaves</h3>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <CalendarX className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{MOCK_LEAVES.length}</div>
          <div className="text-xs text-amber-400 flex items-center gap-1">
            <span>Requires review</span>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-red-400/80 text-sm font-medium">Exceptions</h3>
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-500 mb-1">
            {MOCK_EXCEPTIONS.filter(e => e.severity === 'high').length}
          </div>
          <div className="text-xs text-red-400 flex items-center gap-1">
            <span>Critical actions pending</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Weekly Attendance Trend */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-white/5 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            7-Day Attendance Trend
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="onTime" name="On Time" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOnTime)" />
                <Area type="monotone" dataKey="late" name="Late" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLate)" />
                <Area type="monotone" dataKey="absent" name="Absent" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorAbsent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workforce Distribution */}
        <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Workforce Distribution</h3>
          <div className="flex-1 w-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_COMPANIES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  stroke="none"
                >
                  {MOCK_COMPANIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={companyColors[index % companyColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-3xl font-bold text-white">{MOCK_COMPANIES.reduce((acc, curr) => acc + curr.count, 0)}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Demographics Bar Chart */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Demographics</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographicsData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#ffffff50" tick={{ fill: '#ffffff90', fontSize: 13 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" name="Employees" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={companyColors[index % companyColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Recent System Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-white">Leave Approved for <span className="font-semibold">Employee 4</span></p>
                <p className="text-xs text-gray-400">By Admin • 10 mins ago</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-white">New Employee Added to <span className="font-semibold">Osan Studio</span></p>
                <p className="text-xs text-gray-400">By Super_HR • 45 mins ago</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-white">Severe Late Exception logged for <span className="font-semibold">Employee 3</span></p>
                <p className="text-xs text-gray-400">System • 2 hours ago</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-white">Company profile updated: <span className="font-semibold">Musk</span></p>
                <p className="text-xs text-gray-400">By Admin • 3 hours ago</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}


