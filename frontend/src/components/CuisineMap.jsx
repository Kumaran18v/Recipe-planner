import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Globe, ArrowRight, Utensils, Coffee, Pizza, Croissant, Soup, Cookie, Cake, Fish, Drumstick } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
    { name: "Desserts", icon: <Cake size={20} />, description: "Sweet treats, cakes, and all-time favorites.", color: "bg-rose-500", count: 101 },
    { name: "Breads", icon: <Croissant size={20} />, description: "Freshly baked loaves, rolls, and artisan breads.", color: "bg-amber-600", count: 105 },
    { name: "Cookies and Bars", icon: <Cookie size={20} />, description: "Classic cookies, brownies, and snack bars.", color: "bg-orange-500", count: 91 },
    { name: "Amish and Mennonite", icon: <Utensils size={20} />, description: "Traditional, hearty comfort food favorites.", color: "bg-emerald-600", count: 112 },
    { name: "Breakfast and Brunch", icon: <Coffee size={20} />, description: "Start your day with morning classics.", color: "bg-blue-500", count: 63 },
    { name: "Soups", icon: <Soup size={20} />, description: "Warm, comforting soups and hearty stews.", color: "bg-indigo-500", count: 48 },
    { name: "Cakes", icon: <Cake size={20} />, description: "Special occasion cakes and simple bakes.", color: "bg-pink-500", count: 58 },
    { name: "Muffins", icon: <Croissant size={20} />, description: "Perfectly portioned breakfast muffins.", color: "bg-yellow-600", count: 55 },
    { name: "Quick Breads", icon: <Croissant size={20} />, description: "Easy, no-yeast breads and loaves.", color: "bg-orange-600", count: 52 },
    { name: "Pancakes", icon: <Utensils size={20} />, description: "Fluffy pancakes and morning griddle cakes.", color: "bg-amber-400", count: 42 },
    { name: "Fish and Seafood", icon: <Fish size={20} />, description: "Fresh catches and seafood specialties.", color: "bg-cyan-500", count: 63 },
    { name: "Beef", icon: <Drumstick size={20} />, description: "Savory beef dishes and hearty roasts.", color: "bg-red-600", count: 32 }
];

const CuisineMap = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCategories = categories.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-bg-dark text-white py-12 px-4 pb-24">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div className="flex-1">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-primary mb-4 hover:underline flex items-center gap-1"
                        >
                            <ChevronLeft size={16} /> Back to Home
                        </button>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
                            Flavor Explorer
                        </h1>
                        <p className="text-text-gray mt-4 max-w-xl text-lg">
                            Discover recipes by category. We've matched our explorer to the actual flavors in our database.
                        </p>
                    </div>

                    <div className="w-full md:w-80">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search flavors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-white backdrop-blur-md"
                            />
                            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            onClick={() => navigate(`/recipes?cuisine=${cat.name}`)}
                            className="group cursor-pointer relative glass-panel rounded-3xl p-8 border border-white/10 overflow-hidden hover:border-primary/30 transition-all duration-300 h-full flex flex-col"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-[70px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full ${cat.color}`} />

                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-primary group-hover:scale-110 transition-transform">
                                    {cat.icon}
                                </div>
                                <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-slate-400 border border-white/5">
                                    {cat.count} RECIPES
                                </span>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-2xl font-heading font-bold text-white group-hover:text-primary transition-colors">{cat.name}</h3>
                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                                {cat.description}
                            </p>

                            <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:translate-x-1 transition-transform mt-auto">
                                View Collection <ArrowRight size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-24 glass-panel rounded-3xl border border-white/10">
                        <p className="text-slate-500 italic">No flavors found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CuisineMap;
