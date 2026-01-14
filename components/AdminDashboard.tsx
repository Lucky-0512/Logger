
import React, { useState } from 'react';
import { Suggestion, AreaToWorkOn } from '../types';
import EditModal from './EditModal';
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master Suggestion Log</h1>
          <p className="text-sm text-gray-500">Manage, evaluate, and update employee feedback.</p>
        </div>
        <button
          onClick={handleInsight}
          disabled={isInsightLoading || suggestions.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-all flex items-center space-x-2 disabled:opacity-50"
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
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl relative">
          <button 
            onClick={() => setAiInsight('')}
            className="absolute top-2 right-2 text-purple-400 hover:text-purple-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
          <div className="flex items-start space-x-3">
             <span className="text-2xl">💡</span>
             <div className="text-purple-800 text-sm whitespace-pre-line prose max-w-none">
               <strong>AI-Generated Trends & Analysis:</strong><br/>
               {aiInsight}
             </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[2000px]">
            <thead>
              <tr className="bg-blue-600 text-white text-xs uppercase tracking-wider">
                <th className="px-4 py-3 sticky left-0 bg-blue-600 z-10 border-r border-blue-500">Action</th>
                <th className="px-4 py-3 border-r border-blue-500">ID</th>
                <th className="px-4 py-3 border-r border-blue-500">Date</th>
                <th className="px-4 py-3 border-r border-blue-500 min-w-[300px]">Description</th>
                <th className="px-4 py-3 border-r border-blue-500">Category</th>
                <th className="px-4 py-3 border-r border-blue-500 min-w-[200px]">Benefit</th>
                <th className="px-4 py-3 border-r border-blue-500">Area</th>
                <th className="px-4 py-3 border-r border-blue-500">Emp ID</th>
                <th className="px-4 py-3 border-r border-blue-500">Suggested By</th>
                {/* Admin Columns */}
                <th className="px-4 py-3 border-r border-blue-500 bg-blue-700 min-w-[150px]">Evaluation</th>
                <th className="px-4 py-3 border-r border-blue-500 bg-blue-700">Status</th>
                <th className="px-4 py-3 border-r border-blue-500 bg-blue-700">Reviewed</th>
                <th className="px-4 py-3 border-r border-blue-500 bg-blue-700">Live Date</th>
                <th className="px-4 py-3 border-r border-blue-500 bg-blue-700">Final Status</th>
                <th className="px-4 py-3 border-r border-blue-500 bg-blue-700">Owner</th>
                <th className="px-4 py-3 border-r border-blue-500 bg-blue-700">ETA</th>
                <th className="px-4 py-3 border-r border-blue-500 bg-blue-700">Rev. Date</th>
                <th className="px-4 py-3 border-r border-blue-500 bg-blue-700 min-w-[200px]">Conclusion</th>
                <th className="px-4 py-3 bg-blue-700 min-w-[250px]">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {suggestions.map((s, idx) => (
                <tr 
                  key={s.id} 
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors cursor-pointer group`}
                  onClick={() => setSelectedSuggestion(s)}
                >
                  <td className="px-4 py-3 sticky left-0 z-10 bg-inherit border-r group-hover:bg-blue-100 transition-colors">
                    <button className="text-blue-600 hover:text-blue-800 font-bold underline">Edit</button>
                  </td>
                  <td className="px-4 py-3 border-r font-mono text-xs">{s.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 border-r whitespace-nowrap">{s.date_of_suggestion}</td>
                  <td className="px-4 py-3 border-r truncate max-w-xs">{s.suggestion_description}</td>
                  <td className="px-4 py-3 border-r whitespace-nowrap">{s.category}</td>
                  <td className="px-4 py-3 border-r truncate max-w-[200px]">{s.benefit}</td>
                  <td className="px-4 py-3 border-r whitespace-nowrap">{s.area_to_work_on}</td>
                  <td className="px-4 py-3 border-r">{s.emp_id}</td>
                  <td className="px-4 py-3 border-r font-medium whitespace-nowrap">{s.suggested_by}</td>
                  {/* Admin Values */}
                  <td className="px-4 py-3 border-r italic text-gray-500">{s.evaluation || '-'}</td>
                  <td className="px-4 py-3 border-r">{s.current_status || '-'}</td>
                  <td className="px-4 py-3 border-r">{s.reviewed || '-'}</td>
                  <td className="px-4 py-3 border-r">{s.went_live || '-'}</td>
                  <td className="px-4 py-3 border-r">{s.final_status || '-'}</td>
                  <td className="px-4 py-3 border-r">{s.owner || '-'}</td>
                  <td className="px-4 py-3 border-r">{s.tentative_eta || '-'}</td>
                  <td className="px-4 py-3 border-r">{s.revised_date || '-'}</td>
                  <td className="px-4 py-3 border-r italic text-gray-500">{s.conclusion || '-'}</td>
                  <td className="px-4 py-3">{s.remarks || '-'}</td>
                </tr>
              ))}
              {suggestions.length === 0 && (
                <tr>
                  <td colSpan={20} className="px-4 py-12 text-center text-gray-400">
                    No suggestions found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
