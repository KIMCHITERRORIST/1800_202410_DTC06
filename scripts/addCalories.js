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
                console.log(`Processing recipe: ${doc.id}`); // Log each recipe being processed
                if (doc.id === "count") {
                    return; // Skip the count document
                }
                const recipeElement = document.createElement('div');
                recipeElement.classList.add("bg-slate-50", "border-2", "border-gray-200", "rounded-full", "p-2", "shadow-lg", "mb-2");
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
                categoryElement.classList.add("bg-white", "border-2", "border-gray-200", "rounded-full", "p-2", "shadow-lg", "mb-2");
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

function addRecipeToCalories(category, recipeName) {
    const uid = firebase.auth().currentUser.uid;
    const selectedFraction = document.getElementById('recipeFraction').value;

    // Convert selectedFraction to a numerical value
    const quantity = convertFractionToDecimal(selectedFraction);

    db.collection("Recipes").doc(uid).collection(category).doc(recipeName).get().then(recipeDoc => {
        if (recipeDoc.exists) {
            const recipeData = recipeDoc.data();
            const currentDate = new Date();
            const dateString = currentDate.getFullYear() + '-' +
                ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + currentDate.getDate()).slice(-2);

            // Calculate macros and calories based on quantity
            const fats = recipeData.fats * quantity;
            const carbs = recipeData.carbs * quantity;
            const protein = recipeData.protein * quantity;
            const calories = recipeData.calories * quantity;

            db.collection("calories").doc(uid).set({
                [recipeName]: {
                    fats: fats,
                    carbs: carbs,
                    protein: protein,
                    calories: calories,
                    date: dateString
                }
            }, { merge: true }).then(() => {
                console.log(`${quantity} ${recipeName} added to Calories with date ${dateString} successfully.`);
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

// Function to convert fractional amount to decimal
function convertFractionToDecimal(fraction) {
    if (!fraction.includes('/')) {
        return parseFloat(fraction); // If no fraction, return the number as it is
    }
    const parts = fraction.split(' ');
    const whole = parts.length > 1 ? parseFloat(parts[0]) : 0;
    const fractionParts = parts[parts.length - 1].split('/');
    const numerator = parseFloat(fractionParts[0]);
    const denominator = parseFloat(fractionParts[1]);
    const decimal = whole + (numerator / denominator);
    return decimal;
}