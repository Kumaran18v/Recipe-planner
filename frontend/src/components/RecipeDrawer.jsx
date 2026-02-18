import React, { useState, useEffect } from 'react';
import { X, Clock, Flame, ChefHat, Scale } from 'lucide-react';

const RecipeDrawer = ({ recipe, isOpen, onClose }) => {
    if (!recipe) return null;

    return (
        <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="drawer-content" onClick={e => e.stopPropagation()}>
                <div className="drawer-header">
                    <div>
                        <div className="badge mb-2">{recipe.cuisine || 'International'}</div>
                        <h2 className="text-xl">{recipe.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 bg-transparent hover:bg-white/10 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="drawer-body">
                    <div className="flex gap-4 mb-6 text-sm text-gray">
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{recipe.total_time || '--'} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Flame size={16} />
                            <span>{recipe.rating ? recipe.rating.toFixed(1) : '--'} ★</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ChefHat size={16} />
                            <span>{recipe.serves}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray leading-relaxed text-sm">
                            {recipe.description || "No description available."}
                        </p>
                    </div>

                    <div className="glass-panel p-4 mb-6">
                        <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                            <Clock size={18} />
                            Time Breakdown
                        </h3>
                        <div className="flex justify-between text-sm">
                            <div>
                                <span className="text-gray block">Prep Time</span>
                                <span className="font-medium">{recipe.prep_time || '--'} min</span>
                            </div>
                            <div>
                                <span className="text-gray block">Cook Time</span>
                                <span className="font-medium">{recipe.cook_time || '--'} min</span>
                            </div>
                            <div>
                                <span className="text-gray block">Total Time</span>
                                <span className="font-medium">{recipe.total_time || '--'} min</span>
                            </div>
                        </div>
                    </div>

                    {recipe.nutrients && (
                        <div>
                            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                                <Scale size={18} />
                                Nutrition Facts
                            </h3>
                            <div className="nutrition-grid">
                                {Object.entries(recipe.nutrients).map(([key, value]) => (
                                    <div key={key} className="nutrition-item">
                                        <span className="nutrition-label">{key.replace('Content', '')}</span>
                                        <span className="nutrition-value">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeDrawer;
