import React, { useEffect, useState } from 'react';
import { useExam } from '../../context/ExamContext.tsx';
import { analyzePerformance, generateQuestionExplanation } from '../../services/geminiService.ts';
import { AnalysisResult, Question } from '../../types.ts';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analysis: React.FC = () => {
  const { state } = useExam();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const runAnalysis = async () => {
      let correct = 0;
      let incorrect = 0;
      let unattempted = 0;
      let score = 0;

      state.questions.forEach(q => {
        const ua = state.userAnswers[q.id];
        if (!ua || !ua.answer) unattempted++;
        else if (ua.answer === q.correctAnswer) { correct++; score += 4; }
        else { incorrect++; score -= 1; }
      });

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
        aiRecommendations: aiResult.aiRecommendations || "AI summary not available.",
        improvementPlan: aiResult.improvementPlan || ""
      });
      setLoading(false);
    };

    runAnalysis();
  }, [state.questions, state.userAnswers]);

  const handleExplain = async (q: Question) => {
    if (aiExplanations[q.id]) return;
    setAiExplanations(prev => ({ ...prev, [q.id]: "Generating AI explanation..." }));
    const ua = state.userAnswers[q.id];
    const text = await generateQuestionExplanation(q, ua?.answer || null);
    setAiExplanations(prev => ({ ...prev, [q.id]: text }));
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-blue-600 font-bold text-xl animate-pulse">Running AI Performance Analysis...</div>;
  if (!analysis) return <div className="p-10 text-center">Failed to load analysis.</div>;

  const pieData = [
    { name: 'Correct', value: analysis.correctCount, color: '#22c55e' },
    { name: 'Incorrect', value: analysis.incorrectCount, color: '#ef4444' },
    { name: 'Unattempted', value: analysis.unattemptedCount, color: '#94a3b8' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Exam Analysis Report</h1>
                <p className="text-gray-500">{state.title} • {new Date().toLocaleDateString()}</p>
            </div>
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back to Dashboard</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <div className="text-gray-500 text-sm font-medium">TOTAL SCORE</div>
                <div className="text-4xl font-bold text-blue-600 mt-2">{analysis.score}<span className="text-lg text-gray-400">/300</span></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <div className="text-gray-500 text-sm font-medium">ACCURACY</div>
                <div className="text-4xl font-bold text-green-600 mt-2">{Math.round(analysis.accuracy)}%</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <div className="text-gray-500 text-sm font-medium">PERCENTILE</div>
                <div className="text-4xl font-bold text-purple-600 mt-2">--</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <div className="text-gray-500 text-sm font-medium">ATTEMPTED</div>
                <div className="text-4xl font-bold text-gray-800 mt-2">{analysis.correctCount + analysis.incorrectCount}/{analysis.totalQuestions}</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border">
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

            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100">
                <h3 className="flex items-center gap-2 text-xl font-bold text-indigo-900 mb-4">
                    <Brain className="text-indigo-600" /> Gemini Insights
                </h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-indigo-800 uppercase">Strategic Advice</h4>
                        <p className="text-gray-700 mt-1 leading-relaxed">{analysis.aiRecommendations}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <h4 className="font-bold text-red-700 mb-2">Weak Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.weakTopics.map(t => <span key={t} className="px-2 py-1 bg-white text-red-600 text-xs rounded border">{t}</span>)}
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h4 className="font-bold text-green-700 mb-2">Strong Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.strongTopics.map(t => <span key={t} className="px-2 py-1 bg-white text-green-600 text-xs rounded border">{t}</span>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 font-bold">Question Review</div>
            <div className="divide-y">
                {state.questions.map((q, idx) => {
                    const ua = state.userAnswers[q.id];
                    const isCorrect = ua?.answer === q.correctAnswer;
                    const isSkipped = !ua || !ua.answer;
                    return (
                        <div key={q.id}>
                            <div onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded font-medium">{idx + 1}</span>
                                    <div className="text-sm font-medium truncate max-w-lg">{q.text}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {isSkipped ? <span className="text-gray-400 text-sm">Skipped</span> : isCorrect ? <span className="text-green-600 text-sm">Correct</span> : <span className="text-red-500 text-sm">Incorrect</span>}
                                    {expandedQuestion === q.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                </div>
                            </div>
                            {expandedQuestion === q.id && (
                                <div className="p-6 bg-gray-50 border-t">
                                    <p className="text-gray-800 mb-4">{q.text}</p>
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div><strong>Your Answer:</strong> {isSkipped ? 'None' : (q.options ? q.options[parseInt(ua.answer!)] : ua.answer)}</div>
                                        <div><strong>Correct Answer:</strong> {q.options ? q.options[parseInt(q.correctAnswer)] : q.correctAnswer}</div>
                                    </div>
                                    <div className="mt-4">
                                        {!aiExplanations[q.id] ? (
                                            <button onClick={() => handleExplain(q)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded text-sm"><Brain size={16}/> Explain with AI</button>
                                        ) : (
                                            <div className="bg-indigo-50 p-4 rounded border border-indigo-100 text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">{aiExplanations[q.id]}</div>
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