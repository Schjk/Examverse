import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../context/ExamContext.tsx';
import { Play, Award, BarChart3, Clock, AlertTriangle, ChevronDown, BookOpen, X, Info } from 'lucide-react';
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
            <span className="font-bold text-xl text-gray-800 tracking-tight">AceRank</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{MOCK_USER.name}</p>
                <p className="text-xs text-gray-500">Roll: {MOCK_USER.rollNumber}</p>
            </div>
            <img src={MOCK_USER.photo} alt="Profile" className="w-10 h-10 rounded-full border-2 border-blue-100 object-cover shadow-sm" />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Available Mock Tests</h2>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase">Academic Session 2024-25</span>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="h-40 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 relative p-8">
                        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                            {selectedExamType.replace('_', ' ')} Target
                        </div>
                        <h3 className="text-3xl font-extrabold text-white mt-4 drop-shadow-sm">Full Length Mock Test #01</h3>
                        <p className="text-blue-100 font-medium flex items-center gap-2 mt-2">
                           <Info size={14} /> Comprehensive evaluation for Physics, Chemistry & Maths
                        </p>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                                <Clock className="mx-auto mb-2 text-blue-600" size={20} />
                                <span className="block text-xs text-gray-500 font-bold uppercase tracking-tighter">Duration</span>
                                <span className="text-sm font-bold text-gray-800">180 Min</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                                <Award className="mx-auto mb-2 text-green-600" size={20} />
                                <span className="block text-xs text-gray-500 font-bold uppercase tracking-tighter">Marks</span>
                                <span className="text-sm font-bold text-gray-800">300 Pts</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                                <BarChart3 className="mx-auto mb-2 text-purple-600" size={20} />
                                <span className="block text-xs text-gray-500 font-bold uppercase tracking-tighter">Items</span>
                                <span className="text-sm font-bold text-gray-800">75 Ques</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Configure Examination Pattern</label>
                            <div className="relative">
                                <select 
                                    value={selectedExamType}
                                    onChange={(e) => setSelectedExamType(e.target.value as ExamType)}
                                    className="block w-full appearance-none bg-white border-2 border-gray-100 text-gray-700 py-3.5 px-4 pr-10 rounded-xl leading-tight focus:outline-none focus:border-blue-500 transition-colors shadow-sm cursor-pointer font-medium"
                                >
                                    <option value="JEE_MAIN">JEE Main (CBT Style)</option>
                                    <option value="JEE_ADVANCED">JEE Advanced (Conceptual)</option>
                                    <option value="NEET">NEET (Speed Based)</option>
                                    <option value="CUSTOM">Customized Preparation</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-orange-50 border-2 border-orange-100 p-4 rounded-2xl mb-8 flex gap-4 items-center">
                             <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                                <AlertTriangle className="text-orange-600" size={20} />
                             </div>
                             <div className="text-sm text-orange-900 leading-tight">
                                 <span className="font-bold block">AI-Driven Proctoring Active</span>
                                 Environmental audio and video will be monitored to ensure exam integrity.
                             </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={startTest} className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200">
                                <Play size={22} fill="currentColor" /> Start Examination
                            </button>
                            <button onClick={() => setShowRules(true)} className="flex-1 py-4 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all group">
                                <BookOpen size={20} className="group-hover:text-blue-600 transition-colors" /> View Rules
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart3 size={18} className="text-blue-600" /> Topic Proficiency
                    </h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Physics', val: 65, col: 'bg-purple-500' },
                            { name: 'Chemistry', val: 42, col: 'bg-green-500' },
                            { name: 'Maths', val: 88, col: 'bg-blue-500' }
                        ].map((sub) => (
                          <div key={sub.name}>
                              <div className="flex justify-between text-sm mb-2">
                                  <span className="text-gray-600 font-medium">{sub.name}</span>
                                  <span className="font-bold text-gray-900">{sub.val}%</span>
                              </div>
                              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className={`h-full transition-all duration-1000 ${sub.col}`} style={{ width: `${sub.val}%` }}></div>
                              </div>
                          </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors uppercase tracking-widest">View Detailed Analytics</button>
                </div>

                <div className="bg-indigo-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award size={80} />
                    </div>
                    <h4 className="font-bold text-lg mb-2">AI Rank Predictor</h4>
                    <p className="text-indigo-200 text-xs mb-4">Complete 3 more mocks to unlock your estimated All India Rank.</p>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 1 ? 'bg-indigo-400' : 'bg-indigo-700'}`}></div>)}
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* Exam Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowRules(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-gray-900 leading-none">Examination Instructions</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Please read carefully</p>
                </div>
              </div>
              <button onClick={() => setShowRules(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
              <div className="space-y-6">
                {EXAM_RULES.map((rule, idx) => (
                  <div key={idx} className="flex gap-5 group">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 font-extrabold rounded-xl text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        {idx + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed text-sm pt-1 font-medium">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3">
              <button onClick={() => setShowRules(false)} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;