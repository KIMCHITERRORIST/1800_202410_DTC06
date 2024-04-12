document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, get the user ID and run other functions
            const uid = user.uid;
            appendCategoriesToDropdownInPage(uid)

            // Add event listener to the category dropdown to fetch meals for the selected category in the modal
            document.getElementById('categoriesForMeals').addEventListener('change', () => {
                if (document.getElementById('categoriesForMeals').value) {
                    appendMealsToDropdownInPage(uid)
                }
                else { alert('Please select a category first') }
            })

            // Add event listener to the add meal button to add the selected meal to the meals collection
            document.getElementById('addMealButton').addEventListener('click', (event) => {
                event.preventDefault(); // Prevent the default form submit behavior
                if (document.getElementById('categoriesForMeals').value && document.getElementById('meal').value && document.getElementById('quantity').value) {
                    addRecipeToMeals(uid);
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

/**Function to fetch categories from the firebase using UID
 * @param {string} uid
 * @returns {Promise<Array>} - Returns an array of categories
 **/
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

/**Function to append the fetched categories to the dropdown in the page
 * @param {string} uid
 * @returns {void}
 **/
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

/**Function to clear the Dropdown except for the "recipe" text to avoid overlapping recipes
 * @returns {void}
 */
function clearDropdownExceptRecipe() {
    const selectElement = document.getElementById('meal');
    const options = Array.from(selectElement.options);

    options.forEach(option => {
        if (option.textContent.toLowerCase() !== 'recipe') {
            selectElement.removeChild(option);
        }
    });
}

/**Function to append meal/recipe user have in database to the dropdown
 * @param {string} uid
 * @returns {void}
 **/
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


// Function to add a recipe to the Calories collection
/**Function to add meal user made/had to the database
 * @param {string} uid
 * @returns {void}
 */
function addRecipeToMeals(uid) {
    console.log("Adding recipe to Calories...");
    const category = document.getElementById('categoriesForMeals').value;
    const recipeName = document.getElementById('meal').value;
    const selectedFraction = document.getElementById('quantity').value;

    // Convert selectedFraction to a numerical value
    const quantity = convertFractionToDecimal(selectedFraction);

    db.collection("Recipes").doc(uid).collection(category).get().then(recipeDocRef => {
        recipeDocRef.docs.forEach(recipeDoc => {
            if (recipeDoc.exists) {
                if (recipeDoc.id === "count") {
                    return; // Skip the count document
                }

                // Get the recipe data
                const recipeData = recipeDoc.data();

                // Get the current date and time and format in DD-MM-YYYY and HH:MM AM/PM
                const currentDate = new Date();
                const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`
                const hours = currentDate.getHours();
                const minutes = currentDate.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const timeString = `${((hours + 11) % 12 + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

                // Calculate macros and calories based on quantity
                const fats = recipeData.fats * quantity;
                const carbs = recipeData.carbs * quantity;
                const protein = recipeData.protein * quantity;
                const calories = recipeData.calories * quantity;

                // Add the recipe to the meals collection
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
                    window.location.href = "meal_log.html";

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
/**Function to convert fraction to decimal
 * @param {string} fraction
 * @returns {number} - Returns a decimal number
 */
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