
import React, { useState, useMemo } from 'react';
import { Suggestion } from '../types';

interface AdminStatsProps {
  suggestions: Suggestion[];
}

const DIMENSIONS = [
  { key: 'current_status' as keyof Suggestion, label: 'STATUS', colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'] },
  { key: 'final_status' as keyof Suggestion, label: 'FINAL STATUS', colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'] },
  { key: 'owner' as keyof Suggestion, label: 'OWNER', colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'] },
  { key: 'area_to_work_on' as keyof Suggestion, label: 'AREA', colors: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'] },
  { key: 'evaluation' as keyof Suggestion, label: 'EVALUATION', colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'] },
  { key: 'category' as keyof Suggestion, label: 'CATEGORY', colors: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'] },
];

const AdminStats: React.FC<AdminStatsProps> = ({ suggestions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const statsData = useMemo(() => {
    return DIMENSIONS.map((dim) => {
      const counts: Record<string, number> = {};
      suggestions.forEach(s => {
        const val = (s[dim.key] as string) || 'Unassigned';
        counts[val] = (counts[val] || 0) + 1;
      });

      const items = Object.entries(counts)
        .map(([name, count], itemIdx) => ({
          name,
          count,
          color: dim.colors[itemIdx % dim.colors.length],
        }))
        .sort((a, b) => b.count - a.count);

      const maxCount = Math.max(...items.map(i => i.count), 0);

      return {
        ...dim,
        items,
        maxCount,
        totalInDim: items.reduce((acc, curr) => acc + curr.count, 0) || 0
      };
    });
  }, [suggestions]);

  return (
    <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[3rem] p-6 sm:p-10 shadow-inner flex flex-col space-y-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white h-24 w-24 rounded-3xl flex flex-col items-center justify-center shadow-xl border border-gray-100">
              <span className="text-3xl font-black text-gray-900">{suggestions.length}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Logs</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800 tracking-tight">Analytics Dashboard</h3>
            <p className="text-sm text-gray-500 font-medium">Distribution breakdown across key parameters</p>
          </div>
        </div>

        <div className="w-full max-w-md relative group">
          <input
            type="text"
            placeholder="Search parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-12 py-4 bg-white border-2 border-gray-100 rounded-[1.5rem] text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-gray-300 font-bold shadow-sm"
          />
          <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Bar Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((dim) => (
          <div 
            key={dim.label} 
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-blue-500 transition-colors">
                {dim.label}
              </h4>
              <span className="text-[10px] bg-gray-50 px-2 py-1 rounded-full text-gray-400 font-bold border border-gray-100">
                {dim.items.length} Metrics
              </span>
            </div>

            <div className="flex-grow space-y-4">
              {dim.items.map((item) => {
                const isMatch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());
                const widthPercentage = dim.maxCount > 0 ? (item.count / dim.maxCount) * 100 : 0;

                return (
                  <div 
                    key={item.name} 
                    className={`transition-opacity duration-300 ${searchTerm && !isMatch ? 'opacity-20' : 'opacity-100'}`}
                  >
                    <div className="flex justify-between items-end mb-1.5 px-1">
                      <span className="text-[11px] font-black text-gray-700 uppercase truncate pr-4">
                        {item.name}
                      </span>
                      <span className="text-[13px] font-mono font-black text-gray-900">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative group/bar"
                        style={{ 
                          width: `${widthPercentage}%`, 
                          backgroundColor: item.color,
                          transitionDelay: `${Math.random() * 200}ms`
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {dim.items.length === 0 && (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-xs text-gray-300 italic font-medium">No data points</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
               <div className="flex -space-x-1">
                 {dim.items.slice(0, 3).map((item, idx) => (
                   <div 
                     key={idx} 
                     className="w-4 h-4 rounded-full border-2 border-white" 
                     style={{ backgroundColor: item.color }}
                   ></div>
                 ))}
               </div>
               <span className="text-[10px] text-gray-300 font-bold uppercase">Dynamic Breakdown</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-3 bg-white/50 self-center px-10 py-4 rounded-full border border-gray-200 shadow-sm">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-200"></div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.25em]">
          Command Center Data Engine • Live Analytics
        </p>
      </div>
    </div>
  );
};

export default AdminStats;
