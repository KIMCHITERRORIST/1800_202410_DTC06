document.addEventListener('DOMContentLoaded', function () {
  // Fetch UID function
  async function fetchUID() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          resolve(user.uid);
        } else {
          reject('User is not logged in.');
        }
      });
    });
  }

  // Display the recipe information
  async function displayRecipeInfo() {
    try {
      const uid = await fetchUID(); // Fetch the user's UID
      // Get the selected category and recipe from local storage
      const categoryID = localStorage.getItem('selectedCategory');
      const recipeID = localStorage.getItem('selectedRecipe');
      console.log(recipeID);

      // Fetch the recipe document from Database
      const recipeDocRef = await db.collection("Recipes").doc(uid).collection(categoryID).get();
      recipeDocRef.docs.forEach(docRecipe => {
        if (docRecipe.data().name === recipeID && docRecipe.exists) {
          const doc = docRecipe.data();

          // Set the recipe information in the page
          document.getElementById("recipeName").innerText = recipeID;
          document.getElementById("calories").innerText = doc.calories;
          document.getElementById("protein").innerText = doc.protein;
          document.getElementById("carbs").innerText = doc.carbs;
          document.getElementById("fats").innerText = doc.fats;

          let ingredientsContainer = document.getElementById("ingredientsContainer");
          // Clear existing content
          ingredientsContainer.innerHTML = '';

          // Iterate over each ingredient key-value pairs in the recipe
          Object.keys(doc.ingredients).forEach(ingredientName => {
            const ingredientDetails = doc.ingredients[ingredientName];

            let ingredientDiv = `<div class="flex justify-between px-2 py-3 border-b border-gray-200">
                          <span class="text-gray-700 font-semibold me-4">${ingredientName}</span>
                          <span class="flex text-center space-x-4">
                              <div class="text-gray-500">carbs<p class="flex-col container">${ingredientDetails.carbs}g</p></div>
                              <div class="text-gray-500">fats<p class="flex-col container">${ingredientDetails.fat}g</p></div>
                              <div class="text-gray-500">protein<p class="flex-col container">${ingredientDetails.protein}g</p></div>
                              <div class="text-gray-500">calories<p class="flex-col container">${ingredientDetails.calories}kcal</p></div>
                          </span>
                      </div>`;

            ingredientsContainer.insertAdjacentHTML('beforeend', ingredientDiv);
          });
        } else {
          console.log('No such document!')
        }
      });
    } catch (error) {
      console.error("Error displaying recipe info:", error);
    }
  };
  displayRecipeInfo();
});

// Function to toggle the modal visibility
function toggleModal() {
  const modal = document.getElementById('ingredientModal');
  modal.classList.toggle('hidden');
}

// Function to redirect to ingredients.html
function redirectIngredientsPage() {
  window.location.href = 'ingredients.html';
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
