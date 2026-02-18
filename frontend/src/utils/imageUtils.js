const termMapping = {
    "Amish and Mennonite": "baked goods",
    "Argentina": "steak",
    "Australian": "barbecue",
    "Austrian": "schnitzel",
    "Belgian": "waffles",
    "Brazilian": "brazilian food",
    "Cajun and Creole": "jambalaya",
    "Canadian": "poutine",
    "Central American": "tacos",
    "Chinese": "chinese food",
    "Cuban": "cuban sandwich",
    "English": "fish and chips",
    "Ethiopian": "ethiopian food",
    "Filipino": "filipino food",
    "French": "french cuisine",
    "German": "german food",
    "Greek": "greek food",
    "Hawaiian": "poke bowl",
    "Hungarian": "goulash",
    "Indian": "curry",
    "Indonesian": "nasi goreng",
    "Irish": "irish stew",
    "Italian": "pasta",
    "Japanese": "sushi",
    "Jewish": "bagels",
    "Korean": "bibimbap",
    "Lebanese": "hummus",
    "Malaysian": "laksa",
    "Mediterranean": "mediterranean food",
    "Mexican": "tacos",
    "Middle Eastern": "falafel",
    "Moroccan": "tagine",
    "Persian": "kebab",
    "Peruvian": "ceviche",
    "Polish": "pierogi",
    "Portuguese": "seafood",
    "Russian": "borscht",
    "Scandinavian": "meatballs",
    "Scottish": "haggis",
    "Southern": "fried chicken",
    "Southern Soul Food": "fried chicken",
    "Spanish": "paella",
    "Swedish": "meatballs",
    "Swiss": "fondue",
    "Thai": "pad thai",
    "Turkish": "kebab",
    "Vietnamese": "pho",
    "Welsh": "welsh cakes"
};

const API_BASE_URL = 'http://localhost:8000/api';

export const getRecipeImage = (cuisine, id) => {
    // Return the proxy endpoint
    // The browser will hit this, backend will scrape/redirect
    return `${API_BASE_URL}/recipes/${id}/image`;
};

// Fallback generator for onError events
export const getFallbackImage = (cuisine, id) => {
    let query = 'food';
    if (cuisine) {
        if (termMapping[cuisine]) {
            query = termMapping[cuisine];
        } else {
            query = cuisine.split(' ')[0];
        }
    }
    return `https://loremflickr.com/800/600/food,${query}?lock=${id}`;
};
