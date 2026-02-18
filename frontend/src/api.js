import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchRecipes = async (page = 1, limit = 10, sortBy = 'rating', sortOrder = 'desc') => {
    try {
        const response = await axios.get(`${API_URL}/recipes`, {
            params: { page, limit, sort_by: sortBy, sort_order: sortOrder }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};

export const searchRecipes = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/recipes/search`, {
            params: filters
        });
        return response.data;
    } catch (error) {
        console.error("Error searching recipes:", error);
        throw error;
    }
};

export const searchPantry = async (ingredients) => {
    try {
        const response = await axios.post(`${API_URL}/recipes/pantry`, { ingredients });
        return response.data;
    } catch (error) {
        console.error("Error searching pantry:", error);
        throw error;
    }
};

export const getRecipeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching recipe ${id}:`, error);
        throw error;
    }
};

export const getRandomRecipe = async () => {
    try {
        const response = await axios.get(`${API_URL}/random-recipe`);
        return response.data;
    } catch (error) {
        console.error("Error fetching random recipe:", error);
        throw error;
    }
};

// Meal Planner API
export const getMealPlans = async () => {
    try {
        const response = await axios.get(`${API_URL}/meal-plans`);
        return response.data;
    } catch (error) {
        console.error("Error fetching meal plans:", error);
        throw error;
    }
};

export const createMealPlan = async (mealPlan) => {
    try {
        const response = await axios.post(`${API_URL}/meal-plans`, mealPlan);
        return response.data;
    } catch (error) {
        console.error("Error creating meal plan:", error);
        throw error;
    }
};

export const deleteMealPlan = async (id) => {
    try {
        await axios.delete(`${API_URL}/meal-plans/${id}`);
    } catch (error) {
        console.error("Error deleting meal plan:", error);
        throw error;
    }
};

// Favorites API
export const getFavorites = async () => {
    try {
        const response = await axios.get(`${API_URL}/favorites`);
        return response.data;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        throw error;
    }
};

export const addFavorite = async (recipeId) => {
    try {
        const response = await axios.post(`${API_URL}/favorites`, { recipe_id: recipeId });
        return response.data;
    } catch (error) {
        console.error("Error adding favorite:", error);
        throw error;
    }
};

export const removeFavorite = async (recipeId) => {
    try {
        await axios.delete(`${API_URL}/favorites/${recipeId}`);
    } catch (error) {
        console.error("Error removing favorite:", error);
        throw error;
    }
};
