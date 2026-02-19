import React, { useRef, useState } from 'react';
import { X, Download, Share2, ChefHat, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

const ShareModal = ({ isOpen, onClose, recipe, image }) => {
    const cardRef = useRef(null);
    const [generating, setGenerating] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setGenerating(true);
        try {
            // Wait for images to load if needed, though usually they are loaded
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true, // Important for external images
                scale: 2, // Retinas resolution
                backgroundColor: '#1E293B'
            });

            const link = document.createElement('a');
            link.download = `${recipe.title.replace(/\s+/g, '-').toLowerCase()}-recipe.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            onClose();
        } catch (error) {
            console.error("Failed to generate image", error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-bg-card border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-text-gray hover:text-white transition-colors z-20"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                            <Share2 className="text-primary" /> Share Recipe
                        </h3>

                        {/* The Share Card (Hidden processing area or visible preview) */}
                        <div className="flex justify-center mb-8 relative">
                            {generating && (
                                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-xl">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                                </div>
                            )}

                            <div
                                ref={cardRef}
                                className="bg-bg-dark border border-white/10 rounded-xl overflow-hidden w-full max-w-sm shadow-xl relative"
                            >
                                <div className="h-48 relative">
                                    <img
                                        src={image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h4 className="text-xl font-heading font-bold text-white mb-1 drop-shadow-lg">{recipe.title}</h4>
                                        <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
                                            <ChefHat size={14} /> {recipe.cuisine}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 space-y-4">
                                    <div className="flex justify-between text-sm text-text-gray border-b border-white/5 pb-4">
                                        <span>Ready in {recipe.total_time}m</span>
                                        <span>Serves {recipe.serves}</span>
                                        <span className="flex items-center gap-1 text-yellow-500">
                                            <Star size={12} fill="currentColor" /> {recipe.rating?.toFixed(1)}
                                        </span>
                                    </div>

                                    <div className="text-center pb-2">
                                        <p className="text-amber-500 font-heading italic">"A masterpiece from ChefBot"</p>
                                        <p className="text-xs text-slate-500 mt-2">recipe-ai.app</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={generating}
                            className="w-full btn-primary justify-center"
                        >
                            {generating ? 'Generating...' : (
                                <>
                                    <Download size={20} /> Download Image Card
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
