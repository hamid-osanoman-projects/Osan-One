import { useState, useMemo } from 'react';
import { X, UserPlus, Loader2, Phone, Mail } from 'lucide-react';
import type { Role, Nationality, AuthPolicy } from '../../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: { name: string; authPolicy?: AuthPolicy }[];
  onAdd: (data: any) => Promise<void>;
}

export function AddEmployeeModal({ isOpen, onClose, companies, onAdd }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Employee' as Role,
    company: companies.length > 0 ? companies[0].name : '',
    nationality: 'Omani' as Nationality,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-select first company when opening
  useMemo(() => {
    if (isOpen && companies.length > 0 && !formData.company) {
      setFormData(prev => ({ ...prev, company: companies[0].name }));
    }
  }, [isOpen, companies]);

  const activeCompanyPolicy = useMemo(() => {
    const selected = companies.find(c => c.name === formData.company);
    return selected?.authPolicy || 'both';
  }, [formData.company, companies]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company) return;

    // Validate based on policy
    if (activeCompanyPolicy === 'email' && !formData.email.trim()) {
      alert('Email address is required for this company.');
      return;
    }
    if (activeCompanyPolicy === 'phone' && !formData.phone.trim()) {
      alert('Phone number is required for this company.');
      return;
    }
    if (activeCompanyPolicy === 'both' && !formData.email.trim() && !formData.phone.trim()) {
      alert('Please fill out either Email Address or Phone Number.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Auto-populate placeholder values for fields omitted by policy constraints
      const submissionData = {
        ...formData,
        email: activeCompanyPolicy === 'phone' ? `placeholder-${Math.random().toString(36).substring(2, 7)}@osan-placeholder.com` : formData.email,
        phone: activeCompanyPolicy === 'email' ? undefined : formData.phone,
      };

      await onAdd(submissionData);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
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
              <label className="block text-sm font-medium text-gray-400 mb-1">Company Assignment</label>
              <select
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                {companies.map(c => (
                  <option key={c.name} value={c.name} className="bg-slate-900 text-white">{c.name}</option>
                ))}
              </select>
            </div>

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
          </div>

          {/* Conditional inputs based on selected company's authPolicy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCompanyPolicy !== 'phone' && (
              <div className={activeCompanyPolicy === 'email' ? 'col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address {activeCompanyPolicy === 'email' && '*'}
                </label>
                <input
                  type="email"
                  required={activeCompanyPolicy === 'email'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            )}

            {activeCompanyPolicy !== 'email' && (
              <div className={activeCompanyPolicy === 'phone' ? 'col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Number (WhatsApp) {activeCompanyPolicy === 'phone' && '*'}
                </label>
                <input
                  type="tel"
                  required={activeCompanyPolicy === 'phone'}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 96891234567"
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            )}
          </div>

          {activeCompanyPolicy === 'phone' && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-medium">
              💡 <strong>WhatsApp Ready:</strong> A 6-digit login PIN will be auto-generated for this employee. You can send it directly to their WhatsApp number once created.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">System Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="Employee" className="bg-slate-900 text-white">Employee</option>
                <option value="Super_HR" className="bg-slate-900 text-white">HR Admin</option>
                <option value="Accountant" className="bg-slate-900 text-white">Accountant</option>
                <option value="CEO" className="bg-slate-900 text-white">CEO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">Nationality Category</label>
              <div className="flex gap-4 h-[46px] items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nationality"
                    value="Omani"
                    checked={formData.nationality === 'Omani'}
                    onChange={() => setFormData({ ...formData, nationality: 'Omani' })}
                    className="w-4 h-4 text-blue-500 bg-background/50 border-white/10 focus:ring-blue-500/50"
                  />
                  <span className="text-white text-xs">Omani</span>
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
                  <span className="text-white text-xs">Expat</span>
                </label>
              </div>
            </div>
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
              disabled={isSubmitting || !formData.name.trim() || !formData.company}
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
