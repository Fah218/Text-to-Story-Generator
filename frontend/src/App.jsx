import React, { useState, useEffect, useRef } from 'react';
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
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

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
  const [prompt, setPrompt] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Sci-fi");
  const [selectedTone, setSelectedTone] = useState("Serious");
  const [scenes, setScenes] = useState(3);
  const [targetAudience, setTargetAudience] = useState("All Ages");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0); // 0: none, 1: Planning, 2: Writing, 3: Illustrating

  // Result State
  const [generatedStory, setGeneratedStory] = useState(null);
  const storyRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    if (!storyRef.current || !generatedStory) return;
    setIsExporting(true);

    const element = storyRef.current;
    const opt = {
      margin: 10,
      filename: `${generatedStory.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => setIsExporting(false));
  };

  const loadingStages = [
    { text: "Planning story structure...", icon: <BookOpen className="w-5 h-5 animate-pulse" /> },
    { text: "Writing narrative...", icon: <Type className="w-5 h-5 animate-pulse" /> },
    { text: "Generating illustrations...", icon: <ImageIcon className="w-5 h-5 animate-pulse" /> }
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setLoadingStage(0);
    setGeneratedStory(null);

    // Mock the generation process for demo
    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage > 2) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratedStory({
            title: "The Neon Enigma",
            concept: prompt,
            scenes: Array.from({ length: scenes }).map((_, i) => ({
              id: i + 1,
              title: `Scene ${i + 1}: The Discovery`,
              text: "The neon lights flickered over the wet pavement, reflecting a city that never slept but always dreamed. Detective Aris pulled his collar up against the chill, his cybernetic eye scanning the alleyway. The jazz club 'Blue Note' was just ahead, its neon sign buzzing like a dying insect. Inside, the conspiracy lay waiting...",
              imageUrl: `https://images.unsplash.com/photo-1517594422361-5e1f74bc9338?auto=format&fit=crop&q=80&w=800&h=400`
            }))
          });
        }, 1500);
      } else {
        setLoadingStage(currentStage);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200">
      {/* Navbar */}
      <nav className="h-16 px-6 lg:px-10 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800">
            StoryStudio
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
            <a href="#" className="text-indigo-600 font-semibold">Studio</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>

            <div className="relative">
              <button
                onClick={() => setIsExamplesOpen(!isExamplesOpen)}
                className={`flex items-center gap-1 transition-colors ${isExamplesOpen ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
              >
                Examples
                <ChevronDown className={`w-3 h-3 transition-transform ${isExamplesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isExamplesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
                    className="absolute top-full mt-6 right-0 w-[400px] bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden z-50 py-2 max-h-96 overflow-y-auto custom-scrollbar"
                  >
                    <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Start with an idea...
                    </div>
                    {EXAMPLES.map((ex, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPrompt(ex);
                          setIsExamplesOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border-b border-slate-50 last:border-0"
                      >
                        {ex}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </button>
            <button className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm shadow-indigo-200">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Sidebar (Input Panel) */}
        <div className="w-full lg:w-[420px] xl:w-[480px] h-full overflow-y-auto bg-white/40 border-r border-slate-200/50 p-6 lg:p-8 custom-scrollbar">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Story</h2>

          <div className="space-y-8">
            {/* Concept Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-500" />
                  Story Concept
                </label>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your story idea here... (e.g. A robot who learns to paint in a post-apocalyptic world)"
                className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none shadow-sm placeholder:text-slate-400"
              />
            </div>

            {/* Genre & Tone Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Genre
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedGenre === genre
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                        }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map(tone => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedTone === tone
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:text-purple-600'
                        }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white/60 rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/80 transition-colors"
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
                    {/* Scene Slider */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-600">Scene Count</label>
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{scenes}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={scenes}
                        onChange={(e) => setScenes(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Target Audience
                      </label>
                      <select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white/90 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
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
        </div>

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
                      key={scene.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 + 0.2 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100 group">
                        <img
                          src={scene.imageUrl}
                          alt={`Illustration for ${scene.title}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <button className="text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium">
                            <ImageIcon className="w-4 h-4" /> View Full Image
                          </button>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold tracking-widest uppercase mb-4">
                          Scene {idx + 1}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">{scene.title}</h3>
                        <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                          {scene.text}
                        </p>
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

        </div>
      </div>
    </div>
  );
}
