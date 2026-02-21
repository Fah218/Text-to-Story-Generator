const { generateStoryText, generateImagePrompt } = require("../services/textService");
const { generateImage } = require("../services/imageService");

exports.generateStory = async (req, res) => {
  try {
    const { concept, tone, genre, scenes } = req.body;

    // 1. Generate the narrative
    const storyData = await generateStoryText(concept, tone, genre, scenes);
    const finalScenes = [];

    // 2. Process scenes sequentially for better API stability
    for (let scene of storyData.scenes) {
      // Create a visual-heavy prompt from the story text
      const visualPrompt = await generateImagePrompt(scene.description);

      // Send to Leonardo with Style/Tone metadata
      const imageUrl = await generateImage(visualPrompt, genre, tone);

      finalScenes.push({
        ...scene,
        visualPrompt: visualPrompt, // Useful for debugging
        image: imageUrl
      });
    }

    res.json({
      title: storyData.title,
      scenes: finalScenes
    });

  } catch (error) {
    console.error("Process Failed:", error);
    res.status(500).json({ error: "Story generation failed", details: error.message });
  }
};