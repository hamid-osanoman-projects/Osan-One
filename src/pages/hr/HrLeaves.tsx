import { CheckCircle2, XCircle } from 'lucide-react';
import { MOCK_LEAVES } from './mockData';

export function HrLeaves() {
  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {MOCK_LEAVES.map(leave => (
        <div key={leave.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-colors">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg text-white">{leave.employee}</h3>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium uppercase tracking-wider text-gray-300">
                {leave.type} Leave
              </span>
            </div>
            <div className="text-gray-400 text-sm mb-4">
              Requested for: <strong className="text-white">{leave.start}</strong> to <strong className="text-white">{leave.end}</strong>
            </div>

            {/* Embedded Balances Info crucial for HR decision */}
            <div className="flex gap-4 text-sm">
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                Remaining Yearly: <span className="text-primary font-bold">{leave.balances.yearly}</span>
              </div>
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                Remaining Sick: <span className="text-amber-500 font-bold">{leave.balances.sick}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors font-medium">
              <XCircle className="w-5 h-5" />
              Reject
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-primary/20">
              <CheckCircle2 className="w-5 h-5" />
              Approve
            </button>
          </div>
        </div>
      ))}
      {MOCK_LEAVES.length === 0 && (
        <div className="text-center py-12 text-gray-400 glass rounded-2xl border border-white/5">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No pending leave requests.</p>
        </div>
      )}
    </div>
  );
}
