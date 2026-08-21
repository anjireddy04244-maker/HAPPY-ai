import { GoogleGenAI } from '@google/genai';

// Initialize the SDK with your API key environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. Extract the user message from the request body
    const { message } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A valid "message" string is required.' });
    }

    // 3. Call the Gemini API server-side
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });

    // 4. Send the result back to the frontend
    return res.status(200).json({
      answer: response.text,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request.',
    });
  }
}
