import json
import math
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Create tables if they don't exist
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def import_data():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(models.Recipe).count() > 0:
        print("Data already exists. Skipping import.")
        db.close()
        return

    try:
        with open("../US_recipes_null.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            
            for key, item in data.items():
                # Handle NaN/Invalid values
                def clean_float(val):
                    if val is None: return None
                    if isinstance(val, (int, float)):
                        if math.isnan(val): return None
                        return float(val)
                    return None

                def clean_int(val):
                    if val is None: return None
                    if isinstance(val, (int, float)):
                        if math.isnan(val): return None
                        return int(val)
                    return None

                recipe = models.Recipe(
                    cuisine=item.get("cuisine"),
                    title=item.get("title"),
                    rating=clean_float(item.get("rating")),
                    prep_time=clean_int(item.get("prep_time")),
                    cook_time=clean_int(item.get("cook_time")),
                    total_time=clean_int(item.get("total_time")),
                    description=item.get("description"),
                    nutrients=item.get("nutrients"),
                    serves=item.get("serves"),
                    url=item.get("URL"), # Map JSON 'URL' to model 'url'
                    ingredients=item.get("ingredients")
                )
                db.add(recipe)
            
            db.commit()
            print("Data imported successfully!")
            
    except Exception as e:
        print(f"Error importing data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import_data()
