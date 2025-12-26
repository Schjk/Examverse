import { GoogleGenAI, Type } from "@google/genai";
import { Question, UserAnswer, AnalysisResult } from '../types.ts';

// Helper to get Gemini client - strictly follows the SDK requirement for named parameter
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzePerformance = async (
  questions: Question[],
  userAnswers: Record<string, UserAnswer>
): Promise<Partial<AnalysisResult>> => {
  const ai = getAI();
  if (!ai) {
    return {
      aiRecommendations: "AI Analysis is currently unavailable. No API Key detected.",
      improvementPlan: "Please check system configuration."
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
      aiRecommendations: "Error generating AI insights. Check API status.",
      improvementPlan: "Review performance manually."
    };
  }
};

export const generateQuestionExplanation = async (question: Question, userAnswer: string | null): Promise<string> => {
  const ai = getAI();
  if (!ai) return "AI explanation unavailable.";

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
    return response.text || "No explanation could be generated.";
  } catch (e) {
    return "The AI failed to generate an explanation.";
  }
};