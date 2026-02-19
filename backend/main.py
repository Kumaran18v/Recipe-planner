from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import desc, text, func
from typing import Optional, List
import models, schemas, auth
from database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Auth Dependencies ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except auth.JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

# --- Auth Endpoints ---

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/api/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/api/users/me", response_model=schemas.User)
async def update_user(user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.preferences is not None:
        current_user.preferences = user_update.preferences
    
    db.commit()
    db.refresh(current_user)
    return current_user

# --- Authenticated Endpoints ---

@app.post("/api/meal-plans", response_model=schemas.MealPlan)
def create_meal_plan(meal_plan: schemas.MealPlanCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_meal_plan = models.MealPlan(**meal_plan.dict(), user_id=current_user.id)
    db.add(db_meal_plan)
    db.commit()
    db.refresh(db_meal_plan)
    return db_meal_plan

@app.get("/api/meal-plans", response_model=List[schemas.MealPlan])
def get_meal_plans(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.MealPlan).filter(models.MealPlan.user_id == current_user.id).all()

@app.delete("/api/meal-plans/{id}")
def delete_meal_plan(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    meal_plan = db.query(models.MealPlan).filter(models.MealPlan.id == id, models.MealPlan.user_id == current_user.id).first()
    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    db.delete(meal_plan)
    db.commit()
    return {"message": "Meal plan deleted"}

@app.post("/api/favorites", response_model=schemas.Favorite)
def add_favorite(favorite: schemas.FavoriteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    existing = db.query(models.Favorite).filter(models.Favorite.recipe_id == favorite.recipe_id, models.Favorite.user_id == current_user.id).first()
    if existing:
        return existing
    
    db_fav = models.Favorite(recipe_id=favorite.recipe_id, user_id=current_user.id)
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return db_fav

@app.get("/api/favorites", response_model=List[schemas.Favorite])
def get_favorites(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Favorite).filter(models.Favorite.user_id == current_user.id).all()

@app.delete("/api/favorites/{recipe_id}")
def remove_favorite(recipe_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    fav = db.query(models.Favorite).filter(models.Favorite.recipe_id == recipe_id, models.Favorite.user_id == current_user.id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}

# --- Public Endpoints (Unchanged logic, just ensure no regression) ---

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
    sort_column = getattr(models.Recipe, sort_by, models.Recipe.rating)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())
    recipes = query.offset(offset).limit(limit).all()
    return {"page": page, "limit": limit, "total": total, "data": recipes}

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
    if title: query = query.filter(models.Recipe.title.ilike(f"%{title}%"))
    if cuisine: query = query.filter(models.Recipe.cuisine.ilike(f"%{cuisine}%"))

    # Advanced filtering helper
    def apply_operator_filter(query, column, value_str):
        import re
        match = re.match(r"(>=|<=|>|<|=)(.*)", value_str)
        if match:
            op, val = match.groups()
            try:
                val = float(val)
            except ValueError:
                return query
            if op == ">=": return query.filter(column >= val)
            elif op == "<=": return query.filter(column <= val)
            elif op == ">": return query.filter(column > val)
            elif op == "<": return query.filter(column < val)
            elif op == "=": return query.filter(column == val)
        else:
            try:
                val = float(value_str)
                return query.filter(column == val)
            except ValueError:
                return query
        return query

    if rating: query = apply_operator_filter(query, models.Recipe.rating, rating)
    if total_time: query = apply_operator_filter(query, models.Recipe.total_time, total_time)

    results = query.all()
    
    # Python-side filtering for complex fields
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
                    cal_str = r.nutrients["calories"]
                    cal_val_match = re.search(r"(\d+)", str(cal_str))
                    if cal_val_match:
                        cal_val = float(cal_val_match.group(1))
                        if op == ">=" and cal_val >= target_cal: filtered_results.append(r)
                        elif op == "<=" and cal_val <= target_cal: filtered_results.append(r)
                        elif op == ">" and cal_val > target_cal: filtered_results.append(r)
                        elif op == "<" and cal_val < target_cal: filtered_results.append(r)
                        elif op == "=" and cal_val == target_cal: filtered_results.append(r)
            results = filtered_results

    if diet:
        diet = diet.lower()
        if diet == "vegetarian":
            results = [r for r in results if not any(x in str(r.ingredients).lower() for x in ["chicken", "beef", "pork", "fish", "meat", "bacon", "ham", "sausage"])]
        elif diet == "vegan":
            results = [r for r in results if not any(x in str(r.ingredients).lower() for x in ["chicken", "beef", "pork", "fish", "meat", "bacon", "ham", "sausage", "egg", "milk", "cheese", "cream", "butter", "honey", "yogurt"])]
        elif diet == "gluten-free":
            results = [r for r in results if not any(x in str(r.ingredients).lower() for x in ["flour", "wheat", "barley", "rye", "bread", "pasta"])]

    if exclude:
        exclusions = [e.strip().lower() for e in exclude.split(",")]
        results = [r for r in results if not any(ex in str(r.ingredients).lower() for ex in exclusions)]

    return results

@app.get("/api/random-recipe", response_model=schemas.Recipe)
def get_random_recipe(db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).order_by(func.random()).first()
    if not recipe: raise HTTPException(status_code=404, detail="No recipes found")
    return recipe

@app.get("/api/recipes/{recipe_id}/image")
def get_recipe_image(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe: raise HTTPException(status_code=404, detail="Recipe not found")
    if recipe.image_url: return RedirectResponse(url=recipe.image_url)
    if not recipe.url: raise HTTPException(status_code=404, detail="No source URL to scrape")
    try:
        import requests
        from bs4 import BeautifulSoup
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(recipe.url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.content, 'html.parser')
        og_image = soup.find("meta", property="og:image")
        image_url = og_image["content"] if og_image else None
        if not image_url:
            twitter_image = soup.find("meta", property="twitter:image")
            image_url = twitter_image["content"] if twitter_image else None
        if image_url:
            recipe.image_url = image_url
            db.commit()
            return RedirectResponse(url=image_url)
        else: raise HTTPException(status_code=404, detail="No image found on page")
    except Exception as e:
        print(f"Scraping failed: {e}")
        raise HTTPException(status_code=404, detail="Scraping failed")

@app.get("/api/recipes/{recipe_id}", response_model=schemas.Recipe)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe: raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@app.post("/api/chat")
def chat_with_chef(chat: schemas.ChatMessage):
    msg = chat.message.lower()
    if "wine" in msg: reply = "For heavy red meats, try a Cabernet Sauvignon. For fish, a crisp Sauvignon Blanc is perfect."
    elif "substitute" in msg: reply = "You can substitute buttermilk with milk + lemon juice, or eggs with flaxseed meal."
    elif "hello" in msg: reply = "Bonjour! Ready to cook something delicious?"
    else: reply = "That sounds interesting! Check our recipe database for more inspiration."
    return {"reply": reply}

@app.post("/api/recipes/pantry", response_model=List[schemas.Recipe])
def search_pantry(search: schemas.PantrySearch, db: Session = Depends(get_db)):
    all_recipes = db.query(models.Recipe).all()
    results = []
    user_ingredients = [ing.lower() for ing in search.ingredients]
    for recipe in all_recipes:
        match_count = 0
        if recipe.ingredients:
            for rec_ing in recipe.ingredients:
                for user_ing in user_ingredients:
                    if user_ing in rec_ing.lower():
                        match_count += 1
                        break
        if match_count > 0:
            recipe.match_count = match_count
            results.append(recipe)
    results.sort(key=lambda x: x.match_count, reverse=True)
    return results[:20]

@app.get("/api/cuisines/counts")
def get_cuisine_counts(db: Session = Depends(get_db)):
    counts = db.query(models.Recipe.cuisine, func.count(models.Recipe.id)).group_by(models.Recipe.cuisine).all()
    return [{"cuisine": c, "count": n} for c, n in counts if c]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
