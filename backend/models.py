from sqlalchemy import Column, Integer, String, Float, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    cuisine = Column(String, index=True)
    title = Column(String, index=True)
    rating = Column(Float, nullable=True)
    prep_time = Column(Integer, nullable=True)
    cook_time = Column(Integer, nullable=True)
    total_time = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    nutrients = Column(JSON, nullable=True)
    serves = Column(String, nullable=True)
    url = Column(String, nullable=True)
    ingredients = Column(JSON, nullable=True)

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True)
    meal_type = Column(String)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))

    recipe = relationship("Recipe")

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), unique=True)

    recipe = relationship("Recipe")