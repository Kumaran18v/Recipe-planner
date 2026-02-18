# 🍳 Recipe Planner AI

A powerful, full-stack recipe discovery and meal planning platform powered by FastAPI and React. This application combines data science with culinary art to provide a seamless cooking experience.

![GitHub](https://img.shields.io/badge/GitHub-Recipe--planner-orange?style=flat-square&logo=github)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat-square&logo=sqlite)

---

## ✨ Key Features

### 🤖 AI Chef Bot
Engage with our virtual culinary expert for wine pairings, ingredient substitutions, and cooking tips. The chatbot uses a rule-based engine to provide instant kitchen advice.

### 🍱 Smart Pantry
Enter the ingredients you have on hand, and our "Smart Pantry" algorithm will suggest the best recipes you can make right now, sorted by how many ingredients you already possess.

### 📊 Nutrition Visuals
Integrated **Recharts** visualizations showcase macro-nutrient breakdowns (Calories, Protein, Fat, Sodium) for every recipe, helping you make healthier choices.

### 📅 Meal Planner
Plan your week with ease! Add recipes to specific days and meal slots (Breakfast, Lunch, Dinner, Snack) using our interactive calendar-based meal planner.

### 💖 Favorites & Cookbook
Save your favorite recipes to your personal digital cookbook for quick access anytime.

### 🎲 Surprise Me Mode
Feeling adventurous? Let our random recipe generator pick your next culinary masterpiece with a single click.

### 🔍 Advanced Filtering
Precision search with support for:
-   **Dietary Needs**: Vegetarian, Vegan, Gluten-Free.
-   **Ingredient Exclusion**: Hide recipes containing allergens or disliked ingredients.
-   **Complex Queries**: Filter by rating, total time, and calories using logical operators (e.g., `>= 4.5`).

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Python, FastAPI, SQLAlchemy |
| **Database** | SQLite |
| **Frontend** | React (Vite), Axios |
| **UI/UX** | Framer Motion (Animations), Lucide React (Icons), Recharts (Charts) |
| **Styling** | Vanilla CSS (Glassmorphism, Dark Mode) |

---

## 🚀 Getting Started

### 1. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install required packages:
    ```bash
    pip install fastapi uvicorn sqlalchemy pydantic requests
    ```
3.  Initialize the database and import data:
    ```bash
    python import_data.py
    ```
4.  Start the FastAPI server:
    ```bash
    python -m uvicorn main:app --reload
    ```
    *API will be available at `http://localhost:8000`.*

### 2. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *Application will be available at `http://localhost:5174`.*

---

## 📸 UI Showcase
- **Hero Section**: Dynamic entrance with quick navigation.
- **Card Grid**: Modern, responsive layout replacing traditional tables.
- **Interactive Details**: Macro-nutrient charts and detailed instructions.

---

## 📂 Project Structure
```text
recipe-api/
├── backend/            # FastAPI source code
│   ├── main.py        # API routes and logic
│   ├── models.py      # Database models
│   ├── schemas.py     # Pydantic validation
│   └── import_data.py # JSON to SQLite migration
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   └── api.js      # API integration layer
│   └── vite.config.js  # Server configuration
└── recipes.db          # SQLite Database (generated)
```

Developed with ❤️ for food lovers everywhere.
