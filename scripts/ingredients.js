document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, fetch user ID and run other functions
            var uid = user.uid;
            fetchAndDisplayIngredients(uid);

            // Add event listener to save the changes when save button is clicked in the modal
            document.getElementById('saveIngredientChanges').addEventListener('click', (event) => {
                event.preventDefault();
                let confirmation = confirm("Are you sure you want to save changes?");
                if (confirmation) {
                    saveIngredientChanges();
                }
            });

            // Add event listener to cancel the changes when cancel button is clicked in the modal
            document.getElementById('deleteIngredient').addEventListener('click', (event) => {
                event.preventDefault();
                let confirmation = confirm("Are you sure you want to delete this ingredient?");
                if (confirmation) {
                    deleteIngredient();
                }
            }
            );
        } else {
            // No user is signed in. Redirect to login page and show message
            console.log('User is not logged in. Redirecting to login page...');
            window.location.href = 'login.html';
        }
    });

    // Search box (text box) event listener
    document.getElementById('simple-search').addEventListener('input', function (e) {
        e.preventDefault(); // Prevent the form from submitting
        const searchValue = e.target.value.toLowerCase();
        filterDisplayedIngredients(searchValue);
    });
});

/** Function to fetch and display ingredients
 * @param {string} uid - User ID
 * @returns {void}
 **/
function fetchAndDisplayIngredients(uid) {
    db.collection("ingredients").doc(uid).get().then(documentSnapshot => {
        if (documentSnapshot.exists) {
            const ingredientNames = documentSnapshot.data();
            const ingredientsContainer = document.getElementById("ingredientsContainer");
            ingredientsContainer.innerHTML = ''; // Clear previous entries

            Object.keys(ingredientNames).forEach(ingredientName => {
                const ingredient = ingredientNames[ingredientName];
                var ingredientCardHTML = `
    <div id="${ingredientName}" data-ingredient-name="${ingredientName.toLowerCase()}" class="ingredient-card flex w-full mx-auto border-2 border-gray-300 shadow-lg rounded-lg mt-4 mb-6 p-4 items-center justify-between bg-white hover:bg-gray-50 transition-colors" onclick="openEditIngredientModal('${ingredientName}')">
        <div class="flex-1">
            <p class="text-xl font-bold mb-2 text-gray-800">${ingredientName}</p>
            <p class="text-sm text-gray-600">${ingredient.protein}g Protein | ${ingredient.carbs}g Carbs | ${ingredient.fat}g Fat | ${ingredient.calories} kcal</p>
        </div>
    </div>`;
                ingredientsContainer.insertAdjacentHTML('afterbegin', ingredientCardHTML);
            });
        } else {
            console.log("No such document!");
        }
    }).catch(error => {
        console.log("Error getting document:", error);
    });
}

// Function to filter displayed ingredients when user searches
/**Function to filter displayed ingredients when user type in search box
 * @param {string} searchValue - Search value entered by the user
 * @returns {void}
 */
function filterDisplayedIngredients(searchValue) {
    const ingredientCards = document.querySelectorAll('.ingredient-card');
    ingredientCards.forEach(card => {
        const ingredientName = card.getAttribute('data-ingredient-name');
        if (ingredientName.includes(searchValue)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to open the modal to edit an ingredient
/** Function to open the modal to edit an ingredient
 * @param {string} ingredientName - Name of the ingredient to edit
 * @returns {void}
 */
async function openEditIngredientModal(ingredientName) {
    uid = await fetchUID();
    recipeDoc = await db.collection("ingredients").doc(uid).get()
    recipeData = recipeDoc.data();

    if (recipeData[ingredientName] === undefined) {
        console.log("There is no such ingredient in the database.");
    } else {
        console.log(recipeData[ingredientName]);
        // Set the values in the modal
        document.getElementById('editIngredientName').value = ingredientName;
        document.getElementById('editProtein').value = recipeData[ingredientName].protein;
        document.getElementById('editCarbs').value = recipeData[ingredientName].carbs;
        document.getElementById('editFat').value = recipeData[ingredientName].fat;
        document.getElementById('editCalories').value = recipeData[ingredientName].calories;
        document.getElementById('editQuantity').value = recipeData[ingredientName].quantity.value;
        document.getElementById('editUnit').value = recipeData[ingredientName].quantity.unit;

        // Unhide the modal
        document.getElementById('editIngredientModal').classList.remove('hidden');
    }
}

// Function to save changes
/** Function to save changes made by edit ingredient modal to database
 * @returns {void}
 */
async function saveIngredientChanges() {
    const uid = await fetchUID();
    const newingredientName = document.getElementById('editIngredientName').value;
    const newprotein = Number(document.getElementById('editProtein').value);
    const newcarbs = Number(document.getElementById('editCarbs').value);
    const newfat = Number(document.getElementById('editFat').value);
    const newcalories = Number(document.getElementById('editCalories').value);
    const newquantity = {
        value: Number(document.getElementById('editQuantity').value),
        unit: document.getElementById('editUnit').value
    };

    console.log(newingredientName, newprotein, newcarbs, newfat, newcalories, newquantity);
    db.collection("ingredients").doc(uid).update({

        [newingredientName]: {
            protein: newprotein,
            carbs: newcarbs,
            fat: newfat,
            calories: newcalories,
            quantity: newquantity
        }
    }).then(() => {
        console.log("Document successfully updated!");
        document.getElementById('editIngredientModal').classList.add('hidden');
        fetchAndDisplayIngredients(uid); // Refresh the ingredients list
    }).catch((error) => {
        console.error("Error updating document: ", error);
    });
}
// Function to cancel changes
function cancelIngredientChanges() {
    window.history.back();
}

// Function to delete ingredient
/** Function to delete an ingredient from the database
 * @returns {void}
 */
async function deleteIngredient() {
    uid = await fetchUID();
    const ingredientName = document.getElementById('editIngredientName').value;

    db.collection("ingredients").doc(uid).update({
        [ingredientName]: firebase.firestore.FieldValue.delete() // Delete the ingredient
    }).then(() => {
        console.log("Document successfully deleted!");
        document.getElementById('editIngredientModal').classList.add('hidden');
        fetchAndDisplayIngredients(uid); // Refresh the ingredients list
    }).catch((error) => {
        console.error("Error deleting document: ", error);
    });
}