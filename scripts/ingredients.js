document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, fetch user ID and run other functions
            var uid = user.uid;
            fetchAndDisplayIngredients(uid);
        } else {
            // No user is signed in. Redirect to login page and show message
            console.log('User is not logged in. Redirecting to login page...');
            // Redirect to login page
            window.location.href = 'login.html';
        }
    });
});

function fetchAndDisplayIngredients(uid) {
    console.log(`Attempting to fetch ingredients for UID: ${uid}`); // Log before fetching

    db.collection("ingredients").doc(uid).get().then(documentSnapshot => {
        console.log(`Fetched document with UID: ${uid}`); // Log after successful fetch

        if (documentSnapshot.exists) {
            const ingredientNames = documentSnapshot.data();
            const ingredientsContainer = document.getElementById("ingredientsContainer");

            // Iterate over each field in the document as an ingredient
            Object.keys(ingredientNames).forEach(ingredientName => {
                const ingredient = ingredientNames[ingredientName];
                var ingredientCardHTML = `
                <div class="flex w-full mx-auto border-2 border-gray-300 shadow-lg rounded-lg mt-4 mb-6 p-4 items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                    <div class="flex-1 cursor-pointer" onclick="addIngredientToRecipe('${ingredientName}')">
                        <p class="text-xl font-bold mb-2 text-gray-800">${ingredientName}</p>
                        <p class="text-sm text-gray-600">${ingredient.protein}g Protein | ${ingredient.carbs}g Carbs | ${ingredient.fat}g Fat | ${ingredient.calories} kcal</p>
                    </div>
                    <button onclick="event.stopPropagation(); editIngredient('${ingredientName}');" class="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75">
                        Edit
                    </button>
                </div>`;
                ingredientsContainer.insertAdjacentHTML('afterbegin', ingredientCardHTML);
            });
        } else {
            console.log("No such document!"); // Log if document does not exist
        }
    }).catch(error => {
        console.log("Error getting document:", error); // Log any errors during fetch
    });
}

function addIngredientToRecipe(ingredientName) {
    const selectedCategory = localStorage.getItem('selectedCategory');
    const selectedRecipe = localStorage.getItem('selectedRecipe');
    const user = firebase.auth().currentUser;

    if (user && selectedCategory && selectedRecipe) {
        const uid = user.uid;

        db.collection("ingredients").doc(uid).get().then(documentSnapshot => {
            if (documentSnapshot.exists) {
                const ingredientData = documentSnapshot.data()[ingredientName];
                if (ingredientData) {
                    const recipeIngredientData = {
                        protein: ingredientData.protein,
                        carbs: ingredientData.carbs,
                        fat: ingredientData.fat,
                        calories: ingredientData.calories
                    };

                    // Dynamically add grams or milliliters if they exist
                    if (ingredientData.grams) {
                        recipeIngredientData.grams = ingredientData.grams;
                    }
                    if (ingredientData.ml) {
                        recipeIngredientData.ml = ingredientData.ml;
                    }
                    // Add the ingredient to the selected recipe in the selected category
                    db.collection("Recipes").doc(uid)
                        .collection(selectedCategory).doc(selectedRecipe)
                        .set({ [ingredientName]: recipeIngredientData }, { merge: true })
                        .then(() => {
                            console.log(`${ingredientName} added to ${selectedRecipe} in ${selectedCategory} successfully.`);
                            // Redirect after successful addition
                            window.location.href = 'each_recipe.html';
                        })
                        .catch(error => {
                            console.error("Error adding ingredient to recipe:", error);
                        });
                } else {
                    console.log(`Ingredient ${ingredientName} not found.`);
                }
            } else {
                console.log("No ingredients found for this user.");
            }
        }).catch(error => {
            console.log("Error getting ingredient document:", error);
        });
    } else {
        console.log('Missing information or user not signed in.');
    }
}

const modal = document.getElementById('ingredientModal');
const modalBg = document.getElementById('modalBackground');
// Function to toggle the modal visibility
function toggleModal() {
    modal.classList.toggle('hidden');
}

// Close modal on outside click
modalBg.addEventListener("click", () => {
    modal.classList.add("hidden");
    modalBg.classList.add("hidden");
});


// Function to handle the ingredient name submission
function submitIngredientName() {
    const ingredientName = document.getElementById('ingredientName').value.trim();
    localStorage.setItem('ingredientName', ingredientName);
    if (ingredientName === "") {
        alert("Please enter an ingredient name.");
        return;
    }

    // Directly retrieve the user's UID from Firebase Auth
    const user = firebase.auth().currentUser;
    if (user) {
        // User is signed in, proceed with saving the ingredient
        const uid = user.uid;

        // Define the ingredient data with macronutrients set to 0
        const ingredientData = {
            protein: 0,
            carbs: 0,
            fat: 0,
            calories: 0
        };

        // Prepare the document update with the ingredient data
        const updateObject = {};
        updateObject[ingredientName] = ingredientData; // Use the ingredient name as the key

        // Update the document for the user with the new ingredient
        db.collection("ingredients").doc(uid).set(updateObject, { merge: true })
            .then(() => {
                console.log("Ingredient added to Firestore successfully.");
                // Optionally redirect or perform other actions after successful update
                window.location.href = 'addIngredient.html'; // Example redirection
            })
            .catch((error) => {
                console.error("Error adding ingredient to Firestore: ", error);
            });
    } else {
        // No user is signed in. Handle accordingly, possibly redirecting to login page
        console.log('No user is signed in. Redirecting to login page...');
        window.location.href = 'login.html';
    }
}