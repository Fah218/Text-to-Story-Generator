import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full text-center py-8 mt-auto border-t border-brand-border/50 bg-white/30 backdrop-blur-md relative z-10 shrink-0">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                <span className="font-bold text-brand-text">StoryStudio</span>
            </div>
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} StoryStudio AI. All rights reserved.</p>
        </footer>
    );
}
