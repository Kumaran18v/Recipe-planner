import requests
import json

try:
    r = requests.get('http://localhost:8000/api/recipes/search', params={'cuisine': 'Desserts'})
    print(f"Status: {r.status_code}")
    data = r.json()
    print(f"Count: {len(data)}")
    if data:
        print(f"Sample: {data[0]['title']} ({data[0]['cuisine']})")
except Exception as e:
    print(f"Error: {e}")
