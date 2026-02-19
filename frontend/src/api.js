import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with interceptor
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth header interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Auth API ---
export const login = async (email, password) => {
    try {
        // OAuth2PasswordRequestForm expects form-urlencoded data
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await axios.post(`${API_URL}/token`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/api/users/me');
        return response.data;
    } catch (error) {
        console.error("Fetch user failed:", error);
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await apiClient.put('/api/users/me', userData);
        return response.data;
    } catch (error) {
        console.error("Update user failed:", error);
        throw error;
    }
};

// --- Recipes API ---

export const fetchRecipes = async (page = 1, limit = 10, sortBy = 'rating', sortOrder = 'desc') => {
    try {
        const response = await apiClient.get('/api/recipes', {
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
        const response = await apiClient.get('/api/recipes/search', {
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
        const response = await apiClient.post('/api/recipes/pantry', { ingredients });
        return response.data;
    } catch (error) {
        console.error("Error searching pantry:", error);
        throw error;
    }
};

export const getRecipeById = async (id) => {
    try {
        const response = await apiClient.get(`/api/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching recipe ${id}:`, error);
        throw error;
    }
};

export const getRandomRecipe = async () => {
    try {
        const response = await apiClient.get('/api/random-recipe');
        return response.data;
    } catch (error) {
        console.error("Error fetching random recipe:", error);
        throw error;
    }
};

// --- Meal Planner API ---
export const getMealPlans = async () => {
    try {
        const response = await apiClient.get('/api/meal-plans');
        return response.data;
    } catch (error) {
        console.error("Error fetching meal plans:", error);
        throw error;
    }
};

export const createMealPlan = async (mealPlan) => {
    try {
        const response = await apiClient.post('/api/meal-plans', mealPlan);
        return response.data;
    } catch (error) {
        console.error("Error creating meal plan:", error);
        throw error;
    }
};

export const deleteMealPlan = async (id) => {
    try {
        await apiClient.delete(`/api/meal-plans/${id}`);
    } catch (error) {
        console.error("Error deleting meal plan:", error);
        throw error;
    }
};

// --- Favorites API ---
export const getFavorites = async () => {
    try {
        const response = await apiClient.get('/api/favorites');
        return response.data;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        // Treat 401 as empty favorites for now to avoid crashing UI for guests
        if (error.response && error.response.status === 401) return [];
        throw error;
    }
};

export const addFavorite = async (recipeId) => {
    try {
        const response = await apiClient.post('/api/favorites', { recipe_id: recipeId });
        return response.data;
    } catch (error) {
        console.error("Error adding favorite:", error);
        throw error;
    }
};

export const removeFavorite = async (recipeId) => {
    try {
        await apiClient.delete(`/api/favorites/${recipeId}`);
    } catch (error) {
        console.error("Error removing favorite:", error);
        throw error;
    }
};

// --- Utils ---
export const getCuisineCounts = async () => {
    try {
        const response = await apiClient.get('/api/cuisines/counts');
        return response.data;
    } catch (error) {
        console.error("Error fetching cuisine counts:", error);
        return [];
    }
};
