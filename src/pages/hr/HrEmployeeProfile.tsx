import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Mail, Phone, Calendar, Clock, AlertCircle, FileText, Download } from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_LEAVES } from './mockData';

type TabType = 'attendance' | 'leaves' | 'profile';

export function HrEmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('attendance');

  // Find employee or fallback
  const employee = MOCK_EMPLOYEES.find(e => e.id === id) || {
    id: 'unknown',
    name: 'Unknown Employee',
    role: 'Employee',
    company: 'Unknown',
    nationality: 'Omani',
    gender: 'Male',
    status: 'Inactive'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Generate mock heatmap data for the last 30 days
  const today = new Date();
  const heatmapData = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));

    // Randomize status for demo purposes
    const isWeekend = date.getDay() === 5 || date.getDay() === 6; // Friday/Saturday in Oman
    let status: 'present' | 'late' | 'absent' | 'weekend' = 'present';

    if (isWeekend) status = 'weekend';
    else if (Math.random() > 0.85) status = 'late';
    else if (Math.random() > 0.95) status = 'absent';

    return { date, status };
  });

  const getHeatmapColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-500/80 hover:bg-emerald-400';
      case 'late': return 'bg-amber-500/80 hover:bg-amber-400';
      case 'absent': return 'bg-red-500/80 hover:bg-red-400';
      case 'weekend': return 'bg-white/5 hover:bg-white/10';
      default: return 'bg-white/5';
    }
  };

  // Mock specific leave data for this user
  const userLeaves = MOCK_LEAVES.slice(0, 2);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">

      {/* Navigation & Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Employee Profile</h2>
          <p className="text-sm text-gray-400">Detailed analytics and records for this staff member.</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 border border-primary/30 flex items-center justify-center text-3xl font-bold text-primary shadow-lg shadow-black/40 shrink-0">
            {getInitials(employee.name)}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{employee.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${employee.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}>
                {employee.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                {employee.role.replace('_', ' ')}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {employee.company}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                {employee.name.toLowerCase().replace(' ', '.')}@company.com
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors text-white">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-emerald-600 rounded-xl text-sm font-medium transition-colors text-white shadow-lg shadow-primary/20">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'attendance', label: 'Attendance & Time', icon: Clock },
          { id: 'leaves', label: 'Leave Management', icon: Calendar },
          { id: 'profile', label: 'Personal Details', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-inner'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass p-5 rounded-2xl border border-white/5">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">On-Time Days</div>
                <div className="text-3xl font-bold text-emerald-400">21</div>
                <div className="text-xs text-gray-500 mt-1">Last 30 Days</div>
              </div>
              <div className="glass p-5 rounded-2xl border border-white/5">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Late Arrivals</div>
                <div className="text-3xl font-bold text-amber-400">3</div>
                <div className="text-xs text-gray-500 mt-1">Average 15m late</div>
              </div>
              <div className="glass p-5 rounded-2xl border border-white/5">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Absences</div>
                <div className="text-3xl font-bold text-red-400">1</div>
                <div className="text-xs text-gray-500 mt-1">Unexcused</div>
              </div>
              <div className="glass p-5 rounded-2xl border border-white/5">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Overtime</div>
                <div className="text-3xl font-bold text-blue-400">4.5h</div>
                <div className="text-xs text-gray-500 mt-1">Pending approval</div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Attendance Heatmap */}
              <div className="xl:col-span-1 glass p-6 rounded-2xl border border-white/5 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">30-Day Heatmap</h3>
                  <div className="flex items-center gap-3 text-xs font-medium flex-wrap justify-end">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500/80" /> On-Time</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-amber-500/80" /> Late</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-red-500/80" /> Absent</div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <div key={`${day}-${idx}`} className="text-center text-xs font-bold text-gray-500 mb-1">{day}</div>
                  ))}

                  {/* Pad start of calendar based on first day of our 30 day range */}
                  {Array.from({ length: heatmapData[0].date.getDay() }).map((_, i) => (
                    <div key={`pad-${i}`} className="aspect-square rounded-xl bg-transparent" />
                  ))}

                  {heatmapData.map((data, i) => (
                    <div
                      key={i}
                      title={`${data.date.toLocaleDateString()}: ${data.status}`}
                      className={`aspect-square rounded-lg md:rounded-xl border border-white/5 flex items-center justify-center text-xs md:text-sm font-medium transition-transform cursor-pointer hover:scale-105 ${getHeatmapColor(data.status)}`}
                    >
                      <span className={data.status === 'weekend' ? 'text-gray-600' : 'text-white/90 drop-shadow-md'}>
                        {data.date.getDate()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Logs Table */}
              <div className="xl:col-span-2 glass rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white">Recent Attendance Logs</h3>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-white/5 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase">
                      <tr>
                        <th className="p-4 pl-6">Date</th>
                        <th className="p-4">Punch In</th>
                        <th className="p-4">Punch Out</th>
                        <th className="p-4">Work / Break</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-medium text-white">Today</td>
                        <td className="p-4 text-gray-300">08:05 AM</td>
                        <td className="p-4 text-gray-500">--:--</td>
                        <td className="p-4">
                          <div className="text-sm text-gray-300">In Progress</div>
                          <div className="text-xs text-gray-500">45m break</div>
                        </td>
                        <td className="p-4"><span className="text-emerald-400 font-medium">Present</span></td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-medium text-white">Yesterday</td>
                        <td className="p-4 text-gray-300">08:22 AM</td>
                        <td className="p-4 text-gray-300">05:00 PM</td>
                        <td className="p-4">
                          <div className="text-sm text-gray-300">8h 38m</div>
                          <div className="text-xs text-gray-500">1h break</div>
                        </td>
                        <td className="p-4"><span className="text-amber-400 font-medium">Late</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* LEAVES TAB */}
        {activeTab === 'leaves' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-white mb-4">Current Leave Balances</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center mb-4 relative">
                  <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary/20" />
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray="351.85" strokeDashoffset="100" />
                  </svg>
                  <div className="flex flex-col items-center justify-center relative z-10">
                    <span className="text-3xl font-bold text-white">20</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Days</span>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white mb-1">Annual Leave</h4>
                <p className="text-sm text-gray-400">10 days consumed this year</p>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center mb-4 relative">
                  <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-amber-500/20" />
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-amber-500" strokeDasharray="351.85" strokeDashoffset="280" />
                  </svg>
                  <div className="flex flex-col items-center justify-center relative z-10">
                    <span className="text-3xl font-bold text-white">3</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Days</span>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white mb-1">Sick Leave</h4>
                <p className="text-sm text-gray-400">12 days consumed this year</p>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-full border-8 border-white/10 flex flex-col items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">50</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Days</span>
                </div>
                <h4 className="font-bold text-lg text-white mb-1">Pregnancy Leave</h4>
                <p className="text-sm text-gray-400">0 days consumed</p>
              </div>

            </div>

            <h3 className="text-lg font-bold text-white mb-4 mt-8">Leave History</h3>
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Type</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Documents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {userLeaves.map((req) => (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-white">{req.type} Leave</div>
                        <div className="text-xs text-gray-400">Requested a month ago</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-300">{req.start} to {req.end}</div>
                        <div className="text-xs font-medium text-emerald-400">4 Days Total</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                            req.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                              'bg-amber-500/10 text-amber-400'
                          }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {req.documentUrl ? (
                          <button className="text-sm text-primary hover:underline">View Medical Cert</button>
                        ) : (
                          <span className="text-sm text-gray-500">None attached</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass p-8 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Personal Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Full Legal Name</label>
                  <div className="text-base text-white font-medium">{employee.name}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Employee ID</label>
                  <div className="text-base text-white font-medium font-mono">{employee.id.toUpperCase()}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Nationality</label>
                  <div className="text-base text-white font-medium">{employee.nationality}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Gender</label>
                  <div className="text-base text-white font-medium">{(employee as any).gender || 'Not Specified'}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                  <div className="text-base text-white font-medium">+968 9123 4567</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Contract Start Date</label>
                  <div className="text-base text-white font-medium">01 Jan 2024</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
