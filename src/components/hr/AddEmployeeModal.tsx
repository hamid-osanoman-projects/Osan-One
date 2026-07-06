import { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import type { Role, Nationality } from '../../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: { name: string }[];
  onAdd: (data: any) => Promise<void>;
}

export function AddEmployeeModal({ isOpen, onClose, companies, onAdd }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee' as Role,
    company: companies.length > 0 ? companies[0].name : '',
    nationality: 'Omani' as Nationality,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.company) return;

    setIsSubmitting(true);
    try {
      await onAdd(formData);
      setFormData({
        name: '',
        email: '',
        role: 'Employee',
        company: companies.length > 0 ? companies[0].name : '',
        nationality: 'Omani',
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to add employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass w-full max-w-lg p-6 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <UserPlus className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Add New Employee</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">System Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="Employee">Employee</option>
                <option value="Super_HR">HR Admin</option>
                <option value="Accountant">Accountant</option>
                <option value="CEO">CEO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Company Assignment</label>
              <select
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                {companies.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nationality Category</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="nationality"
                  value="Omani"
                  checked={formData.nationality === 'Omani'}
                  onChange={() => setFormData({ ...formData, nationality: 'Omani' })}
                  className="w-4 h-4 text-blue-500 bg-background/50 border-white/10 focus:ring-blue-500/50"
                />
                <span className="text-white text-sm">Omani (Morning Shift)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="nationality"
                  value="Expat"
                  checked={formData.nationality === 'Expat'}
                  onChange={() => setFormData({ ...formData, nationality: 'Expat' })}
                  className="w-4 h-4 text-blue-500 bg-background/50 border-white/10 focus:ring-blue-500/50"
                />
                <span className="text-white text-sm">Expat (Split Shift)</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: This setting determines the employee's required attendance rules.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.company}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSubmitting ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
