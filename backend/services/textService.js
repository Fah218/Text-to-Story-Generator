const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

exports.generateStoryText = async (concept, tone, genre, sceneCount) => {
  try {
    const prompt = `
    Write a ${genre} story with a ${tone} tone about: "${concept}".
    Break it into exactly ${sceneCount} distinct scenes.
    
    IMPORTANT: Each scene description must be highly visual and descriptive of the setting and characters. 
    Avoid internal dialogue; focus on what a camera would see.

    Return ONLY valid JSON:
    {
      "title": "Story Title",
      "scenes": [
        { "sceneNumber": 1, "description": "Visual description of the scene..." }
      ]
    }
    `;

    const response = await cohere.chat({
      model: "command-a-03-2025", // Using a more capable model for logic
      message: prompt,
      temperature: 0.7,
    });

    const content = response.text;
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}");
    return JSON.parse(content.substring(jsonStart, jsonEnd + 1));
  } catch (error) {
    console.error("Story Gen Error:", error.message);
    throw error;
  }
};

exports.generateImagePrompt = async (sceneText) => {
  try {
    const prompt = `
    Task: Convert this story scene into a precise image generation prompt.
    Focus on: Subject, Clothing, Action, and Background. 
    Rule: Use concrete nouns and verbs. No metaphors.
    
    Scene: ${sceneText}
    
    Output the visual prompt only.`;

    const response = await cohere.chat({
      model: "command",
      message: prompt,
      temperature: 0.3, // Lower temperature for more literal descriptions
    });

    return response.text.trim();
  } catch (error) {
    return sceneText; // Fallback to raw text if Cohere fails
  }
};