import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useExam } from '../context/ExamContext';
import { Play, Award, BarChart3, Clock, AlertTriangle, ChevronDown } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { ExamType } from '../types';

const Dashboard: React.FC = () => {
  const history = useHistory();
  const { dispatch } = useExam();
  const [selectedExamType, setSelectedExamType] = useState<ExamType>('JEE_MAIN');

  const startTest = () => {
    dispatch({ type: 'START_EXAM', payload: { examType: selectedExamType } });
    history.push('/exam');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Col: Upcoming Tests */}
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
                                 <span className="font-bold">Proctoring Enabled:</span> This test uses AI-based proctoring. Your camera and microphone will be monitored. Full-screen mode is enforced.
                             </div>
                        </div>

                        <button 
                            onClick={startTest}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <Play size={20} /> Start Test Now
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-between items-center opacity-75">
                    <div>
                        <h4 className="font-bold text-gray-800">Chapter Test: Electrostatics</h4>
                        <p className="text-sm text-gray-500">Physics • 25 Questions</p>
                    </div>
                    <button disabled className="px-4 py-2 border border-gray-300 rounded text-gray-400 text-sm">Locked</button>
                </div>
            </div>

            {/* Right Col: Stats */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4">Your Progress</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Physics</span>
                                <span className="font-bold text-gray-900">65%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[65%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Chemistry</span>
                                <span className="font-bold text-gray-900">42%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[42%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Maths</span>
                                <span className="font-bold text-gray-900">88%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[88%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
                        <p className="text-indigo-200 text-sm mb-4">Get unlimited AI analysis and access to 10,000+ premium questions.</p>
                        <button className="px-4 py-2 bg-white text-indigo-900 text-sm font-bold rounded hover:bg-indigo-50">View Plans</button>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-700 rounded-full opacity-50"></div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;