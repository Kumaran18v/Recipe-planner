import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeTable from './components/RecipeTable';
import LandingPage from './pages/LandingPage';
import RecipeDetail from './pages/RecipeDetail';
import MealPlanner from './pages/MealPlanner';
import Favorites from './pages/Favorites';
import ChefBot from './components/ChefBot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-dark text-text-light relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/recipes" element={<RecipeTable />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/planner" element={<MealPlanner />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
        <ChefBot />
      </div>
    </Router>
  );
}

export default App;
