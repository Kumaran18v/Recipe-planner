import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 bg-bg-dark">
            {/* Video Background - Parallax */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 w-full h-full z-0"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="/assets/hero_bg.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent"></div>
                <div className="absolute inset-0 bg-white/30 dark:bg-black/40"></div>
            </motion.div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-30 z-0" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none opacity-20 z-0" />

            <div className="container mx-auto relative z-10 flex flex-col items-center justify-center text-center h-full pt-20">

                {/* Text Content */}
                <motion.div
                    style={{ y: textY }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-widest mb-8 border border-primary/20 uppercase backdrop-blur-md"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Culinary Intelligence
                    </motion.div>

                    <h1 className="text-6xl lg:text-8xl font-heading font-bold leading-[1.1] mb-8 text-slate-900 dark:text-white">
                        Discover Recipes.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">
                            Explore Flavors.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-700 dark:text-text-gray mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        A modern, data-driven way to explore thousands of recipes.
                        Filter by nutrition, cuisine, and rating to find your next masterpiece.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/recipes')}
                            className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary/20"
                        >
                            Start Exploring <ChevronRight size={20} />
                        </motion.button>

                        <button
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-full font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/20 hover:border-slate-500 dark:hover:border-white/50 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/40 dark:bg-black/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-black/60 shadow-sm"
                        >
                            Learn More
                        </button>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
