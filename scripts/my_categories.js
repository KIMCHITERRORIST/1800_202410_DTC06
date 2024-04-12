document.addEventListener('DOMContentLoaded', function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in, fetch user ID and run functions
      const uid = user.uid;
      fetchAndDisplayUserName(uid);
      fetchAndDisplayCategories(uid);
    }
    else {
      // No user is signed in. Redirect to login page and show message
      console.log('User is not logged in. Redirecting to login page...');
      window.location.href = 'login.html';
    }
  });

  /**Function to fetch and display categories from firebase in the page
   * @param {string} uid - User ID
   * @returns {void}
   */
  function fetchAndDisplayCategories(uid) {
    // Read the categories array from the UID document under 'Recipes' collection
    db.collection('Recipes').doc(uid).get().then(doc => {
      if (doc.exists) {
        const categoriesArray = doc.data().categories;
        console.log(categoriesArray);

        // Fetch and read the 'count' document from each corresponding category collection
        categoriesArray.forEach(categoryName => {
          db.collection('Recipes').doc(uid).collection(categoryName).doc('count').get()
            .then(docCount => {
              if (docCount.exists) {
                createCategoryDiv(categoryName, docCount.data().count);
              } else {
                console.log(`Count document does not exist in ${categoryName} collection`);
              }
            }).catch(error => {
              console.log("Error fetching count document:", error);
            });
        });
      } else {
        console.log("No such document for this UID!");
      }
    }).catch(error => {
      console.log("Error fetching categories array:", error);
    });
  }

  // Function to create a category div and append it to the categories container div
  /**Function to create a category div and append it to the categories container div
   * @param {string} category - Category name
   * @param {number} count - Number of recipes in the category
   * @returns {void}
   * */
  function createCategoryDiv(category, count) {
    const container = document.getElementById('categories-container');
    const categoryDiv = document.createElement('div');
    categoryDiv.id = `div${category}`;
    categoryDiv.className = "flex flex-col mx-auto h-24 justify-center items-center border-2 border-gray-300 shadow-md rounded-md my-5 sm:px-6 lg:px-8";
    categoryDiv.innerHTML = `<div class="text-center">
    <p class="text-2xl font-semibold">${category}</p>
    <button class="bg-blue-700 text-white px-2 py-1 rounded-md shadow-lg text-lg mt-2" data-category="${category}"><span id="${category}-count">${count}</span> Recipes</button>
  </div>`;

    // Add event listener to each category's button to redirect to each_category.html
    const button = categoryDiv.querySelector(`[data-category="${category}"]`);
    button.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent the click event from bubbling up to the parent div
      // Save the selected category in localStorage and redirect to each_category.html
      localStorage.setItem('selectedCategory', category);
      window.location.href = '/each_category.html';
    });

    // Add event listener to open delete confirmation modal when category div is clicked
    categoryDiv.addEventListener('click', () => {
      showDeleteConfirmationModal(category);
    });

    container.appendChild(categoryDiv);
  }



  // Function to fetch and display user's name
  /**Function to fetch and display user's name in the page
   * @param {string} uid - User ID
   * @returns {void}
   */
  function fetchAndDisplayUserName(uid) {
    db.collection('users').doc(uid).get().then(doc => {
      if (doc.exists) {
        document.getElementById('name').textContent = doc.data().name;
      } else {
        console.log('No user data found!');
      }
    });
  }
});

// Function to show delete confirmation modal
/**Function to show delete confirmation modal
 * @param {string} category - Category name
 * @returns {void}
 */
async function showDeleteConfirmationModal(category) {
  document.getElementById("categoryName").textContent = category;
  const modal = document.getElementById("deleteCategoryModal");
  modal.classList.remove("hidden");
  document.getElementById("cancelCategoryDeletion").addEventListener("click", cancelCategoryDeletion);
  document.getElementById("deleteCategory").addEventListener("click", async function (event) {
    event.preventDefault();
    await deleteCategory(category);
  });
}

// Function to delete category and all its recipes
/**Function to delete category and all its recipes
 * @param {string} category - Category name
 * @returns {void}
 */
async function deleteCategory(category) {
  try {
    const uid = firebase.auth().currentUser.uid;
    const categoryRef = db.collection('Recipes').doc(uid).collection(category);

    const snapshot = await categoryRef.get();
    snapshot.docs.forEach(doc => {
      doc.ref.delete()
    });
    document.getElementById('deleteCategoryModal').classList.add('hidden');
    window.location.reload();
  } catch (error) {
    console.error("Error deleting document:", error)
  }
}

// Function to cancel category deletion
function cancelCategoryDeletion() {
  document.getElementById("deleteCategoryModal").classList.add("hidden");
}
