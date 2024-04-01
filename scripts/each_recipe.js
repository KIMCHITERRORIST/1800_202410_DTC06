document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#chooseIngredientsDiv').addEventListener('click', loadIngredients);
});

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

async function displayRecipeInfo() {
  try {
    const uid = await fetchUID();
    const categoryID = localStorage.getItem('selectedCategory');
    const recipeID = localStorage.getItem('selectedRecipe');
    console.log(recipeID);

    const recipeDocRef = await db.collection("Recipes").doc(uid).collection(categoryID).doc(recipeID).get();
    if (recipeDocRef.exists) {
      const doc = recipeDocRef.data();
      console.log(doc.ingredients);

      document.getElementById("recipeName").innerText = recipeID;
      document.getElementById("calories").innerText = doc.totalCalorie;
      document.getElementById("protein").innerText = doc.protein;
      document.getElementById("carbs").innerText = doc.carbs;
      document.getElementById("fats").innerText = doc.fats;

      let ingredientsContainer = document.getElementById("ingredientsContainer");
      // Clear existing content
      ingredientsContainer.innerHTML = '';

      // // Iterate through ingredientsMap and display each ingredient
      // for (const [key, value] of Object.entries(doc.ingredients)) {
      //   let ingredientDiv = `<div class="flex justify-between px-2 py-3 border-b border-gray-200">
      //                       <span class="text-gray-700 font-semibold">${key}</span>
      //                       <span class="flex">
      //                           <span class="text-gray-500 mx-2">${value.quantity} </span>
      //                           <span class="text-gray-500">| ${value.calorie} cal</span>
      //                       </span>
      //                   </div>`;
      //   ingredientsContainer.insertAdjacentHTML('beforeend', ingredientDiv);
      // }

    } else {
      console.log('No such document!')
    }
  } catch (error) {
    console.error("Error displaying recipe info:", error);
  }
};
displayRecipeInfo();

// Function to toggle the modal visibility
function toggleModal() {
  const modal = document.getElementById('ingredientModal');
  modal.classList.toggle('hidden');
}

// Function to redirect to ingredients.html
function redirectIngredientsPage() {
  window.location.href = 'ingredients.html';
}

// display the ingredients inside the modal 
async function loadIngredients() {
  try {
    const uid = await fetchUID();
    const ingredientsRef = db.collection('ingredients').doc(uid);
    const snapshot = await ingredientsRef.get();

    if (snapshot.exists) {
      const ingredients = snapshot.data();
      const ingredientList = document.getElementById('ingredientList');
      ingredientList.innerHTML = ''; // Clear current list

      Object.keys(ingredients).forEach(key => {
        // For each ingredient, create a list item or similar element
        const ingredientElement = `<div class="ingredient-item p-2 hover:bg-gray-200 cursor-pointer" onclick="addIngredientToList('${key}')">${key}</div>`;
        ingredientList.insertAdjacentHTML('beforeend', ingredientElement);
      });
    }
  } catch (error) {
    console.error("Error loading ingredients:", error);
  }
}
