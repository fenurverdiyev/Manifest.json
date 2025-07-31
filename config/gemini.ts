import axios from 'axios';
import Constants from 'expo-constants';

const GEMINI_API_KEY = Constants?.expoConfig?.extra?.geminiApiKey || (process.env.GEMINI_API_KEY as string);

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not set. Create a .env file or supply via app config.');
}

// Gemini model to use
const MODEL_NAME = 'gemini-pro';

export async function askGemini(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await axios.post(url, {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    const candidates = response.data?.candidates ?? [];
    const text = candidates[0]?.content?.parts?.[0]?.text ?? '';
    return text.trim();
  } catch (err: any) {
    console.error('Gemini API error', err?.response?.data || err?.message);
    throw new Error('Failed to fetch answer from Gemini API');
  }
}