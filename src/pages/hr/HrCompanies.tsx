import { useState } from 'react';
import { Building2, Users, MoreVertical, LayoutGrid, List, Shield } from 'lucide-react';
import { CompanyFormModal } from '../../components/hr/CompanyFormModal';
import { MOCK_COMPANIES, type CompanyData } from './mockData';

export function HrCompanies() {
  const [companies, setCompanies] = useState<CompanyData[]>(MOCK_COMPANIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSaveCompany = async (companyData: Omit<CompanyData, 'count'>) => {
    if (editingCompany) {
      // Edit existing company
      setCompanies(companies.map(c =>
        c.name === editingCompany.name ? { ...c, ...companyData } : c
      ));
    } else {
      // Add new company
      setCompanies([...companies, { ...companyData, count: 0 }]);
    }
  };

  const openAddModal = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const openEditModal = (company: CompanyData) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const getThemeStyles = (company: CompanyData) => {
    if (company.theme) {
      const themes: Record<string, string> = {
        emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
        blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
        amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
        rose: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
        indigo: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400',
      };
      if (themes[company.theme]) return themes[company.theme];
    }

    // Fallback gradient based on name
    const gradients = [
      'from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-400',
      'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
      'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
      'from-indigo-500/20 to-cyan-500/20 border-indigo-500/30 text-indigo-400',
    ];
    return gradients[company.name.length % gradients.length];
  };

  const getPolicyLabel = (policy?: string) => {
    if (policy === 'email') return 'Email Only';
    if (policy === 'phone') return 'Phone & PIN';
    return 'Hybrid Auth';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Corporate Entities</h2>
          <p className="text-gray-400 text-sm">Manage all subsidiary companies and branch locations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-primary hover:bg-emerald-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-white shadow-lg shadow-primary/20"
          >
            <Building2 className="w-4 h-4" />
            Add Company
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {companies.map(company => {
            const style = getThemeStyles(company);
            const [bgGrad, border, textColor] = style.split(' border-');

            return (
              <div key={company.name} className="glass rounded-xl border border-white/5 overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                {/* Header Gradient */}
                <div className={`h-16 bg-gradient-to-br ${bgGrad} relative`}>
                  <div className="absolute top-2 right-2 p-1.5 bg-background/50 backdrop-blur-md rounded-md text-white hover:bg-white/20 cursor-pointer transition-colors">
                    <MoreVertical className="w-3 h-3" />
                  </div>
                </div>

                <div className="px-4 pb-4 pt-0 relative">
                  {/* Logo / Monogram */}
                  <div className={`w-12 h-12 -mt-6 mb-3 rounded-xl bg-background border-2 border-${border} flex items-center justify-center text-sm font-bold ${textColor} shadow-lg shadow-black/40 overflow-hidden`}>
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(company.name)
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-0.5 truncate" title={company.name}>{company.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-gray-300 w-max mb-3">
                    <Shield className="w-3 h-3 text-primary" />
                    <span>{getPolicyLabel(company.authPolicy)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4 border-b border-white/10 pb-3 truncate" title={company.location || 'Headquarters'}>
                    {company.location || 'Headquarters'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg">
                      <Users className={`w-3.5 h-3.5 ${textColor}`} />
                      <div>
                        <div className="text-[10px] text-gray-400 leading-none mb-0.5">Staff</div>
                        <div className="font-bold text-white text-xs leading-none">{company.count}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => openEditModal(company)}
                      className="text-xs font-medium text-primary hover:text-emerald-400 transition-colors"
                    >
                      Manage →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Company Entity</th>
                <th className="p-4">Location</th>
                <th className="p-4">Login Policy</th>
                <th className="p-4">Total Staff</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {companies.map(company => {
                const style = getThemeStyles(company);
                const [, border, textColor] = style.split(' border-');

                return (
                  <tr key={company.name} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-background border-2 border-${border} flex items-center justify-center text-xs font-bold ${textColor} overflow-hidden shrink-0`}>
                          {company.logoUrl ? (
                            <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(company.name)
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{company.name}</div>
                          {company.contactEmail && <div className="text-xs text-gray-400">{company.contactEmail}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{company.location || 'Headquarters'}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        {getPolicyLabel(company.authPolicy)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                        <Users className={`w-4 h-4 ${textColor}`} />
                        <span className="font-bold text-white text-sm">{company.count}</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => openEditModal(company)}
                        className="text-sm font-medium text-primary hover:text-emerald-400 transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CompanyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompany}
        initialData={editingCompany}
      />
    </div>
  );
}
