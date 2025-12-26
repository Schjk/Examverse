import React, { useEffect, useState } from 'react';
import { useExam } from '../../context/ExamContext';
import { analyzePerformance, generateQuestionExplanation } from '../../services/geminiService';
import { AnalysisResult, Question } from '../../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle, Brain } from 'lucide-react';
import { useHistory } from 'react-router-dom';

const Analysis: React.FC = () => {
  const { state } = useExam();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const history = useHistory();

  useEffect(() => {
    const runAnalysis = async () => {
      // Basic Stats Calculation
      let correct = 0;
      let incorrect = 0;
      let unattempted = 0;
      let score = 0;

      state.questions.forEach(q => {
        const ua = state.userAnswers[q.id];
        if (!ua || !ua.answer) {
          unattempted++;
        } else if (ua.answer === q.correctAnswer) {
          correct++;
          score += 4;
        } else {
          incorrect++;
          score -= 1;
        }
      });

      // AI Analysis
      const aiResult = await analyzePerformance(state.questions, state.userAnswers);

      setAnalysis({
        score,
        totalQuestions: state.questions.length,
        correctCount: correct,
        incorrectCount: incorrect,
        unattemptedCount: unattempted,
        accuracy: (correct / (correct + incorrect || 1)) * 100,
        weakTopics: aiResult.weakTopics || [],
        strongTopics: aiResult.strongTopics || [],
        aiRecommendations: aiResult.aiRecommendations || "No recommendations generated.",
        improvementPlan: aiResult.improvementPlan || ""
      });
      setLoading(false);
    };

    runAnalysis();
  }, [state.questions, state.userAnswers]);

  const handleExplain = async (q: Question) => {
    if (aiExplanations[q.id]) return;
    
    setAiExplanations(prev => ({ ...prev, [q.id]: "Generating explanation..." }));
    const ua = state.userAnswers[q.id];
    const text = await generateQuestionExplanation(q, ua?.answer || null);
    setAiExplanations(prev => ({ ...prev, [q.id]: text }));
  };

  const toggleExpand = (id: string) => {
      setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-blue-600 font-bold text-xl animate-pulse">Running AI Performance Analysis...</div>;

  if (!analysis) return <div>Error loading analysis.</div>;

  const pieData = [
    { name: 'Correct', value: analysis.correctCount, color: '#22c55e' },
    { name: 'Incorrect', value: analysis.incorrectCount, color: '#ef4444' },
    { name: 'Unattempted', value: analysis.unattemptedCount, color: '#94a3b8' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Exam Analysis Report</h1>
                <p className="text-gray-500">JEE Main Full Mock Test 01 • {new Date().toLocaleDateString()}</p>
            </div>
            <button onClick={() => history.push('/')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back to Dashboard</button>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-gray-500 text-sm font-medium">TOTAL SCORE</div>
                <div className="text-4xl font-bold text-blue-600 mt-2">{analysis.score}<span className="text-lg text-gray-400">/300</span></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-gray-500 text-sm font-medium">ACCURACY</div>
                <div className="text-4xl font-bold text-green-600 mt-2">{Math.round(analysis.accuracy)}%</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-gray-500 text-sm font-medium">PERCENTILE (Est.)</div>
                <div className="text-4xl font-bold text-purple-600 mt-2">94.5</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-gray-500 text-sm font-medium">ATTEMPTED</div>
                <div className="text-4xl font-bold text-gray-800 mt-2">{analysis.correctCount + analysis.incorrectCount}<span className="text-lg text-gray-400">/{analysis.totalQuestions}</span></div>
            </div>
        </div>

        {/* AI Insights & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Charts */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Attempt Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Right: AI Feedback */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain size={120} />
                </div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-indigo-900 mb-4">
                    <Brain className="text-indigo-600" /> Gemini Analysis
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-indigo-800 text-sm uppercase tracking-wide">Strategic Advice</h4>
                        <p className="text-gray-700 mt-1 leading-relaxed">{analysis.aiRecommendations}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <h4 className="font-bold text-red-700 text-sm mb-2">Weak Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.weakTopics.map(t => (
                                    <span key={t} className="px-2 py-1 bg-white text-red-600 text-xs rounded border border-red-200">{t}</span>
                                ))}
                                {analysis.weakTopics.length === 0 && <span className="text-xs text-gray-500">None detected</span>}
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h4 className="font-bold text-green-700 text-sm mb-2">Strong Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.strongTopics.map(t => (
                                    <span key={t} className="px-2 py-1 bg-white text-green-600 text-xs rounded border border-green-200">{t}</span>
                                ))}
                                {analysis.strongTopics.length === 0 && <span className="text-xs text-gray-500">None detected</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Question Review */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-800">Detailed Question Review</h3>
            </div>
            <div className="divide-y divide-gray-100">
                {state.questions.map((q, index) => {
                    const ua = state.userAnswers[q.id];
                    const isCorrect = ua?.answer === q.correctAnswer;
                    const isSkipped = !ua || !ua.answer;
                    
                    return (
                        <div key={q.id} className="group">
                            <div 
                                onClick={() => toggleExpand(q.id)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-sm font-medium text-gray-600">{index + 1}</span>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-lg">{q.text}</div>
                                        <div className="text-xs text-gray-500 flex gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-gray-100 rounded">{q.subject}</span>
                                            <span className="px-2 py-0.5 bg-gray-100 rounded">{q.topic}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1">
                                            {isSkipped ? (
                                                <span className="text-gray-400 flex items-center gap-1 text-sm"><AlertCircle size={16}/> Skipped</span>
                                            ) : isCorrect ? (
                                                <span className="text-green-600 flex items-center gap-1 text-sm"><CheckCircle size={16}/> Correct</span>
                                            ) : (
                                                <span className="text-red-500 flex items-center gap-1 text-sm"><XCircle size={16}/> Incorrect</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-400">{ua?.timeSpent || 0}s</div>
                                    </div>
                                    {expandedQuestion === q.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedQuestion === q.id && (
                                <div className="p-6 bg-gray-50 border-t border-gray-100">
                                    <div className="mb-4">
                                        <h4 className="font-bold text-sm text-gray-700 mb-2">Question:</h4>
                                        <p className="text-gray-800 leading-relaxed">{q.text}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-700 mb-2">Your Answer:</h4>
                                            <div className={`p-3 rounded border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : isSkipped ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                                {isSkipped ? 'Not Attempted' : (q.options ? q.options[parseInt(ua.answer!)] : ua.answer)}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-700 mb-2">Correct Answer:</h4>
                                            <div className="p-3 rounded border bg-green-50 border-green-200 text-green-800">
                                                {q.options ? q.options[parseInt(q.correctAnswer)] : q.correctAnswer}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                        <h4 className="font-bold text-sm text-blue-800 mb-1">Standard Solution:</h4>
                                        <p className="text-blue-900 text-sm">{q.solution || "Solution not provided in standard key."}</p>
                                    </div>

                                    {/* AI Explanation Section */}
                                    <div className="mt-4">
                                        {!aiExplanations[q.id] ? (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleExplain(q); }}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded shadow-sm hover:bg-indigo-700 text-sm font-medium transition-colors"
                                            >
                                                <Brain size={16} /> Ask Gemini AI to Explain
                                            </button>
                                        ) : (
                                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                                <h4 className="font-bold text-sm text-indigo-800 mb-2 flex items-center gap-2"><Brain size={16}/> Gemini AI Explanation:</h4>
                                                <p className="text-indigo-900 text-sm whitespace-pre-wrap leading-relaxed">{aiExplanations[q.id]}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;