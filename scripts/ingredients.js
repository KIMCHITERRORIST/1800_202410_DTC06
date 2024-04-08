document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, fetch user ID and run other functions
            var uid = user.uid;
            fetchAndDisplayIngredients(uid);
            document.getElementById('saveIngredientChanges').addEventListener('click', () => {
                confirm("Are you sure you want to save changes?");
                saveIngredientChanges();
            });
            document.getElementById('deleteIngredient').addEventListener('click', () => {
                confirm("Are you sure you want to delete this ingredient?");
                deleteIngredient();
            }
            );
        } else {
            // No user is signed in. Redirect to login page and show message
            console.log('User is not logged in. Redirecting to login page...');
            // Redirect to login page
            window.location.href = 'login.html';
        }
    });

    // Search bar event listener
    document.getElementById('simple-search').addEventListener('input', function (e) {
        e.preventDefault(); // Prevent the form from submitting
        const searchValue = e.target.value.toLowerCase();
        filterDisplayedIngredients(searchValue);
    });
});


function fetchAndDisplayIngredients(uid) {
    db.collection("ingredients").doc(uid).get().then(documentSnapshot => {
        if (documentSnapshot.exists) {
            const ingredientNames = documentSnapshot.data();
            const ingredientsContainer = document.getElementById("ingredientsContainer");
            ingredientsContainer.innerHTML = ''; // Clear previous entries

            Object.keys(ingredientNames).forEach(ingredientName => {
                const ingredient = ingredientNames[ingredientName];
                // Assuming openAmountModal is a function you've defined to handle clicks.
                var ingredientCardHTML = `
                <div id="${ingredientName}" class="ingredient-card flex w-full mx-auto border-2 border-gray-300 shadow-lg rounded-lg mt-4 mb-6 p-4 items-center justify-between bg-white hover:bg-gray-50 transition-colors" ondblclick="openEditIngredientModal('${ingredientName}')">
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
async function saveIngredientChanges() {
    event.preventDefault();
    const uid = await fetchUID();
    const newingredientName = document.getElementById('editIngredientName').value;
    const newprotein = Number(document.getElementById('editProtein').value).toFixed(2);
    const newcarbs = Number(document.getElementById('editCarbs').value).toFixed(2);
    const newfat = Number(document.getElementById('editFat').value).toFixed(2);
    const newcalories = Number(document.getElementById('editCalories').value).toFixed(2);
    const newquantity = {
        value: Number(document.getElementById('editQuantity').value).toFixed(2),
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
        fetchAndDisplayIngredients(uid);
    }).catch((error) => {
        console.error("Error updating document: ", error);
    });
}
// Function to cancel changes
function cancelIngredientChanges() {
    window.history.back();
}

// Function to delete ingredient
async function deleteIngredient() {
    event.preventDefault();
    uid = await fetchUID();
    const ingredientName = document.getElementById('editIngredientName').value;

    db.collection("ingredients").doc(uid).update({
        [ingredientName]: firebase.firestore.FieldValue.delete()
    }).then(() => {
        console.log("Document successfully deleted!");
        document.getElementById('editIngredientModal').classList.add('hidden');
        fetchAndDisplayIngredients(uid);
    }).catch((error) => {
        console.error("Error deleting document: ", error);
    });
}