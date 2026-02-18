from pydantic import BaseModel
from typing import Optional, Dict, Any

class RecipeBase(BaseModel):
    cuisine: Optional[str] = None
    title: Optional[str] = "Untitled"
    rating: Optional[float] = None
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    total_time: Optional[int] = None
    description: Optional[str] = None
    nutrients: Optional[Dict[str, Any]] = None
    serves: Optional[str] = None
    url: Optional[str] = None
    ingredients: Optional[list[str]] = None

class RecipeCreate(RecipeBase):
    pass

class Recipe(RecipeBase):
    id: int

    class Config:
        orm_mode = True

class PaginatedRecipes(BaseModel):
    page: int
    limit: int
    total: int
    data: list[Recipe]

class ChatMessage(BaseModel):
    message: str

class PantrySearch(BaseModel):
    ingredients: list[str]

class MealPlanBase(BaseModel):
    date: str
    meal_type: str
    recipe_id: int

class MealPlanCreate(MealPlanBase):
    pass

class MealPlan(MealPlanBase):
    id: int
    recipe: Optional[Recipe] = None

    class Config:
        orm_mode = True

class FavoriteBase(BaseModel):
    recipe_id: int

class FavoriteCreate(FavoriteBase):
    pass

class Favorite(FavoriteBase):
    id: int
    recipe: Optional[Recipe] = None

    class Config:
        orm_mode = True
