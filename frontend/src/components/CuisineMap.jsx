import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { ChevronLeft, Globe, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const cuisineMapping = {
    "ITA": "Italian",
    "MEX": "Mexican",
    "FRA": "French",
    "CHN": "Chinese",
    "IND": "Indian",
    "JPN": "Japanese",
    "THA": "Thai",
    "ESP": "Spanish",
    "GRC": "Greek",
    "USA": "American",
    "GBR": "British",
    "DEU": "German",
    "VNM": "Vietnamese",
    "KOR": "Korean",
    "TUR": "Turkish",
    "BRA": "Brazilian",
    "MAR": "Moroccan",
    "CUB": "Cuban",
    "SWE": "Scandinavian",
    "RUS": "Russian"
};

const CuisineMap = () => {
    const navigate = useNavigate();
    const [hoveredCountry, setHoveredCountry] = useState(null);

    const handleCountryClick = (geo) => {
        const cuisine = cuisineMapping[geo.id] || cuisineMapping[geo.properties.ISO_A3];
        if (cuisine) {
            navigate(`/recipes?cuisine=${cuisine}`);
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark text-white py-12 px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-primary mb-4 hover:underline flex items-center gap-1"
                        >
                            <ChevronLeft size={16} /> Back to Home
                        </button>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
                            Cuisine Explorer
                        </h1>
                        <p className="text-text-gray mt-4 max-w-xl text-lg">
                            Explore the flavors of the world. Click on a highlighted country to discover its signature recipes.
                        </p>
                    </div>
                    <div className="hidden md:flex flex-col items-end gap-2">
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-slate-300">
                            <Globe size={16} className="text-primary" />
                            <span>Interactive World Map</span>
                        </div>
                    </div>
                </div>

                <div className="relative glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm min-h-[600px] flex items-center justify-center">
                    <ComposableMap projectionConfig={{ scale: 200 }}>
                        <ZoomableGroup>
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => {
                                        const countryId = geo.id || geo.properties.ISO_A3;
                                        const hasCuisine = !!cuisineMapping[countryId];
                                        const isHovered = hoveredCountry === countryId;

                                        return (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                onMouseEnter={() => {
                                                    if (hasCuisine) setHoveredCountry(countryId);
                                                }}
                                                onMouseLeave={() => {
                                                    setHoveredCountry(null);
                                                }}
                                                onClick={() => handleCountryClick(geo)}
                                                style={{
                                                    default: {
                                                        fill: hasCuisine ? "#F59E0B" : "#1E293B",
                                                        outline: "none",
                                                        transition: "all 250ms",
                                                        stroke: "#0F172A",
                                                        strokeWidth: 0.5,
                                                        opacity: hasCuisine ? 0.8 : 0.4
                                                    },
                                                    hover: {
                                                        fill: hasCuisine ? "#6366F1" : "#334155",
                                                        outline: "none",
                                                        cursor: hasCuisine ? "pointer" : "default",
                                                        opacity: 1,
                                                        stroke: "#FFF",
                                                        strokeWidth: 1
                                                    },
                                                    pressed: {
                                                        fill: "#4F46E5",
                                                        outline: "none"
                                                    }
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Geographies>
                        </ZoomableGroup>
                    </ComposableMap>

                    {/* Tooltip-like Legend */}
                    <AnimatePresence>
                        {hoveredCountry && cuisineMapping[hoveredCountry] && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-indigo-600/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 shadow-2xl z-50 flex flex-col items-center"
                            >
                                <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold mb-1">Explore Cuisine</span>
                                <span className="text-3xl font-heading font-black text-white">{cuisineMapping[hoveredCountry]}</span>
                                <div className="flex items-center gap-2 mt-2 text-indigo-200 text-sm">
                                    <Info size={14} />
                                    <span>Click to view recipes</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Map Controls Guide */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs text-slate-400 max-w-[150px]">
                        <p>💡 Click and drag to pan.</p>
                        <p className="mt-1">🔍 Use scroll to zoom.</p>
                        <p className="mt-1 text-primary font-medium">✨ Golden areas have recipes!</p>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(cuisineMapping).map(([code, name]) => (
                        <button
                            key={code}
                            onClick={() => navigate(`/recipes?cuisine=${name}`)}
                            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 text-sm font-medium text-slate-300"
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CuisineMap;
