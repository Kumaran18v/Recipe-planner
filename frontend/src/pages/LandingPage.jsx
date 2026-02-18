import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import { Search, Activity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRandomRecipe } from '../api';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleSurpriseMe = async () => {
        try {
            const recipe = await getRandomRecipe();
            if (recipe && recipe.id) {
                navigate(`/recipes/${recipe.id}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const features = [
        {
            icon: <Search className="text-primary" size={32} />,
            title: "Advanced Search",
            description: "Filter by ingredients, cuisine, and dietary needs with precision."
        },
        {
            icon: <Activity className="text-secondary" size={32} />,
            title: "Nutrition Insights",
            description: "Detailed breakdown of calories, macros, and vitamins."
        },
        {
            icon: <Zap className="text-blue-400" size={32} />,
            title: "Fast Filtering",
            description: "Instant results powered by a high-performance backend."
        }
    ];

    return (
        <div className="min-h-screen bg-bg-dark text-text-light font-body overflow-x-hidden">

            <Hero />

            {/* Features Section */}
            <section className="py-24 bg-bg-surface relative overflow-hidden">
                {/* Decorative Separator */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl mb-6 font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Why Choose Us?</h2>
                        <p className="text-text-gray text-lg max-w-2xl mx-auto leading-relaxed">
                            We combine data science with culinary art to bring you the most powerful recipe discovery platform.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="glass-panel p-8 text-center hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-primary/30"
                            >
                                <div className="mb-6 bg-bg-surface w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-black/20 text-white border border-white/5">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl mb-3 font-heading text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-text-gray text-base leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 relative">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">How It Works</h2>
                        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent dashed-line" />

                        {[
                            { step: "01", title: "Browse", desc: "Explore our curated collection." },
                            { step: "02", title: "Filter", desc: "Refine by taste and nutrition." },
                            { step: "03", title: "Cook", desc: "Follow easy instructions." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                whileHover={{ y: -10 }}
                                className="relative z-10 glass-panel p-8 rounded-2xl w-full max-w-xs border border-white/5 hover:border-primary/20 transition-all duration-300 bg-bg-card"
                            >
                                <div className="text-6xl font-heading text-white/5 absolute -top-8 left-8 select-none font-bold">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl mb-2 mt-4 relative z-10 font-heading font-bold">{item.title}</h3>
                                <p className="text-text-gray relative z-10">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-b from-bg-dark to-primary/5 text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                <div className="container mx-auto relative z-10">
                    <h2 className="text-4xl lg:text-6xl font-heading font-bold mb-8 max-w-4xl mx-auto leading-tight">
                        Ready to Cook Something <span className="text-primary italic">Amazing?</span>
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/recipes')}
                        className="bg-primary text-slate-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-primary-hover transition-colors shadow-2xl shadow-primary/30"
                    >
                        Get Started Now
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/planner')}
                        className="bg-transparent border border-primary text-primary px-10 py-5 rounded-full font-bold text-lg hover:bg-primary/10 transition-colors ml-4"
                    >
                        Plan Your Meals
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSurpriseMe}
                        className="mt-6 md:mt-0 block md:inline-block md:ml-4 text-white hover:text-primary font-medium underline transition-colors"
                    >
                        Surprise Me!
                    </motion.button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
