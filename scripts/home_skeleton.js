function loadSkeleton() {
  $('#navbarPlaceholder').load('./navbars/home_nav_top.html', function () {
    console.log('Navbar loaded');
    //Select the button and the menu div
    let button = document.querySelector('button[data-collapse-toggle="navbar-hamburger"]');
    let menu = document.getElementById('navbar-hamburger');

    //Add an event listener to the button
    button.addEventListener('click', () => {
      //Toggle the 'hidden' class on the menu div
      menu.classList.toggle('hidden');

      //Toggle the aria-expanded attribute to reflect the state change
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
    });

  });
  $('#footerPlaceholder').load('./navbars/home_nav_bottom.html', function () {
    console.log('Footer loaded');
    // Event listners for bottom nav
    // Reference to elements
    const plusBtn = document.getElementById("plus-btn");
    const userBtn = document.getElementById("user-btn");
    const quickAddMenu = document.getElementById("quickAddMenu");
    const quickAddMenuBg = document.getElementById("quickAddMenuBackground");
    const closeQuickAddMenu = document.getElementById("closeQuickAddMenu");

    // Open menu
    plusBtn.addEventListener("click", () => {
      quickAddMenu.classList.remove("hidden");
      quickAddMenuBg.classList.remove("hidden");
    });

    // Close menu 
    closeQuickAddMenu.addEventListener("click", () => {
      quickAddMenu.classList.add("hidden");
      quickAddMenuBg.classList.add("hidden");
    });

    // Close menu on outside click
    quickAddMenuBg.addEventListener("click", () => {
      quickAddMenu.classList.add("hidden");
      quickAddMenuBg.classList.add("hidden");
    });

    // User button
    userBtn.addEventListener("click", () => {
      console.log("Redirecting to User Profile...");
      window.location.href = "../profile.html";
    });

    document.getElementById('open_add_ingredient_modal').addEventListener('click', loadIngredientsModalandOpen);
    document.getElementById('open_add_new_recipe_modal').addEventListener('click', loadAddNewRecipeModalandOpen);
    document.getElementById('open_add_new_category_modal').addEventListener('click', loadAddNewCategoryModalandOpen);
    document.getElementById('open_add_quick_meal_modal').addEventListener('click', loadAddQuickMealModalandOpen);
  })

};

// Redirect to add exercise page
function connectAddExercise() {
  window.location.href = 'add_exercise.html';
}

function reconnectAddMeal() {
  window.location.href = 'addMeal.html';
}



loadSkeleton();

//------------------------------------------------------------------//
// -----------Functions related to Add Ingredient Modal-------------//
//------------------------------------------------------------------//
function loadIngredientsModalandOpen() {
  $('#add_ingredient_modal_container').load('main_modals/add_ingredients_modal.html', function () {
    const quickAddMenu = document.getElementById("quickAddMenu");
    const quickAddMenuBg = document.getElementById("quickAddMenuBackground");
    quickAddMenu.classList.add("hidden");
    quickAddMenuBg.classList.add("hidden");
    openAddIngredientModal(); // Open Add Ingredient modal

    // Event listeners for Add Ingredient modal
    document.getElementById('close_add_ingredient_modal').addEventListener('click',
      closeAddIngredientModal);

    const addNewIngredientButton = document.getElementById('addNewIngredientButton');
    addNewIngredientButton.addEventListener('click', function (saveData) {
      saveData.preventDefault(); // Prevent the default form submission
      saveIngredientInDB();
    });
  }
  )
};

// Open Add Ingredient modal
function openAddIngredientModal() {
  const modal = document.getElementById('add_ingredient_modal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

// Close Add Ingredient modal
function closeAddIngredientModal() {
  const modal = document.getElementById('add_ingredient_modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

//--------------------------------------------------------------//
// -----------Functions related to Add Recipe Modal-------------//
//--------------------------------------------------------------//

function loadAddNewRecipeModalandOpen() {
  $('#add_new_recipe_modal_container').load('main_modals/add_new_recipe_modal.html', function () {
    const quickAddMenu = document.getElementById("quickAddMenu");
    const quickAddMenuBg = document.getElementById("quickAddMenuBackground");
    quickAddMenu.classList.add("hidden");
    quickAddMenuBg.classList.add("hidden");
    openAddNewRecipeModal(); // Open Add New Recipe modal

    let ingredientIndex = 0;
    // Append categories to dropdown in modal
    appendCategoriesToDropdownInModal();

    // Event listeners for Add Ingredient modal
    document.getElementById('close_add_new_recipe_modal').addEventListener('click',
      closeAddNewRecipeModal);

    const addNewRecipeButton = document.getElementById('addNewRecipeButton');
    addNewRecipeButton.addEventListener('click', function (saveData) {
      saveData.preventDefault(); // Prevent the default form submission
      saveRecipeInDB();
    });

    const addIngredientFieldButton = document.getElementById('add-ingredient-field');
    addIngredientFieldButton.addEventListener('click', () => {
      addIngredientField(ingredientIndex);
      ingredientIndex++;
    })
  }
  )
};

// Open Add Recipe modal
function openAddNewRecipeModal() {
  const modal = document.getElementById('add_new_recipe_modal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

// Close Add Recipe modal
function closeAddNewRecipeModal() {
  const modal = document.getElementById('add_new_recipe_modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}


function addIngredientField(ingredientIndex) {
  let ingredientFieldDiv = `
    <div class="container gap-4 flex flex-row justify-between items-center">
      <div class="flex container">
        <select id="ingredientForNewRecipes${ingredientIndex}" name="ingredientForNewRecipes${ingredientIndex}" required
          class="mt-1 block w-full p-2.5 rounded-md border-gray-900 bg-gray-50 shadow-sm focus:border-[#172d58] focus:ring-[#172d58] sm:text-sm">
          <option value="" disabled selected>ingredient</option>
          <!-- Your options here -->
        </select>
      </div>
      <div class="flex container">
        <input type="number" name="quantity${ingredientIndex}" id="quantity${ingredientIndex}"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="quantity" required>
      </div>
      <div class="flex container">
        <input type="text" name="unit${ingredientIndex}" id="unit${ingredientIndex}"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="unit(auto)" required>
      </div>
    </div>`;

  document.getElementById('ingredientsAdditionForNewRecipe').insertAdjacentHTML('beforeend', ingredientFieldDiv);
  // Append ingredients and associated unit to dropdowns in modal
  appendIngredientsToDropdownInModal(ingredientIndex);
  changeUnitAfterIngredientSelected(ingredientIndex);
  ingredientIndex++;
}

function changeUnitAfterIngredientSelected(ingredientIndex) {
  document.getElementById(`ingredientForNewRecipes${ingredientIndex}`).addEventListener('change', async () => {
    const unit = await fetchUnitForIngredient(ingredientIndex);
    document.getElementById(`unit${ingredientIndex}`).value = unit;
  });
}

// ====== For saving data in DB for new recipe (calculating nutritional values)====== //
async function getBaseValues(ingredientName) {
  const uid = await fetchUID();
  const ingredientRef = db.collection('ingredients').doc(uid);
  const allIngredientSnapshot = await ingredientRef.get();
  const ingredientSnapshot = allIngredientSnapshot.data()[ingredientName];
  console.log(ingredientSnapshot);
  return ingredientSnapshot;
}

function calculateNutrition(baseValues, inputQuantity) {
  const ratio = inputQuantity / baseValues.quantity.value;
  return {
    calories: Math.round(baseValues.calories * ratio),
    carbs: Math.round(baseValues.carbs * ratio),
    fat: Math.round(baseValues.fat * ratio),
    protein: Math.round(baseValues.protein * ratio)
  };
}

function collectRecipeDataFromForm() {
  const ingredientsDataForAddingToRecipe = {};
  let ingredientIndex = 0;
  while (true) {
    const ingredient = document.getElementById(`ingredientForNewRecipes${ingredientIndex}`);
    const quantity = document.getElementById(`quantity${ingredientIndex}`);
    const unit = document.getElementById(`unit${ingredientIndex}`);

    if (!ingredient || !quantity || !unit) {
      // Exit the loop if any of the fields are missing
      break;
    }

    // Extract values from form fields
    const ingredientName = ingredient.value;
    const quantityValue = quantity.value;
    const unitValue = unit.value;

    ingredientsDataForAddingToRecipe[ingredientName] = {
      quantity: {
        unit: unitValue,
        value: Number(quantityValue)
      }
    };

    ingredientIndex++;
  }
  return ingredientsDataForAddingToRecipe;
}


//------------------------------------------------------------------//
// -----------Functions related to Add New Category Modal-------------//
//------------------------------------------------------------------//

function loadAddNewCategoryModalandOpen() {
  $('#add_new_category_modal_container').load('main_modals/add_new_category_modal.html', function () {
    const quickAddMenu = document.getElementById("quickAddMenu");
    const quickAddMenuBg = document.getElementById("quickAddMenuBackground");
    quickAddMenu.classList.add("hidden");
    quickAddMenuBg.classList.add("hidden");
    openAddAddNewCategoryModal();
    document.getElementById('close_add_new_category_modal').addEventListener('click',
      closeAddNewCategoryModal);

    const addNewCategoryButton = document.getElementById('addNewCategoryButton');
    addNewCategoryButton.addEventListener('click', function (saveData) {
      saveData.preventDefault(); // Prevent the default form submission
      saveNewCategoryInDB();
    })
  })
};

// Open Add Category modal
function openAddAddNewCategoryModal() {
  const modal = document.getElementById('add_new_category_modal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeAddNewCategoryModal() {
  const modal = document.getElementById('add_new_category_modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}


//------------------------------------------------------------------//
// -----------Functions related to Add Quick Meal Modal-------------//
//------------------------------------------------------------------//
function loadAddQuickMealModalandOpen() {
  $('#add_quick_meal_modal_container').load('main_modals/quick_add_meal_modal.html', function () {
    const quickAddMenu = document.getElementById("quickAddMenu");
    const quickAddMenuBg = document.getElementById("quickAddMenuBackground");
    quickAddMenu.classList.add("hidden");
    quickAddMenuBg.classList.add("hidden");
    openAddQuickMealModal(); // Open Add Quick meal modal

    // Event listeners for Add Quick Meal modal
    document.getElementById('close_add_quick_meal_modal').addEventListener('click',
      closeAddQuickMealModal);

    const addNewIngredientButton = document.getElementById('addQuickMealButton');
    addNewIngredientButton.addEventListener('click', function (saveData) {
      saveData.preventDefault(); // Prevent the default form submission
      LogQuickMealInDB();
    });
  }
  )
};

// Open Add Quick Meal modal
function openAddQuickMealModal() {
  const modal = document.getElementById('add_quick_meal_modal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

// Close Add Quick Meal modal
function closeAddQuickMealModal() {
  const modal = document.getElementById('add_quick_meal_modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}



//---------------------------------------------------//
//---------------------------------------------------//
// -----------Functions related to DB----------------//
//---------------------------------------------------//
//---------------------------------------------------//

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

// ++++++ For add Ingredient modal ++++++ //
async function saveIngredientInDB() {
  const uid = await fetchUID();
  console.log(uid);
  const ingredientName = document.getElementById('ingredientName').value.trim();
  const fat = Number(document.getElementById('fats').value);
  const carbs = Number(document.getElementById('carbs').value);
  const protein = Number(document.getElementById('protein').value);
  const calories = Number(document.getElementById('calories').value);
  const quantity = Number(document.getElementById('quantity').value);
  const unit = document.getElementById('unit').value;

  // Format data to update in Firestore
  let dataToUpdate = {
    [ingredientName]: {
      fat,
      carbs,
      protein,
      calories,
      quantity: {
        value: quantity,
        unit
      }
    }
  };

  // Update the document in Firestore
  db.collection('ingredients').doc(uid).set(dataToUpdate, { merge: true })
    .then(() => {
      console.log('Document successfully updated!');
      window.location.href = 'ingredients.html'; // Redirect after successful update
    })
    .catch((error) => {
      console.error('Error updating document:', error);
    });
}

// ++++++ For add new recipe modal ++++++ //
async function fetchCategoriesForNewRecipes() {
  const uid = await fetchUID();
  console.log(uid);
  doc = await db.collection("Recipes").doc(uid).get();
  if (doc.exists) {
    console.log("Document data:", doc.data());
    return doc.data().categories;
  }
  else {
    console.log("No such document!");
  }
}

async function appendCategoriesToDropdownInModal() {
  const categories = await fetchCategoriesForNewRecipes();
  const selectElement = document.getElementById("categoriesForNewRecipes");

  categories.forEach(category => {  // Iterate through each category and append it as an option
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    selectElement.appendChild(option);
  });
}

async function fetchIngredientsForNewRecipes() {
  const uid = await fetchUID();
  console.log(uid);
  doc = await db.collection("ingredients").doc(uid).get();
  if (doc.exists) {
    console.log("Document data:", doc.data());
    return Object.keys(doc.data());
  }
  else {
    console.log("No such document!");
  }
}

async function appendIngredientsToDropdownInModal(ingredientIndex) {
  const ingredients = await fetchIngredientsForNewRecipes();
  const selectElement = document.getElementById(`ingredientForNewRecipes${ingredientIndex}`);

  ingredients.forEach(ingredient => {  // Iterate through each ingredient and append it as an option
    const option = document.createElement('option');
    option.value = ingredient;
    option.textContent = ingredient;
    selectElement.appendChild(option);
  });
}

async function fetchUnitForIngredient(ingredientIndex) {
  const uid = await fetchUID();
  console.log("ingredientIndex in fetch unit function:", ingredientIndex)
  const ingredientsDocRef = db.collection('ingredients').doc(uid);
  const ingredientDocSnapshot = await ingredientsDocRef.get();
  const ingredientNameElement = document.getElementById(`ingredientForNewRecipes${ingredientIndex}`);
  const ingredientName = ingredientNameElement.value;
  const ingredientData = ingredientDocSnapshot.data();
  const ingredientUnit = ingredientData[ingredientName].quantity.unit;
  console.log(ingredientUnit);
  return ingredientUnit;
}

// ++++++ Function to save data in DB for new recipe ++++++ //
async function saveRecipeInDB() {
  try {
    const uid = await fetchUID();
    const category = document.getElementById('categoriesForNewRecipes').value;
    const recipeName = document.getElementById('recipeName').value.trim();
    const recipeRef = db.collection('Recipes').doc(uid).collection(category);
    const ingredientsData = collectRecipeDataFromForm();

    let totalFat = 0,
      totalCarbs = 0,
      totalCalories = 0,
      totalProtein = 0;

    for (var ingredientName in ingredientsData) {
      const baseValues = await getBaseValues(ingredientName);
      console.log(baseValues, ingredientsData[ingredientName].quantity.value);
      const nutrition = calculateNutrition(baseValues, ingredientsData[ingredientName].quantity.value);
      ingredientsData[ingredientName] = nutrition;

      totalFat += nutrition.fat;
      totalCarbs += nutrition.carbs;
      totalCalories += nutrition.calories;
      totalProtein += nutrition.protein;
    }

    const recipeNutritionTotals = {
      name: recipeName,
      fats: totalFat,
      carbs: totalCarbs,
      calories: totalCalories,
      protein: totalProtein,
      ingredients: ingredientsData
    };

    await recipeRef.add(recipeNutritionTotals);
    db.collection('Recipes').doc(uid).collection(category).doc('count').update({ count: firebase.firestore.FieldValue.increment(1) })
    localStorage.setItem('selectedCategory', category);
    window.location.href = '/each_category.html'; // Redirect after successful update
  } catch (error) {
    console.error('Error saving recipe:', error);
    alert('Error saving the recipe. Fill all the fields and try again.')
  }
}

// ++++++ For add Category modal ++++++ //
async function saveNewCategoryInDB() {
  const uid = await fetchUID();
  const categoryName = document.getElementById('categoryName').value.trim();
  const categoryRef = db.collection('Recipes').doc(uid).collection(categoryName).doc('count');
  categoryRef.set({
    count: 0
  })
    .then(() => {
      console.log('Category created with id:', categoryName);
      appendCategoryNameToArray();
      window.location.href = 'my_recipes.html';
    })
    .catch((error) => {
      console.error('Error adding new document:', error);
    });
}

async function appendCategoryNameToArray() {
  const uid = await fetchUID();
  const categoryName = document.getElementById('categoryName').value.trim();
  const docRef = db.collection('Recipes').doc(uid);
  docRef.update({
    categories: firebase.firestore.FieldValue.arrayUnion(categoryName)
  })
    .then(() => {
      console.log(`Category ${categoryName} added to the categories array successfully.`);
    })
    .catch((error) => {
      console.error("Error updating categories array:", error);
    });
}

// ++++++ For add Quick Meal modal ++++++ //
async function LogQuickMealInDB() {
  const uid = await fetchUID();
  const mealName = document.getElementById('mealName').value.trim();
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split('T')[0];
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const timeString = `${((hours + 11) % 12 + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

  const calories = Number(document.getElementById('calories').value);
  const fats = Number(document.getElementById('fats').value);
  const carbs = Number(document.getElementById('carbs').value);
  const protein = Number(document.getElementById('protein').value);

  db.collection("meals").doc(uid).set({
    [mealName]: {
      fats: fats,
      carbs: carbs,
      protein: protein,
      calories: calories,
      date: dateString,
      time: timeString
    }
  }, { merge: true }).then(() => {
    alert(`${mealName} of ${calories} is added to Meals successfully.`);
  }).catch(error => {
    console.error("Error adding recipe to Calories:", error);
  });
}