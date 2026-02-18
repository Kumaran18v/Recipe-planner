from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, text, func
from typing import Optional, List
import models, schemas
from database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/recipes", response_model=schemas.PaginatedRecipes)
def get_recipes(
    page: int = 1,
    limit: int = 10,
    sort_by: str = "rating",
    sort_order: str = "desc",
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    total = db.query(models.Recipe).count()
    
    query = db.query(models.Recipe)
    
    # Determine sort column
    sort_column = getattr(models.Recipe, sort_by, models.Recipe.rating)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    recipes = query.offset(offset).limit(limit).all()
    
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": recipes
    }

@app.get("/api/recipes/search", response_model=List[schemas.Recipe])
def search_recipes(
    title: Optional[str] = None,
    cuisine: Optional[str] = None,
    calories: Optional[str] = None,
    total_time: Optional[str] = None,
    rating: Optional[str] = None,
    diet: Optional[str] = None,
    exclude: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Recipe)

    if title:
        query = query.filter(models.Recipe.title.ilike(f"%{title}%"))
    
    if cuisine:
        query = query.filter(models.Recipe.cuisine == cuisine)
    
    # Advanced filtering helper
    def apply_operator_filter(query, column, value_str):
        import re
        match = re.match(r"(>=|<=|>|<|=)(.*)", value_str)
        if match:
            op, val = match.groups()
            try:
                val = float(val)
            except ValueError:
                return query # Ignore invalid numbers
            
            if op == ">=":
                return query.filter(column >= val)
            elif op == "<=":
                return query.filter(column <= val)
            elif op == ">":
                return query.filter(column > val)
            elif op == "<":
                return query.filter(column < val)
            elif op == "=":
                return query.filter(column == val)
        else:
            # Default to equality if no operator found, or contains just number
            try:
                val = float(value_str)
                return query.filter(column == val)
            except ValueError:
                return query
        return query

    if rating:
        query = apply_operator_filter(query, models.Recipe.rating, rating)
    
    if total_time:
        query = apply_operator_filter(query, models.Recipe.total_time, total_time)

    # For calories, we need to dig into JSON. SQLite JSON support can be tricky with SQLAlchemy.
    # A simple approach for this assignment without complex JSON operators is to fetch and filter in Python
    # OR use text() for raw SQL JSON extraction if SQLite version supports it.
    # Given requirements, let's try to string matching or just filter validation in python for calories if strictly required.
    # However, "nutrients" is JSON.
    # Let's see if we can use basic JSON extract.
    if calories:
         # Extract numerical value from "389 kcal" string in JSON?
         # This is complex in SQL.
         # Let's filter in python for calories for simplicity and reliability in this specific environment, 
         # UNLESS dataset is huge.
         pass 

    results = query.all()
    
    # Filter detailed JSON fields in Python if needed (like calories)
    if calories:
        import re
        filtered_results = []
        op_match = re.match(r"(>=|<=|>|<|=)?(\d+)", calories)
        if op_match:
            op, target_cal = op_match.groups()
            if not op: op = "="
            target_cal = float(target_cal)
            
            for r in results:
                if r.nutrients and "calories" in r.nutrients:
                    # "calories": "389 kcal"
                    cal_str = r.nutrients["calories"]
                    # extract number
                    cal_val_match = re.search(r"(\d+)", str(cal_str))
                    if cal_val_match:
                        cal_val = float(cal_val_match.group(1))
                        
                        if op == ">=" and cal_val >= target_cal: filtered_results.append(r)
                        elif op == "<=" and cal_val <= target_cal: filtered_results.append(r)
                        elif op == ">" and cal_val > target_cal: filtered_results.append(r)
                        elif op == "<" and cal_val < target_cal: filtered_results.append(r)
                        elif op == "=" and cal_val == target_cal: filtered_results.append(r)
            results = filtered_results

    # Diet Filtering (Naive)
    if diet:
        diet = diet.lower()
        if diet == "vegetarian":
            results = [r for r in results if not any(x in str(r.ingredients).lower() for x in ["chicken", "beef", "pork", "fish", "meat", "bacon", "ham", "sausage"])]
        elif diet == "vegan":
            results = [r for r in results if not any(x in str(r.ingredients).lower() for x in ["chicken", "beef", "pork", "fish", "meat", "bacon", "ham", "sausage", "egg", "milk", "cheese", "cream", "butter", "honey", "yogurt"])]
        elif diet == "gluten-free":
            results = [r for r in results if not any(x in str(r.ingredients).lower() for x in ["flour", "wheat", "barley", "rye", "bread", "pasta"])]

    # Exclude Ingredients
    if exclude:
        exclusions = [e.strip().lower() for e in exclude.split(",")]
        results = [r for r in results if not any(ex in str(r.ingredients).lower() for ex in exclusions)]

    return results

@app.get("/api/random-recipe", response_model=schemas.Recipe)
def get_random_recipe(db: Session = Depends(get_db)):
    print("DEBUG: Reached get_random_recipe")
    recipe = db.query(models.Recipe).order_by(func.random()).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="No recipes found")
    return recipe

@app.get("/api/recipes/{recipe_id}", response_model=schemas.Recipe)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@app.post("/api/chat")
def chat_with_chef(chat: schemas.ChatMessage):
    msg = chat.message.lower()
    
    if "wine" in msg:
        reply = "For heavy red meats, try a Cabernet Sauvignon. For fish, a crisp Sauvignon Blanc is perfect. For spicy food, go with a Riesling!"
    elif "substitute" in msg or "replace" in msg:
        reply = "Cooking is an art! You can substitute buttermilk with milk + lemon juice, or eggs with flaxseed meal + water for baking."
    elif "hello" in msg or "hi" in msg:
        reply = "Bonjour! Ready to cook something delicious?"
    elif "spice" in msg or "hot" in msg:
        reply = "To reduce heat, add dairy (yogurt/cream) or nut butter. To add heat, fresh chilies or cayenne pepper work wonders."
    else:
        reply = "That sounds interesting! I'm still learning, but I'd suggest checking our recipe database for more inspiration."
        
    return {"reply": reply}

@app.post("/api/recipes/pantry", response_model=List[schemas.Recipe])
def search_pantry(search: schemas.PantrySearch, db: Session = Depends(get_db)):
    # Naive implementation: fetch all recipes and filter in python
    # Optimization: Use SQL filtering if possible, but JSON matching is tricky in SQLite without extensions
    all_recipes = db.query(models.Recipe).all()
    
    results = []
    user_ingredients = [ing.lower() for ing in search.ingredients]
    
    for recipe in all_recipes:
        match_count = 0
        if recipe.ingredients:
            # recipe.ingredients is a list of strings
            for rec_ing in recipe.ingredients:
                rec_ing_lower = rec_ing.lower()
                for user_ing in user_ingredients:
                    if user_ing in rec_ing_lower:
                        match_count += 1
                        break # Count each user ingredient only once per recipe ingredient? Or once per recipe?
                              # Logic: if "chicken" is in "chicken breast", match.
        
        if match_count > 0:
            # Attach match count to recipe object for sorting (hacky, but works for sorting)
            recipe.match_count = match_count
            results.append(recipe)
            
    # Sort by match count desc
    results.sort(key=lambda x: x.match_count, reverse=True)
    
    return results[:20] # Return top 20 matches

# Meal Planner Endpoints
@app.post("/api/meal-plans", response_model=schemas.MealPlan)
def create_meal_plan(meal_plan: schemas.MealPlanCreate, db: Session = Depends(get_db)):
    db_meal_plan = models.MealPlan(**meal_plan.dict())
    db.add(db_meal_plan)
    db.commit()
    db.refresh(db_meal_plan)
    return db_meal_plan

@app.get("/api/meal-plans", response_model=List[schemas.MealPlan])
def get_meal_plans(db: Session = Depends(get_db)):
    return db.query(models.MealPlan).all()

@app.delete("/api/meal-plans/{id}")
def delete_meal_plan(id: int, db: Session = Depends(get_db)):
    meal_plan = db.query(models.MealPlan).filter(models.MealPlan.id == id).first()
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    db.delete(meal_plan)
    db.commit()
    db.commit()
    return {"message": "Meal plan deleted"}

# Favorites Endpoints
@app.post("/api/favorites", response_model=schemas.Favorite)
def add_favorite(favorite: schemas.FavoriteCreate, db: Session = Depends(get_db)):
    # Check if already exists
    existing = db.query(models.Favorite).filter(models.Favorite.recipe_id == favorite.recipe_id).first()
    if existing:
        return existing
    
    db_fav = models.Favorite(recipe_id=favorite.recipe_id)
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return db_fav

@app.get("/api/favorites", response_model=List[schemas.Favorite])
def get_favorites(db: Session = Depends(get_db)):
    return db.query(models.Favorite).all()

@app.delete("/api/favorites/{recipe_id}")
def remove_favorite(recipe_id: int, db: Session = Depends(get_db)):
    fav = db.query(models.Favorite).filter(models.Favorite.recipe_id == recipe_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
