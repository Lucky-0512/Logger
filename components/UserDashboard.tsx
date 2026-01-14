
import React, { useState } from 'react';
import { User, Suggestion, Category, AreaToWorkOn } from '../types';
import { polishSuggestion } from '../services/geminiService';

interface UserDashboardProps {
  currentUser: User;
  onSubmit: (suggestion: Omit<Suggestion, 'id' | 'date_of_suggestion' | 'emp_id' | 'suggested_by'>) => void;
  mySuggestions: Suggestion[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser, onSubmit, mySuggestions }) => {
  const [description, setDescription] = useState('');
  const [benefit, setBenefit] = useState('');
  const [area, setArea] = useState<AreaToWorkOn>(AreaToWorkOn.GENERAL);
  const [category, setCategory] = useState<Category>(Category.PROCESS_ENHANCEMENT);
  const [isPolishing, setIsPolishing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      suggestion_description: description,
      category: category,
      benefit,
      area_to_work_on: area,
      evaluation: '',
      current_status: '',
      reviewed: '',
      conclusion: '',
      went_live: '',
      final_status: '',
      owner: '',
      tentative_eta: '',
      revised_date: '',
      remarks: ''
    });
    setDescription('');
    setBenefit('');
    setArea(AreaToWorkOn.GENERAL);
    setCategory(Category.PROCESS_ENHANCEMENT);
    alert('Suggestion submitted successfully!');
  };

  const handleAIImprove = async () => {
    if (!description) return;
    setIsPolishing(true);
    const polished = await polishSuggestion(description);
    setDescription(polished);
    setIsPolishing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Submit Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Submit New Suggestion
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-700">Suggestion Description</label>
              <button 
                type="button" 
                onClick={handleAIImprove}
                disabled={isPolishing || !description}
                className="text-xs text-blue-600 font-medium hover:text-blue-800 disabled:opacity-50 flex items-center"
              >
                {isPolishing ? 'Working...' : '✨ Polish with AI'}
              </button>
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Describe your idea clearly..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Area to Work On</label>
              <select
                required
                value={area}
                onChange={(e) => setArea(e.target.value as AreaToWorkOn)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.values(AreaToWorkOn).map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Benefit</label>
            <input
              type="text"
              required
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="How will this help the organization?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors"
          >
            Submit Suggestion
          </button>
        </form>
      </div>

      {/* Recent History */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-800">My Recent Suggestions</h2>
        <div className="flex-grow space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {mySuggestions.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No suggestions submitted yet.</p>
            </div>
          ) : (
            mySuggestions.map(s => (
              <div key={s.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded uppercase">
                    {s.area_to_work_on}
                  </span>
                  <span className="text-xs text-gray-400">{s.date_of_suggestion}</span>
                </div>
                <p className="text-gray-800 font-medium line-clamp-2 mb-2">{s.suggestion_description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex flex-col">
                    <span>Category: <b>{s.category}</b></span>
                    <span>Status: <b className={s.current_status ? 'text-blue-600' : 'italic text-gray-400'}>{s.current_status || 'Pending Review'}</b></span>
                  </div>
                  {s.owner && <span>Owner: <b>{s.owner}</b></span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
