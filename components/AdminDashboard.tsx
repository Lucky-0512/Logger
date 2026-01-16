
import React, { useState, useMemo } from 'react';
import { Suggestion, Category, AreaToWorkOn } from '../types';
import EditModal from './EditModal';
import AdminStats from './AdminStats';
import { getSuggestionInsights } from '../services/geminiService';

interface AdminDashboardProps {
  suggestions: Suggestion[];
  onUpdate: (id: string, updates: Partial<Suggestion>) => void;
}

interface TableFilters {
  id: string;
  description: string;
  category: string;
  area: string;
  suggestedBy: string;
  status: string;
  finalStatus: string;
  owner: string;
  reviewed: string;
  evaluation: string;
  conclusion: string;
  wentLive: string;
  eta: string;
  revised: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ suggestions, onUpdate }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<TableFilters>({
    id: '',
    description: '',
    category: '',
    area: '',
    suggestedBy: '',
    status: '',
    finalStatus: '',
    owner: '',
    reviewed: '',
    evaluation: '',
    conclusion: '',
    wentLive: '',
    eta: '',
    revised: ''
  });

  const handleInsight = async () => {
    setIsInsightLoading(true);
    const result = await getSuggestionInsights(suggestions);
    setAiInsight(result);
    setIsInsightLoading(false);
  };

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(s => {
      return (
        s.id.toLowerCase().includes(filters.id.toLowerCase()) &&
        s.suggestion_description.toLowerCase().includes(filters.description.toLowerCase()) &&
        (filters.category === '' || s.category === filters.category) &&
        (filters.area === '' || s.area_to_work_on === filters.area) &&
        s.suggested_by.toLowerCase().includes(filters.suggestedBy.toLowerCase()) &&
        (filters.status === '' || (s.current_status || '').toLowerCase().includes(filters.status.toLowerCase())) &&
        (filters.finalStatus === '' || (s.final_status || '').toLowerCase().includes(filters.finalStatus.toLowerCase())) &&
        (s.owner || '').toLowerCase().includes(filters.owner.toLowerCase()) &&
        (s.reviewed || '').toLowerCase().includes(filters.reviewed.toLowerCase()) &&
        (filters.evaluation === '' || (s.evaluation || '').toLowerCase().includes(filters.evaluation.toLowerCase())) &&
        (s.conclusion || '').toLowerCase().includes(filters.conclusion.toLowerCase()) &&
        (s.went_live || '').includes(filters.wentLive) &&
        (s.tentative_eta || '').includes(filters.eta) &&
        (s.revised_date || '').includes(filters.revised)
      );
    });
  }, [suggestions, filters]);

  const updateFilter = (key: keyof TableFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      id: '',
      description: '',
      category: '',
      area: '',
      suggestedBy: '',
      status: '',
      finalStatus: '',
      owner: '',
      reviewed: '',
      evaluation: '',
      conclusion: '',
      wentLive: '',
      eta: '',
      revised: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Command Center</h1>
          <p className="text-sm text-gray-500 font-medium">Monitor activity and manage the master suggestion log.</p>
        </div>
        <button
          onClick={handleInsight}
          disabled={isInsightLoading || suggestions.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 transition-all flex items-center space-x-2 disabled:opacity-50 active:scale-95"
        >
          {isInsightLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          <span>{isInsightLoading ? 'Analyzing...' : 'Generate AI Insights'}</span>
        </button>
      </div>

      {aiInsight && (
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-[2.5rem] relative shadow-sm animate-in slide-in-from-top-4 duration-300">
          <button 
            onClick={() => setAiInsight('')}
            className="absolute top-4 right-4 text-indigo-300 hover:text-indigo-600 transition-colors bg-white p-1 rounded-full shadow-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
          <div className="flex items-start space-x-5">
             <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
             </div>
             <div className="text-indigo-900 text-sm whitespace-pre-line prose max-w-none leading-relaxed">
               <div className="flex items-center space-x-2 mb-2">
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Intelligent Analysis</span>
                 <div className="h-[1px] flex-grow bg-indigo-100"></div>
               </div>
               <h4 className="text-indigo-800 font-black text-lg mb-2">Operational Suggestions Audit</h4>
               {aiInsight}
             </div>
          </div>
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Intelligence Portal</span>
        </div>
        <AdminStats suggestions={suggestions} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-900 text-white p-2 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Master Suggestion Log</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {filteredSuggestions.length} of {suggestions.length} entries shown
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                Clear Filters
              </button>
            )}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-2xl transition-all shadow-lg flex items-center space-x-2 ${showFilters ? 'bg-indigo-600 text-white scale-105' : 'bg-white text-gray-400 hover:text-indigo-600 border border-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">{showFilters ? 'Active Filters' : 'Filter View'}</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[3200px]">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                  <th className="px-6 py-5 sticky left-0 bg-gray-50 z-20 border-r border-gray-100">Action</th>
                  <th className="px-6 py-5 border-r border-gray-100">ID</th>
                  <th className="px-6 py-5 border-r border-gray-100">Date</th>
                  <th className="px-6 py-5 border-r border-gray-100 min-w-[400px]">Description</th>
                  <th className="px-6 py-5 border-r border-gray-100">Category</th>
                  <th className="px-6 py-5 border-r border-gray-100 min-w-[250px]">Benefit</th>
                  <th className="px-6 py-5 border-r border-gray-100">Area</th>
                  <th className="px-6 py-5 border-r border-gray-100">Emp ID</th>
                  <th className="px-6 py-5 border-r border-gray-100">Suggested By</th>
                  <th className="px-6 py-5 border-r border-gray-100 bg-indigo-50/20">Evaluation</th>
                  <th className="px-6 py-5 border-r border-gray-100 bg-indigo-50/20">Status</th>
                  <th className="px-6 py-5 border-r border-gray-100 bg-indigo-50/20">Reviewed By</th>
                  <th className="px-6 py-5 border-r border-gray-100 bg-indigo-50/20">Conclusion</th>
                  <th className="px-6 py-5 border-r border-gray-100 bg-indigo-50/20">Went Live</th>
                  <th className="px-6 py-5 border-r border-gray-100 bg-indigo-50/20">Final Status</th>
                  <th className="px-6 py-5 border-r border-gray-100 bg-indigo-50/20">Owner</th>
                  <th className="px-6 py-5 border-r border-gray-100 bg-indigo-50/20">Tentative ETA</th>
                  <th className="px-6 py-5 border-r border-gray-100 bg-indigo-50/20">Revised Date</th>
                  <th className="px-6 py-5 bg-indigo-50/20">Remarks</th>
                </tr>
                
                {showFilters && (
                  <tr className="bg-white border-b border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <td className="px-4 py-3 sticky left-0 bg-white z-20 border-r"></td>
                    <td className="px-4 py-3 border-r">
                      <input className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="Search ID..." value={filters.id} onChange={(e) => updateFilter('id', e.target.value)} />
                    </td>
                    <td className="px-4 py-3 border-r"></td>
                    <td className="px-4 py-3 border-r">
                      <input className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="Search Description..." value={filters.description} onChange={(e) => updateFilter('description', e.target.value)} />
                    </td>
                    <td className="px-4 py-3 border-r">
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[10px] font-black uppercase focus:ring-2 focus:ring-indigo-100 outline-none" value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
                        <option value="">All Categories</option>
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 border-r"></td>
                    <td className="px-4 py-3 border-r">
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[10px] font-black uppercase focus:ring-2 focus:ring-indigo-100 outline-none" value={filters.area} onChange={(e) => updateFilter('area', e.target.value)}>
                        <option value="">All Areas</option>
                        {Object.values(AreaToWorkOn).map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 border-r"></td>
                    <td className="px-4 py-3 border-r">
                      <input className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="Search Name..." value={filters.suggestedBy} onChange={(e) => updateFilter('suggestedBy', e.target.value)} />
                    </td>
                    {/* Admin Field Filters */}
                    <td className="px-4 py-3 border-r bg-indigo-50/10">
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[10px] font-black uppercase focus:ring-2 focus:ring-indigo-100 outline-none" value={filters.evaluation} onChange={(e) => updateFilter('evaluation', e.target.value)}>
                        <option value="">All Evaluations</option>
                        <option value="Actionable">Actionable</option>
                        <option value="NA">NA</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 border-r bg-indigo-50/10">
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[10px] font-black uppercase focus:ring-2 focus:ring-indigo-100 outline-none" value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
                        <option value="">Any Status</option>
                        <option value="completed">completed</option>
                        <option value="in queue">in queue</option>
                        <option value="WIP">WIP</option>
                        <option value="Out of Scope">Out of Scope</option>
                        <option value="internal resolution">internal resolution</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 border-r bg-indigo-50/10">
                      <input className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="Reviewed by..." value={filters.reviewed} onChange={(e) => updateFilter('reviewed', e.target.value)} />
                    </td>
                    <td className="px-4 py-3 border-r bg-indigo-50/10">
                      <input className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="Conclusion..." value={filters.conclusion} onChange={(e) => updateFilter('conclusion', e.target.value)} />
                    </td>
                    <td className="px-4 py-3 border-r bg-indigo-50/10">
                      <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="YYYY-MM-DD" value={filters.wentLive} onChange={(e) => updateFilter('wentLive', e.target.value)} />
                    </td>
                    <td className="px-4 py-3 border-r bg-indigo-50/10">
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[10px] font-black uppercase focus:ring-2 focus:ring-indigo-100 outline-none" value={filters.finalStatus} onChange={(e) => updateFilter('finalStatus', e.target.value)}>
                        <option value="">Final Status</option>
                        <option value="open">open</option>
                        <option value="closed">closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 border-r bg-indigo-50/10">
                      <input className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="Owner..." value={filters.owner} onChange={(e) => updateFilter('owner', e.target.value)} />
                    </td>
                    <td className="px-4 py-3 border-r bg-indigo-50/10">
                       <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="ETA..." value={filters.eta} onChange={(e) => updateFilter('eta', e.target.value)} />
                    </td>
                    <td className="px-4 py-3 border-r bg-indigo-50/10">
                       <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="Revised..." value={filters.revised} onChange={(e) => updateFilter('revised', e.target.value)} />
                    </td>
                    <td className="px-4 py-3 bg-indigo-50/10"></td>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-50 text-[13px]">
                {filteredSuggestions.map((s) => (
                  <tr 
                    key={s.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedSuggestion(s)}
                  >
                    <td className="px-6 py-5 sticky left-0 z-10 bg-white group-hover:bg-gray-50 transition-colors border-r border-gray-100">
                      <button className="text-indigo-600 hover:text-indigo-900 font-black text-[11px] uppercase tracking-wider underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-600">
                        Edit Record
                      </button>
                    </td>
                    <td className="px-6 py-5 border-r border-gray-100 font-mono text-[10px] text-gray-400">{s.id.slice(0, 8)}</td>
                    <td className="px-6 py-5 border-r border-gray-100 whitespace-nowrap text-gray-500 font-bold">{s.date_of_suggestion}</td>
                    <td className="px-6 py-5 border-r border-gray-100 font-bold text-gray-900 leading-snug">{s.suggestion_description}</td>
                    <td className="px-6 py-5 border-r border-gray-100 whitespace-nowrap">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${s.category === 'Automation' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                         {s.category}
                       </span>
                    </td>
                    <td className="px-6 py-5 border-r border-gray-100 text-gray-500 font-medium leading-relaxed">{s.benefit}</td>
                    <td className="px-6 py-5 border-r border-gray-100 whitespace-nowrap text-gray-600 font-black uppercase text-[10px]">{s.area_to_work_on}</td>
                    <td className="px-6 py-5 border-r border-gray-100 text-gray-400 font-mono text-xs">{s.emp_id}</td>
                    <td className="px-6 py-5 border-r border-gray-100 font-black text-gray-800 whitespace-nowrap uppercase tracking-tight">{s.suggested_by}</td>
                    
                    {/* Admin Data Columns */}
                    <td className="px-6 py-5 border-r border-gray-100 text-gray-600 font-bold bg-indigo-50/10">{s.evaluation || '-'}</td>
                    <td className="px-6 py-5 border-r border-gray-100 font-black text-indigo-600 uppercase text-[10px] bg-indigo-50/10">
                      {s.current_status ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                          <span>{s.current_status}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-5 border-r border-gray-100 text-gray-600 bg-indigo-50/10">{s.reviewed || '-'}</td>
                    <td className="px-6 py-5 border-r border-gray-100 text-gray-600 font-medium max-w-[300px] truncate bg-indigo-50/10">{s.conclusion || '-'}</td>
                    <td className="px-6 py-5 border-r border-gray-100 text-gray-500 bg-indigo-50/10">{s.went_live || '-'}</td>
                    <td className="px-6 py-5 border-r border-gray-100 font-black text-gray-900 uppercase text-[10px] bg-indigo-50/10">{s.final_status || '-'}</td>
                    <td className="px-6 py-5 border-r border-gray-100 text-indigo-700 font-black uppercase text-[10px] bg-indigo-50/10">{s.owner || '-'}</td>
                    <td className="px-6 py-5 border-r border-gray-100 text-gray-500 bg-indigo-50/10">{s.tentative_eta || '-'}</td>
                    <td className="px-6 py-5 border-r border-gray-100 text-gray-500 bg-indigo-50/10">{s.revised_date || '-'}</td>
                    <td className="px-6 py-5 text-gray-400 text-xs italic bg-indigo-50/10">{s.remarks || '-'}</td>
                  </tr>
                ))}
                {filteredSuggestions.length === 0 && (
                  <tr>
                    <td colSpan={19} className="px-4 py-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200">
                          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-900 font-black uppercase tracking-widest">No matching results</p>
                          <p className="text-gray-400 text-sm font-medium">Try adjusting your filters or search terms.</p>
                        </div>
                        <button onClick={resetFilters} className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95">
                          Clear Search
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selectedSuggestion && (
        <EditModal 
          suggestion={selectedSuggestion} 
          onClose={() => setSelectedSuggestion(null)} 
          onSave={(updates) => {
            onUpdate(selectedSuggestion.id, updates);
            setSelectedSuggestion(null);
          }} 
        />
      )}

      <div className="flex items-center justify-center space-x-3 bg-gray-50 self-center px-10 py-5 rounded-full border border-gray-200 shadow-sm border-dashed">
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-lg shadow-indigo-200"></div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
          Master Control System • Data Grid v2.1
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
