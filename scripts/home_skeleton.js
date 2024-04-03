//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
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
  })
};

loadSkeleton();

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
//---------------------------------------------------//
// -----------Functions related to DB----------------//
//---------------------------------------------------//

async function saveIngredientInDB() {
  const uid = await fetchUID();
  console.log(uid);
  const ingredientName = document.getElementById('ingredientName').value.trim();
  const fats = Number(document.getElementById('fats').value);
  const carbs = Number(document.getElementById('carbs').value);
  const protein = Number(document.getElementById('protein').value);
  const calories = Number(document.getElementById('calories').value);
  const quantity = Number(document.getElementById('quantity').value);
  const unit = document.getElementById('unit').value;

  // Format data to update in Firestore
  let dataToUpdate = {
    [ingredientName]: {
      fats,
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

