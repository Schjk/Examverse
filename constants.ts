import { QuestionStatus } from './types';

export const EXAM_RULES = [
  "The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination.",
  "When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.",
  "The Question Palette displayed on the right side of screen will show the status of each question.",
  "You can click on the '>' arrow to maximize the question window.",
  "Click on the question number on the Question Palette to go to that question directly."
];

export const STATUS_COLORS: Record<QuestionStatus, string> = {
  [QuestionStatus.NOT_VISITED]: 'bg-gray-200 text-gray-700 border-gray-300',
  [QuestionStatus.NOT_ANSWERED]: 'bg-red-500 text-white border-red-600',
  [QuestionStatus.ANSWERED]: 'bg-green-500 text-white border-green-600',
  [QuestionStatus.MARKED_FOR_REVIEW]: 'bg-purple-500 text-white border-purple-600',
  [QuestionStatus.ANSWERED_AND_MARKED_FOR_REVIEW]: 'bg-purple-500 text-white border-purple-600 relative after:content-[""] after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2 after:bg-green-400 after:rounded-full'
};

export const MOCK_USER = {
  name: "Arjun Kumar",
  rollNumber: "202400156",
  photo: "https://picsum.photos/100/100"
};
