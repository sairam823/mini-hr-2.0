
import { GoogleGenAI, Type, Modality } from "@google/genai";

export const getCompanyInsights = async (companyName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide recent news, company culture insights, and interview tips for ${companyName}. Focus on what a high-potential engineering candidate should know.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "No insights found.";
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  return { text, sources };
};

export const connectToLiveRecruiter = (config: {
  systemInstruction: string,
  callbacks: {
    onopen: () => void,
    onmessage: (message: any) => void,
    onerror: (e: any) => void,
    onclose: (e: any) => void
  }
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: config.callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: config.systemInstruction,
      outputAudioTranscription: {},
      inputAudioTranscription: {},
    },
  });
};

export const generateAssessmentQuestions = async (category: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 challenging multiple-choice questions for a ${category} assessment. Each question should test logic, reasoning, or technical depth.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.NUMBER }
          },
          required: ['text', 'options', 'correctIndex'],
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateSmartDraft = async (inputText: string, recipientName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the user's intent: "${inputText}", draft a professional and concise message to ${recipientName}. Also provide a short suggestion note explaining why this draft is effective for a high-potential candidate profile.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          draft: { type: Type.STRING },
          suggestionNote: { type: Type.STRING }
        },
        required: ['draft', 'suggestionNote']
      }
    }
  });
  return JSON.parse(response.text);
};

export const evaluateInterview = async (transcripts: string[], trustScore: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Perform a high-fidelity multidimensional evaluation of this interview transcript. 
    
    STRICT SCORING PROTOCOL:
    1. SUBSTANCE MANDATE: Only assign merit marks if the candidate provides substantive, relevant answers. 
    2. IRRELEVANCE PENALTY: If a candidate provides empty, generic, or non-responsive answers, the interviewQualityScore MUST be 0.
    3. INTEGRITY CHECK: Use the base Trust Index of ${trustScore}.

    Current Transcripts:
    ${transcripts.join('\n')}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          interviewQualityScore: { type: Type.NUMBER },
          technicalScore: { type: Type.NUMBER },
          communicationScore: { type: Type.NUMBER },
          insights: { type: Type.STRING },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateDetailedInterviewFeedback = async (transcripts: string[], score: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Provide a comprehensive analysis of an AI interview. Score: ${score}%. Transcripts: ${transcripts.join('\n')}`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
          cognitivePatterns: { type: Type.STRING },
          communicationStyle: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const parseResume = async (resumeText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following resume text: ${resumeText}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          experienceLevel: { type: Type.STRING },
          rawSummary: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text);
};
