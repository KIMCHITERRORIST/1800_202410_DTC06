document.addEventListener("DOMContentLoaded", function () {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      const recipeCategory = localStorage.getItem('selectedCategory');
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
        var recipeData = recipeDocument.data()
        var recipeCardHTML = `
          <div class="flex flex-col items-center justify-center w-full max-w-sm mx-auto my-4 border-2 border-gray-300 rounded-lg shadow-md">
            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">${recipeData.name}</h5>
              <ul class="mb-4 text-gray-600">
                <li>Calories: ${recipeData.calories}kcal</li>
                <li>Protein: ${recipeData.protein}g</li>
                <li>Carbs: ${recipeData.carbs}g</li>
                <li>Fats: ${recipeData.fats}g</li>
              </ul>
              <button onclick="viewRecipeDetails('${recipeData.name}')" class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
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