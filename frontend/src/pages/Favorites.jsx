import React, { useState, useEffect } from 'react';
import { getFavorites, removeFavorite } from '../api'; // addFavorite not needed here unless we add "undo"
import { getRecipeImage, getFallbackImage } from '../utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Clock, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Favorites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const data = await getFavorites();
            setFavorites(data);
        } catch (error) {
            console.error("Failed to load favorites", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (e, recipeId) => {
        e.stopPropagation();
        try {
            await removeFavorite(recipeId);
            setFavorites(favorites.filter(f => f.recipe_id !== recipeId));
        } catch (error) {
            console.error("Failed to remove favorite", error);
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark text-text-light font-body py-12 px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <button onClick={() => navigate('/recipes')} className="text-sm text-primary mb-2 hover:underline flex items-center gap-1">
                            <ArrowLeft size={14} /> Back to Recipes
                        </button>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 flex items-center gap-3">
                            <Heart className="text-red-500 fill-current" /> My Cookbook
                        </h1>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-text-gray animate-pulse">Loading favorites...</div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-20 bg-bg-surface rounded-3xl border border-white/5">
                        <Heart size={64} className="mx-auto text-slate-700 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
                        <p className="text-text-gray mb-6">Start exploring recipes and save the ones you love!</p>
                        <button
                            onClick={() => navigate('/recipes')}
                            className="bg-primary text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-primary-hover transition-colors"
                        >
                            Browse Recipes
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((fav) => {
                            const recipe = fav.recipe;
                            return (
                                <motion.div
                                    key={fav.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -5 }}
                                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                                    className="bg-bg-card border border-white/10 rounded-2xl overflow-hidden shadow-lg cursor-pointer group hover:border-primary/30 transition-all"
                                >
                                    <div className="h-48 bg-slate-800 relative overflow-hidden">
                                        <img
                                            src={getRecipeImage(recipe.cuisine, recipe.id)}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getFallbackImage(recipe.cuisine, recipe.id);
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent opacity-80"></div>

                                        <div className="absolute bottom-4 left-4 right-4">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-black/50 px-2 py-1 rounded backdrop-blur-md">
                                                {recipe.cuisine}
                                            </span>
                                            <h3 className="text-xl font-heading font-bold text-white mt-1 group-hover:text-primary transition-colors line-clamp-2">
                                                {recipe.title}
                                            </h3>
                                        </div>

                                        <button
                                            onClick={(e) => handleRemove(e, recipe.id)}
                                            className="absolute top-4 right-4 bg-white/10 hover:bg-red-500/20 text-red-500 p-2 rounded-full backdrop-blur-md transition-colors border border-white/10"
                                            title="Remove from favorites"
                                        >
                                            <Heart size={20} fill="currentColor" />
                                        </button>
                                    </div>

                                    <div className="p-4 flex justify-between items-center text-sm text-text-gray bg-white/5">
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} className="text-primary" />
                                            <span>{recipe.total_time ? `${recipe.total_time}m` : '--'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={16} className="text-primary" />
                                            <span>{recipe.serves}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star size={16} className="text-yellow-500 fill-current" />
                                            <span>{recipe.rating ? recipe.rating.toFixed(1) : '--'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
