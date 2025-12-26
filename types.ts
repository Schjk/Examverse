export enum QuestionType {
  MCQ = 'MCQ',
  NUMERIC = 'NUMERIC'
}

export enum Subject {
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  MATHS = 'Maths'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum QuestionStatus {
  NOT_VISITED = 'not_visited',
  NOT_ANSWERED = 'not_answered',
  ANSWERED = 'answered',
  MARKED_FOR_REVIEW = 'marked_for_review',
  ANSWERED_AND_MARKED_FOR_REVIEW = 'answered_and_marked_for_review'
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  options?: string[]; // For MCQ
  correctAnswer: string; // Option index (0-3) or numeric value
  solution?: string;
  imageUrl?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string | null; // Option index or numeric string
  status: QuestionStatus;
  timeSpent: number; // in seconds
  isMarkedForReview: boolean;
}

export type ExamType = 'JEE_MAIN' | 'JEE_ADVANCED' | 'NEET' | 'CUSTOM';

export interface ExamSession {
  id: string;
  title: string;
  totalTime: number; // in seconds
  timeLeft: number;
  isActive: boolean;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, UserAnswer>;
  startTime: number;
  examType: ExamType;
}

export interface AnalysisResult {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  weakTopics: string[];
  strongTopics: string[];
  aiRecommendations: string;
  improvementPlan: string;
}