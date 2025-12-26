import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../context/ExamContext.tsx';
import { Play, Award, BarChart3, Clock, AlertTriangle, ChevronDown, BookOpen, X } from 'lucide-react';
import { MOCK_USER, EXAM_RULES } from '../constants.ts';
import { ExamType } from '../types.ts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useExam();
  const [selectedExamType, setSelectedExamType] = useState<ExamType>('JEE_MAIN');
  const [showRules, setShowRules] = useState(false);

  const startTest = () => {
    dispatch({ type: 'START_EXAM', payload: { examType: selectedExamType } });
    navigate('/exam');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-xl text-gray-800">AceRank</span>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Welcome, {MOCK_USER.name}</span>
            <img src={MOCK_USER.photo} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative p-6">
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {selectedExamType.replace('_', ' ')} Pattern
                        </div>
                        <h3 className="text-2xl font-bold text-white mt-8">Full Mock Test 01</h3>
                        <p className="text-blue-100">Physics, Chemistry, Maths</p>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2"><Clock size={16} /> 180 Minutes</div>
                            <div className="flex items-center gap-2"><Award size={16} /> 300 Marks</div>
                            <div className="flex items-center gap-2"><BarChart3 size={16} /> 75 Questions</div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Exam Target</label>
                            <div className="relative">
                                <select 
                                    value={selectedExamType}
                                    onChange={(e) => setSelectedExamType(e.target.value as ExamType)}
                                    className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                >
                                    <option value="JEE_MAIN">JEE Main</option>
                                    <option value="JEE_ADVANCED">JEE Advanced</option>
                                    <option value="NEET">NEET</option>
                                    <option value="CUSTOM">Custom Pattern</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-6 flex gap-3 items-start">
                             <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                             <div className="text-sm text-yellow-800">
                                 <span className="font-bold">Proctoring Enabled:</span> Camera and microphone monitored. Full-screen enforced.
                             </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={startTest} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Play size={20} /> Start Test Now
                            </button>
                            <button onClick={() => setShowRules(true)} className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <BookOpen size={20} /> View Rules
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4">Your Progress</h3>
                    <div className="space-y-4">
                        {['Physics', 'Chemistry', 'Maths'].map((sub, i) => (
                          <div key={sub}>
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">{sub}</span>
                                  <span className="font-bold text-gray-900">{[65, 42, 88][i]}%</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${['bg-purple-500', 'bg-green-500', 'bg-blue-500'][i]}`} style={{ width: `${[65, 42, 88][i]}%` }}></div>
                              </div>
                          </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </main>

      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRules(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Important Exam Instructions</h3>
              </div>
              <button onClick={() => setShowRules(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {EXAM_RULES.map((rule, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 font-bold rounded-full text-sm border border-blue-100">{idx + 1}</span>
                    <p className="text-gray-700 leading-relaxed text-sm pt-1">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setShowRules(false)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">I Understand</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;