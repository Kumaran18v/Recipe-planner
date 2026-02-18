from database import SessionLocal
import models
from sqlalchemy import text

def check_db():
    try:
        db = SessionLocal()
        # count recipes
        count = db.query(models.Recipe).count()
        print(f"Total Recipes: {count}")
        
        if count > 0:
            first = db.query(models.Recipe).first()
            print(f"First Recipe: {first.title}")
            print(f"URL: {first.url}")
        else:
            print("Database is empty!")
            
        db.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
