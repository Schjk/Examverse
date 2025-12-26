import React, { useState } from 'react';
import { useExam } from '../../context/ExamContext.tsx';
import QuestionPalette from './QuestionPalette.tsx';
import ProctoringMonitor from './ProctoringMonitor.tsx';
import { QuestionType } from '../../types.ts';
import { useNavigate } from 'react-router-dom';
import { Calculator } from 'lucide-react';

const ExamInterface: React.FC = () => {
  const { state, dispatch } = useExam();
  const navigate = useNavigate();
  const currentQ = state.questions[state.currentQuestionIndex];
  const currentAns = state.userAnswers[currentQ.id];
  const [showCalculator, setShowCalculator] = useState(false);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmitExam = () => {
      if (window.confirm("Are you sure you want to submit the exam?")) {
          dispatch({ type: 'END_EXAM' });
          navigate('/results');
      }
  };

  const handleOptionSelect = (optIndex: number) => {
      dispatch({ type: 'MARK_ANSWER', payload: { questionId: currentQ.id, answer: optIndex.toString() } });
  };

  const handleNumericChange = (val: string) => {
      dispatch({ type: 'MARK_ANSWER', payload: { questionId: currentQ.id, answer: val } });
  };

  if (!state.isActive) {
      return <div className="flex items-center justify-center h-screen font-bold text-blue-600">Initializing Exam Session...</div>;
  }

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden noselect">
      <ProctoringMonitor />
      
      <div className="flex-1 flex flex-col h-full relative">
        <div className="bg-white border-b border-gray-300 p-2 flex justify-between items-center shadow-sm z-10">
            <h1 className="text-lg font-bold text-blue-900">{state.title}</h1>
            <div className="flex items-center gap-4">
                <button onClick={() => setShowCalculator(!showCalculator)} className="p-2 rounded hover:bg-gray-100 text-gray-600">
                    <Calculator size={20} />
                </button>
                <div className="bg-black text-white px-4 py-2 rounded font-mono font-bold text-xl tracking-widest">
                    {formatTime(state.timeLeft)}
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="flex justify-between items-start mb-4 border-b pb-2">
                <h2 className="text-lg font-semibold text-gray-800">Question {state.currentQuestionIndex + 1}</h2>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border">+4, -1</span>
                </div>
            </div>

            <div className="text-lg text-gray-900 mb-8 leading-relaxed font-serif">{currentQ.text}</div>

            <div className="w-full max-w-3xl">
                {currentQ.type === QuestionType.MCQ ? (
                    <div className="space-y-3">
                        {currentQ.options?.map((opt, idx) => (
                            <label key={idx} className={`flex items-center gap-4 p-3 border rounded cursor-pointer transition-colors ${currentAns?.answer === idx.toString() ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="option" className="w-5 h-5 accent-blue-600" checked={currentAns?.answer === idx.toString()} onChange={() => handleOptionSelect(idx)} />
                                <span className="text-gray-800 text-base">{opt}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Answer:</label>
                        <input type="text" className="w-48 p-2 border border-gray-300 rounded text-lg focus:ring-2 focus:ring-blue-500 outline-none" value={currentAns?.answer || ''} onChange={(e) => handleNumericChange(e.target.value)} />
                    </div>
                )}
            </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-3 flex justify-between items-center z-10">
            <div className="flex gap-2">
                <button onClick={() => dispatch({ type: 'TOGGLE_REVIEW', payload: { questionId: currentQ.id } })} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium">Mark for Review</button>
                <button onClick={() => dispatch({ type: 'CLEAR_RESPONSE', payload: { questionId: currentQ.id } })} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium">Clear Response</button>
            </div>
            <button onClick={() => { if (state.currentQuestionIndex < state.questions.length - 1) dispatch({ type: 'JUMP_TO_QUESTION', payload: state.currentQuestionIndex + 1 }); }} className="px-6 py-2 bg-blue-600 text-white rounded font-bold text-sm">Save & Next</button>
        </div>
      </div>

      <div className="h-full flex flex-col">
        <QuestionPalette />
        <button onClick={handleSubmitExam} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-sm uppercase tracking-wide">Submit Exam</button>
      </div>
    </div>
  );
};

export default ExamInterface;