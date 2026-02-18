import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, addFavorite, removeFavorite, getFavorites } from '../api';
import { ArrowLeft, Clock, Users, Star, ExternalLink, ChefHat, Flame, List, AlignLeft, PieChart as PieChartIcon, Heart, Play } from 'lucide-react';
import { getRecipeImage, getFallbackImage } from '../utils/imageUtils';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

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
        <div className="min-h-screen bg-bg-dark flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!recipe) return (
        <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center text-white">
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
                <div className="bg-bg-card p-3 border border-white/10 rounded-lg shadow-xl">
                    <p className="font-bold text-white">{`${payload[0].name} : ${payload[0].value}g`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-bg-dark text-text-light font-body pb-20">
            {/* Header / Hero */}
            <div className="relative h-[50vh] bg-bg-surface overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={getRecipeImage(recipe.cuisine, recipe.id)}
                        alt={recipe.title}
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getFallbackImage(recipe.cuisine, recipe.id);
                        }}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-dark/50 to-bg-dark z-10"></div>
                {/* Abstract Background pattern overlay */}

                <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-20">
                    <button
                        onClick={() => navigate('/recipes')}
                        className="absolute top-8 left-4 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/40"
                    >
                        <ArrowLeft size={18} /> Back to Recipes
                    </button>

                    <button
                        onClick={toggleFavorite}
                        className={`absolute top-8 right-4 p-3 rounded-full backdrop-blur-sm transition-all border ${isFavorite
                            ? 'bg-red-500/20 border-red-500 text-red-500'
                            : 'bg-black/20 border-white/10 text-white/70 hover:bg-black/40 hover:text-white'}`}
                    >
                        <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

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
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 leading-tight">
                            {recipe.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-text-gray text-lg">
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
                        <p className="text-xl leading-relaxed text-text-gray/90 italic border-l-4 border-primary pl-6 py-2">
                            {recipe.description || "A delicious recipe waiting for you to cook!"}
                        </p>
                    </section>

                    {/* URL Link */}
                    {recipe.url && (
                        <a
                            href={recipe.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-primary border border-primary/30 px-6 py-3 rounded-lg transition-all font-semibold"
                        >
                            <ExternalLink size={18} /> View Original Recipe Source
                        </a>
                    )}

                    {/* Ingredients */}
                    <section className="bg-bg-card/50 p-8 rounded-2xl border border-white/5">
                        <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                            <List className="text-primary" /> Ingredients
                        </h3>
                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 list-disc list-inside text-text-gray">
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i} className="capitalize">{ing}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-text-gray italic">
                                Full ingredient list available at original source or unknown.
                            </p>
                        )}
                    </section>

                    {/* Instructions */}
                    <section className="bg-bg-card/50 p-8 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-heading font-bold flex items-center gap-3">
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
                            <p className="text-text-gray">
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
                    <div className="bg-bg-card p-6 rounded-2xl border border-white/5 sticky top-8">
                        <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
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

                        <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2 border-t border-white/10 pt-6">
                            <ChefHat className="text-secondary" /> Nutrition Facts
                        </h3>
                        <div className="space-y-3">
                            {recipe.nutrients ? (
                                Object.entries(recipe.nutrients).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                        <span className="text-text-gray capitalize">{key.replace(/Content/g, '').replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="font-semibold text-white">{value}</span>
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
