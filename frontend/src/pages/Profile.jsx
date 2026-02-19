import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../api';
import { motion } from 'framer-motion';
import { User, Mail, Save, Check, ChefHat, Leaf, Wheat, Milk, Flame } from 'lucide-react';

const Profile = () => {
    const { user, login, refreshUser } = useAuth(); // login used here just to refresh context if needed, or we might need a refreshUser method
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [preferences, setPreferences] = useState(user?.preferences || {});
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setPreferences(user.preferences || {});
        }
    }, [user]);

    const handlePreferenceToggle = (key) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            await updateUser({
                full_name: fullName,
                preferences: preferences
            });
            setSuccessMsg('Profile updated successfully!');
            if (refreshUser) refreshUser();
        } catch (error) {
            setErrorMsg('Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    const dietaryOptions = [
        { key: 'vegetarian', label: 'Vegetarian', icon: <Leaf size={18} />, color: 'text-green-400' },
        { key: 'vegan', label: 'Vegan', icon: <Leaf size={18} />, color: 'text-green-500' },
        { key: 'gluten_free', label: 'Gluten Free', icon: <Wheat size={18} />, color: 'text-amber-200' },
        { key: 'dairy_free', label: 'Dairy Free', icon: <Milk size={18} />, color: 'text-blue-200' },
        { key: 'spicy_tolerance', label: 'High Spice Tolerance', icon: <Flame size={18} />, color: 'text-red-500' },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
            >
                {/* Header Pattern */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-secondary/20 -z-10"></div>
                <div className="absolute top-20 left-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-orange-500 p-1 shadow-xl">
                        <div className="w-full h-full rounded-full bg-bg-card flex items-center justify-center text-4xl font-bold text-white">
                            {user?.full_name ? user.full_name[0].toUpperCase() : <User size={40} />}
                        </div>
                    </div>
                </div>

                <div className="mt-20 ml-36 mb-8">
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{user?.full_name || 'Chef'}</h1>
                    <p className="text-text-gray flex items-center gap-2"><Mail size={16} /> {user?.email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 mt-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Personal Details</h3>

                            <div className="space-y-2">
                                <label className="text-sm text-text-gray">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 opacity-60">
                                <label className="text-sm text-text-gray">Email (Cannot be changed)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dietary Preferences */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Dietary Preferences</h3>
                            <p className="text-xs text-text-gray mb-4">Select your dietary restrictions to personalize recipe recommendations.</p>

                            <div className="grid grid-cols-1 gap-3">
                                {dietaryOptions.map(option => (
                                    <label
                                        key={option.key}
                                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${preferences[option.key] ? 'bg-primary/20 border-primary/50' : 'bg-white/50 dark:bg-black/20 border-slate-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`${option.color}`}>{option.icon}</div>
                                            <span className="font-medium text-slate-700 dark:text-text-light">{option.label}</span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${preferences[option.key] ? 'bg-primary border-primary' : 'border-slate-500'}`}>
                                            {preferences[option.key] && <Check size={14} className="text-black" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={preferences[option.key] || false}
                                            onChange={() => handlePreferenceToggle(option.key)}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Feedback Messages */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                            {successMsg && <span className="text-green-400 flex items-center gap-2"><Check size={18} /> {successMsg}</span>}
                            {errorMsg && <span className="text-red-400">{errorMsg}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary"
                        >
                            {isLoading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;
