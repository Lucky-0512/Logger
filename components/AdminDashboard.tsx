
import React, { useState } from 'react';
import { Suggestion } from '../types';
import EditModal from './EditModal';
import AdminStats from './AdminStats';
import { getSuggestionInsights } from '../services/geminiService';

interface AdminDashboardProps {
  suggestions: Suggestion[];
  onUpdate: (id: string, updates: Partial<Suggestion>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ suggestions, onUpdate }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState('');

  const handleInsight = async () => {
    setIsInsightLoading(true);
    const result = await getSuggestionInsights(suggestions);
    setAiInsight(result);
    setIsInsightLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Command Center</h1>
          <p className="text-sm text-gray-500">Monitor activity and manage the master suggestion log.</p>
        </div>
        <button
          onClick={handleInsight}
          disabled={isInsightLoading || suggestions.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {isInsightLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          <span>{isInsightLoading ? 'Analyzing...' : 'Generate AI Insights'}</span>
        </button>
      </div>

      {aiInsight && (
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl relative shadow-sm">
          <button 
            onClick={() => setAiInsight('')}
            className="absolute top-3 right-3 text-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
          <div className="flex items-start space-x-4">
             <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-100">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
             </div>
             <div className="text-indigo-900 text-sm whitespace-pre-line prose max-w-none leading-relaxed">
               <strong className="text-indigo-800 text-base">Deep Analytics Insight:</strong><br/>
               {aiInsight}
             </div>
          </div>
        </div>
      )}

      {/* Analytics Grid */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest">Global Statistics Hub</span>
        </div>
        <AdminStats suggestions={suggestions} />
      </section>

      {/* Master Log Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Master Suggestion Log</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">{suggestions.length} total entries</span>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[2000px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider border-b">
                  <th className="px-4 py-4 sticky left-0 bg-gray-50 z-10 border-r">Action</th>
                  <th className="px-4 py-4 border-r">ID</th>
                  <th className="px-4 py-4 border-r">Date</th>
                  <th className="px-4 py-4 border-r min-w-[300px]">Description</th>
                  <th className="px-4 py-4 border-r">Category</th>
                  <th className="px-4 py-4 border-r min-w-[200px]">Benefit</th>
                  <th className="px-4 py-4 border-r">Area</th>
                  <th className="px-4 py-4 border-r">Emp ID</th>
                  <th className="px-4 py-4 border-r">Suggested By</th>
                  <th className="px-4 py-4 border-r bg-indigo-50/50 min-w-[150px]">Evaluation</th>
                  <th className="px-4 py-4 border-r bg-indigo-50/50">Status</th>
                  <th className="px-4 py-4 border-r bg-indigo-50/50">Reviewed</th>
                  <th className="px-4 py-4 border-r bg-indigo-50/50">Live Date</th>
                  <th className="px-4 py-4 border-r bg-indigo-50/50">Final Status</th>
                  <th className="px-4 py-4 border-r bg-indigo-50/50">Owner</th>
                  <th className="px-4 py-4 border-r bg-indigo-50/50">ETA</th>
                  <th className="px-4 py-4 border-r bg-indigo-50/50">Rev. Date</th>
                  <th className="px-4 py-4 border-r bg-indigo-50/50 min-w-[200px]">Conclusion</th>
                  <th className="px-4 py-4 bg-indigo-50/50 min-w-[250px]">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {suggestions.map((s, idx) => (
                  <tr 
                    key={s.id} 
                    className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                    onClick={() => setSelectedSuggestion(s)}
                  >
                    <td className="px-4 py-3 sticky left-0 z-10 bg-white group-hover:bg-indigo-50 transition-colors border-r">
                      <button className="text-indigo-600 hover:text-indigo-800 font-bold">Edit</button>
                    </td>
                    <td className="px-4 py-3 border-r font-mono text-[10px] text-gray-400">{s.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 border-r whitespace-nowrap text-gray-600">{s.date_of_suggestion}</td>
                    <td className="px-4 py-3 border-r truncate max-w-xs font-medium text-gray-800">{s.suggestion_description}</td>
                    <td className="px-4 py-3 border-r whitespace-nowrap">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.category === 'Automation' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                         {s.category}
                       </span>
                    </td>
                    <td className="px-4 py-3 border-r truncate max-w-[200px] text-gray-500">{s.benefit}</td>
                    <td className="px-4 py-3 border-r whitespace-nowrap text-gray-600">{s.area_to_work_on}</td>
                    <td className="px-4 py-3 border-r text-gray-500">{s.emp_id}</td>
                    <td className="px-4 py-3 border-r font-semibold text-gray-700 whitespace-nowrap">{s.suggested_by}</td>
                    
                    <td className="px-4 py-3 border-r italic text-gray-500">{s.evaluation || '-'}</td>
                    <td className="px-4 py-3 border-r font-medium text-indigo-700">{s.current_status || '-'}</td>
                    <td className="px-4 py-3 border-r text-gray-600">{s.reviewed || '-'}</td>
                    <td className="px-4 py-3 border-r text-gray-600">{s.went_live || '-'}</td>
                    <td className="px-4 py-3 border-r font-bold text-gray-800 uppercase text-[11px]">{s.final_status || '-'}</td>
                    <td className="px-4 py-3 border-r text-indigo-600 font-medium">{s.owner || '-'}</td>
                    <td className="px-4 py-3 border-r text-gray-600">{s.tentative_eta || '-'}</td>
                    <td className="px-4 py-3 border-r text-gray-600">{s.revised_date || '-'}</td>
                    <td className="px-4 py-3 border-r text-gray-500 text-xs italic">{s.conclusion || '-'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{s.remarks || '-'}</td>
                  </tr>
                ))}
                {suggestions.length === 0 && (
                  <tr>
                    <td colSpan={20} className="px-4 py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-400 font-medium">No suggestions to display yet.</p>
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
    </div>
  );
};

export default AdminDashboard;
