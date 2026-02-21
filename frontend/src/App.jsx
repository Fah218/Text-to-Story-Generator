import React, { useEffect, useRef } from 'react';
import {
  Sparkles,
  Wand2,
  Settings2,
  BookOpen,
  Image as ImageIcon,
  ChevronDown,
  Loader2,
  Play,
  Type,
  Users,
  Download,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import {
  setPrompt, setSelectedGenre, setSelectedTone,
  setSceneCount, setTargetAudience, setActiveScene
} from './store/storySlice';
import { toggleAdvancedOpen, setIsExamplesOpen, setAuthModal } from './store/uiSlice';
import { useStoryGeneration } from './hooks/useStoryGeneration';

// Components
import Home from './components/Home';
import About from './components/About';
import AuthModal from './components/AuthModal';
import ClickParticles from './components/ClickParticles';
import Footer from './components/Footer';

const GENRES = ['Fantasy', 'Sci-fi', 'Mystery', 'Educational', 'Romance', 'Thriller', 'Adventure', 'Horror'];
const TONES = ['Lighthearted', 'Serious', 'Humorous', 'Dark', 'Inspirational', 'Dramatic', 'Whimsical', 'Mysterious'];
const AUDIENCES = ['Early Readers', 'Children (3-8)', 'Middle Grade (9-12)', 'Teens', 'Young Adult', 'Adult', 'All Ages'];
const EXAMPLES = [
  "A rainy city, a missing person case, and a jazz club that holds the key to a dark conspiracy.",
  "An ancient robot wakes up in a forest of glowing trees.",
  "A young baker discovers their pastries grant temporary magical abilities.",
  "A group of teens discover their school is a training ground for time travelers.",
  "A dragon who is allergic to gold tries to build a hoard of wooden toys instead.",
  "In a world where music is magic, a deaf girl discovers she can cast the most powerful spells.",
  "A spaceship AI falls in love with the captain's pet cat.",
  "A ghost detective solves mysteries for other spirits in a bustling spectral metropolis.",
  "A boy finds a map in his attic that leads to a secret kingdom underneath his town.",
  "During a severe drought, a mysterious traveler arrives with a jar of endless water."
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPage = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  const {
    prompt, selectedGenre, selectedTone, sceneCount, targetAudience,
    isGenerating, loadingStage, generatedStory, activeScene
  } = useSelector(state => state.story);

  const { isAdvancedOpen, isExamplesOpen } = useSelector(state => state.ui);

  const { generateStory } = useStoryGeneration();

  const storyRef = useRef(null);
  const [isExporting, setIsExporting] = React.useState(false);

  useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setSelectedImage(null);
    }
  };

  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleExportPDF = async () => {
  if (!storyRef.current || !generatedStory) return;
  setIsExporting(true);

  try {
    const element = storyRef.current;

    // Clone node to avoid Tailwind oklch parsing issues
    const clone = element.cloneNode(true);

    // Force safe background & text color
    clone.style.background = "#ffffff";
    clone.style.color = "#000000";

    // Append clone temporarily (required for proper rendering)
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    // Select all images inside cloned node
    const images = clone.querySelectorAll("img");

    // Wait for all images to load
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    const opt = {
      margin: [0.5, 0.5],
      filename: `${generatedStory.title.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: "#ffffff", // Critical Fix
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    await html2pdf().set(opt).from(clone).save();

    // Remove clone after export
    document.body.removeChild(clone);

  } catch (error) {
    console.error("PDF Export failed:", error);
    alert("Failed to export PDF.");
  } finally {
    setIsExporting(false);
  }
 };
  

    
  

  const loadingStages = [
    { text: "Planning story structure...", icon: <BookOpen className="w-5 h-5 animate-pulse" /> },
    { text: "Writing narrative...", icon: <Type className="w-5 h-5 animate-pulse" /> },
    { text: "Generating illustrations...", icon: <ImageIcon className="w-5 h-5 animate-pulse" /> }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);
      setGeneratedStory(null);

    // Loading animation stages
      setLoadingStage(0);

    // Stage 1 - Planning
      setTimeout(() => setLoadingStage(1), 1000);

    // Stage 2 - Writing
      setTimeout(() => setLoadingStage(2), 2000);

      const response = await axios.post(
        "http://localhost:5000/api/story/generate",
        {
          concept: prompt,
          genre: selectedGenre,
          tone: selectedTone,
          scenes: scenes,
          audience: targetAudience
        }
      );

      const data = response.data;

    // Map backend structure to frontend structure
      const formattedStory = {
        title: data.title,
        concept: prompt,
        scenes: data.scenes.map((scene, index) => ({
          id: index + 1,
          title: scene.title || `Scene ${index + 1}`,
          text: scene.description,
          imageUrl: scene.image // Leonardo returns image URL
        }))
      };
      setLoadingStage(2);
      setGeneratedStory(formattedStory);

    } catch (error) {
      console.error("Frontend Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-fuchsia-50 to-cyan-100 text-brand-text font-sans selection:bg-indigo-200">
      <ClickParticles />
      <AuthModal />

      {/* Ambient Aurora Background Orbs (Global) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[60px] z-10" />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-300/50 blur-[100px] z-0"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[70%] rounded-full bg-purple-300/50 blur-[120px] z-0"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.5, 0.4],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[10%] w-[70%] h-[50%] rounded-full bg-cyan-300/50 blur-[120px] z-0"
        />
      </div>
      {/* Navbar */}
      <nav className="h-16 px-6 lg:px-10 border-b border-slate-200/50 bg-brand-card backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-br from-brand-primary to-purple-600 p-2 rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800">
            StoryStudio
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-brand-primary' : 'text-slate-600 hover:text-brand-primary'}`}
            >
              Home
            </button>
            <div className="relative">
              <button
                onClick={() => dispatch(setIsExamplesOpen(!isExamplesOpen))}
                className={`flex items-center gap-1 transition-colors ${isExamplesOpen ? 'text-brand-primary' : 'hover:text-brand-primary'}`}
              >
                Examples
                <ChevronDown className={`w-3 h-3 transition-transform ${isExamplesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isExamplesOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => dispatch(setIsExamplesOpen(false))} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
                    >
                      {EXAMPLES.map((ex, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            dispatch(setPrompt(ex));
                            dispatch(setIsExamplesOpen(false));
                            navigate('/studio');
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-brand-primary transition-colors border-b border-slate-50 last:border-0"
                        >
                          {ex}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => navigate('/studio')}
              className={`text-sm font-medium transition-colors ${currentPage === 'studio' ? 'text-brand-primary' : 'text-slate-600 hover:text-brand-primary'}`}
            >
              Studio
            </button>
            <button
              onClick={() => navigate('/about')}
              className={`text-sm font-medium transition-colors ${currentPage === 'about' ? 'text-brand-primary' : 'text-slate-600 hover:text-brand-primary'}`}
            >
              About
            </button>
          </div>
          <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
            <button
              onClick={() => dispatch(setAuthModal({ isOpen: true, type: 'login' }))}
              className="text-sm font-medium text-slate-600 hover:text-brand-primary transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => dispatch(setAuthModal({ isOpen: true, type: 'signup' }))}
              className="text-sm font-semibold bg-brand-primary hover:bg-brand-primary text-white px-4 py-2 rounded-lg transition-all shadow-sm shadow-indigo-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home navigate={navigate} />} />
        <Route path="/about" element={<About navigate={navigate} />} />
        <Route path="/studio" element={
          <div className="max-w-[1400px] w-full mx-auto flex-1 min-h-[calc(100vh-[160px])] flex flex-col lg:flex-row relative">
            {/* Left Panel (Controls) */}
            <div className={`w-full lg:w-[450px] bg-brand-card backdrop-blur-2xl border-r border-brand-border shadow-[4px_0_24px_rgba(0,0,0,0.04)] flex flex-col transition-all duration-300 z-10 
              ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                {/* Headers */}
                <div>
                  <h2 className="text-2xl font-bold text-brand-text mb-2">Create Story</h2>
                  <p className="text-sm text-slate-500">Transform your ideas into an illustrated narrative.</p>
                </div>

                {/* Prompt Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-indigo-500" />
                      Story Prompt
                    </label>
                  </div>
                  <textarea
                    value={prompt}
                    onChange={(e) => dispatch(setPrompt(e.target.value))}
                    placeholder="Describe your story idea here... (e.g. A robot who learns to paint in a post-apocalyptic world)"
                    className="w-full h-32 p-4 rounded-xl border border-brand-border bg-brand-card backdrop-blur-md focus:bg-brand-card focus:ring-2 focus:ring-indigo-100 focus:border-brand-primary outline-none transition-all resize-none shadow-sm placeholder:text-slate-400"
                  />
                </div>

                {/* Core Settings */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Genre</label>
                    <div className="flex flex-wrap gap-2">
                      {GENRES.map(genre => (
                        <button
                          key={genre}
                          onClick={() => dispatch(setSelectedGenre(genre))}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedGenre === genre
                            ? 'bg-brand-primary text-white shadow-md shadow-indigo-200'
                            : 'bg-brand-card backdrop-blur-sm text-slate-600 border border-brand-border shadow-sm hover:border-indigo-300 hover:bg-brand-card hover:text-brand-primary'
                            }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map(tone => (
                        <button
                          key={tone}
                          onClick={() => dispatch(setSelectedTone(tone))}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTone === tone
                            ? 'bg-cyan-500 text-white shadow-md shadow-cyan-200'
                            : 'bg-brand-card backdrop-blur-sm text-slate-600 border border-brand-border shadow-sm hover:border-cyan-300 hover:bg-brand-card hover:text-cyan-600'
                            }`}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="bg-brand-card backdrop-blur-lg rounded-xl border border-brand-border shadow-sm overflow-hidden">
                  <button
                    onClick={() => dispatch(toggleAdvancedOpen())}
                    className="w-full flex items-center justify-between p-4 hover:bg-brand-card transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Settings2 className="w-4 h-4 text-slate-400" />
                      Advanced Settings
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isAdvancedOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 space-y-5"
                      >
                        {/* Scene Count Slider */}
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-600">Content Length</label>
                            <span className="text-sm font-bold text-brand-primary bg-indigo-50 px-2 py-0.5 rounded-md">{sceneCount}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-400">1</span>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={sceneCount}
                              onChange={(e) => dispatch(setSceneCount(parseInt(e.target.value)))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <span className="text-xs text-slate-400">10</span>
                          </div>
                        </div>

                        {/* Target Audience */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Target Audience
                          </label>
                          <select
                            value={targetAudience}
                            onChange={(e) => dispatch(setTargetAudience(e.target.value))}
                            className="w-full p-2.5 rounded-lg border border-brand-border bg-brand-card backdrop-blur-sm shadow-sm text-sm focus:bg-brand-card focus:border-brand-primary focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                          >
                            {AUDIENCES.map(audience => (
                              <option key={audience} value={audience}>{audience}</option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Generate Button */}
                <button
                  disabled={isGenerating || !prompt.trim()}
                  onClick={handleGenerate}
                  className={`w-full relative overflow-hidden group flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${isGenerating || !prompt.trim()
                    ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                    : 'bg-gradient-to-r from-brand-primary to-cyan-500 hover:from-brand-primary hover:to-cyan-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]'
                    }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      Generate Story
                    </>
                  )}
                  {/* Shine effect */}
                  {!isGenerating && prompt.trim() && (
                    <div className="absolute inset-0 -translate-x-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                  )}
                </button>

                <AnimatePresence>
                  {generatedStory && !isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-slate-200 bg-white font-semibold text-base transition-all shadow-sm ${isExporting ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 hover:border-slate-300'}`}
                      >
                        {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 text-slate-500" />}
                        {isExporting ? 'Exporting...' : 'Export Story as PDF'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading Stages indicator */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-xl flex flex-col gap-3"
                    >
                      {loadingStages.map((stage, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${loadingStage > idx ? 'bg-brand-primary text-white' :
                            loadingStage === idx ? 'bg-indigo-100 text-brand-primary shadow-inner' : 'bg-slate-200/50 text-slate-400'
                            }`}>
                            {loadingStage > idx ? <Sparkles className="w-4 h-4" /> : stage.icon}
                          </div>
                          <span className={`text-sm font-medium ${loadingStage > idx ? 'text-indigo-800' :
                            loadingStage === idx ? 'text-brand-primary animate-pulse' : 'text-slate-400'
                            }`}>
                            {stage.text}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Panel (Output/Viewer) */}
            <div className="flex-1 bg-transparent relative h-full overflow-y-auto px-6 lg:px-12 py-8 custom-scrollbar relative">

              {!isGenerating && !generatedStory && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-blue-100 to-cyan-50 flex items-center justify-center shadow-inner border border-white/50">
                    <Sparkles className="w-10 h-10 text-brand-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-text mb-3">Your Story Awaits</h3>
                  <p className="text-slate-500 max-w-md text-base leading-relaxed">
                    Enter a concept, select your settings, and watch as our AI weaves a captivating narrative complete with vivid scenes.
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-4 border-blue-100/50 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-brand-primary rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-brand-primary">
                      {loadingStages[loadingStage]?.icon}
                    </div>
                  </div>
                  <p className="text-lg font-medium text-slate-700 animate-pulse">
                    {loadingStages[loadingStage]?.text}
                  </p>
                </div>
              )}

              <AnimatePresence>
                {generatedStory && !isGenerating && (
                  <motion.div
                    ref={storyRef}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="max-w-4xl mx-auto pb-20 bg-transparent"
                  >
                    <div className="mb-10 text-center">
                      <h1 className="text-4xl lg:text-5xl font-extrabold text-brand-text mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        {generatedStory.title}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="px-3 py-1 bg-indigo-100 text-brand-primary rounded-full text-xs font-semibold tracking-wider uppercase">{selectedGenre}</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold tracking-wider uppercase">{selectedTone}</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold tracking-wider uppercase">{targetAudience}</span>
                      </div>
                    </div>

                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeScene}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-brand-card backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-brand-border overflow-hidden group"
                        >
                          <div className="relative h-64 sm:h-[400px] w-full overflow-hidden bg-slate-100 group">
                            <img
                              src={generatedStory.scenes[activeScene].imageUrl}
                              alt={`Illustration for ${generatedStory.scenes[activeScene].title}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                              <button className="text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium">
                                <ImageIcon className="w-4 h-4" /> View Full Image
                              </button>
                            </div>
                          </div>
                          <div className="p-8 lg:p-10">
                            <div className="flex items-center justify-between mb-6">
                              <div className="inline-block px-3 py-1 bg-indigo-50 text-brand-primary rounded-md text-xs font-bold tracking-widest uppercase">
                                Scene {activeScene + 1} of {generatedStory.scenes.length}
                              </div>
                            </div>
                            <h3 className="text-3xl font-bold text-brand-text mb-6">{generatedStory.scenes[activeScene].title}</h3>
                            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                              {generatedStory.scenes[activeScene].text}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Scene Navigation */}
                    <div className="mt-8 flex items-center justify-between">
                      <button
                        onClick={() => dispatch(setActiveScene(Math.max(0, activeScene - 1)))}
                        disabled={activeScene === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeScene === 0
                          ? 'text-slate-400 bg-slate-100 cursor-not-allowed border border-transparent'
                          : 'text-slate-700 bg-brand-card backdrop-blur-md border border-brand-border shadow-sm hover:border-indigo-300 hover:text-brand-primary hover:bg-brand-card'
                          }`}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <div className="flex gap-2">
                        {generatedStory.scenes.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => dispatch(setActiveScene(idx))}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${activeScene === idx
                              ? 'bg-brand-primary w-8'
                              : 'bg-slate-300 hover:bg-slate-400'
                              }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => dispatch(setActiveScene(Math.min(generatedStory.scenes.length - 1, activeScene + 1)))}
                        disabled={activeScene === generatedStory.scenes.length - 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeScene === generatedStory.scenes.length - 1
                          ? 'text-slate-400 bg-slate-100 cursor-not-allowed border border-transparent'
                          : 'text-brand-primary bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 shadow-sm'
                          }`}
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-12 text-center border-t border-slate-200/60 pt-8">
                      <button className="bg-brand-card backdrop-blur-md text-slate-700 border border-brand-border shadow-sm hover:border-indigo-300 hover:text-brand-text hover:bg-brand-card font-semibold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        Modify Settings to Generate Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate Button */}
            <button
              disabled={isGenerating || !prompt.trim()}
              onClick={handleGenerate}
              className={`w-full relative overflow-hidden group flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${isGenerating || !prompt.trim()
                ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/25 active:scale-[0.98]'
                }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Generate Story
                </>
              )}
              {/* Shine effect */}
              {!isGenerating && prompt.trim() && (
                <div className="absolute inset-0 -translate-x-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
              )}
            </button>
            
            
              
            <AnimatePresence>
                {generatedStory && !isGenerating && (
                  <div className="max-w-4xl mx-auto pb-20">
        
                    {/* PDF EXPORT BUTTON - Placed above the story content */}
                    <div className="flex justify-end mb-6">
                      <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm
                          ${isExporting 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-white border-2 border-indigo-100 text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50'
                          }`}
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Preparing PDF...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Download PDF
                          </>
                        )}
                      </button>
                    </div>

                    {/* THE ACTUAL STORY CONTENT (Captured by Ref) */}
                    <motion.div
                      ref={storyRef}
                      id="story-content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
                    >
                      <div className="mb-12 text-center">
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                          {generatedStory.title}
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                          <span className="h-1 w-12 bg-indigo-500 rounded-full"></span>
                          <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">
                            A {selectedGenre} Story
                          </p>
                          <span className="h-1 w-12 bg-indigo-500 rounded-full"></span>
                        </div>
                      </div>

                      <div className="space-y-16">
                        {generatedStory.scenes.map((scene, idx) => (
                          <div
                            key={scene.id}
                            className="break-inside-avoid" 
                            style={{ pageBreakInside: 'avoid' }} // Extra insurance for PDF engines
                          >
                            <div className="relative mb-8">
                              <img
                                src={scene.imageUrl}
                                alt={scene.title}
                                crossOrigin="anonymous" 
                                className="w-full h-auto rounded-2xl shadow-lg border border-slate-100"
                              />
                            </div>
                
                            <div className="max-w-2xl mx-auto text-center md:text-left">
                              <div className="text-indigo-600 font-bold text-sm tracking-[0.2em] uppercase mb-2">
                                Chapter {idx + 1}
                              </div>
                              <h3 className="text-3xl font-bold text-slate-800 mb-6 leading-tight">
                                {scene.title}
                              </h3>
                              <p className="text-slate-600 text-xl leading-relaxed font-serif">
                                {scene.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
            </AnimatePresence>
           

            {/* Loading Stages indicator */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-xl flex flex-col gap-3"
                >
                  {loadingStages.map((stage, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${loadingStage > idx ? 'bg-indigo-600 text-white' :
                        loadingStage === idx ? 'bg-indigo-100 text-indigo-600 shadow-inner' : 'bg-slate-200/50 text-slate-400'
                        }`}>
                        {loadingStage > idx ? <Sparkles className="w-4 h-4" /> : stage.icon}
                      </div>
                      <span className={`text-sm font-medium ${loadingStage > idx ? 'text-indigo-800' :
                        loadingStage === idx ? 'text-indigo-600 animate-pulse' : 'text-slate-400'
                        }`}>
                        {stage.text}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

        {/* Right Panel (Output/Viewer) */}
        <div className="flex-1 bg-slate-50/50 relative h-full overflow-y-auto px-6 lg:px-12 py-8 custom-scrollbar relative">

          {!isGenerating && !generatedStory && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-indigo-100 to-purple-50 flex items-center justify-center shadow-inner">
                <Sparkles className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Your Story Awaits</h3>
              <p className="text-slate-500 max-w-md text-base leading-relaxed">
                Enter a concept, select your settings, and watch as our AI weaves a captivating narrative complete with vivid scenes.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Add an animated creative loading visual here */}
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                  {loadingStages[loadingStage]?.icon}
                </div>
              </div>
              <p className="text-lg font-medium text-slate-700 animate-pulse">
                {loadingStages[loadingStage]?.text}
              </p>
            </div>
          )}

          <AnimatePresence>
            {generatedStory && !isGenerating && (
              <motion.div
                ref={storyRef}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-4xl mx-auto pb-20 bg-slate-50/50"
              >
                <div className="mb-10 text-center">
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                    {generatedStory.title}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold tracking-wider uppercase">{selectedGenre}</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold tracking-wider uppercase">{selectedTone}</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold tracking-wider uppercase">{targetAudience}</span>
                  </div>
                </div>

                <div className="space-y-12">
                  {generatedStory.scenes.map((scene, idx) => (
                    <motion.div
                      ref={storyRef}
                      id="story-content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
  // Use inline style for background to override any OKLCH theme variables
                      style={{ backgroundColor: '#ffffff', color: '#0f172a' }} 
                      className="max-w-4xl mx-auto p-10 rounded-3xl shadow-xl border border-slate-100"
                    >
                      <div className="mb-12 text-center">
                        <h1 style={{ color: '#0f172a' }} className="text-4xl lg:text-6xl font-black mb-4 tracking-tight">
                          {generatedStory.title}
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                          <span style={{ backgroundColor: '#6366f1' }} className="h-1 w-12 rounded-full"></span>
                          <p style={{ color: '#64748b' }} className="font-medium uppercase tracking-widest text-xs">
                            A {selectedGenre} Story
                          </p>
                          <span style={{ backgroundColor: '#6366f1' }} className="h-1 w-12 rounded-full"></span>
                        </div>
                      </div>

                      <div className="space-y-16">
                        {generatedStory.scenes.map((scene, idx) => (
                          <div key={scene.id} className="break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
                            <div className="relative mb-8">
                              <img
                                src={scene.imageUrl}
                                alt={scene.title}
                                crossOrigin="anonymous"
                                className="w-full h-auto rounded-2xl shadow-lg"
                                style={{ border: '1px solid #f1f5f9' }}
                              />
                            </div>
        
                            <div className="max-w-2xl mx-auto text-center md:text-left">
                              <div style={{ color: '#4f46e5' }} className="font-bold text-sm tracking-[0.2em] uppercase mb-2">
                               Chapter {idx + 1}
                              </div>
                              <h3 style={{ color: '#1e293b' }} className="text-3xl font-bold mb-6 leading-tight">
                                {scene.title}
                              </h3>
                              <p style={{ color: '#334155' }} className="text-xl leading-relaxed font-serif">
                                {scene.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <button className="bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 font-semibold py-3 px-8 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    Modify Story
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
              >
                {/* Close Button */}
                <button
                  className="absolute top-6 right-6 text-white text-3xl font-bold"
                  onClick={() => setSelectedImage(null)}
                >
                  ✕
                </button>

                {/* Image */}
                <motion.img
                  src={selectedImage}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
