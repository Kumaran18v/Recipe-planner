import React, { useState, useEffect } from 'react';
import { getMealPlans, createMealPlan, deleteMealPlan, searchRecipes } from '../api';
import { Plus, Trash2, Calendar, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

const MealPlanner = () => {
    const navigate = useNavigate();
    const [mealPlans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null); // { date: 'Monday', type: 'Breakfast' }
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        loadMealPlans();
    }, []);

    const loadMealPlans = async () => {
        try {
            const data = await getMealPlans();
            setMealPlans(data);
        } catch (error) {
            console.error("Failed to load meal plans", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = (day, type) => {
        setSelectedSlot({ date: day, meal_type: type });
        setSearchTerm('');
        setSearchResults([]);
        setIsModalOpen(true);
    };

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length > 2) {
            const results = await searchRecipes({ title: term });
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const selectRecipe = async (recipe) => {
        if (!selectedSlot) return;
        try {
            const newPlan = {
                date: selectedSlot.date,
                meal_type: selectedSlot.meal_type,
                recipe_id: recipe.id
            };
            const created = await createMealPlan(newPlan);
            // Refresh or update local state
            // The backend returns the created object, but it might not populate 'recipe' relation immediately 
            // unless backend handles it or we reload. 
            // Our Schema 'MealPlan' includes 'recipe: Recipe'.
            // Backend `db.refresh` populates it? 
            // If not, we might need to reload. Let's reload for simplicity.
            await loadMealPlans();
            closeModal();
        } catch (error) {
            console.error("Failed to add meal", error);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Remove this meal?")) {
            try {
                await deleteMealPlan(id);
                setMealPlans(mealPlans.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete meal", error);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSlot(null);
    };

    const getMealForSlot = (day, type) => {
        return mealPlans.find(plan => plan.date === day && plan.meal_type === type);
    };

    return (
        <div className="container py-12 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600 flex items-center gap-3">
                    <Calendar className="text-primary" /> Meal Planner
                </h1>
                <button onClick={() => navigate('/recipes')} className="text-primary hover:underline">
                    Back to Recipes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {DAYS.map(day => (
                    <div key={day} className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-center text-primary bg-white/5 py-2 rounded-lg border border-white/10">{day}</h3>
                        <div className="flex flex-col gap-4">
                            {MEAL_TYPES.map(type => {
                                const meal = getMealForSlot(day, type);
                                return (
                                    <div key={`${day}-${type}`} className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider mb-1 px-1">{type}</span>
                                        <div
                                            className={`
                                                min-h-[100px] rounded-xl border p-3 flex flex-col justify-center items-center text-center transition-all relative group
                                                ${meal ? 'bg-bg-card border-primary/30' : 'bg-white/5 border-white/5 border-dashed hover:border-primary/50 cursor-pointer'}
                                            `}
                                            onClick={() => !meal && handleAddClick(day, type)}
                                        >
                                            {meal ? (
                                                <>
                                                    <div
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-red-400 hover:text-red-500 bg-black/50 rounded-full p-1"
                                                        onClick={(e) => handleDelete(meal.id, e)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </div>
                                                    <h4
                                                        className="font-bold text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                                                        onClick={() => navigate(`/recipes/${meal.recipe_id}`)}
                                                    >
                                                        {meal.recipe ? meal.recipe.title : 'Loading...'}
                                                    </h4>
                                                    {meal.recipe && meal.recipe.rating && (
                                                        <span className="text-xs text-yellow-500 mt-1">★ {meal.recipe.rating.toFixed(1)}</span>
                                                    )}
                                                </>
                                            ) : (
                                                <Plus className="text-slate-500 group-hover:text-primary transition-colors" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md relative z-10 shadow-2xl"
                        >
                            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-4 text-white">Add Meal</h2>
                            <p className="text-slate-400 mb-6">
                                Select a recipe for <span className="text-primary font-bold">{selectedSlot?.date} - {selectedSlot?.meal_type}</span>
                            </p>

                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search recipes..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div className="max-h-[300px] overflow-y-auto space-y-2 custom-scrollbar">
                                {searchResults.map(recipe => (
                                    <div
                                        key={recipe.id}
                                        onClick={() => selectRecipe(recipe)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer flex justify-between items-center transition-colors group"
                                    >
                                        <span className="font-medium text-slate-200 group-hover:text-primary transition-colors">{recipe.title}</span>
                                        {recipe.rating && <span className="text-xs text-yellow-500">★ {recipe.rating.toFixed(1)}</span>}
                                    </div>
                                ))}
                                {searchTerm && searchResults.length === 0 && (
                                    <p className="text-center text-slate-500 py-4">No recipes found.</p>
                                )}
                                {!searchTerm && (
                                    <p className="text-center text-slate-600 py-4 italic text-sm">Type to search...</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MealPlanner;
