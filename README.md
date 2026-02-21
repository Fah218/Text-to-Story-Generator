# StoryStudio: Gen AI Text-to-Story App

## Project Idea & How It Works

**StoryStudio** is an AI-powered Text-to-Story Generation application. It empowers users to input basic concepts or fully realized prompts, specify their preferred genre, tone, length, and target audience, and automatically generate beautifully written, coherent narratives broken down scene-by-scene.

Behind the scenes, the system acts as an autonomous digital storytelling agency:
1.  **Concept & Structure Phase:** The input prompt is analyzed, expanded into a logical structure, and segmented into chapters or scenes depending on the specified length.
2.  **Narrative Weave Phase:** Advanced Large Language Models adopt the requested genre and tone to generate high-quality text for each scene.
3.  **Visual Rendering Phase:** Alongside the text, context-aware prompts are automatically formulated and fed into Vision models to produce beautiful keyframe illustrations tailored to the current scene's setting and characters.
4.  **Delivery Phase:** Text and images are assembled into an interactive read-through interface on the UI. The user can consume the content easily or export the finalized book to an offline source like PDF.

## Project Structure

This repository contains a full-stack Next-Generation React application.

**The Frontend (`/frontend`)**
*   Built using React + Vite.
*   Styling is powered robustly by **Tailwind CSS**, configured tightly to a custom 'Light Gradient & Glass Cards' theme (`index.css`).
*   **State Management:** Built utilizing `Redux Toolkit` (`/src/store`) strictly separating concerns (UI state vs. Story logic).
*   **Animations:** Powered heavily by `Framer Motion` for smooth component mountings, active screen transitions, and interactive click effects.
*   **Routing:** Handled entirely by `react-router-dom` to pivot effortlessly between Landing Pages, the fully immersive Generation Studio, and documentation pages.

**The Backend (`/backend`)** *(Integration Pending)*
*   Will handle prompt chaining, LLM interfacing (OpenAI / Anthropic equivalents), and image generation API forwarding.
*   Will connect to a database to persist users, saved prompts, and finalized generated PDF/Image stories.

## Frontend Setup

To launch the frontend locally and see the beautiful UI:

1. Validate you are in the correct directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (Vite, Tailwind, Framer Motion, Redux, Lucide, html2pdf):
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
4. Navigate to the local URL provided by Vite (usually `http://localhost:5173`).

Enjoy building worlds!
