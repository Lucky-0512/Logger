
import React, { useState } from 'react';
import { Suggestion, AreaToWorkOn } from '../types';

interface EditModalProps {
  suggestion: Suggestion;
  onClose: () => void;
  onSave: (updates: Partial<Suggestion>) => void;
}

const EVALUATION_OPTIONS = ['Actionable', 'NA'];
const STATUS_OPTIONS = ['Out of Scope', 'completed', 'internal resolution', 'in queue', 'WIP'];
const FINAL_STATUS_OPTIONS = ['closed', 'open'];

const EditModal: React.FC<EditModalProps> = ({ suggestion, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Suggestion>>({
    evaluation: suggestion.evaluation,
    current_status: suggestion.current_status,
    reviewed: suggestion.reviewed,
    conclusion: suggestion.conclusion,
    went_live: suggestion.went_live,
    final_status: suggestion.final_status,
    owner: suggestion.owner,
    tentative_eta: suggestion.tentative_eta,
    revised_date: suggestion.revised_date,
    remarks: suggestion.remarks,
    area_to_work_on: suggestion.area_to_work_on,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-blue-50 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Edit Suggestion Record</h3>
            <p className="text-sm text-gray-500">ID: {suggestion.id} | By: {suggestion.suggested_by}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Original Suggestion</h4>
            <p className="text-gray-700 mb-2 font-medium">{suggestion.suggestion_description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <span><b>Benefit:</b> {suggestion.benefit}</span>
              <span><b>Area:</b> {suggestion.area_to_work_on}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status</label>
              <select 
                name="current_status" 
                value={formData.current_status} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Status</option>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Final Status</label>
              <select 
                name="final_status" 
                value={formData.final_status} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Final Status</option>
                {FINAL_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Owner</label>
              <input name="owner" value={formData.owner} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Department Head" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Area</label>
              <select name="area_to_work_on" value={formData.area_to_work_on} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                {Object.values(AreaToWorkOn).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Went Live</label>
              <input type="date" name="went_live" value={formData.went_live} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Reviewed By</label>
              <input name="reviewed" value={formData.reviewed} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Tentative ETA</label>
              <input type="date" name="tentative_eta" value={formData.tentative_eta} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Revised Date</label>
              <input type="date" name="revised_date" value={formData.revised_date} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Evaluation</label>
              <select 
                name="evaluation" 
                value={formData.evaluation} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Evaluation</option>
                {EVALUATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Conclusion</label>
              <textarea name="conclusion" rows={3} value={formData.conclusion} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Final conclusion and outcome details..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Remarks</label>
              <textarea name="remarks" rows={3} value={formData.remarks} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Admin remarks..." />
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end space-x-4 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">Cancel</button>
          <button 
            onClick={() => onSave(formData)} 
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
