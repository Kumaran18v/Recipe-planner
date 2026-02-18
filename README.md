# Recipe Data Collection and API System

## Project Overview
This is a full-stack application that parses recipe data from a JSON file, stores it in a SQLite database, and provides a rich React-based UI to explore, search, and view detailed recipe information.

## Technology Stack
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite
- **Frontend**: React (Vite), Axios, Lucide React
- **Styling**: Vanilla CSS (Modern, Glassmorphism, Dark Mode)

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already installed, `requirements.txt` generation recommended but for now assume standard env):
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic
   ```
3. Run the data import script (populates `recipes.db`):
   ```bash
   python import_data.py
   ```
4. Start the API server:
   ```bash
   uvicorn main:app --reload
   ```
   Server will run at `http://localhost:8000`.

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   App will run at `http://localhost:5173`.

## Features
- **Data Ingestion**: Parses `US_recipes_null.json`, handles NaN values, cleans data.
- **Recipe Table**: Paginated view of recipes sorted by rating.
- **Search & Filtering**: Filter by Title, Cuisine, Rating, Total Time (e.g. `<= 60`), and Calories (exact match or custom logic implemented).
- **Detail View**: Interactive drawer showing nutrition facts, time breakdown, and description.
- **Responsive Design**: Modern UI with glassmorphism effects.

## API Documentation
- **GET /api/recipes**: List recipes with pagination.
  - Params: `page`, `limit`
- **GET /api/recipes/search**: Search recipes.
  - Params: `title`, `cuisine`, `rating` (supports operators like `>=4.5`), `total_time`, `calories`.
- **GET /api/recipes/{id}**: Get single recipe details.
