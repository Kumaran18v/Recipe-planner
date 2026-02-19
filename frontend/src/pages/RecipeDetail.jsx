import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, addFavorite, removeFavorite, getFavorites } from '../api';
import { ArrowLeft, Clock, Users, Star, ExternalLink, ChefHat, Flame, List, AlignLeft, PieChart as PieChartIcon, Heart, Play } from 'lucide-react';
import { getRecipeImage, getFallbackImage } from '../utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import SkeletonCard, { SkeletonLine } from '../components/SkeletonCard';
import ShareModal from '../components/ShareModal';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [recipeData, favoritesData] = await Promise.all([
                    getRecipeById(id),
                    getFavorites()
                ]);
                setRecipe(recipeData);
                // Check if current recipe is in favorites
                const found = favoritesData.find(f => f.recipe_id === parseInt(id));
                setIsFavorite(!!found);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const toggleFavorite = async () => {
        if (!recipe) return;
        try {
            if (isFavorite) {
                await removeFavorite(recipe.id);
                setIsFavorite(false);
            } else {
                await addFavorite(recipe.id);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-bg-surface dark:bg-bg-dark text-slate-900 dark:text-text-light font-body pb-20">
            {/* Hero Skeleton */}
            <div className="relative h-[50vh] bg-slate-200 dark:bg-bg-surface overflow-hidden">
                <SkeletonCard className="w-full h-full opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-bg-dark/50 to-white dark:to-bg-dark z-10"></div>
                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-20">
                    <SkeletonLine width="150px" height="24px" className="mb-6" />
                    <SkeletonLine width="70%" height="60px" className="mb-8" />
                    <div className="flex gap-6">
                        <SkeletonLine width="100px" height="24px" />
                        <SkeletonLine width="100px" height="24px" />
                        <SkeletonLine width="100px" height="24px" />
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <SkeletonLine width="100%" height="100px" />
                    <SkeletonCard className="h-64 w-full" />
                    <SkeletonCard className="h-96 w-full" />
                </div>
                <div className="space-y-8">
                    <SkeletonCard className="h-80 w-full" />
                    <SkeletonCard className="h-64 w-full" />
                </div>
            </div>
        </div>
    );

    if (!recipe) return (
        <div className="min-h-screen bg-bg-surface dark:bg-bg-dark flex flex-col items-center justify-center text-slate-900 dark:text-white">
            <h2 className="text-2xl mb-4">Recipe not found</h2>
            <button onClick={() => navigate('/recipes')} className="text-primary hover:underline">Back to Recipes</button>
        </div>
    );

    // Prepare Chart Data
    const nutrientData = recipe.nutrients ? [
        { name: 'Carbs', value: parseFloat(recipe.nutrients.carbohydrateContent) || 0, color: '#fbbf24' },
        { name: 'Protein', value: parseFloat(recipe.nutrients.proteinContent) || 0, color: '#34d399' },
        { name: 'Fat', value: parseFloat(recipe.nutrients.fatContent) || 0, color: '#f87171' },
    ].filter(d => d.value > 0) : [];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-bg-card p-3 border border-slate-200 dark:border-white/10 rounded-lg shadow-xl">
                    <p className="font-bold text-slate-900 dark:text-white">{`${payload[0].name} : ${payload[0].value}g`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-bg-surface dark:bg-bg-dark text-slate-900 dark:text-text-light font-body pb-20">
            {/* Header / Hero */}
            <div className="relative h-[50vh] bg-slate-200 dark:bg-bg-surface overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={getRecipeImage(recipe.cuisine, recipe.id)}
                        alt={recipe.title}
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getFallbackImage(recipe.cuisine, recipe.id);
                        }}
                        crossOrigin="anonymous"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-bg-dark/50 to-white dark:to-bg-dark z-10"></div>

                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-20">
                    <button
                        onClick={() => navigate('/recipes')}
                        className="absolute top-8 left-4 flex items-center gap-2 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/40"
                    >
                        <ArrowLeft size={18} /> Back to Recipes
                    </button>

                    <div className="absolute top-8 right-4 flex gap-2">
                        <button
                            onClick={() => setIsShareOpen(true)}
                            className="p-3 rounded-full backdrop-blur-sm bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-white/70 dark:hover:bg-black/40 hover:text-slate-900 dark:hover:text-white transition-all"
                            title="Share Recipe"
                        >
                            <ExternalLink size={24} />
                        </button>
                        <button
                            onClick={toggleFavorite}
                            className={`p-3 rounded-full backdrop-blur-sm transition-all border ${isFavorite
                                ? 'bg-red-500/20 border-red-500 text-red-500'
                                : 'bg-white/50 dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-white/70 dark:hover:bg-black/40 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                    </div>

                    <ShareModal
                        isOpen={isShareOpen}
                        onClose={() => setIsShareOpen(false)}
                        recipe={recipe}
                        image={getRecipeImage(recipe.cuisine, recipe.id)}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-3 mb-4 text-primary font-bold tracking-wider uppercase text-sm">
                            <span className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">{recipe.cuisine || "International"}</span>
                            {recipe.rating && (
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star size={16} fill="currentColor" /> {recipe.rating.toFixed(1)}
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-slate-300 leading-tight">
                            {recipe.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-slate-700 dark:text-text-gray text-lg">
                            <div className="flex items-center gap-2">
                                <Clock size={20} className="text-primary" />
                                <span>{recipe.total_time ? `${recipe.total_time} mins` : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={20} className="text-primary" />
                                <span>{recipe.serves}</span>
                            </div>
                            {recipe.nutrients && recipe.nutrients.calories && (
                                <div className="flex items-center gap-2">
                                    <Flame size={20} className="text-primary" />
                                    <span>{recipe.nutrients.calories}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Description */}
                    <section>
                        <p className="text-xl leading-relaxed text-slate-700 dark:text-text-gray/90 italic border-l-4 border-primary pl-6 py-2">
                            {recipe.description || "A delicious recipe waiting for you to cook!"}
                        </p>
                    </section>

                    {/* URL Link */}
                    {recipe.url && (
                        <a
                            href={recipe.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-primary border border-primary/30 px-6 py-3 rounded-lg transition-all font-semibold shadow-sm"
                        >
                            <ExternalLink size={18} /> View Original Recipe Source
                        </a>
                    )}

                    {/* Ingredients */}
                    <section className="bg-white/50 dark:bg-bg-card/50 p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                        <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                            <List className="text-primary" /> Ingredients
                        </h3>
                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 list-disc list-inside text-slate-700 dark:text-text-gray">
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i} className="capitalize">{ing}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 dark:text-text-gray italic">
                                Full ingredient list available at original source or unknown.
                            </p>
                        )}
                    </section>

                    {/* Instructions */}
                    <section className="bg-white/50 dark:bg-bg-card/50 p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-heading font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                                <AlignLeft className="text-primary" /> Instructions
                            </h3>
                            <button
                                onClick={() => navigate(`/recipes/${recipe.id}/cook`)}
                                className="flex items-center gap-2 bg-gradient-to-r from-primary to-amber-500 text-bg-dark font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all"
                            >
                                <Play size={20} fill="currentColor" /> Start Cooking Mode
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-700 dark:text-text-gray">
                                Ready to cook? Click the button above for a step-by-step guide.
                            </p>
                            {recipe.url && (
                                <a
                                    href={recipe.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1 text-sm"
                                >
                                    View original source <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Nutrition */}
                <div className="space-y-8">
                    <div className="bg-white/50 dark:bg-bg-card p-6 rounded-2xl border border-slate-200 dark:border-white/5 sticky top-8 shadow-sm">
                        <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                            <PieChartIcon className="text-secondary" /> Macro Breakdown
                        </h3>

                        {/* Macro Chart */}
                        {nutrientData.length > 0 ? (
                            <div className="h-64 w-full mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={nutrientData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {nutrientData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-20 flex items-center justify-center text-slate-500 italic">No chart data</div>
                        )}

                        <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2 border-t border-slate-200 dark:border-white/10 pt-6 text-slate-900 dark:text-white">
                            <ChefHat className="text-secondary" /> Nutrition Facts
                        </h3>
                        <div className="space-y-3">
                            {recipe.nutrients ? (
                                Object.entries(recipe.nutrients).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <span className="text-slate-700 dark:text-text-gray capitalize">{key.replace(/Content/g, '').replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500">No nutrition data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
