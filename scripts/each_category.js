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
          <div id ="${recipeDocument.id}" class="flex flex-col items-center justify-center w-full max-w-sm mx-auto my-4 border-2 border-gray-300 rounded-lg shadow-md" ondblclick="showDeleteConfirmationModal('${recipeDocument.id}', '${recipeCategory}')">
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

async function showDeleteConfirmationModal(recipeID, recipeCategory) {
  console.log("Recipe ID: ", recipeID, "Recipe Category: ", recipeCategory)
  const uid = firebase.auth().currentUser.uid;
  const recipeRef = await db.collection('Recipes').doc(uid).collection(recipeCategory).doc(recipeID).get();
  document.getElementById("recipeName").innerText = recipeRef.data().name;

  const modal = document.getElementById("deleteRecipeModal");
  modal.classList.remove("hidden");

  document.getElementById("deleteRecipe").addEventListener("click", async function (event) {
    event.preventDefault();
    await deleteRecipe(recipeID, recipeCategory);
  });
}

async function deleteRecipe(recipeID, recipeCategory) {
  try {
    const uid = firebase.auth().currentUser.uid;
    await db.collection('Recipes')
      .doc(uid)
      .collection(recipeCategory)
      .doc(recipeID)
      .delete();
    console.log("Recipe deleted successfully!");
    await db.collection('Recipes').doc(uid).collection(recipeCategory).doc("count").update({
      count: firebase.firestore.FieldValue.increment(-1)
    });
    document.getElementById("deleteRecipeModal").classList.add("hidden");
    displayRecipeInfo(uid, recipeCategory);
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
}

function cancelRecipeDeletion() {
  window.history.back();
}



//function when you click on view recipe
function viewRecipeDetails(recipeName) {
  localStorage.setItem('selectedRecipe', recipeName);
  window.location.href = '/each_recipe.html';
}