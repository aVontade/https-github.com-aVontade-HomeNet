import { GoogleGenAI, Type } from "@google/genai";

export const generateAutomationSuggestion = async (devices: string[]): Promise<string[]> => {
  if (!process.env.API_KEY) {
    return [
      "Good Morning: Turn on lights and coffee maker at 7 AM",
      "Security Guard: Lock doors and turn on cameras when you leave",
      "Night Mode: Dim lights and lower thermostat at 10 PM"
    ];
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `I have the following smart home devices: ${devices.join(', ')}. 
    Suggest exactly 3 distinct, creative, and practical home automation ideas. 
    Return them as a JSON array of strings. Each string MUST be a concise title and description, following the format 'Title: Description'.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    if (response.text) {
      const suggestions = JSON.parse(response.text);
      // Ensure we return exactly 3 suggestions if the model returned more or fewer, 
      // though the schema helps, sometimes models are chatty.
      return suggestions.slice(0, 3);
    }
    return ["No suggestions available."];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [
      "Wake Up: Slowly brighten lights at 7 AM",
      "Eco Mode: Turn off thermostat when window opens",
      "Welcome Home: Turn on hallway lights when door unlocks"
    ];
  }
};

export const chatWithAssistant = async (message: string): Promise<string> => {
    if (!process.env.API_KEY) return "I'm sorry, I can't connect to the server right now. (Missing API Key)";
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: "You are HomeNet, a helpful, friendly, and concise smart home assistant. You help users manage their home devices, suggest automations, and troubleshoot issues."
            }
        });
        return response.text || "I didn't catch that.";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Sorry, I'm having trouble thinking right now.";
    }
}