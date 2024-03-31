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
            const ingredientData = documentSnapshot.data();
            const ingredientsContainer = document.getElementById("ingredientsContainer");

            // Iterate over each field in the document as an ingredient
            Object.keys(ingredientData).forEach(ingredientName => {
                const ingredient = ingredientData[ingredientName];
                var ingredientCardHTML = `
    <div class="flex w-full mx-auto border-2 border-gray-300 shadow-md rounded-full mt-2 mb-5 p-4 items-center justify-between">
        <div class="flex-1 pl-4 md:pl-8">
            <p class="text-2xl md:text-4xl font-bold mb-2">${ingredientName}</p>
            <p class="text-xs md:text-sm text-gray-500">${ingredient.protein}g Protein | ${ingredient.carbs}g Carbs | ${ingredient.fat}g Fat</p>
        </div>
        <div class="w-auto flex flex-col justify-center items-center md:items-end">
            <p class="text-xl md:text-3xl font-semibold">${ingredient.calories} kcal</p>
        </div>
    </div>`;
                // Append the card HTML for each ingredient to the container
                ingredientsContainer.innerHTML = ingredientCardHTML + ingredientsContainer.innerHTML;
            });
        } else {
            console.log("No such document!"); // Log if document does not exist
        }
    }).catch(error => {
        console.log("Error getting document:", error); // Log any errors during fetch
    });
}

// Function to toggle the modal visibility
function toggleModal() {
    const modal = document.getElementById('ingredientModal');
    modal.classList.toggle('hidden');
}

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