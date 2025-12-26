import { GoogleGenAI, Type } from "@google/genai";
import { Question, UserAnswer, AnalysisResult } from '../types.ts';

// Initialize the Gemini API client. 
// The API_KEY is provided via the environment's process.env object.
const getAIClient = () => {
  // Access process.env.API_KEY safely in the browser context
  const apiKey = (globalThis as any).process?.env?.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing from process.env.API_KEY. AI features will be disabled.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize Gemini API:", e);
    return null;
  }
};

const ai = getAIClient();

export const analyzePerformance = async (
  questions: Question[],
  userAnswers: Record<string, UserAnswer>
): Promise<Partial<AnalysisResult>> => {
  if (!ai) {
    return {
      aiRecommendations: "Please configure your API Key in the environment to get AI insights.",
      improvementPlan: "Review your mistakes in the detailed report below."
    };
  }

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
    1. weakTopics: Array of strings
    2. strongTopics: Array of strings
    3. aiRecommendations: A concise paragraph
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
            improvementPlan: { type: Type.STRING }
          },
          required: ["weakTopics", "strongTopics", "aiRecommendations", "improvementPlan"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      aiRecommendations: "AI Analysis currently unavailable. Please check your network or API quota.",
      improvementPlan: "Focus on revising incorrect questions in the meantime."
    };
  }
};

export const generateQuestionExplanation = async (question: Question, userAnswer: string | null): Promise<string> => {
  if (!ai) return "AI explanation unavailable (API Key missing).";

  const prompt = `
    Explain the solution for this ${question.subject} question.
    Question: ${question.text}
    Options: ${question.options?.join(', ') || 'Numeric Input'}
    Correct Answer: ${question.correctAnswer}
    Student Answered: ${userAnswer || 'Skipped'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No explanation generated.";
  } catch (e) {
    return "Failed to generate explanation. Please try again later.";
  }
};