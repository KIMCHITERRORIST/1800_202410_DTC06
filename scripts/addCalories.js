document.addEventListener('DOMContentLoaded', function () {
    // Your code to run after the DOM is fully loaded
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, now you can safely call your functions
            fetchAndDisplaySubcategories();
        } else {
            // User is not signed in. Redirect or handle accordingly.
            console.log('User is not logged in.');
        }
    });
});

function fetchAndDisplayRecipes(category) {
    const uid = firebase.auth().currentUser.uid;
    const recipesContainer = document.getElementById('recipesContainer');
    recipesContainer.innerHTML = ''; // Clear previous recipes

    db.collection("Recipes").doc(uid).collection(category).get().then(querySnapshot => {
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const recipeElement = document.createElement('div');
                recipeElement.textContent = doc.id;
                recipeElement.addEventListener('click', () => {
                    addRecipeToCalories(category, doc.id);
                });
                recipesContainer.appendChild(recipeElement);
            });
        } else {
            console.log(`No recipes found in the ${category} category.`);
        }
    }).catch(error => {
        console.error("Error fetching recipes:", error);
    });
}

function fetchAndDisplaySubcategories() {
    const uid = firebase.auth().currentUser.uid;
    const subcategoriesContainer = document.getElementById('subcategoriesContainer');

    db.collection("Recipes").doc(uid).get().then(doc => {
        if (doc.exists && doc.data().categories) {
            const categories = doc.data().categories;
            categories.forEach(category => {
                const categoryElement = document.createElement('div');
                categoryElement.textContent = category;
                categoryElement.addEventListener('click', () => {
                    fetchAndDisplayRecipes(category);
                });
                subcategoriesContainer.appendChild(categoryElement);
            });
        } else {
            console.log("No categories found for this user or document does not exist.");
        }
    }).catch(error => {
        console.error("Error fetching categories:", error);
    });
}

// Function to add a recipe to the Calories collection
function addRecipeToCalories(category, recipeName) {
    const uid = firebase.auth().currentUser.uid;

    db.collection("Recipes").doc(uid).collection(category).doc(recipeName).get().then(recipeDoc => {
        if (recipeDoc.exists) {
            const recipeData = recipeDoc.data();
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0];

            // Directly use the macros from the recipeData
            const fats = recipeData.fats;
            const carbs = recipeData.carbs;
            const protein = recipeData.protein;
            const calories = recipeData.calories;

            db.collection("calories").doc(uid).set({
                [recipeName]: {
                    fats: fats,
                    carbs: carbs,
                    protein: protein,
                    calories: calories,
                    date: dateString
                }
            }, { merge: true }).then(() => {
                console.log(`${recipeName} added to Calories with date ${dateString} successfully.`);
            }).catch(error => {
                console.error("Error adding recipe to Calories:", error);
            });
        } else {
            console.log("Recipe not found.");
        }
    }).catch(error => {
        console.error("Error fetching recipe details:", error);
    });
}