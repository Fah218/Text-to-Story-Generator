import React from 'react';
import {
    Sparkles,
    Wand2,
    ArrowRight,
    Layers,
    Image as ImageIcon,
    BookOpen,
    ChevronRight,
    Star,
    PlayCircle,
    Clock,
    Download,
    Share2
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home({ navigate }) {
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 250]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const yFloating1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const yFloating2 = useTransform(scrollYProgress, [0, 1], [0, 150]);

    const featureCards = [
        {
            title: 'Infinite Imagination',
            desc: 'Weave any prompt into a compelling, multi-scene narrative. Explore sci-fi, fantasy, romance, and beyond.',
            icon: <Wand2 className="w-8 h-8 text-indigo-500" />,
            image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000",
            accent: 'from-indigo-500 to-blue-500'
        },
        {
            title: 'Structured Generation',
            desc: 'Our engine orchestrates your story into coherent, distinct, and highly detailed acts and chapters automatically.',
            icon: <Layers className="w-8 h-8 text-purple-500" />,
            image: "https://images.unsplash.com/photo-1618365908648-e71bd5716cba?auto=format&fit=crop&q=80&w=1000",
            accent: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Vivid Illustrations',
            desc: 'Each scene is accompanied by breathtaking AI-generated keyframe illustrations that bring your vision to life.',
            icon: <ImageIcon className="w-8 h-8 text-emerald-500" />,
            image: "https://images.pexels.com/photos/3532543/pexels-photo-3532543.jpeg",
            accent: 'from-emerald-500 to-teal-500'
        }
    ];

    const steps = [
        {
            step: "01",
            title: "Set the Stage",
            desc: "Enter a simple prompt, select your genre, and set the perfect tone for your narrative.",
            icon: <PlayCircle className="w-6 h-6 text-brand-primary" />
        },
        {
            step: "02",
            title: "AI Generation",
            desc: "Our engine writes captivating scenes and renders stunning accompanying illustrations.",
            icon: <Clock className="w-6 h-6 text-purple-500" />
        },
        {
            step: "03",
            title: "Export & Share",
            desc: "Download your beautifully formatted story as a PDF, complete with chapters and art.",
            icon: <Download className="w-6 h-6 text-emerald-500" />
        }
    ];

    const galleries = [
        { title: 'In a world of magic', genre: 'Sci-Fi', url: 'https://images.pexels.com/photos/2522672/pexels-photo-2522672.jpeg' },
        { title: 'A ghost detective', genre: 'Fantasy', url: 'https://images.pexels.com/photos/2522671/pexels-photo-2522671.jpeg' },
        { title: 'A boy finds a map', genre: 'Cyberpunk', url: 'https://images.pexels.com/photos/1144269/pexels-photo-1144269.jpeg' },
        { title: 'A mysterious traveler', genre: 'Mystery', url: 'https://images.pexels.com/photos/1144254/pexels-photo-1144254.jpeg' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="min-h-screen bg-transparent overflow-y-auto overflow-x-hidden selection:bg-brand-primary/20 text-brand-text relative">

            {/* Hero Section */}
            <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden z-10 w-full">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-blue-400/20 blur-[120px] rounded-full mix-blend-multiply"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[10%] -right-[10%] w-[40%] h-[60%] bg-purple-400/20 blur-[150px] rounded-full mix-blend-multiply"
                    />
                </div>

                <motion.div
                    style={{ y: yHero, opacity: opacityHero }}
                    className="max-w-7xl mx-auto px-6 lg:px-8 relative"
                >
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-card border border-brand-border backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-brand-primary font-bold text-sm mb-8 relative overflow-hidden group cursor-default"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Sparkles className="w-4 h-4" />
                            <span className="relative z-10">Next-Generation AI Storytelling</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-6xl lg:text-7xl xl:text-8xl font-black text-brand-text tracking-tight mb-8 leading-[1.05]"
                        >
                            Where ideas become <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-500 drop-shadow-sm">
                                masterpieces.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto font-medium"
                        >
                            Harness the power of Generative AI to instantly transform simple prompts into lush, multi-scene illustrated narratives.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-5"
                        >
                            <button
                                onClick={() => navigate('/studio')}
                                className="w-full sm:w-auto relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-purple-500 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition duration-500 group-hover:duration-200" />
                                <div className="relative bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl group-hover:scale-[1.02] transition-transform">
                                    Start Writing Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/about')}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg text-slate-700 bg-brand-card hover:bg-white border border-brand-border shadow-sm backdrop-blur-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                See How It Works
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Decorative floating UI elements */}
                <motion.div
                    style={{ y: yFloating1 }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-[20%] left-8 lg:left-16 xl:left-[10%] hidden md:block z-20 pointer-events-auto"
                >
                    <motion.div
                        animate={{ y: [-15, 15, -15] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-white/60 backdrop-blur-xl border border-white p-5 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.05)] rotate-[-12deg] hover:rotate-[-5deg] hover:scale-110 hover:bg-white transition-all duration-500 cursor-pointer"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform -rotate-12">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-800 leading-tight mb-1">
                                    AI-Powered
                                </div>
                                <div className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide">
                                    Storytelling
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-slate-500 font-medium ml-1">Infinite narrative possibilities.</div>
                    </motion.div>
                </motion.div>

                <motion.div
                    style={{ y: yFloating2 }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute top-[25%] right-8 lg:right-16 xl:right-[10%] hidden md:block z-20 pointer-events-auto"
                >
                    <motion.div
                        animate={{ y: [15, -15, 15] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-white/60 backdrop-blur-xl border border-white p-5 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.05)] rotate-[12deg] hover:rotate-[5deg] hover:scale-110 hover:bg-white transition-all duration-500 cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-sm transform rotate-6 border border-emerald-200/50">
                                <ImageIcon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-800 mb-1.5">Breathtaking Visuals</div>
                                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md inline-flex items-center shadow-sm">
                                    Multi-Modal AI Engine
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Feature Cards Section */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-brand-text mb-4">Unleash Your Creativity</h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Three powerful pillars driving our story generation engine.</p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {featureCards.map((feature, idx) => (
                        <motion.div
                            variants={itemVariants}
                            key={idx}
                            className="group relative bg-brand-card backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2rem] overflow-hidden border border-brand-border transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent z-10" />
                                <div className="absolute top-6 left-6 z-30 w-16 h-16 bg-white border border-slate-100 shadow-xl rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-all duration-300">
                                    {feature.icon}
                                </div>
                            </div>
                            <div className="p-8 relative z-30 bg-white/50 backdrop-blur-sm -mt-6 h-full border-t border-white">
                                <h3 className="text-2xl font-black text-brand-text mb-4 flex items-center gap-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-base font-medium">
                                    {feature.desc}
                                </p>
                            </div>
                            {/* Animated glow line */}
                            <div className={`absolute bottom-0 left-0 h-1.5 w-full bg-gradient-to-r ${feature.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-40`} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* How it Works Section */}
            <div className="py-24 bg-white/40 backdrop-blur-xl border-y border-brand-border">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">

                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-sm mb-6">
                                    <PlayCircle className="w-4 h-4" /> Workflow
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black text-brand-text mb-6">From Idea to PDF in seconds.</h2>
                                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                                    You bring the concept, we bring the magic. StoryStudio uses advanced language and diffusion models to rapidly produce complete stories.
                                </p>

                                <div className="space-y-8">
                                    {steps.map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.15 }}
                                            className="flex gap-6 group cursor-default"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-white border border-brand-border shadow-sm flex items-center justify-center shrink-0 group-hover:shadow-md group-hover:scale-105 transition-all">
                                                {step.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-brand-text flex items-center gap-3">
                                                    <span className="text-sm font-black text-slate-300">{step.step}</span>
                                                    {step.title}
                                                </h4>
                                                <p className="text-slate-500 mt-2 font-medium">{step.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:w-1/2 w-full relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative rounded-[2rem] bg-brand-card backdrop-blur-3xl border border-white shadow-2xl p-6 lg:p-10 group transition-all duration-500 hover:shadow-[0_30px_60px_rgba(99,102,241,0.2)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-purple-500/10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative z-10 flex flex-col h-full transform transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="flex gap-2 items-center mb-6">
                                        <div className="w-3 h-3 rounded-full bg-red-400 group-hover:bg-red-500 shadow-sm transition-colors" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400 group-hover:bg-amber-500 shadow-sm transition-colors" />
                                        <div className="w-3 h-3 rounded-full bg-green-400 group-hover:bg-green-500 shadow-sm transition-colors" />
                                        <span className="ml-2 text-xs font-semibold text-brand-primary font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">GENERATING_SCENE...</span>
                                    </div>
                                    <div className="w-full aspect-video rounded-2xl overflow-hidden relative shadow-lg group-hover:shadow-2xl transition-all duration-500 mb-6 border border-white/50">
                                        <img
                                            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000"
                                            alt="Preview"
                                            className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                                            <p className="text-white text-sm lg:text-base font-semibold leading-tight drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                "The ancient forest whispered secrets of forgotten realms, a glow emanating from the deeply rooted flora."
                                            </p>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white backdrop-blur flex items-center justify-center text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 shadow-[0_0_30px_rgba(255,255,255,0.7)]">
                                            <Sparkles className="w-6 h-6 animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <motion.div
                                            className="h-2 w-full bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500 rounded-full origin-left"
                                            initial={{ scaleX: 0.2 }}
                                            whileInView={{ scaleX: 1 }}
                                            transition={{ duration: 2.5, ease: "easeOut" }}
                                        />
                                        <div className="text-slate-600 text-sm lg:text-base leading-relaxed font-medium transition-colors duration-500 group-hover:text-slate-900">
                                            Suddenly, the dense canopy parted to reveal a glowing civilization, built entirely from massive floating crystals...
                                        </div>
                                        <div className="flex gap-2 items-center pt-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold uppercase tracking-wide">Fantasy</span>
                                            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-bold uppercase tracking-wide">Whimsical</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Gallery Grid Section */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl lg:text-5xl font-black text-brand-text mb-6">Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-purple-600">Masterpieces</span></h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Explore stunning worlds, characters, and concepts brought to life using StoryStudio's multi-modal generative AI.</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {galleries.map((item, idx) => (
                        <motion.div
                            variants={itemVariants}
                            key={idx}
                            className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border border-brand-border hover:shadow-2xl aspect-[3/4] transition-all duration-500 hover:-translate-y-3"
                        >
                            <img
                                src={item.url}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="mb-auto self-end flex gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <Share2 className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <span className="inline-block px-3 py-1 bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-lg text-xs font-bold tracking-wider uppercase mb-3 w-max">
                                    {item.genre}
                                </span>
                                <h4 className="text-2xl font-bold text-white leading-tight drop-shadow-md mb-2">{item.title}</h4>

                                <div className="mt-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/studio');
                                        }}
                                        className="flex w-full items-center justify-center gap-2 bg-brand-primary text-white text-sm font-bold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        <BookOpen className="w-4 h-4" /> Read Story
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom CTA Section */}
            <div className="relative py-24 max-w-6xl mx-auto px-6 lg:px-8 z-10 mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] overflow-hidden shadow-2xl p-12 lg:p-20 text-center group bg-brand-primary border border-white/20"
                >
                    {/* Animated Gradient overlay */}
                    <motion.div
                        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute inset-0 bg-gradient-to-br from-brand-primary via-purple-600 to-indigo-600 z-0 bg-[length:200%_200%]"
                    />
                    {/* Background pattern mask */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay z-1" />

                    <div className="relative z-10 text-white flex flex-col items-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="p-4 bg-white/10 backdrop-blur-xl rounded-full shadow-lg border border-white/20 mb-8"
                        >
                            <Star className="w-10 h-10 text-yellow-300 fill-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.5)]" />
                        </motion.div>

                        <h2 className="text-4xl lg:text-6xl font-black mb-6 drop-shadow-md">Your next masterpiece awaits.</h2>
                        <p className="text-xl lg:text-2xl text-white/80 mb-10 max-w-2xl font-medium drop-shadow-sm">Join the creators generating thousands of beautiful, illustrated stories automatically.</p>

                        <button
                            onClick={() => navigate('/studio')}
                            className="relative overflow-hidden bg-white text-indigo-700 px-10 py-5 rounded-2xl font-extrabold text-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:-translate-y-1 inline-flex items-center gap-3 group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Launch Studio
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>

        </div>
    );
}
