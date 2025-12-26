import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ExamSession, Question, UserAnswer, QuestionStatus, Subject, ExamType } from '../types';
import { MOCK_QUESTIONS } from '../services/mockData';

interface ExamState extends ExamSession {
  isProctoringActive: boolean;
  cheatingFlags: number;
}

type Action =
  | { type: 'START_EXAM'; payload: { examType: ExamType } }
  | { type: 'END_EXAM' }
  | { type: 'TICK' }
  | { type: 'JUMP_TO_QUESTION'; payload: number }
  | { type: 'MARK_ANSWER'; payload: { questionId: string; answer: string } }
  | { type: 'CLEAR_RESPONSE'; payload: { questionId: string } }
  | { type: 'TOGGLE_REVIEW'; payload: { questionId: string } }
  | { type: 'CHANGE_SUBJECT'; payload: Subject }
  | { type: 'FLAG_ACTIVITY'; payload: string };

const INITIAL_TIME = 3 * 60 * 60; // 3 hours

const initialState: ExamState = {
  id: 'session-1',
  title: 'JEE Main Full Mock Test 01',
  totalTime: INITIAL_TIME,
  timeLeft: INITIAL_TIME,
  isActive: false,
  questions: MOCK_QUESTIONS,
  currentQuestionIndex: 0,
  userAnswers: {},
  startTime: 0,
  examType: 'JEE_MAIN',
  isProctoringActive: false,
  cheatingFlags: 0
};

const ExamContext = createContext<{
  state: ExamState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

const examReducer = (state: ExamState, action: Action): ExamState => {
  switch (action.type) {
    case 'START_EXAM':
      return {
        ...state,
        isActive: true,
        startTime: Date.now(),
        isProctoringActive: true,
        examType: action.payload.examType,
        title: `${action.payload.examType.replace('_', ' ')} Mock Test`,
        userAnswers: state.questions.reduce((acc, q) => {
          acc[q.id] = {
            questionId: q.id,
            answer: null,
            status: QuestionStatus.NOT_VISITED,
            timeSpent: 0,
            isMarkedForReview: false
          };
          return acc;
        }, {} as Record<string, UserAnswer>)
      };
    case 'END_EXAM':
      return { ...state, isActive: false, isProctoringActive: false };
    case 'TICK':
      if (state.timeLeft <= 0) return { ...state, isActive: false };
      // Also update time spent on current question
      const currentQ = state.questions[state.currentQuestionIndex];
      const updatedUserAnswersTick = { ...state.userAnswers };
      if (updatedUserAnswersTick[currentQ.id]) {
         updatedUserAnswersTick[currentQ.id].timeSpent += 1;
      }
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
        userAnswers: updatedUserAnswersTick
      };
    case 'JUMP_TO_QUESTION':
      // Mark current as visited if not answered
      const prevQ = state.questions[state.currentQuestionIndex];
      const nextIndex = action.payload;
      const updatedAnswersJump = { ...state.userAnswers };
      
      // Update status of previous question if it was NOT_VISITED
      if (updatedAnswersJump[prevQ.id].status === QuestionStatus.NOT_VISITED) {
        updatedAnswersJump[prevQ.id].status = QuestionStatus.NOT_ANSWERED;
      }

      return { ...state, currentQuestionIndex: nextIndex, userAnswers: updatedAnswersJump };
    
    case 'MARK_ANSWER':
      const { questionId, answer } = action.payload;
      const ua = state.userAnswers[questionId];
      let newStatus = QuestionStatus.ANSWERED;
      if (ua.isMarkedForReview) newStatus = QuestionStatus.ANSWERED_AND_MARKED_FOR_REVIEW;
      
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [questionId]: { ...ua, answer, status: newStatus }
        }
      };

    case 'CLEAR_RESPONSE':
        const uaClear = state.userAnswers[action.payload.questionId];
        return {
          ...state,
          userAnswers: {
            ...state.userAnswers,
            [action.payload.questionId]: { 
                ...uaClear, 
                answer: null, 
                status: uaClear.isMarkedForReview ? QuestionStatus.MARKED_FOR_REVIEW : QuestionStatus.NOT_ANSWERED 
            }
          }
        };

    case 'TOGGLE_REVIEW':
        const uaReview = state.userAnswers[action.payload.questionId];
        const isMarked = !uaReview.isMarkedForReview;
        let reviewStatus = uaReview.status;

        if (isMarked) {
             reviewStatus = uaReview.answer ? QuestionStatus.ANSWERED_AND_MARKED_FOR_REVIEW : QuestionStatus.MARKED_FOR_REVIEW;
        } else {
             reviewStatus = uaReview.answer ? QuestionStatus.ANSWERED : QuestionStatus.NOT_ANSWERED;
        }

        return {
            ...state,
            userAnswers: {
                ...state.userAnswers,
                [action.payload.questionId]: {
                    ...uaReview,
                    isMarkedForReview: isMarked,
                    status: reviewStatus
                }
            }
        };

    case 'CHANGE_SUBJECT':
        // Find first question of that subject
        const firstIdx = state.questions.findIndex(q => q.subject === action.payload);
        if (firstIdx !== -1) {
            return { ...state, currentQuestionIndex: firstIdx };
        }
        return state;

    case 'FLAG_ACTIVITY':
        return { ...state, cheatingFlags: state.cheatingFlags + 1 };
        
    default:
      return state;
  }
};

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(examReducer, initialState);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state.isActive && state.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isActive, state.timeLeft]);

  return (
    <ExamContext.Provider value={{ state, dispatch }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error("useExam must be used within ExamProvider");
  return context;
};