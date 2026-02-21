import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClickParticles() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            // Skip particles for form inputs to avoid lag during typing
            const tag = e.target?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

            // Create 8 particles for each click
            const newParticles = Array.from({ length: 8 }).map((_, i) => {
                // Random angle (0 to 360 degrees)
                const angle = Math.random() * Math.PI * 2;
                // Random distance (30 to 60px)
                const distance = 30 + Math.random() * 30;

                return {
                    id: Date.now() + i,
                    x: e.clientX,
                    y: e.clientY,
                    // Calculate destination coordinates based on angle and distance
                    destX: Math.cos(angle) * distance,
                    destY: Math.sin(angle) * distance,
                    // Random size (4px to 8px)
                    size: 4 + Math.random() * 4,
                    // Random color from our theme
                    color: ['#818cf8', '#a78bfa', '#38bdf8', '#34d399'][Math.floor(Math.random() * 4)]
                };
            });

            setParticles((prev) => [...prev, ...newParticles]);

            // Remove particles after animation completes (600ms)
            setTimeout(() => {
                setParticles((prev) => prev.filter(p => !newParticles.find(np => np.id === p.id)));
            }, 600);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{
                            x: p.x,
                            y: p.y,
                            opacity: 1,
                            scale: 0
                        }}
                        animate={{
                            x: p.x + p.destX,
                            y: p.y + p.destY,
                            opacity: 0,
                            scale: 1
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut"
                        }}
                        className="absolute rounded-full"
                        style={{
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            // Offset slightly so cursor is at center of particle burst
                            marginLeft: -p.size / 2,
                            marginTop: -p.size / 2,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
