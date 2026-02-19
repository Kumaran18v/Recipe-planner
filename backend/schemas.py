from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Recipe(BaseModel):
    id: int
    title: str
    cuisine: Optional[str] = None
    rating: Optional[float] = None
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    total_time: Optional[int] = None
    description: Optional[str] = None
    nutrients: Optional[Dict[str, Any]] = None
    serves: Optional[str] = None
    url: Optional[str] = None
    ingredients: Optional[List[str]] = None
    instructions: Optional[List[str]] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class PaginatedRecipes(BaseModel):
    page: int
    limit: int
    total: int
    data: List[Recipe]

class ChatMessage(BaseModel):
    message: str

class PantrySearch(BaseModel):
    ingredients: List[str]

# --- Auth Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class User(UserBase):
    id: int
    preferences: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- User Specific ---
class MealPlanCreate(BaseModel):
    date: str
    meal_type: str
    recipe_id: int

class MealPlan(BaseModel):
    id: int
    date: str
    meal_type: str
    recipe_id: int
    recipe: Optional[Recipe] = None

    class Config:
        from_attributes = True

class FavoriteCreate(BaseModel):
    recipe_id: int

class Favorite(BaseModel):
    id: int
    recipe_id: int
    recipe: Optional[Recipe] = None

    class Config:
        from_attributes = True
