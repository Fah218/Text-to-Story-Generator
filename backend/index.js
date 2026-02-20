const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('StoryStudio Backend is Running!');
});

// Placeholder for Gen AI generation route
app.post('/api/generate-story', async (req, res) => {
    try {
        const { prompt, genre, tone, scenes, targetAudience } = req.body;

        // Here you would integrate with OpenAI or another Gen AI service
        // e.g. const response = await openai.createChatCompletion({...})

        res.json({
            success: true,
            message: "This is where the Gen AI story will be returned."
        });
    } catch (error) {
        console.error("Error generating story:", error);
        res.status(500).json({ success: false, error: "Failed to generate story" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
