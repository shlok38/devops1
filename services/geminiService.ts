import { GoogleGenAI } from "@google/genai";

// Initialize the client
// Note: In a real production app, ensure API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanResponse = (text: string): string => {
  // 1. Try to match a standard closed code block: ```language ... ```
  const closedBlockRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/;
  const closedMatch = text.match(closedBlockRegex);
  if (closedMatch && closedMatch[1]) {
    return closedMatch[1].trim();
  }

  // 2. Try to match an unclosed code block (start to end of string): ```language ...
  // This handles cases where the response might be truncated or lacks the closing tag.
  const unclosedBlockRegex = /```(?:\w+)?\s*([\s\S]*)$/;
  const unclosedMatch = text.match(unclosedBlockRegex);
  if (unclosedMatch && unclosedMatch[1]) {
    return unclosedMatch[1].trim();
  }

  // 3. Fallback: Strip generic markdown start/end if it looks like code but regex missed
  let cleaned = text.replace(/^```[\w-]*\s*/, '');
  cleaned = cleaned.replace(/\s*```$/, '');
  return cleaned.trim();
};

export const generateDevOpsContent = async (
  prompt: string, 
  systemInstruction: string = "You are an expert Senior DevOps Engineer. Provide clean, production-ready code or explanations."
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for deterministic code generation
      }
    });
    
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating content: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const convertYamlJson = async (content: string, toJson: boolean): Promise<string> => {
  const direction = toJson ? "YAML to JSON" : "JSON to YAML";
  // Explicitly asking for markdown blocks makes extraction in cleanResponse more reliable
  const prompt = `Convert the following ${direction}. Wrap the result in a markdown code block.
  
  Input:
  ${content}`;
  
  const result = await generateDevOpsContent(prompt, "You are a precise data conversion utility.");
  return cleanResponse(result);
};

export const convertCron = async (input: string): Promise<string> => {
  const prompt = `The user has provided: "${input}".
  If it is a Cron expression, explain what it means in plain English.
  If it is a plain English description, provide the valid Cron expression (standard 5 fields).
  Return ONLY the result (Expression or Explanation).`;
  
  const result = await generateDevOpsContent(prompt, "You are a Cron job expert.");
  return cleanResponse(result);
};

export const generateDockerfile = async (params: any): Promise<string> => {
  const prompt = `Generate a production-ready Dockerfile for a ${params.language} application (version ${params.version}).
  - Expose Port: ${params.port}
  - Environment Variables: ${params.envVars}
  - Additional Requirements: ${params.extras}
  
  Use multi-stage builds if applicable (e.g., for Go or Node).
  Return ONLY the Dockerfile code in a markdown block.`;
  
  const result = await generateDevOpsContent(prompt);
  return cleanResponse(result);
};

export const generateK8sManifest = async (params: any): Promise<string> => {
  const prompt = `Generate a Kubernetes ${params.kind} manifest.
  - Name: ${params.name}
  - Namespace: ${params.namespace}
  - Image: ${params.image}
  - Replicas: ${params.replicas}
  - Container Port: ${params.port}
  
  Include standard resource limits (CPU: 250m, Memory: 512Mi) and requests.
  Return ONLY the YAML code in a markdown block.`;
  
  const result = await generateDevOpsContent(prompt);
  return cleanResponse(result);
};

export const generateSshCommand = async (email: string, type: string): Promise<string> => {
  const prompt = `Generate the exact terminal command to generate an SSH key pair.
  - Type: ${type}
  - Comment/Email: ${email}
  - File path: standard default (~/.ssh/id_${type})
  
  Return ONLY the command string.`;
  const result = await generateDevOpsContent(prompt, "You are a terminal helper.");
  return cleanResponse(result);
};