import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/LandingPage';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import CookingMode from './pages/CookingMode';
import MealPlanner from './pages/MealPlanner';
import CuisineMap from './components/CuisineMap';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import { AuthProvider } from './context/AuthContext';
import ChefBot from './components/ChefBot';

function App() {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  // Debugging: Check if API URL is set correctly
  React.useEffect(() => {
    console.log("🚀 Frontend Configured API URL:", import.meta.env.VITE_API_URL || "Defaulting to localhost (BAD if deployed)");
    console.log("If this says localhost but you are on Vercel, you need to set VITE_API_URL in Vercel Settings and Redeploy.");
  }, []);

  // Hide navbar on standalone pages
  const hideNavbar = ['/login', '/register'].includes(location.pathname) || location.pathname.includes('/cook');

  return (
    <AuthProvider>
      <div className="font-body bg-bg-surface dark:bg-bg-dark min-h-screen text-slate-900 dark:text-text-light selection:bg-primary/30">
        {!hideNavbar && <Navbar onOpenChefBot={() => setIsChatOpen(true)} />}

        <ChefBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />

        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/recipes" element={<PageTransition><RecipeList /></PageTransition>} />
            <Route path="/recipes/:id" element={<PageTransition><RecipeDetail /></PageTransition>} />
            <Route path="/recipes/:id/cook" element={<PageTransition><CookingMode /></PageTransition>} />
            <Route path="/planner" element={<PageTransition><MealPlanner /></PageTransition>} />
            <Route path="/map" element={<PageTransition><CuisineMap /></PageTransition>} />
            <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
}

export default App;
