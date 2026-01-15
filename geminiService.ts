
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ProjectFile } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  /**
   * Generates a full project structure based on a prompt.
   * This is the "Main Architecture API"
   */
  async generateAppBlueprint(prompt: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Build a full production-ready application for: ${prompt}.
      
      RULES:
      1. Use React, TypeScript, and Tailwind CSS.
      2. Provide multiple files if necessary.
      3. Format output with [FILE: path/to/file.tsx] markers.
      4. Ensure all code is clean and modular.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 16000 }
      },
    });

    return response.text || '';
  }

  /**
   * Simulates a "Build API" by asking Gemini to generate realistic build/compilation steps 
   * based on the provided source code.
   */
  async getBuildPipelineSteps(files: ProjectFile[], target: string): Promise<string[]> {
    const ai = this.getAI();
    const codeContext = files.map(f => `File: ${f.path}\nContent Summary: ${f.content.substring(0, 100)}...`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user is building this project for ${target}. Based on these files, give me 5 realistic, technical build steps (one per line):
      
      ${codeContext}`,
      config: {
        systemInstruction: "You are a CI/CD expert. Return only the steps, one per line. No numbers.",
        temperature: 0.1,
      },
    });

    return response.text?.split('\n').filter(s => s.trim().length > 0) || [];
  }

  /**
   * Code Refactoring API
   */
  async refactorCode(path: string, content: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Refactor this file (${path}) to be more efficient and follow best practices:\n\n${content}`,
      config: {
        systemInstruction: "Return only the refactored code. No explanations.",
        temperature: 0.3,
      },
    });
    return response.text || content;
  }

  /**
   * Explanation API
   */
  async explainCode(content: string): Promise<string> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain how this code works in 3 bullet points:\n\n${content}`,
      config: {
        temperature: 0.5,
      },
    });
    return response.text || "Could not generate explanation.";
  }
}

export const gemini = new GeminiService();
