import React, { useState } from 'react';
import { Search, X, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PantryFilter = ({ onSearch }) => {
    const [input, setInput] = useState('');
    const [ingredients, setIngredients] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!ingredients.includes(input.trim().toLowerCase())) {
                setIngredients([...ingredients, input.trim().toLowerCase()]);
            }
            setInput('');
        }
    };

    const removeIngredient = (ing) => {
        setIngredients(ingredients.filter(i => i !== ing));
    };

    const handleSearch = () => {
        onSearch(ingredients);
    };

    return (
        <div className="bg-bg-surface/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md mb-8">
            <div className="flex items-center gap-3 mb-4">
                <ChefHat className="text-primary" size={24} />
                <h3 className="text-xl font-heading font-bold text-white">Smart Pantry Search</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">
                Enter ingredients you have (e.g., "chicken", "rice") and press Enter. We'll find recipes you can cook right now!
            </p>

            <div className="flex flex-col gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add an ingredient..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px]">
                    <AnimatePresence>
                        {ingredients.map(ing => (
                            <motion.span
                                key={ing}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-primary/20"
                            >
                                {ing}
                                <button onClick={() => removeIngredient(ing)} className="hover:text-white">
                                    <X size={14} />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSearch}
                        disabled={ingredients.length === 0}
                        className="bg-primary text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    >
                        Find Recipes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PantryFilter;
