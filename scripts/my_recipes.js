document.addEventListener('DOMContentLoaded', function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in, fetch user ID and run other functions
      const uid = user.uid;
      fetchAndDisplayUserName(uid);
      fetchAndDisplayCategories(uid);
    } else {
      // No user is signed in. Redirect to login page or show message
      console.log('User is not logged in. Redirecting to login page...');
      // Redirect to login page
      // window.location.href = 'login.html';
    }
  });

  // function that fetches displays the user's categories
  function fetchAndDisplayCategories(uid) {
    db.collection('users').doc(uid).collection('categories').get().then(snapshot => {
      snapshot.forEach(doc => {
        createCategoryDiv(doc.id, doc.data().count);
      });
    }).catch(error => {
      console.log("Error fetching categories", error);
    });

    document.getElementById('create-category').addEventListener('click', function () {
      const newCategoryName = prompt("Please enter the name of the new category:");
      if (newCategoryName && newCategoryName.trim() !== "") {
        createNewCategory(uid, newCategoryName.trim());
      } else {
        console.log("Nothing was entered");
      }
    });
  }

  // Function to create, append, and display category divs
  function createCategoryDiv(category, count) {
    const container = document.getElementById('categories-container');
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'flex flex-col mx-auto h-24 justify-center items-center border-2 border-gray-300 shadow-md rounded-full my-5 sm:px-6 lg:px-8';
    categoryDiv.innerHTML =
      `<div class="text-center">
        <p class="text-2xl font-semibold">${category}</p>
        <p class="text-lg"><span id="${category}-count">${count}</span> Recipes</p>
      </div>`;

    // Add click event listener to redirect to the category page
    categoryDiv.addEventListener('click', () => {
      window.location.href = `/${category}.html`; // Redirect to respective category page
    });

    container.insertBefore(categoryDiv, container.firstChild);
  }

  // Function to fetch and display user's name
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
