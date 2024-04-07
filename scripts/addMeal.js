document.addEventListener('DOMContentLoaded', function () {
    // Your code to run after the DOM is fully loaded
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, now you can safely call your functions
            const uid = user.uid;
            appendCategoriesToDropdownInPage(uid)

            document.getElementById('categoriesForMeals').addEventListener('change', () => {
                if (document.getElementById('categoriesForMeals').value) {
                    appendMealsToDropdownInPage(uid)
                }
                else { alert('Please select a category first') }
            })

            document.getElementById('addMealButton').addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the default form submit behavior
                if (document.getElementById('categoriesForMeals').value && document.getElementById('meal').value && document.getElementById('quantity').value) {
                    console.log('Adding meal to Calories...');
                    addRecipeToCalories(uid);
                } else {
                    alert('Please select a category, meal, and quantity first.');
                }
            });


        } else {
            // User is not signed in. Redirect or handle accordingly.
            console.log('User is not logged in.');
        }
    });
});

function fetchCategories(uid) {
    console.log(uid);
    return db.collection("Recipes").doc(uid).get().then(doc => {
        if (doc.exists) {
            console.log("Document data under Recipes, uid:", doc.data().categories);
            var categoriesArray = doc.data().categories;
        }
        else {
            console.log("No such document!");
            categoriesArray = [];
        }
        return categoriesArray;
    }).catch(error => {
        console.error("Error fetching categories:", error);
    });
}

function appendCategoriesToDropdownInPage(uid) {
    console.log("Appending categories to dropdown...");
    const selectElement = document.getElementById('categoriesForMeals');
    fetchCategories(uid).then(categories => {
        console.log(categories);
        categories.forEach(category => {
            console.log(category)  // Iterate through each category and append it as an option
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            selectElement.appendChild(option);
        });
    }).catch(error => {
        console.error("Error fetching categories:", error);
    });
}

function clearDropdownExceptRecipe() {
    const selectElement = document.getElementById('meal');
    const options = Array.from(selectElement.options);

    options.forEach(option => {
        if (option.textContent.toLowerCase() !== 'recipe') {
            selectElement.removeChild(option);
        }
    });
}

function appendMealsToDropdownInPage(uid) {
    const category = document.getElementById('categoriesForMeals').value;
    console.log("Appending meals to dropdown for category:", category);
    const selectElement = document.getElementById('meal');
    clearDropdownExceptRecipe();
    console.log(uid, category)
    db.collection("Recipes").doc(uid).collection(category).get().then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
            if (doc.id === "count") {
                return;
            }
            const option = document.createElement('option');
            option.value = doc.data().name;
            option.textContent = doc.data().name;
            selectElement.appendChild(option);
        });
    })
        .catch(error => {
            console.error("Error fetching recipes:", error);
        });
}


// // Function to add a recipe to the Calories collection
function addRecipeToCalories(uid) {
    console.log("Adding recipe to Calories...");
    const category = document.getElementById('categoriesForMeals').value;
    const recipeName = document.getElementById('meal').value;
    const selectedFraction = document.getElementById('quantity').value;
    console.log(category, recipeName, selectedFraction)

    // Convert selectedFraction to a numerical value
    const quantity = convertFractionToDecimal(selectedFraction);

    db.collection("Recipes").doc(uid).collection(category).get().then(recipeDocRef => {
        recipeDocRef.docs.forEach(recipeDoc => {
            if (recipeDoc.exists) {
                if (recipeDoc.id === "count") {
                    return;
                }
                const recipeData = recipeDoc.data();
                console.log("Recipe data under recipe doc data NEW:", recipeData);
                const currentDate = new Date();
                const dateString = currentDate.toISOString().split('T')[0];
                const hours = currentDate.getHours();
                const minutes = currentDate.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const timeString = `${((hours + 11) % 12 + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

                // Calculate macros and calories based on quantity
                const fats = recipeData.fats * quantity;
                const carbs = recipeData.carbs * quantity;
                const protein = recipeData.protein * quantity;
                const calories = recipeData.calories * quantity;
                console.log("Macros and calories:", fats, carbs, protein, calories);

                db.collection("meals").doc(uid).set({
                    [recipeName]: {
                        fats: fats,
                        carbs: carbs,
                        protein: protein,
                        calories: calories,
                        date: dateString,
                        time: timeString
                    }
                }, { merge: true }).then(() => {
                    // window.location.href = "meal_log.html";

                }).catch(error => {
                    console.error("Error adding recipe to Calories:", error);
                });
            } else {
                console.log("Recipe not found.");
            }
        });
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