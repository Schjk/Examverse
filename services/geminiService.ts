import { GoogleGenAI, Type } from "@google/genai";
import { Question, UserAnswer, AnalysisResult } from '../types';

// NOTE: In a real production app, API calls should be routed through a backend to protect the API key.
// For this demo, we assume the key is available via process.env.
// If not provided, we will fallback gracefully or show an error.

const apiKey = process.env.API_KEY || ''; 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzePerformance = async (
  questions: Question[],
  userAnswers: Record<string, UserAnswer>
): Promise<Partial<AnalysisResult>> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning mock analysis.");
    return {
      aiRecommendations: "Please configure your API Key to get AI insights.",
      improvementPlan: "Review your mistakes in the detailed report."
    };
  }

  // Prepare data for the prompt
  const performanceData = questions.map(q => {
    const ua = userAnswers[q.id];
    const isCorrect = ua && ua.answer === q.correctAnswer;
    return {
      topic: q.topic,
      difficulty: q.difficulty,
      subject: q.subject,
      correct: isCorrect,
      timeSpent: ua ? ua.timeSpent : 0
    };
  });

  const prompt = `
    Analyze the following student performance data for a JEE Mock Test.
    Data: ${JSON.stringify(performanceData)}
    
    Provide a structured analysis in JSON format with:
    1. weakTopics: Array of strings (topics where performance was poor)
    2. strongTopics: Array of strings (topics where performance was good)
    3. aiRecommendations: A concise paragraph (max 50 words) giving strategic advice.
    4. improvementPlan: A list of 3 actionable steps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weakTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            strongTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiRecommendations: { type: Type.STRING },
            improvementPlan: { type: Type.STRING } // Returning as single string for simplicity in display
          }
        }
      }
    });
    
    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      aiRecommendations: "AI Analysis currently unavailable.",
      improvementPlan: "Focus on revising incorrect questions."
    };
  }
};

export const generateQuestionExplanation = async (question: Question, userAnswer: string | null): Promise<string> => {
  if (!ai) return "AI explanation unavailable (API Key missing).";

  const prompt = `
    Explain the solution for this ${question.subject} question clearly for a student.
    Question: ${question.text}
    Options: ${question.options?.join(', ') || 'Numeric Input'}
    Correct Answer: ${question.correctAnswer}
    Student Answered: ${userAnswer || 'Skipped'}
    
    Provide a step-by-step explanation. If the student was wrong, explain why their likely approach might have failed.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No explanation generated.";
  } catch (e) {
    return "Failed to generate explanation.";
  }
};
