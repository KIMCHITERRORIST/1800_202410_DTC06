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

    db.collection("Ingredients").doc(uid).get().then(documentSnapshot => {
        console.log(`Fetched document with UID: ${uid}`); // Log after successful fetch

        if (documentSnapshot.exists) {
            const ingredientData = documentSnapshot.data();
            const ingredientsContainer = document.getElementById("ingredientsContainer");
            ingredientsContainer.innerHTML = ""; // Clear existing contents

            // Iterate over each field in the document as an ingredient
            Object.keys(ingredientData).forEach(ingredientName => {
                const ingredient = ingredientData[ingredientName];
                var ingredientCardHTML = `
                    <div class="flex w-full mx-auto border-2 border-gray-300 shadow-md rounded-full mt-2 mb-5 p-4 text-center">
                        <div class="w-3/4">
                            <p class="text-3xl font-bold mb-2">${ingredientName}</p>
                            <p class="text-sm text-gray-500">${ingredient.protein}g Protein | ${ingredient.carbs}g Carbs | ${ingredient.fat}g Fat | ${ingredient.calories} kcal</p>
                        </div>
                    </div>`;
                // Append the card HTML for each ingredient to the container
                ingredientsContainer.innerHTML += ingredientCardHTML;
            });
        } else {
            console.log("No such document!"); // Log if document does not exist
        }
    }).catch(error => {
        console.log("Error getting document:", error); // Log any errors during fetch
    });
}
