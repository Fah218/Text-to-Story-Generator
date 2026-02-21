const axios = require("axios");

function getStyleByGenreAndTone(genre, tone) {
  const genreStyles = {
    "Fantasy": "ethereal fantasy art, intricate detail, magical glow",
    "Sci-fi": "cyberpunk aesthetic, futuristic tech, neon lighting",
    "Mystery": "film noir, heavy shadows, misty atmosphere",
    "Educational": "flat vector illustration, clean lines, bright colors",
    "Romance": "soft focus, warm cinematic lighting, pastel hues",
    "Horror": "ghastly lighting, high contrast, dark eerie atmosphere",
    "Adventure": "epic cinematic wide shot, vibrant colors"
  };

  const toneStyles = {
    "Humorous": "vibrant cartoon style, expressive characters",
    "Serious": "photorealistic, cinematic, muted colors",
    "Dark": "low key lighting, moody, dramatic shadows",
    "Whimsical": "storybook style, dreamy, surreal elements",
    "Inspirational": "golden hour lighting, lens flare, uplifting"
  };

  return `${genreStyles[genre] || "digital art"}, ${toneStyles[tone] || "balanced lighting"}`;
}

exports.generateImage = async (safePrompt, genre, tone) => {
  try {
    const style = getStyleByGenreAndTone(genre, tone);
    
    // STRUCTURE: [Subject (High Weight)] + [Environment] + [Style/Lighting (Lower Weight)]
    const finalPrompt = `(Subject: ${safePrompt}), (Style: ${style}), 8k resolution, highly detailed, masterpiece.`;

    const response = await axios.post(
      "https://cloud.leonardo.ai/api/rest/v1/generations",
      {
        prompt: finalPrompt,
        modelId: "7b592283-e8a7-4c5a-9ba6-d18c31f258b9", // Leonardo Vision XL (Best for prompt adherence)
        width: 768,
        height: 768,
        num_images: 1,
        alchemy: false, // Crucial for high-quality prompt following
        guidance_scale: 9, // Increased to force the AI to stick to the text
        negative_prompt: "text, letters, watermark, distorted face, extra limbs, blurry, low quality"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LEONARDO_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const generationId = response.data.sdGenerationJob.generationId;
    return await waitForImage(generationId);
  } catch (error) {
    console.error("Leonardo Error:", error.response?.data || error.message);
    return "https://via.placeholder.com/1024x1024?text=Image+Generation+Failed";
  }
};

async function waitForImage(generationId) {
  const maxAttempts = 15;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const result = await axios.get(
      `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
      { headers: { Authorization: `Bearer ${process.env.LEONARDO_API_KEY}` } }
    );
    const images = result.data.generations_by_pk?.generated_images;
    if (images && images.length > 0) return images[0].url;
  }
  return "https://via.placeholder.com/1024x1024?text=Timed+Out";
}