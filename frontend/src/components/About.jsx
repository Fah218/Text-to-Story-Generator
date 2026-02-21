import React, { useState } from 'react';
import { Network, PenTool, BrainCircuit, Cpu, Zap, ArrowRight, X, Layers, Server, Code, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function About({ navigate }) {
    const [activeStep, setActiveStep] = useState(null);

    const storySnippets = [
        "A lonely robot finding a paintbrush in the ruins of Earth...",
        "Two rival wizards forced to share a tiny metropolitan apartment...",
        "A dragon who accidentally becomes a successful pastry chef...",
        "The last starship pilot discovering a hidden galaxy of glass...",
        "A detective who can only solve crimes while asleep...",
        "An ancient forest where the trees whisper forgotten secrets...",
        "A cafe suspended between dimensions offering tea to lost souls...",
        "A clockmaker who discovers how to rewind time by 5 minutes..."
    ];

    const steps = [
        {
            id: 1,
            icon: <BrainCircuit className="w-8 h-8 text-cyan-600" />,
            title: "Concept",
            desc: "Brainstorms the core plot, arcs, and themes instantly.",
            color: "from-cyan-500 to-blue-500",
            shadow: "shadow-cyan-500/20"
        },
        {
            id: 2,
            icon: <Network className="w-8 h-8 text-purple-600" />,
            title: "Structure",
            desc: "Maps your story onto a timeline of distinct scenes.",
            color: "from-purple-500 to-pink-500",
            shadow: "shadow-purple-500/20"
        },
        {
            id: 3,
            icon: <PenTool className="w-8 h-8 text-emerald-600" />,
            title: "Narrative Weave",
            desc: "Drafts vivid text adopting your chosen genre and tone.",
            color: "from-emerald-500 to-teal-500",
            shadow: "shadow-emerald-500/20"
        },
        {
            id: 4,
            icon: <Cpu className="w-8 h-8 text-amber-500" />,
            title: "Visual Rendering",
            desc: "Generates beautiful illustrations aligned with the text.",
            color: "from-amber-500 to-orange-500",
            shadow: "shadow-amber-500/20"
        }
    ];

    const workflows = [
        {
            title: "Frontend Interface",
            desc: "A sleek, responsive React app captures your prompts, configurations (genres, tones, lengths), and sends a validated payload to the engine.",
            icon: <Code className="w-6 h-6 text-blue-600" />,
            color: "from-blue-400 to-indigo-500",
            bgColor: "bg-blue-50/80",
            shadow: "shadow-blue-500/20"
        },
        {
            title: "System Orchestration",
            desc: "Our robust backend handles data protocols, user state, and intelligently breaks your creative brief down into individual parallel AI tasks.",
            icon: <Server className="w-6 h-6 text-purple-600" />,
            color: "from-purple-400 to-fuchsia-500",
            bgColor: "bg-purple-50/80",
            shadow: "shadow-purple-500/20"
        },
        {
            title: "Multi-Modal Generation",
            desc: "Advanced language models write the chapters while vision models simultaneously generate gorgeous, context-aware keyframe illustrations.",
            icon: <Sparkles className="w-6 h-6 text-cyan-600" />,
            color: "from-cyan-400 to-teal-500",
            bgColor: "bg-cyan-50/80",
            shadow: "shadow-cyan-500/20"
        },
        {
            title: "Delivery & Export",
            desc: "The completed story is assembled seamlessly on your screen. Users can read scene-by-scene interactively or export the full book to PDF.",
            icon: <FileText className="w-6 h-6 text-rose-500" />,
            color: "from-rose-400 to-orange-500",
            bgColor: "bg-rose-50/80",
            shadow: "shadow-rose-500/20"
        }
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-transparent overflow-y-auto selection:bg-indigo-200 text-brand-text relative flex flex-col">

            {/* Header */}
            <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden z-10 border-b border-indigo-100/50">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-brand-card border border-brand-border rounded-2xl backdrop-blur-xl mb-8 shadow-sm relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            <Zap className="w-8 h-8 text-indigo-500 relative z-10" />
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 mb-8 tracking-tight drop-shadow-sm">
                            Behind the Magic
                        </h1>
                        <p className="text-xl lg:text-2xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
                            StoryStudio is an intelligent engine. It doesn't just write; it orchestrates your ideas into a complete universe.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Interactive Philosophy Section */}
            <div className="max-w-5xl mx-auto px-6 lg:px-8 py-24 flex-grow relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-brand-text mb-4">How it works</h2>
                    <p className="text-slate-500 text-lg">Click an icon below to reveal the process.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 lg:gap-12 relative z-20">
                    {steps.map((step) => (
                        <motion.button
                            key={step.id}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveStep(step)}
                            className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-brand-card border backdrop-blur-xl flex flex-col items-center justify-center gap-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all overflow-hidden group ${activeStep?.id === step.id ? 'border-transparent shadow-md ring-2 ring-indigo-400/50' : 'border-brand-border shadow-sm hover:border-transparent'}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 ${activeStep?.id === step.id ? 'opacity-20' : 'group-hover:opacity-[0.15]'} transition-opacity duration-300`} />
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                {step.icon}
                                <span className="text-[10px] lg:text-xs font-bold text-slate-600 hidden sm:block">{step.title}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Explanation Card (AnimatePresence) */}
                <div className="mt-16 h-64 relative">
                    <AnimatePresence mode="wait">
                        {activeStep ? (
                            <motion.div
                                key={activeStep.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute inset-0 max-w-2xl mx-auto"
                            >
                                <div className="bg-brand-card backdrop-blur-2xl border border-brand-border rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activeStep.color}`} />
                                    <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${activeStep.color} rounded-full blur-[60px] opacity-[0.15] group-hover:opacity-30 transition-opacity duration-500`} />

                                    <button
                                        onClick={() => setActiveStep(null)}
                                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-brand-text bg-white/50 hover:bg-white/80 rounded-full transition-colors backdrop-blur-md shadow-sm border border-brand-border z-20"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10 text-center sm:text-left">
                                        <div className={`p-4 rounded-2xl bg-white/80 border border-brand-border backdrop-blur-md shadow-sm transform group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500 ${activeStep.shadow}`}>
                                            {React.cloneElement(activeStep.icon, { className: "w-12 h-12 flex-shrink-0" })}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Phase {activeStep.id}</div>
                                            <h3 className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${activeStep.color} mb-4`}>{activeStep.title}</h3>
                                            <p className="text-lg text-slate-600 leading-relaxed font-light">
                                                {activeStep.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="text-slate-500 font-light flex items-center gap-3">
                                    <span className="w-12 h-px bg-slate-300" />
                                    Select an icon to view phase details
                                    <span className="w-12 h-px bg-slate-300" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* System Architecture / Workflow Section */}
            <div className="relative py-32 z-10 border-t border-indigo-100/50 bg-transparent">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl lg:text-5xl font-black text-brand-text mb-6 tracking-tight">Project Architecture</h2>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                                Explore the intricate technical workflow from the moment you hit generate to the delivery of your final masterpiece.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {workflows.map((flow, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15, type: "spring" }}
                                className={`group relative ${flow.bgColor} backdrop-blur-2xl border border-brand-border hover:border-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden`}
                            >
                                <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${flow.color} rounded-full blur-[50px] opacity-[0.05] group-hover:opacity-30 group-hover:scale-150 transition-all duration-700`} />
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${flow.color} rounded-bl-full opacity-[0.02] group-hover:opacity-10 transition-opacity duration-500`} />

                                <div className={`relative z-10 w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-500 ${flow.shadow}`}>
                                    {React.cloneElement(flow.icon, { className: "w-6 h-6 transition-colors duration-300 drop-shadow-sm" })}
                                </div>

                                <h3 className="relative z-10 text-xl font-bold text-brand-text mb-4 flex items-center gap-3">
                                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${flow.color} text-sm font-black`}>0{idx + 1}</span>
                                    {flow.title}
                                </h3>

                                <p className="relative z-10 text-slate-600 font-light leading-relaxed text-sm">
                                    {flow.desc}
                                </p>

                                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${flow.color} opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 origin-left`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-24 z-10 border-t border-indigo-100/50 bg-gradient-to-t from-sky-100/50 to-white/60 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl lg:text-5xl font-black mb-8 text-brand-text tracking-tight">Ready to spin a tale?</h2>
                    <button
                        onClick={() => navigate('/studio')}
                        className="bg-gradient-to-r from-brand-primary to-cyan-500 hover:from-brand-primary hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto"
                    >
                        Open the Studio <ArrowRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Infinite Scrolling Marquee */}
                <div className="w-full overflow-hidden mt-20 relative px-4">
                    {/* Fading Edges */}
                    <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-sky-50 to-transparent z-10 hidden md:block" />
                    <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white/30 to-transparent z-10 hidden md:block" />

                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="flex gap-6 w-max items-center py-4"
                    >
                        {[...storySnippets, ...storySnippets].map((text, idx) => (
                            <div
                                key={idx}
                                className="bg-white backdrop-blur-xl border border-indigo-100/60 hover:border-indigo-200/80 shadow-[0_4px_15px_rgb(0,0,0,0.03)] px-6 py-5 rounded-2xl w-80 shrink-0 transform hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-2 mb-2 opacity-50 text-indigo-500">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-xs font-bold tracking-wider uppercase">Idea</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 line-clamp-2 italic leading-relaxed group-hover:text-brand-primary transition-colors">
                                    "{text}"
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
