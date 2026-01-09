import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateInterviewQuestions = async (jobTitle, jobDescription, numberOfQuestions = 5) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      You are an expert recruiter. Generate ${numberOfQuestions} interview questions for a ${jobTitle} position.
      
      Job Description: ${jobDescription}
      
      Please provide:
      1. A mix of technical and behavioral questions
      2. Questions that assess relevant skills
      3. Questions that evaluate cultural fit
      
      Format the response as a JSON array with objects containing:
      - question: the interview question
      - type: "technical" or "behavioral"
      - followUp: a potential follow-up question
      
      Return ONLY valid JSON, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format from Gemini');
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};

export const evaluateAnswer = async (question, answer, jobContext) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Evaluate this interview answer on a scale of 1-100.
      
      Job Context: ${jobContext}
      Question: ${question}
      Candidate Answer: ${answer}
      
      Provide a JSON response with:
      - score: number between 1-100
      - strengths: array of positive points
      - improvements: array of areas for improvement
      - feedback: brief constructive feedback
      
      Return ONLY valid JSON, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format from Gemini');
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
};