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
                <div class="ingredient-card flex w-full mx-auto border-2 border-gray-300 shadow-lg rounded-lg mt-4 mb-6 p-4 items-center justify-between bg-white hover:bg-gray-50 transition-colors" data-ingredient-name="${ingredientName.toLowerCase()}" onclick="openAmountModal('${ingredientName}')">
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