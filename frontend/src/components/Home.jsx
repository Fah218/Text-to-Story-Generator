import React from 'react';
import { Sparkles, Wand2, ArrowRight, Layers, Image as ImageIcon, BookOpen, ChevronRight, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home({ navigate }) {
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const featureCards = [
        {
            title: 'Infinite Imagination',
            desc: 'Weave any prompt into a compelling, multi-scene narrative. Explore sci-fi, fantasy, romance, and beyond.',
            icon: <Wand2 className="w-6 h-6 text-cyan-400" />,
            image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000",
            accent: 'from-cyan-500 to-blue-500'
        },
        {
            title: 'Structured Generation',
            desc: 'Our engine orchestrates your story into coherent, distinct, and highly detailed acts and chapters automatically.',
            icon: <Layers className="w-6 h-6 text-purple-400" />,
            image: "https://images.unsplash.com/photo-1618365908648-e71bd5716cba?auto=format&fit=crop&q=80&w=1000",
            accent: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Vivid Illustrations',
            desc: 'Each scene is accompanied by breathtaking AI-generated keyframe illustrations that bring your vision to life.',
            icon: <ImageIcon className="w-6 h-6 text-emerald-400" />,
            image: "https://images.pexels.com/photos/3532543/pexels-photo-3532543.jpeg",
            accent: 'from-emerald-500 to-teal-500'
        }
    ];

    const galleries = [
        { title: 'In a world of magic ', genre: 'Sci-Fi', url: 'https://images.pexels.com/photos/2522672/pexels-photo-2522672.jpeg' },
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
        <div className="min-h-[calc(100vh-64px)] bg-transparent overflow-y-auto selection:bg-indigo-200 text-brand-text relative">

            {/* Hero Section */}
            <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden z-10">
                <motion.div
                    style={{ y: yHero, opacity: opacityHero }}
                    className="max-w-7xl mx-auto px-6 lg:px-8 relative"
                >
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-card border border-brand-border backdrop-blur-md shadow-sm text-brand-primary font-semibold text-sm mb-8 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Sparkles className="w-4 h-4" />
                            <span className="relative z-10">Next-Generation AI Storytelling</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl lg:text-7xl xl:text-8xl font-black text-brand-text tracking-tight mb-8 leading-[1.1]"
                        >
                            Where ideas become <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                masterpieces.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto font-light"
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
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500 group-hover:duration-200" />
                                <div className="relative bg-brand-card backdrop-blur-md px-8 py-4 rounded-2xl font-bold text-lg text-brand-primary flex items-center justify-center gap-2 border border-brand-border group-hover:bg-white transition-colors shadow-lg">
                                    Start Writing Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/about')}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg text-slate-700 bg-brand-card hover:bg-brand-card border border-brand-border shadow-sm backdrop-blur-lg transition-all flex items-center justify-center gap-2"
                            >
                                See How It Works
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Decorative floating UI elements behind the hero text */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-1/4 left-10 hidden lg:block"
                >
                    <div className="bg-brand-card backdrop-blur-xl border border-brand-border p-4 rounded-2xl shadow-2xl rotate-[-12deg]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500" />
                            <div className="h-2 w-20 bg-brand-card rounded-full" />
                        </div>
                        <div className="h-2 w-32 bg-brand-card rounded-full mb-2" />
                        <div className="h-2 w-24 bg-brand-card rounded-full" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute bottom-1/4 right-10 hidden lg:block"
                >
                    <div className="bg-brand-card backdrop-blur-xl border border-brand-border p-4 rounded-2xl shadow-2xl rotate-[8deg]">
                        <ImageIcon className="w-8 h-8 text-cyan-400 mb-2" />
                        <div className="h-2 w-24 bg-cyan-400/30 rounded-full mb-2" />
                        <div className="h-2 w-16 bg-brand-card rounded-full" />
                    </div>
                </motion.div>
            </div>

            {/* Feature Cards Section (Glassmorphism) */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {featureCards.map((feature, idx) => (
                        <motion.div
                            variants={itemVariants}
                            key={idx}
                            className="group relative bg-brand-card backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2rem] overflow-hidden border border-brand-border transition-all duration-500"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-100 transform group-hover:scale-105 transition-all duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent z-10" />
                                <div className="absolute top-6 left-6 z-30 w-14 h-14 bg-brand-card border border-brand-border backdrop-blur-xl shadow-lg rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                            </div>
                            <div className="p-8 relative z-30 -mt-6">
                                <h3 className="text-2xl font-bold text-brand-text mb-4 flex items-center gap-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                                    {feature.desc}
                                </p>
                            </div>
                            {/* Hover animated glow line */}
                            <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${feature.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Glowing Divider */}
            <div className="w-full max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Gallery Grid Section */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl lg:text-6xl font-black text-brand-text mb-6 tracking-tight">Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Masterpieces</span></h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">Explore stunning worlds, characters, and concepts brought to life using StoryStudio's multi-modal generative AI.</p>
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
                            className="group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-brand-card border border-brand-border hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)] aspect-[3/4] transition-all duration-500 hover:-translate-y-2"
                        >
                            <img
                                src={item.url}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent opacity-100 transition-opacity duration-500" />

                            <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="mb-auto self-end">
                                    <div className="w-10 h-10 rounded-full bg-brand-primary backdrop-blur-md shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                                        <ArrowRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md rounded-lg text-xs font-bold tracking-wider uppercase mb-3 w-max">
                                    {item.genre}
                                </span>
                                <h4 className="text-2xl font-bold text-brand-text leading-tight drop-shadow-md">{item.title}</h4>

                                <div className="mt-4 flex items-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/studio');
                                        }}
                                        className="flex items-center gap-2 bg-brand-primary hover:bg-blue-700 shadow-md text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                                    >
                                        <BookOpen className="w-4 h-4 text-white" /> Read Story
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom CTA (Glassmorphism + Neon) */}
            <div className="relative py-24 mb-16 max-w-5xl mx-auto px-6 lg:px-8 z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl p-12 lg:p-20 text-center group border border-white/40"
                >
                    <motion.div
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 z-0 bg-[length:200%_200%]"
                    />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000')] opacity-20 bg-cover bg-center mix-blend-overlay z-1" />
                    <div className="relative z-10 text-white">
                        <div className="flex justify-center mb-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="p-4 bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/30"
                            >
                                <Star className="w-8 h-8 text-yellow-300 fill-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]" />
                            </motion.div>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white drop-shadow-md">Your next masterpiece awaits.</h2>
                        <p className="text-xl text-indigo-50 mb-10 max-w-xl mx-auto drop-shadow-sm">Join the creators generating thousands of beautiful, illustrated stories automatically.</p>

                        <button
                            onClick={() => navigate('/studio')}
                            className="relative overflow-hidden bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.7)] hover:-translate-y-1 inline-flex items-center gap-2 group"
                        >
                            <span className="relative z-10 flex items-center gap-2">Launch Studio <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
