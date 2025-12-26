import React from 'react';
import { useExam } from '../../context/ExamContext';
import { STATUS_COLORS } from '../../constants';
import { Subject, QuestionStatus, UserAnswer } from '../../types';

const QuestionPalette: React.FC = () => {
  const { state, dispatch } = useExam();

  const handleQuestionClick = (index: number) => {
    dispatch({ type: 'JUMP_TO_QUESTION', payload: index });
  };

  const counts = Object.values(state.userAnswers).reduce((acc, ua: UserAnswer) => {
      acc[ua.status] = (acc[ua.status] || 0) + 1;
      return acc;
  }, {} as Record<QuestionStatus, number>);

  return (
    <div className="flex flex-col h-full bg-blue-50 border-l border-gray-300 w-80 shrink-0">
      {/* User Info */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-300 bg-white">
        <img 
            src="https://picsum.photos/id/64/100/100" 
            alt="User" 
            className="w-12 h-12 rounded bg-gray-200 object-cover" 
        />
        <div>
            <h3 className="font-bold text-sm text-gray-800">John Doe</h3>
            <p className="text-xs text-gray-500">Candidate ID: 202409</p>
        </div>
      </div>

      {/* Legend */}
      <div className="p-2 grid grid-cols-2 gap-2 text-[10px] bg-white border-b border-gray-300">
        <div className="flex items-center gap-1"><span className={`w-4 h-4 rounded-full border flex items-center justify-center ${STATUS_COLORS[QuestionStatus.ANSWERED]}`}>1</span> Answered</div>
        <div className="flex items-center gap-1"><span className={`w-4 h-4 rounded-full border flex items-center justify-center ${STATUS_COLORS[QuestionStatus.NOT_ANSWERED]}`}>2</span> Not Answered</div>
        <div className="flex items-center gap-1"><span className={`w-4 h-4 rounded-full border flex items-center justify-center ${STATUS_COLORS[QuestionStatus.NOT_VISITED]}`}>3</span> Not Visited</div>
        <div className="flex items-center gap-1"><span className={`w-4 h-4 rounded-full border flex items-center justify-center ${STATUS_COLORS[QuestionStatus.MARKED_FOR_REVIEW]}`}>4</span> Review</div>
        <div className="col-span-2 flex items-center gap-1"><span className={`w-4 h-4 rounded-full border flex items-center justify-center ${STATUS_COLORS[QuestionStatus.ANSWERED_AND_MARKED_FOR_REVIEW]}`}>5</span> Ans & Marked for Review</div>
      </div>

      {/* Subject Selector */}
      <div className="bg-sky-700 p-2 flex gap-1 overflow-x-auto text-white text-xs">
          {Object.values(Subject).map(sub => (
              <button 
                key={sub}
                onClick={() => dispatch({ type: 'CHANGE_SUBJECT', payload: sub })}
                className={`px-3 py-1 rounded ${state.questions[state.currentQuestionIndex].subject === sub ? 'bg-yellow-500 text-black font-bold' : 'bg-sky-600 hover:bg-sky-500'}`}
              >
                  {sub}
              </button>
          ))}
      </div>

      {/* Palette Grid */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        <h4 className="text-blue-800 font-bold text-sm mb-2 px-1">
            {state.questions[state.currentQuestionIndex].subject} Section
        </h4>
        <div className="grid grid-cols-4 gap-2">
            {state.questions.map((q, idx) => {
                // Only show questions for current subject or all? usually all are accessible but grouped.
                // For typical JEE, the palette shows questions of the ACTIVE section usually, 
                // but simpler to show all with subject headers or just filter.
                // Let's filter to show only current subject for cleaner UI.
                if (q.subject !== state.questions[state.currentQuestionIndex].subject) return null;

                const status = state.userAnswers[q.id]?.status || QuestionStatus.NOT_VISITED;
                return (
                    <button
                        key={q.id}
                        onClick={() => handleQuestionClick(idx)}
                        className={`
                            h-10 w-full rounded border flex items-center justify-center text-sm font-medium transition-all
                            ${state.currentQuestionIndex === idx ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                            ${STATUS_COLORS[status]}
                        `}
                    >
                        {idx + 1}
                    </button>
                );
            })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-2 bg-gray-100 text-xs text-center border-t border-gray-300">
          AceRank CBT v1.0
      </div>
    </div>
  );
};

export default QuestionPalette;