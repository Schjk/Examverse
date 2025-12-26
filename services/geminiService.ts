import { GoogleGenAI, Type } from "@google/genai";
import { Question, UserAnswer, AnalysisResult } from '../types.ts';

// The Google GenAI SDK handles the API key via the configuration object.
// We pull this from the environment variable process.env.API_KEY.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled until an API_KEY is provided in the environment.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize Google GenAI client:", e);
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
      aiRecommendations: "AI Analysis is currently unavailable because no API Key was detected in the environment.",
      improvementPlan: "Please check your environment settings for the API Key."
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
      aiRecommendations: "There was an error generating your AI analysis. Please check your API quota.",
      improvementPlan: "Review the detailed question analysis manually."
    };
  }
};

export const generateQuestionExplanation = async (question: Question, userAnswer: string | null): Promise<string> => {
  if (!ai) return "AI explanation unavailable. No API Key provided.";

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
    return "The AI failed to generate an explanation. Please try again later.";
  }
};