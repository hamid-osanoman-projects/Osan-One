import { MOCK_EXCEPTIONS } from './mockData.ts';

export function HrExceptions() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Action Required (Pending Deductions)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_EXCEPTIONS.filter(e => e.severity === 'high').map(exc => (
            <div key={exc.id} className="glass p-5 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{exc.employee}</h3>
                  <span className="text-xs text-gray-400">{exc.date}</span>
                </div>
                <p className="text-red-400 font-medium text-sm mb-1">{exc.type}</p>
                <p className="text-gray-400 text-sm mb-4">{exc.details}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Approve Deduction
                </button>
                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
                  Forgive
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Warnings Logged
        </h2>
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Details</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_EXCEPTIONS.filter(e => e.severity === 'medium').map(exc => (
                <tr key={exc.id} className="hover:bg-white/5">
                  <td className="p-4 font-medium text-white">{exc.employee}</td>
                  <td className="p-4 text-amber-400">{exc.type}</td>
                  <td className="p-4 text-gray-400">{exc.details}</td>
                  <td className="p-4 text-gray-400">{exc.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
