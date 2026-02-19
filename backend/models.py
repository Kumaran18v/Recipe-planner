from sqlalchemy import Column, Integer, String, Float, Text, JSON, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    preferences = Column(JSON, nullable=True)

    favorites = relationship("Favorite", back_populates="user")
    meal_plans = relationship("MealPlan", back_populates="user")

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
    instructions = Column(JSON, nullable=True)
    image_url = Column(String, nullable=True)

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True)
    meal_type = Column(String)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    recipe = relationship("Recipe")
    user = relationship("User", back_populates="meal_plans")

class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = (UniqueConstraint('user_id', 'recipe_id', name='unique_user_recipe'),)

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    recipe = relationship("Recipe")
    user = relationship("User", back_populates="favorites")