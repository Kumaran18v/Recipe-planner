import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, Calendar, Map, ChefHat, LogIn, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenChefBot }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const links = [
        { to: "/", label: "Home", icon: <Home size={20} /> },
        { to: "/recipes", label: "Recipes", icon: <Search size={20} /> },
        { to: "/favorites", label: "Favorites", icon: <Heart size={20} /> },
        { to: "/planner", label: "Planner", icon: <Calendar size={20} /> },
        { to: "/map", label: "Map", icon: <Map size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
        >
            <div className="max-w-4xl mx-auto">
                <div className="glass-panel bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
                    <button onClick={onOpenChefBot} className="flex items-center gap-2 font-heading font-bold text-lg text-primary mr-4 hover:scale-105 transition-transform">
                        <ChefHat size={24} />
                        <span className="hidden sm:inline">ChefBot</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `
                                    relative px-3 py-2 rounded-full transition-all duration-300 flex items-center gap-2 group
                                    ${isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-pill"
                                                className="absolute inset-0 bg-primary/10 dark:bg-white/10 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.icon}</span>
                                        <span className="text-sm font-medium hidden lg:block relative z-10">{link.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}




                        <div className="w-px h-6 bg-slate-300 dark:bg-white/20 mx-1"></div>
                        <div className="w-px h-6 bg-slate-300 dark:bg-white/20 mx-1"></div>


                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center text-xs font-bold shadow-lg">
                                        {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-bg-card border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1"
                                            onMouseLeave={() => setShowUserMenu(false)}
                                        >
                                            <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.full_name}</p>
                                                <p className="text-xs text-slate-500 dark:text-text-gray truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2"
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <NavLink
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all font-bold text-sm"
                            >
                                <LogIn size={18} /> <span className="hidden sm:inline">Sign In</span>
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
