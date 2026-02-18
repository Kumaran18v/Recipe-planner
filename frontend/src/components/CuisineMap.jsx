import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const regions = [
    { name: "Italian", code: "ITA", description: "Pasta, Pizza, and everything in between.", color: "bg-emerald-500" },
    { name: "Mexican", code: "MEX", description: "Bold flavors, tacos, and spicy salsas.", color: "bg-orange-500" },
    { name: "Indian", code: "IND", description: "Rich spices, curries, and aromatic rice.", color: "bg-amber-500" },
    { name: "Japanese", code: "JPN", description: "Fresh sushi, ramen, and delicate flavors.", color: "bg-red-500" },
    { name: "French", code: "FRA", description: "Elegant pastries, sauces, and fine dining.", color: "bg-blue-500" },
    { name: "Chinese", code: "CHN", description: "Stir-fries, dim sum, and regional classics.", color: "bg-red-600" },
    { name: "Thai", code: "THA", description: "Balance of sweet, sour, salty, and spicy.", color: "bg-blue-600" },
    { name: "Greek", code: "GRC", description: "Mediterranean fresh, feta, and olives.", color: "bg-sky-500" },
    { name: "Spanish", code: "ESP", description: "Paella, tapas, and vibrant seafood.", color: "bg-yellow-500" },
    { name: "American", code: "USA", description: "Burgers, BBQ, and comfort classics.", color: "bg-indigo-500" },
    { name: "British", code: "GBR", description: "Pies, roasts, and afternoon tea.", color: "bg-blue-700" },
    { name: "German", code: "DEU", description: "Sausages, pretzels, and hearty stews.", color: "bg-yellow-600" },
    { name: "Korean", code: "KOR", description: "Kimchi, BBQ, and bold fermentations.", color: "bg-rose-500" },
    { name: "Vietnamese", code: "VNM", description: "Fresh herbs, Pho, and light broths.", color: "bg-green-600" },
    { name: "Turkish", code: "TUR", description: "Kebabs, baklava, and Middle Eastern delights.", color: "bg-rose-600" },
    { name: "Brazilian", code: "BRA", description: "Grilled meats, Feijoada, and tropical fruit.", color: "bg-green-500" }
];

const CuisineMap = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRegions = regions.filter(r =>
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
                            Cuisine Explorer
                        </h1>
                        <p className="text-text-gray mt-4 max-w-xl text-lg">
                            Travel the world through your plate. Select a region to discover its signature culinary masterpieces.
                        </p>
                    </div>

                    <div className="w-full md:w-80">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search cuisines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 text-white backdrop-blur-md"
                            />
                            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredRegions.map((region, index) => (
                        <motion.div
                            key={region.code}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            onClick={() => navigate(`/recipes?cuisine=${region.name}`)}
                            className="group cursor-pointer relative glass-panel rounded-3xl p-8 border border-white/10 overflow-hidden hover:border-primary/30 transition-all duration-300 h-full flex flex-col"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full ${region.color}`} />

                            <div className="mb-6">
                                <span className="text-xs font-bold tracking-widest text-primary uppercase">{region.code}</span>
                                <h3 className="text-2xl font-heading font-bold mt-1 text-white group-hover:text-primary transition-colors">{region.name}</h3>
                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                                {region.description}
                            </p>

                            <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                Explore Recipes <ArrowRight size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredRegions.length === 0 && (
                    <div className="text-center py-24 glass-panel rounded-3xl border border-white/10">
                        <p className="text-slate-500 italic">No cuisines found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CuisineMap;
