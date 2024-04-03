document.addEventListener("DOMContentLoaded", function () {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      const recipeCategory = localStorage.getItem('selectedCategory');
      // Attach click event listener to the create-recipe div
      document.getElementById('create-recipe').addEventListener('click', function () {
        // Call your function to create a new recipe
        createNewRecipePrompt(uid, recipeCategory);
      });
      if (recipeCategory) {
        document.getElementById("recipeCategory").innerText = recipeCategory;
      }
      displayRecipeInfo(uid, recipeCategory);
    } else {
      console.error('User is not logged in.');
      window.location.href = 'login.html';
    }
  });
});

function displayRecipeInfo(uid, recipeCategory) {
  db.collection('Recipes')
    .doc(uid)
    .collection(recipeCategory)
    .get()
    .then((querySnapshot) => {
      const recipesContainer = document.getElementById("recipesContainer");
      recipesContainer.innerHTML = ""; // Clear the container before adding new recipes because it is repeated
      querySnapshot.forEach((recipeDocument) => {
        if (recipeDocument.id === "count") {
          return;
        }
        var recipeName = recipeDocument.id;
        var recipeData = recipeDocument.data()
        var recipeCardHTML = `
          <div class="flex flex-col items-center justify-center w-full max-w-sm mx-auto my-4 border-2 border-gray-300 rounded-lg shadow-md">
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">${recipeName}</h5>
              <ul class="mb-4 text-gray-600">
                <li>Calories: ${recipeData.calories}kcal</li>
                <li>Protein: ${recipeData.protein}g</li>
                <li>Carbs: ${recipeData.carbs}g</li>
                <li>Fats: ${recipeData.fats}g</li>
              </ul>
              <button onclick="viewRecipeDetails('${recipeName}')" class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                View Recipe
                <svg aria-hidden="true" class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H7"></path></svg>
              </button>
            </div>
          </div>
        `;
        recipesContainer.insertAdjacentHTML('afterbegin', recipeCardHTML);
      });
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error);
    });
}

//function when you click on view recipe
function viewRecipeDetails(recipeName) {
  localStorage.setItem('selectedRecipe', recipeName);
  window.location.href = '/each_recipe.html';
}

// Function to create a new recipe in Firebase
function createNewRecipe(newName, recipeCategory, uid) {
  db.collection('Recipes').doc(uid).collection(recipeCategory).doc(newName).set({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  }).then(function () {
    console.log("Recipe created with id:", newName);
    db.collection('Recipes').doc(uid).collection(recipeCategory).doc('count').update({ count: firebase.firestore.FieldValue.increment(1) }); // Increment the count
    localStorage.setItem('selectedRecipe', newName);
    window.location.href = '/each_recipe.html'; // Redirect to the recipe page
  }).catch(function (error) {
    console.error("Error adding new document:", error);
  });
}

// function asking for prompt
function createNewRecipePrompt(uid, recipeCategory) {
  const newRecipeName = prompt("Please enter the name of the new recipe:");
  if (newRecipeName && newRecipeName.trim() !== "") {
    // Pass newName, recipeCatName, and uid to createNewRecipe
    createNewRecipe(newRecipeName.trim(), recipeCategory, uid);
  } else {
    console.log("Nothing was entered");
  }
}