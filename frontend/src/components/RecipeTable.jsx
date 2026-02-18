import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRecipes, searchRecipes, searchPantry } from '../api';
import PantryFilter from './PantryFilter';

const RecipeTable = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialCuisine = searchParams.get('cuisine') || '';

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    // Search State
    const [searchMode, setSearchMode] = useState(initialCuisine !== '');
    const [sortOrder, setSortOrder] = useState('desc');
    const [sortBy, setSortBy] = useState('rating');

    const [filters, setFilters] = useState({
        title: '',
        cuisine: initialCuisine,
        rating: '',
        calories: '',
        total_time: '',
        diet: '',
        exclude: ''
    });

    const [pantryMode, setPantryMode] = useState(false);
    const [pantryIngredients, setPantryIngredients] = useState([]);

    const loadData = async (currentFilters = filters) => {
        setLoading(true);
        try {
            if (pantryMode) {
                const data = await searchPantry(pantryIngredients);
                setRecipes(data);
                setTotal(data.length);
            } else if (searchMode || initialCuisine) {
                const data = await searchRecipes(currentFilters);
                setRecipes(data);
                setTotal(data.length);
            } else {
                const data = await fetchRecipes(page, limit, sortBy, sortOrder);
                setRecipes(data.data);
                setTotal(data.total);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadData();
        }, 300); // Debounce to prevent 500/spam when typing
        return () => clearTimeout(timeoutId);
    }, [page, limit, searchMode, sortBy, sortOrder, pantryMode, pantryIngredients, filters]);

    useEffect(() => {
        if (initialCuisine) {
            setFilters(prev => ({ ...prev, cuisine: initialCuisine }));
            setSearchMode(true);
            setPage(1);
        }
    }, [initialCuisine]);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setSearchMode(true);
        setPage(1);
        loadData();
    };

    const handleClearSearch = () => {
        setFilters({ title: '', cuisine: '', rating: '', calories: '', total_time: '', diet: '', exclude: '' });
        setSearchMode(false);
        setPage(1);
    };

    const handleRowClick = (recipe) => {
        navigate(`/recipes/${recipe.id}`);
    };

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <button onClick={() => navigate('/')} className="text-sm text-primary mb-2 hover:underline flex items-center gap-1">
                        <ChevronLeft size={14} /> Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">
                        Flavor Explorer
                    </h1>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2 text-sm text-text-gray bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <span className="font-bold text-white">{total}</span> Recipes Found
                    </div>

                    {/* Sorting Controls */}
                    {!searchMode && !pantryMode && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-text-gray">Sort by Rating:</span>
                            <button
                                onClick={() => setSortOrder('asc')}
                                className={`px-3 py-1 rounded-md border ${sortOrder === 'asc' ? 'bg-primary text-black border-primary' : 'bg-transparent text-white border-white/10 hover:bg-white/5'}`}
                            >
                                Asc
                            </button>
                            <button
                                onClick={() => setSortOrder('desc')}
                                className={`px-3 py-1 rounded-md border ${sortOrder === 'desc' ? 'bg-primary text-black border-primary' : 'bg-transparent text-white border-white/10 hover:bg-white/5'}`}
                            >
                                Desc
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Pantry Toggle */}
            <div className="flex justify-center mb-6">
                <div className="bg-white/5 p-1 rounded-xl flex gap-1 border border-white/10">
                    <button
                        onClick={() => setPantryMode(false)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${!pantryMode ? 'bg-primary text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Browse & Filter
                    </button>
                    <button
                        onClick={() => setPantryMode(true)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${pantryMode ? 'bg-primary text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Smart Pantry
                    </button>
                </div>
            </div>

            {/* Search/Filter Section */}
            {pantryMode ? (
                <PantryFilter onSearch={(ingredients) => {
                    setPantryIngredients(ingredients);
                    setPage(1);
                    // Effect will trigger reload
                }} />
            ) : (
                <div className="glass-panel p-6 mb-8 border border-white/10 shadow-2xl bg-bg-card/50 backdrop-blur-xl rounded-2xl">
                    <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-end">
                        <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                            <label className="text-xs text-primary font-bold uppercase tracking-wider">Search Title</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="e.g. Pecan Pie"
                                    value={filters.title}
                                    onChange={e => setFilters({ ...filters, title: e.target.value })}
                                    className="w-full pl-10 bg-bg-dark border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all py-3 shadow-inner"
                                />
                                <Search className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full sm:w-[180px]">
                            <label className="text-xs text-primary font-bold uppercase tracking-wider">Cuisine</label>
                            <input
                                type="text"
                                placeholder="e.g. Southern"
                                value={filters.cuisine}
                                onChange={e => setFilters({ ...filters, cuisine: e.target.value })}
                                className="w-full bg-bg-dark border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent py-3 px-4 shadow-inner"
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-[140px]">
                            <label className="text-xs text-primary font-bold uppercase tracking-wider">Rating</label>
                            <input
                                type="text"
                                placeholder=">= 4.5"
                                value={filters.rating}
                                onChange={e => setFilters({ ...filters, rating: e.target.value })}
                                className="w-full bg-bg-dark border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent py-3 px-4 shadow-inner text-center"
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-[140px]">
                            <label className="text-xs text-primary font-bold uppercase tracking-wider">Time (min)</label>
                            <input
                                type="text"
                                placeholder="<= 60"
                                value={filters.total_time}
                                onChange={e => setFilters({ ...filters, total_time: e.target.value })}
                                className="w-full bg-bg-dark border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent py-3 px-4 shadow-inner text-center"
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-[160px]">
                            <label className="text-xs text-primary font-bold uppercase tracking-wider">Dietary</label>
                            <select
                                value={filters.diet}
                                onChange={e => setFilters({ ...filters, diet: e.target.value })}
                                className="w-full bg-bg-dark border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent py-3 px-4 shadow-inner cursor-pointer"
                            >
                                <option value="">Any</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="gluten-free">Gluten-Free</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                            <label className="text-xs text-primary font-bold uppercase tracking-wider">Exclude</label>
                            <input
                                type="text"
                                placeholder="e.g. peanuts"
                                value={filters.exclude}
                                onChange={e => setFilters({ ...filters, exclude: e.target.value })}
                                className="w-full bg-bg-dark border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent py-3 px-4 shadow-inner"
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-[160px]">
                            <label className="text-xs text-primary font-bold uppercase tracking-wider">Dietary</label>
                            <select
                                value={filters.diet}
                                onChange={e => setFilters({ ...filters, diet: e.target.value })}
                                className="w-full bg-bg-dark border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent py-3 px-4 shadow-inner cursor-pointer"
                            >
                                <option value="">Any</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="gluten-free">Gluten-Free</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                            <label className="text-xs text-primary font-bold uppercase tracking-wider">Exclude Ingredients</label>
                            <input
                                type="text"
                                placeholder="e.g. peanuts, shellfish"
                                value={filters.exclude}
                                onChange={e => setFilters({ ...filters, exclude: e.target.value })}
                                className="w-full bg-bg-dark border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent py-3 px-4 shadow-inner"
                            />
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                            <button type="submit" className="flex-1 sm:flex-none btn-primary justify-center shadow-lg shadow-primary/20">
                                <Filter size={18} /> Filter
                            </button>
                            {searchMode && (
                                <button type="button" onClick={handleClearSearch} className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                                    Clear
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* Recipe Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/10"></div>
                    ))}
                </div>
            ) : recipes.length === 0 ? (
                <div className="p-12 text-center text-text-gray glass-panel rounded-2xl border border-white/10">No recipes found matching your criteria.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            onClick={() => handleRowClick(recipe)}
                            className="group relative bg-bg-card/50 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer hover:-translate-y-1"
                        >
                            {/* Decorative Header/Placeholder Image */}
                            <div className="h-32 bg-gradient-to-br from-gray-800 to-black relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute bottom-3 left-4">
                                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-black/60 text-white border border-white/10 uppercase tracking-wider backdrop-blur-sm">
                                        {recipe.cuisine || "World"}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-4 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                                    <Star size={12} className="text-primary fill-primary" />
                                    <span className="text-xs font-bold text-white">{recipe.rating ? recipe.rating.toFixed(1) : 'New'}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-heading font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">{recipe.title}</h3>

                                <div className="flex justify-between items-center text-sm text-slate-400 mt-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase tracking-wider text-slate-500">Time</span>
                                            <span className="font-medium text-slate-200">{recipe.total_time ? `${recipe.total_time}m` : '--'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase tracking-wider text-slate-500">Serves</span>
                                            <span className="font-medium text-slate-200">{recipe.serves || '--'}</span>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                        <div className="bg-primary/20 p-2 rounded-full">
                                            <ChevronRight size={16} className="text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!searchMode && !pantryMode && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                    <div className="flex items-center gap-2 bg-glass-panel px-4 py-2 rounded-lg border border-white/5">
                        <span className="text-sm text-text-gray">Rows per page:</span>
                        <select
                            value={limit}
                            onChange={e => setLimit(Number(e.target.value))}
                            className="bg-transparent border-none text-white focus:ring-0 cursor-pointer font-medium"
                        >
                            <option value={10} className="bg-bg-card">10</option>
                            <option value={20} className="bg-bg-card">20</option>
                            <option value={50} className="bg-bg-card">50</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-white border border-white/10"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-sm font-medium text-white bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            Page <span className="text-primary">{page}</span> of {Math.ceil(total / limit)}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= Math.ceil(total / limit)}
                            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-white border border-white/10"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeTable;
