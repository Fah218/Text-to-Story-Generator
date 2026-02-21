import React, { useEffect } from 'react';
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
  ArrowRight,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import {
  setPrompt, setSelectedGenre, setSelectedTone,
  setSceneCount, setTargetAudience, setActiveScene,
  setIsGenerating, setLoadingStage, setGeneratedStory, updateSceneText
} from './store/storySlice';
import axios from 'axios';
import { toggleAdvancedOpen, setIsExamplesOpen, setAuthModal } from './store/uiSlice';
import { useStoryGeneration } from './hooks/useStoryGeneration';

// Components
import Home from './components/Home';
import About from './components/About';
import AuthModal from './components/AuthModal';
import ClickParticles from './components/ClickParticles';
import Footer from './components/Footer';
import StoryHistory, { saveStoryToHistory } from './components/StoryHistory';

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

  const [isExporting, setIsExporting] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [isEditingScene, setIsEditingScene] = React.useState(false);
  const [editingText, setEditingText] = React.useState('');

  useEffect(() => {
    setIsEditingScene(false);
  }, [activeScene]);

  // Auth State
  const [user, setUser] = React.useState(null);

  const readUserFromStorage = React.useCallback(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    readUserFromStorage();
    // Listen for auth changes from AuthModal (login/signup without page reload)
    window.addEventListener('auth-updated', readUserFromStorage);
    return () => window.removeEventListener('auth-updated', readUserFromStorage);
  }, [readUserFromStorage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleExportPDF = async () => {
    if (!generatedStory) return;
    setIsExporting(true);

    try {
      // Helper: fetch an image URL and convert to base64 data URL
      const toBase64 = async (url) => {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (!response.ok) throw new Error('fetch failed');
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch {
          return null; // gracefully skip unloadable images
        }
      };

      // Letter page dimensions in points (72pt = 1in)
      const PAGE_W = 595; // 8.27in * 72
      const PAGE_H = 842; // 11.69in * 72
      const MARGIN = 40;
      const CONTENT_W = PAGE_W - MARGIN * 2;

      const doc = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait' });
      let y = MARGIN;

      const checkPage = (neededHeight) => {
        if (y + neededHeight > PAGE_H - MARGIN) {
          doc.addPage();
          y = MARGIN;
        }
      };

      // --- Cover / Title page ---
      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(15, 23, 42); // slate-900
      const titleLines = doc.splitTextToSize(generatedStory.title, CONTENT_W);
      titleLines.forEach(line => {
        checkPage(36);
        doc.text(line, PAGE_W / 2, y, { align: 'center' });
        y += 36;
      });

      y += 10;

      // Subtitle badge
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139); // slate-500
      const subtitle = `A ${selectedGenre || 'Story'} · ${selectedTone || ''} · ${targetAudience || ''}`;
      doc.text(subtitle.trim().replace(/·\s*$/, ''), PAGE_W / 2, y, { align: 'center' });
      y += 30;

      // Decorative divider
      doc.setDrawColor(99, 102, 241); // indigo-500
      doc.setLineWidth(1.5);
      doc.line(PAGE_W / 2 - 60, y, PAGE_W / 2 + 60, y);
      y += 40;

      // --- Scenes ---
      for (let idx = 0; idx < generatedStory.scenes.length; idx++) {
        const scene = generatedStory.scenes[idx];

        // Chapter label
        checkPage(24);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(99, 102, 241); // indigo
        doc.text(`CHAPTER ${idx + 1}`, MARGIN, y);
        y += 18;

        // Scene title
        checkPage(32);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42); // slate-900
        const sceneTitleLines = doc.splitTextToSize(scene.title || `Scene ${idx + 1}`, CONTENT_W);
        sceneTitleLines.forEach(line => {
          checkPage(24);
          doc.text(line, MARGIN, y);
          y += 24;
        });
        y += 8;

        // Scene image
        if (scene.imageUrl) {
          const imgData = await toBase64(scene.imageUrl);
          if (imgData) {
            const IMG_H = 200;
            checkPage(IMG_H + 16);
            try {
              doc.addImage(imgData, 'JPEG', MARGIN, y, CONTENT_W, IMG_H, undefined, 'FAST');
              y += IMG_H + 16;
            } catch (imgErr) {
              console.warn('Could not embed image:', imgErr);
            }
          }
        }

        // Scene text
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(71, 85, 105); // slate-600
        const textLines = doc.splitTextToSize(scene.text || '', CONTENT_W);
        textLines.forEach(line => {
          checkPage(18);
          doc.text(line, MARGIN, y);
          y += 18;
        });

        y += 30; // space between scenes
      }

      // Save
      const filename = generatedStory.title.replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_') + '.pdf';
      doc.save(filename);

    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('PDF export failed: ' + error.message);
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
      dispatch(setIsGenerating(true));
      dispatch(setGeneratedStory(null));

      // Loading animation stages
      dispatch(setLoadingStage(0));

      // Stage 1 - Planning
      setTimeout(() => dispatch(setLoadingStage(1)), 1000);

      // Stage 2 - Writing
      setTimeout(() => dispatch(setLoadingStage(2)), 2000);

      const response = await axios.post(
        "http://localhost:5001/api/story/generate",
        {
          concept: prompt,
          genre: selectedGenre,
          tone: selectedTone,
          scenes: sceneCount,
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
      dispatch(setLoadingStage(2));
      dispatch(setGeneratedStory(formattedStory));

      // ── Auto-save to local history ──
      saveStoryToHistory(formattedStory, {
        genre: selectedGenre,
        tone: selectedTone,
        audience: targetAudience,
      });

    } catch (error) {
      console.error("Frontend Error:", error);
    } finally {
      dispatch(setIsGenerating(false));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-brand-text font-sans selection:bg-brand-primary/20">
      <ClickParticles />
      <AuthModal />

      {/* Navbar */}
      <nav className="h-16 px-6 lg:px-10 border-b border-slate-200 bg-brand-card backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
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
            {user && (
              <button
                onClick={() => navigate('/history')}
                className={`text-sm font-medium transition-colors ${currentPage === 'history' ? 'text-brand-primary' : 'text-slate-600 hover:text-brand-primary'}`}
              >
                History
              </button>
            )}
            <button
              onClick={() => navigate('/about')}
              className={`text-sm font-medium transition-colors ${currentPage === 'about' ? 'text-brand-primary' : 'text-slate-600 hover:text-brand-primary'}`}
            >
              About
            </button>
          </div>
          <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-full">
                  Hello, {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 hover:text-red-500 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home navigate={navigate} />} />
        <Route path="/about" element={<About navigate={navigate} />} />
        <Route path="/history" element={<StoryHistory navigate={navigate} />} />
        <Route path="/studio" element={
          <div className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col lg:flex-row relative overflow-hidden min-h-[calc(100vh-180px)]">
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
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-slate-200 bg-white font-semibold text-base transition-all shadow-sm ${isExporting ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 hover:border-slate-300 '}`}
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
                      className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex flex-col gap-3"
                    >
                      {loadingStages.map((stage, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${loadingStage > idx ? 'bg-brand-primary text-white' :
                            loadingStage === idx ? 'bg-indigo-100 text-brand-primary shadow-inner' : 'bg-slate-200 text-slate-400'
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
            <div className={`flex-1 bg-transparent relative h-full ${(!isGenerating && !generatedStory) ? 'flex flex-col items-center justify-center overflow-hidden' : 'overflow-y-auto px-6 lg:px-12 py-8 custom-scrollbar'}`}>

              {!isGenerating && !generatedStory && (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-blue-100 to-cyan-50 flex items-center justify-center shadow-inner border border-white">
                    <Sparkles className="w-10 h-10 text-brand-primary" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Your Story Awaits</h3>
                  <p className="text-slate-600 max-w-md text-lg leading-relaxed font-medium">
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
                        <span className="px-4 py-1.5 bg-white backdrop-blur-md border border-white shadow-sm text-indigo-700 rounded-full text-xs font-bold tracking-wider uppercase">{selectedGenre}</span>
                        <span className="px-4 py-1.5 bg-white backdrop-blur-md border border-white shadow-sm text-purple-700 rounded-full text-xs font-bold tracking-wider uppercase">{selectedTone}</span>
                        <span className="px-4 py-1.5 bg-white backdrop-blur-md border border-white shadow-sm text-emerald-700 rounded-full text-xs font-bold tracking-wider uppercase">{targetAudience}</span>
                      </div>
                    </div>

                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeScene}
                          initial={{ opacity: 0, scale: 0.98, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98, y: -10 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="bg-white backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden group relative"
                        >
                          <div className="relative h-72 sm:h-[450px] w-full overflow-hidden bg-slate-100 group">
                            <img
                              src={generatedStory.scenes[activeScene].imageUrl}
                              alt={`Illustration for ${generatedStory.scenes[activeScene].title}`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay for Image */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                              <button
                                onClick={() => setSelectedImage(generatedStory.scenes[activeScene].imageUrl)}
                                className="text-white/90 hover:text-white flex items-center gap-2 text-sm font-semibold bg-white backdrop-blur-md w-fit px-4 py-2 rounded-xl border border-white transition-all hover:bg-white"
                              >
                                <ImageIcon className="w-4 h-4" /> View Full Image
                              </button>
                            </div>
                          </div>
                          <div className="p-8 lg:p-12 relative bg-gradient-to-b from-white to-slate-50/50">
                            <div className="flex items-center justify-between mb-8">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100/50 text-indigo-600 rounded-xl text-xs font-black tracking-[0.2em] uppercase shadow-inner">
                                <BookOpen className="w-4 h-4" />
                                Chapter {activeScene + 1} of {generatedStory.scenes.length}
                              </div>
                              {!isEditingScene && (
                                <button
                                  onClick={() => {
                                    setEditingText(generatedStory.scenes[activeScene].text);
                                    setIsEditingScene(true);
                                  }}
                                  className="text-slate-500 hover:text-brand-primary flex items-center gap-2 text-sm font-semibold transition-colors bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 shadow-sm"
                                >
                                  <Edit2 className="w-4 h-4" /> Edit Text
                                </button>
                              )}
                            </div>
                            <h3 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">{generatedStory.scenes[activeScene].title}</h3>
                            {isEditingScene ? (
                              <div className="space-y-4 animate-in fade-in duration-200">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full min-h-[200px] p-4 rounded-xl border-2 border-indigo-100 bg-white focus:border-brand-primary focus:ring-4 focus:ring-indigo-50 outline-none text-slate-700 text-lg leading-relaxed font-serif resize-y shadow-inner transition-all"
                                  autoFocus
                                />
                                <div className="flex justify-end gap-3">
                                  <button
                                    onClick={() => setIsEditingScene(false)}
                                    className="px-4 py-2 flex items-center gap-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors border border-transparent"
                                  >
                                    <X className="w-4 h-4" /> Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      dispatch(updateSceneText({ sceneIndex: activeScene, newText: editingText }));
                                      setIsEditingScene(false);
                                    }}
                                    className="px-6 py-2 flex items-center gap-2 bg-brand-primary text-white font-bold hover:bg-indigo-600 rounded-xl transition-all shadow-md shadow-indigo-200"
                                  >
                                    <Check className="w-4 h-4" /> Save Changes
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-slate-600 text-xl leading-loose font-serif">
                                {generatedStory.scenes[activeScene].text}
                              </p>
                            )}
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

                    <div className="mt-12 text-center border-t border-slate-200 pt-8">
                      <button className="bg-brand-card backdrop-blur-md text-slate-700 border border-brand-border shadow-sm hover:border-indigo-300 hover:text-brand-text hover:bg-brand-card font-semibold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        Modify Settings to Generate Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-lg p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white/70 hover:text-white bg-white hover:bg-white p-3 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Expanded Scene"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent clicking img from closing modal
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
