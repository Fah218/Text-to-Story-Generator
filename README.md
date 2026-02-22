# StoryStudio: Gen AI Text-to-Story App

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-text--to--story--generator--sepia.vercel.app-6366f1?style=for-the-badge)](https://text-to-story-generator-sepia.vercel.app/)

> **🌐 Deployed App:** [https://text-to-story-generator-sepia.vercel.app/](https://text-to-story-generator-sepia.vercel.app/)

## 🌟 Project Idea: Interactive Story Weaver

**StoryStudio** (Interactive Story Weaver) builds on standard text-to-image generators by creating an immersive, chained narrative experience. Users input **"vibe keywords"** (like "cyberpunk mystery" or "cozy fantasy adventure") to spawn dynamic, fully fleshed-out stories accompanied by matching visuals. 

This is perfect for hackathon demos that wow judges with creativity, polish, and seamless multi-modal AI integration.

### Core Workflow
1. **Interactive Input:** Users enter vibe keywords, set genres, tones, and target audiences via a beautiful, sleek React frontend.
2. **Text Generation (Backend Chaining):** The backend sequentially chains APIs (e.g., Cohere/GPT). It generates a 200-300 word story segment based on keywords and prior context. The prompt engineering is highly specific: *"Write in second-person, vivid style matching the {vibe}, end with a cliffhanger."*
3. **Image Synthesis:** The new story snippet is fed to an image generation API (Leonardo AI) for scene-specific visuals using prompts like: *"Illustrate this scene: {last_paragraph} in {vibe} aesthetic, cinematic lighting."*
4. **AR/Immersive Rendering:** Images and story text are piped to the frontend to create shareable "story cards" (with PDF export capabilities) and an interactive read-through interface that feels alive with parallax and smooth animations.

---

## 🏗️ Project Structure

This repository contains a full-stack Next-Generation React application.

### File & Folder Explorer

```text
Story Studio 2/
├── frontend/                 # React frontend (Vite)
│   ├── public/               # Static public assets
│   ├── src/                  # Source code for the frontend
│   │   ├── api/              # API configurations (e.g., storyApi.js)
│   │   ├── assets/           # React component assets
│   │   ├── components/       # Reusable UI React components (Home, AuthModal, etc.)
│   │   ├── hooks/            # Custom React hooks (e.g., useStoryGeneration)
│   │   ├── store/            # Redux store and slices (uiSlice, storySlice)
│   │   ├── App.jsx           # Main application routing
│   │   ├── index.css         # Global Tailwind CSS classes
│   │   └── main.jsx          # Application entry point
│   ├── eslint.config.js      # ESLint configuration
│   ├── index.html            # Main HTML template
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
├── backend/                  # Node.js + Express backend
│   ├── controllers/          # Route controller logic (authController, storyController)
│   ├── models/               # MongoDB schema models (User.js)
│   ├── routes/               # Express API routing (authRoutes, storyRoutes)
│   ├── services/             # AI API integration services (textService, imageService)
│   ├── .env.sample           # Sample environment variables
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies
├── DEPLOY.md                 # Deployment documentation
├── Dockerfile                # Docker configuration
├── mongo_connect.md          # MongoDB documentation
├── nixpacks.toml             # Built-in nixpacks configurations
├── package.json              # Main project dependencies
├── railway.toml              # Railway deployment config
└── README.md                 # Current documentation file
```

### The Frontend (`/frontend`)
* **Framework:** React + Vite for lightning-fast development.
* **Styling:** Vanilla Tailwind CSS configured with a custom 'Light Gradient & Glass Cards' aesthetic.
* **State Management:** Fully integrated `Redux Toolkit` separating UI state logic from API calls.
* **Animations:** Powered heavily by `Framer Motion` for smooth component mountings, hover effects, and active screen transitions.
* **Routing:** Handled entirely by `react-router-dom`.

### The Backend (`/backend`)
* **Framework:** Node.js with Express.
* **AI Integration:** Prompts and API keys are managed here to securely connect to Cohere (for text) and Leonardo AI (for images).
* **Database (MongoDB):** Utilizes mongoose to connect to a MongoDB Atlas cluster.

---

## 🔐 Database & Authentication (MongoDB)

MongoDB Atlas is the backbone of our user management and data persistence:
* **Sign Up / Login:** We use JWT (JSON Web Tokens) combined with `bcryptjs` for secure password hashing. 
* **User Models:** MongoDB stores user credentials securely. When a user logs in, the backend verifies the hashed password against the database and returns a JWT.
* **Data Persistence:** The database also allows future features like saving generated stories permanently to a user's cloud account instead of just local storage.

---

## 🚀 Setup & Run Instructions

To run the project locally, you need to configure your environment variables and run both the frontend and the backend simultaneously.

### 1. Initialize API Keys & Environment Variables

Create a `.env` file strictly inside the `backend` directory. Without these keys, the application will not be able to securely connect to MongoDB or generate AI stories and images:

```env
# /backend/.env
PORT=5001
MONGODB_URI=your_mongodb_cluster_connection_string
JWT_SECRET=your_secure_jwt_secret_key
COHERE_API_KEY=your_cohere_text_generation_api_key
LEONARDO_API_KEY=your_leonardo_ai_image_generation_api_key
```

### 2. Start the Backend Server
```bash
cd backend
# Install dependencies if you haven't yet
npm install
# Start the server (uses nodemon for hot-reloading)
npm run dev
```
*The backend usually runs on `http://localhost:5001`.*

### 3. Start the Frontend Server
```bash
cd frontend
# Install dependencies
npm install
# Start the Vite development server
npm run dev
```
*Navigate to the local URL provided by Vite (usually `http://localhost:5173`).*

---

## 🤖 Vibe Log: Building with Antigravity

This project was built and accelerated significantly using **Antigravity** (Google DeepMind's advanced agentic coding assistant). 

### How Antigravity Accelerated the Build
Antigravity wasn't just a code-completion tool; it acted as a pair-programmer, handling systematic refactoring, complex UI design implementation, and backend scaffolding. 

Here is how different reasoning models within Antigravity helped shape the project:
* **Architecture & Scaffolding:** Antigravity structured the entire `frontend` vs `backend` split, setting up Redux, React Router, and the Express boilerplate in one go.
* **Aesthetic UI/UX (Frontend):** Antigravity excels at generating modern code. I used prompts to request "Soft Minimal Pastel Themes", "Interactive 3D Floating Elements", and "Glassmorphism navigation bars". It systematically updated `Tailwind` classes across multiple files and added complex `Framer Motion` animations without breaking the React component structure.
* **Logic Debugging (Backend):** When hooking up the Cohere API and MongoDB, Antigravity tracked down async/await bugs, diagnosed `JSON parse` errors during API chaining, and properly implemented the JWT middleware.

### Key Prompts & Workflows Used
* **Initial Setup Prompt:** *"Create a Gen AI-powered text-to-story generator application called 'Interactive Story Weaver'. It needs a light gradient background, glass cards, a sidebar for input, story history, and PDF export function."*
* **Themetic Overhaul Prompt:** *"Update the entire project's UI to match a 'Soft Minimal Pastel Theme' using specific color values. Add some text and hover animation to the 'From idea to pdf in seconds' div on the home page."*
* **Dynamic Background Updates:** *"Adjust the background of the main App to contain an animated soft pastel mesh gradient instead of solid colors."*
* **Cursor Sparkle Effects:** *"Implement a custom interactive Sparkle effect when the cursor clicks or hovers over primary CTA buttons across the interface."*
* **Feature Card Animations:** *"Add beautiful hover animations and 3D tilt effects to all the feature cards on the Home page, making them feel alive when hovered."*
* **Export PDF Activation Workflow:** *"Activate the export PDF functionality in the Story History page using jsPDF. Ensure the exported document is nicely formatted with the story title, genre, tone, and full chapter breakdown including generated images."*
* **Backend Authenication Workflow:** *"Implement backend authentication by connecting to a MongoDB database, creating user models and routes, and integrating this functionality with the frontend's authentication modal."*
* **Micro-interactions:** *"Make the stat pills, filter buttons, and history cards on the Story History page float seamlessly on hover for a more dynamic feel."*

Antigravity combined creative UI interpretation with rigid backend execution to bring the StoryStudio prototype to life rapidly.
