import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Clock, Trash2, Eye, EyeOff,
    Download, Sparkles, X, ImageIcon,
    ScrollText, Search, SlidersHorizontal,
    ChevronDown, ArrowUpDown, Layers, Filter
} from 'lucide-react';
import { jsPDF } from 'jspdf';

// ─────────────────────────────────────────────────────────────
// LocalStorage Helpers
// ─────────────────────────────────────────────────────────────

export function saveStoryToHistory(story, meta) {
    try {
        const existing = JSON.parse(localStorage.getItem('storyHistory') || '[]');
        const entry = {
            id: Date.now().toString(),
            savedAt: new Date().toISOString(),
            genre: meta.genre || '',
            tone: meta.tone || '',
            audience: meta.audience || '',
            story,
        };
        const updated = [entry, ...existing].slice(0, 50);
        localStorage.setItem('storyHistory', JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save story to history:', e);
    }
}

export function getStoryHistory() {
    try {
        return JSON.parse(localStorage.getItem('storyHistory') || '[]');
    } catch { return []; }
}

function deleteEntry(id) {
    const updated = getStoryHistory().filter(e => e.id !== id);
    localStorage.setItem('storyHistory', JSON.stringify(updated));
}

function clearAll() {
    localStorage.removeItem('storyHistory');
}

// ─────────────────────────────────────────────────────────────
// PDF Export
// ─────────────────────────────────────────────────────────────

async function exportAsPDF(entry) {
    const { story, genre, tone, audience } = entry;
    const toBase64 = async (url) => {
        try {
            const res = await fetch(url, { mode: 'cors' });
            if (!res.ok) return null;
            const blob = await res.blob();
            return new Promise((resolve, reject) => {
                const r = new FileReader();
                r.onloadend = () => resolve(r.result);
                r.onerror = reject;
                r.readAsDataURL(blob);
            });
        } catch { return null; }
    };

    const PW = 595, PH = 842, M = 40, CW = PW - M * 2;
    const doc = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait' });
    let y = M;
    const cp = (h) => { if (y + h > PH - M) { doc.addPage(); y = M; } };

    doc.setFont('helvetica', 'bold'); doc.setFontSize(28); doc.setTextColor(15, 23, 42);
    doc.splitTextToSize(story.title, CW).forEach(l => { cp(36); doc.text(l, PW / 2, y, { align: 'center' }); y += 36; });
    y += 10;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(100, 116, 139);
    doc.text(`${genre} · ${tone} · ${audience}`.replace(/·\s*$/, '').replace(/^\s*·\s*/, ''), PW / 2, y, { align: 'center' }); y += 30;
    doc.setDrawColor(99, 102, 241); doc.setLineWidth(1.5);
    doc.line(PW / 2 - 60, y, PW / 2 + 60, y); y += 40;

    for (let i = 0; i < story.scenes.length; i++) {
        const sc = story.scenes[i];
        cp(24); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(99, 102, 241);
        doc.text(`CHAPTER ${i + 1}`, M, y); y += 18;
        cp(32); doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(15, 23, 42);
        doc.splitTextToSize(sc.title || `Scene ${i + 1}`, CW).forEach(l => { cp(24); doc.text(l, M, y); y += 24; }); y += 8;
        if (sc.imageUrl) {
            const img = await toBase64(sc.imageUrl);
            if (img) { const H = 200; cp(H + 16); try { doc.addImage(img, 'JPEG', M, y, CW, H, undefined, 'FAST'); y += H + 16; } catch { } }
        }
        doc.setFont('times', 'normal'); doc.setFontSize(12); doc.setTextColor(71, 85, 105);
        doc.splitTextToSize(sc.text || '', CW).forEach(l => { cp(18); doc.text(l, M, y); y += 18; }); y += 30;
    }
    doc.save(story.title.replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_') + '.pdf');
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatDate(iso) {
    return new Date(iso).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

const GENRE_COLORS = {
    Fantasy: 'bg-violet-50 text-violet-700 border-violet-100',
    'Sci-fi': 'bg-cyan-50 text-cyan-700 border-cyan-100',
    Mystery: 'bg-amber-50 text-amber-700 border-amber-100',
    Educational: 'bg-green-50 text-green-700 border-green-100',
    Romance: 'bg-pink-50 text-pink-700 border-pink-100',
    Thriller: 'bg-red-50 text-red-700 border-red-100',
    Adventure: 'bg-orange-50 text-orange-700 border-orange-100',
    Horror: 'bg-slate-100 text-slate-700 border-slate-200 ',
};

// ─────────────────────────────────────────────────────────────
// Story Card
// ─────────────────────────────────────────────────────────────

function StoryCard({ entry, onDelete, onPreviewImage }) {
    const [expanded, setExpanded] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const scenes = entry.story?.scenes || [];
    const cover = scenes[0]?.imageUrl;
    const genreClass = GENRE_COLORS[entry.genre] || 'bg-indigo-50 text-indigo-700 border-indigo-100';

    const handleExport = async () => {
        setExporting(true);
        try { await exportAsPDF(entry); } finally { setExporting(false); }
    };

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="group bg-white backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
        >
            {/* Cover image */}
            {cover && (
                <div
                    className="relative h-44 w-full overflow-hidden cursor-pointer shrink-0"
                    onClick={() => onPreviewImage(cover)}
                >
                    <img
                        src={cover}
                        alt={entry.story.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 text-white/80 text-xs font-semibold bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white">
                        <ImageIcon className="w-3 h-3" /> {scenes.length} chapter{scenes.length !== 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {/* Body */}
            <div className="flex flex-col flex-1 p-5 gap-3">

                {/* Genre + timeago */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${genreClass}`}>
                        {entry.genre || 'Story'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeAgo(entry.savedAt)}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-2 flex-1">
                    {entry.story.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {entry.tone && (
                        <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                            {entry.tone}
                        </span>
                    )}
                    {entry.audience && (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            {entry.audience}
                        </span>
                    )}
                </div>

                {/* Date */}
                <p className="text-xs text-slate-400">{formatDate(entry.savedAt)}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-xl transition-all border border-indigo-100 hover:shadow-md hover:-translate-y-0.5 group ${expanded ? 'shadow-inner bg-indigo-100' : ''}`}
                    >
                        {expanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
                        {expanded ? 'Collapse' : 'Read'}
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center justify-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all border border-slate-200 hover:shadow-md hover:-translate-y-0.5 group"
                        title="Export PDF"
                    >
                        {exporting
                            ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                            : <Download className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:text-indigo-600 transition-all" />
                        }
                    </button>

                    {confirmDelete ? (
                        <>
                            <button
                                onClick={() => onDelete(entry.id)}
                                className="px-2 py-2 text-xs font-black text-white bg-red-50 hover:bg-red-600 rounded-xl transition-colors"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="px-2 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                No
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="flex items-center justify-center px-2.5 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 hover:shadow-sm hover:-translate-y-0.5 group"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            </div>

            {/* Expandable reader */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50/60 to-white p-5 space-y-8">
                            {scenes.map((scene, idx) => (
                                <div key={idx} className="space-y-3">
                                    <p className="text-[10px] font-black tracking-[0.22em] text-indigo-400 uppercase">
                                        Chapter {idx + 1}
                                    </p>
                                    <h4 className="text-lg font-extrabold text-slate-800 leading-snug">{scene.title}</h4>
                                    {scene.imageUrl && (
                                        <img
                                            src={scene.imageUrl}
                                            alt={scene.title}
                                            onClick={() => onPreviewImage(scene.imageUrl)}
                                            className="w-full rounded-2xl object-cover cursor-pointer hover:opacity-90 transition-opacity border border-slate-100 shadow-sm max-h-52"
                                        />
                                    )}
                                    <p className="text-slate-600 text-sm leading-relaxed font-serif">{scene.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
}

// ─────────────────────────────────────────────────────────────
// Stat Pill
// ─────────────────────────────────────────────────────────────

function StatPill({ label, value, color }) {
    return (
        <div className={`flex items-center gap-2 bg-white backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default group`}>
            <span className={`text-xl font-black ${color} group-hover:scale-110 transition-transform`}>{value}</span>
            <span className="text-xs font-semibold text-slate-500 leading-tight">{label}</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function StoryHistory({ navigate }) {
    const [entries, setEntries] = useState(() => getStoryHistory());
    const [search, setSearch] = useState('');
    const [filterGenre, setFilterGenre] = useState('All');
    const [sortBy, setSortBy] = useState('newest'); // newest | oldest | az | za
    const [confirmClear, setConfirmClear] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const allGenres = useMemo(() => {
        const gs = [...new Set(entries.map(e => e.genre).filter(Boolean))].sort();
        return ['All', ...gs];
    }, [entries]);

    const filtered = useMemo(() => {
        let list = [...entries];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(e =>
                e.story.title.toLowerCase().includes(q) ||
                (e.genre || '').toLowerCase().includes(q) ||
                (e.tone || '').toLowerCase().includes(q)
            );
        }
        if (filterGenre !== 'All') list = list.filter(e => e.genre === filterGenre);
        switch (sortBy) {
            case 'oldest': list.sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt)); break;
            case 'az': list.sort((a, b) => a.story.title.localeCompare(b.story.title)); break;
            case 'za': list.sort((a, b) => b.story.title.localeCompare(a.story.title)); break;
            default: list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        }
        return list;
    }, [entries, search, filterGenre, sortBy]);

    const totalChapters = useMemo(() => entries.reduce((sum, e) => sum + (e.story?.scenes?.length || 0), 0), [entries]);
    const genreCount = useMemo(() => [...new Set(entries.map(e => e.genre).filter(Boolean))].length, [entries]);

    const handleDelete = (id) => {
        deleteEntry(id);
        setEntries(getStoryHistory());
    };

    const handleClearAll = () => {
        clearAll();
        setEntries([]);
        setConfirmClear(false);
    };

    return (
        <>
            <div className="flex-1 w-full min-h-[calc(100vh-180px)]">

                {/* ── Hero Header ── */}
                <div className="w-full bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white relative overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 left-10 w-56 h-56 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

                    <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-14">
                        <div className="flex items-start justify-between flex-wrap gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-11 h-11 rounded-2xl bg-white backdrop-blur-md flex items-center justify-center border border-white">
                                        <ScrollText className="w-5 h-5 text-white" />
                                    </div>
                                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Story History</h1>
                                </div>
                                <p className="text-white/70 text-base max-w-lg">
                                    Every story you generate is automatically saved here. Read, export as PDF, or manage your creative library.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/studio')}
                                className="flex items-center gap-2 bg-white text-indigo-700 font-extrabold px-6 py-3 rounded-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 hover:-translate-y-0.5 transition-all shadow-xl text-sm shrink-0 group"
                            >
                                <Sparkles className="w-4 h-4" /> New Story
                            </button>
                        </div>

                        {/* Stats */}
                        {entries.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-3">
                                <StatPill label="Stories Saved" value={entries.length} color="text-indigo-600" />
                                <StatPill label="Total Chapters" value={totalChapters} color="text-violet-600" />
                                <StatPill label="Genres Explored" value={genreCount} color="text-purple-600" />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Toolbar ── */}
                <div className="sticky top-16 z-30 bg-white backdrop-blur-xl border-b border-slate-100 shadow-sm">
                    <div className="max-w-6xl mx-auto px-6 lg:px-12 py-3 flex flex-wrap items-center gap-3">

                        {/* Search */}
                        <div className="relative flex-1 min-w-[180px]">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by title, genre…"
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all hover:shadow-md focus:shadow-md"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(v => !v)}
                            className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${showFilters ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'}`}
                        >
                            <SlidersHorizontal className={`w-4 h-4 ${showFilters ? '' : 'transition-transform duration-300 group-hover:rotate-180'}`} /> Filters
                        </button>

                        {/* Sort */}
                        <div className="relative">
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="az">A → Z</option>
                                <option value="za">Z → A</option>
                            </select>
                        </div>

                        {/* Clear all */}
                        {entries.length > 0 && (
                            confirmClear ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-medium">Delete all?</span>
                                    <button onClick={handleClearAll} className="text-xs font-black text-white bg-red-50 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors">Yes</button>
                                    <button onClick={() => setConfirmClear(false)} className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors">No</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmClear(true)}
                                    className="flex items-center gap-1.5 text-sm font-bold text-red-400 hover:text-red-500 hover:bg-red-50 px-3.5 py-2.5 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:border-red-100 ml-auto group"
                                >
                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Clear All
                                </button>
                            )
                        )}
                    </div>

                    {/* Genre filter pills (expanded) */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-t border-slate-100 bg-slate-50"
                            >
                                <div className="max-w-6xl mx-auto px-6 lg:px-12 py-3 flex flex-wrap gap-2 items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-2">
                                        <Filter className="w-3.5 h-3.5" /> Genre
                                    </span>
                                    {allGenres.map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setFilterGenre(g)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm ${filterGenre === g ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Content ── */}
                <div className="max-w-6xl mx-auto px-6 lg:px-12 py-8">

                    {/* Result count */}
                    {entries.length > 0 && (
                        <p className="text-sm text-slate-400 font-medium mb-5">
                            Showing <strong className="text-slate-600">{filtered.length}</strong> of {entries.length} {entries.length === 1 ? 'story' : 'stories'}
                            {filterGenre !== 'All' && <> — filtered by <strong className="text-indigo-600">{filterGenre}</strong></>}
                            {search && <> matching &ldquo;<strong className="text-indigo-600">{search}</strong>&rdquo;</>}
                        </p>
                    )}

                    {/* Empty state – no history at all */}
                    {entries.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center text-center py-32 gap-6"
                        >
                            <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-tr from-indigo-100 to-purple-50 flex items-center justify-center shadow-inner border border-white">
                                <BookOpen className="w-12 h-12 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-700 mb-2">No stories yet</h2>
                                <p className="text-slate-400 max-w-sm">
                                    Every story you generate in the Studio will be automatically saved here for you to revisit anytime.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/studio')}
                                className="mt-2 flex items-center gap-2 px-7 py-3.5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-200"
                            >
                                <Sparkles className="w-4 h-4" /> Start Creating →
                            </button>
                        </motion.div>
                    )}

                    {/* Empty state – filter has no results */}
                    {entries.length > 0 && filtered.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center text-center py-24 gap-4"
                        >
                            <Search className="w-10 h-10 text-slate-300" />
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-600 mb-1">No matches found</h3>
                                <p className="text-slate-400 text-sm">Try adjusting your search or genre filter.</p>
                            </div>
                            <button onClick={() => { setSearch(''); setFilterGenre('All'); }} className="text-sm font-bold text-indigo-600 hover:underline">Clear filters</button>
                        </motion.div>
                    )}

                    {/* Card Grid */}
                    {filtered.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            <AnimatePresence>
                                {filtered.map(entry => (
                                    <StoryCard
                                        key={entry.id}
                                        entry={entry}
                                        onDelete={handleDelete}
                                        onPreviewImage={setPreviewImage}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Full-image Modal ── */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/92 backdrop-blur-lg p-4 md:p-12"
                        onClick={() => setPreviewImage(null)}
                    >
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white hover:bg-white p-3 rounded-full transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                            src={previewImage} alt="Scene"
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
