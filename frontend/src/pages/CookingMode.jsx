import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById } from '../api';
import { getRecipeImage, getFallbackImage } from '../utils/imageUtils';
import { ChevronLeft, ChevronRight, Check, Play, Clock, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CookingMode = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
                console.log("Voice command:", transcript);

                if (transcript.includes('next')) {
                    handleNext();
                } else if (transcript.includes('previous') || transcript.includes('back')) {
                    handlePrev();
                }
            };

            recognition.onend = () => {
                if (isListening) {
                    recognition.start();
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [currentStep, isListening]); // Dedpendency on currentStep might cause re-bind issues, handled by ref in real app but simple here

    const toggleVoiceControl = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    useEffect(() => {
        const loadRecipe = async () => {
            try {
                const data = await getRecipeById(id);
                setRecipe(data);
            } catch (error) {
                console.error("Failed to load recipe", error);
            } finally {
                setLoading(false);
            }
        };
        loadRecipe();
    }, [id]);

    if (loading) return <div className="text-white text-center py-20 text-2xl font-light">Preparing your kitchen...</div>;
    if (!recipe) return <div className="text-white text-center py-20">Recipe not found.</div>;

    // Ensure instructions exist and are an array
    const steps = Array.isArray(recipe.instructions) ? recipe.instructions : [];

    if (steps.length === 0) {
        return (
            <div className="min-h-screen bg-bg-dark text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-3xl font-heading mb-4">No Instructions Found</h2>
                <p className="text-slate-400 mb-8">This recipe doesn't have step-by-step instructions yet.</p>
                <button
                    onClick={() => navigate(`/recipes/${id}`)}
                    className="px-6 py-3 bg-primary text-bg-dark font-bold rounded-xl hover:bg-amber-500 transition-colors"
                >
                    Back to Recipe
                </button>
            </div>
        );
    }

    const progress = ((currentStep + 1) / steps.length) * 100;

    const handleNext = () => {
        if (!steps.length) return;
        setCurrentStep(prev => {
            if (prev < steps.length - 1) return prev + 1;
            navigate(`/recipes/${id}`);
            return prev;
        });
    };

    const handlePrev = () => {
        setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
    };

    // Re-bind recognition on step change isn't needed if we use functional updates, 
    // but the closure for handleNext calling navigate might be stale if defined outside.
    // Ideally, we'd use a ref for the handlers or latest state, but simplified:
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();

                if (transcript.includes('next')) {
                    setCurrentStep(prev => {
                        if (prev < steps.length - 1) return prev + 1;
                        if (prev === steps.length - 1) navigate(`/recipes/${id}`); // Naive navigation trigger
                        return prev;
                    });
                } else if (transcript.includes('previous') || transcript.includes('back')) {
                    setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
                }
            };
        }
    }, [steps, id, navigate]);

    return (
        <div className="min-h-screen bg-bg-dark text-white flex flex-col relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 opacity-10">
                <img
                    src={getRecipeImage(recipe.cuisine, recipe.id)}
                    alt="Background"
                    className="w-full h-full object-cover blur-sm"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getFallbackImage(recipe.cuisine, recipe.id);
                    }}
                />
            </div>
            <div className="relative z-10 flex flex-col h-full">
                {/* Header / Progress */}
                <div className="p-6 flex justify-between items-center relative z-10">
                    <button
                        onClick={() => navigate(`/recipes/${id}`)}
                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        title="Exit Cooking Mode"
                    >
                        <ArrowLeft size={24} className="text-slate-400" />
                    </button>

                    <button
                        onClick={toggleVoiceControl}
                        className={`p-3 rounded-full transition-all flex items-center gap-2 ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-slate-400'}`}
                        title="Voice Control"
                    >
                        {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                        <span className="text-xs font-bold uppercase hidden md:inline">{isListening ? 'Listening' : 'Voice Off'}</span>
                    </button>

                    <div className="flex flex-col items-center">
                        <span className="text-sm text-primary font-bold tracking-widest uppercase">Cooking Mode</span>
                        <h2 className="text-lg font-heading hidden md:block">{recipe.title}</h2>
                    </div>
                    <div className="text-sm font-mono text-slate-400">
                        {currentStep + 1} / {steps.length}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/5 w-full">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-hidden relative">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-4xl w-full"
                        >
                            <div className="mb-8">
                                <span className="text-8xl font-bold text-white/5 absolute -top-10 -left-10 select-none">
                                    {currentStep + 1}
                                </span>
                                <h3 className="text-2xl md:text-4xl font-light leading-relaxed relative z-10">
                                    {steps[currentStep]}
                                </h3>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="p-8 border-t border-white/5 bg-black/20 backdrop-blur-md">
                    <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className={`
                            flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all
                            ${currentStep === 0
                                    ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                                    : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'}
                        `}
                        >
                            <ChevronLeft /> Previous
                        </button>

                        <button
                            onClick={handleNext}
                            className={`
                            flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-primary/20 hover:scale-105
                            ${currentStep === steps.length - 1
                                    ? 'bg-green-500 text-black'
                                    : 'bg-primary text-black'}
                        `}
                        >
                            {currentStep === steps.length - 1 ? (
                                <>Finish Cooking <Check /></>
                            ) : (
                                <>Next Step <ChevronRight /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookingMode;
