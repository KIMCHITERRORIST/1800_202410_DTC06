document.addEventListener('DOMContentLoaded', function () {
    // Your code to run after the DOM is fully loaded
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, now you can safely call your functions
            appendCategoriesToDropdownInPage()
            categorySelector = document.getElementById('categoriesForMeals');
            categorySelector.addEventListener('change', appendMealsToDropdownInPage);
            document.getElementById('addMealButton').addEventListener('click', addRecipeToCalories);
        } else {
            // User is not signed in. Redirect or handle accordingly.
            console.log('User is not logged in.');
        }
    });
});

async function fetchCategories() {
    const uid = await fetchUID();
    console.log(uid);
    doc = await db.collection("Recipes").doc(uid).get();
    if (doc.exists) {
        console.log("Document data:", doc.data());
        return doc.data().categories;
    }
    else {
        console.log("No such document!");
    }
}

async function appendCategoriesToDropdownInPage() {
    const categories = await fetchCategories();
    const selectElement = document.getElementById('categoriesForMeals');

    categories.forEach(category => {  // Iterate through each category and append it as an option
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        selectElement.appendChild(option);
    });
}

async function appendMealsToDropdownInPage() {
    const uid = await fetchUID();
    const category = document.getElementById('categoriesForMeals').value;
    recipesRef = db.collection("Recipes").doc(uid).collection(category).get()
    recipes = await recipesRef;

    recipes.forEach(recipe => {  // Iterate through each recipe and append it as an option
        if (recipe.id === 'count') {
            return;
        }
        const option = document.createElement('option');
        option.value = recipe.id;
        option.textContent = recipe.id;
        document.getElementById('meal').appendChild(option);
    });
}

// // Function to add a recipe to the Calories collection
function addRecipeToCalories() {
    category = document.getElementById('categoriesForMeals').value;
    const recipeName = document.getElementById('meal').value;
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
                alert(`${quantity} ${recipeName} added to Calories with date ${dateString} successfully.`);
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