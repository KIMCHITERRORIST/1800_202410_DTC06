document.addEventListener('DOMContentLoaded', function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in, fetch user ID and run other functions
      const uid = user.uid;
      fetchAndDisplayUserName(uid);
      fetchAndDisplayCategories(uid);
    } else {
      // No user is signed in. Redirect to login page and show message
      console.log('User is not logged in. Redirecting to login page...');
      // Redirect to login page
      window.location.href = 'login.html';
    }
  });

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

    document.getElementById('create-category').addEventListener('click', function () {
      const newCategoryName = prompt("Please enter the name of the new category:");
      if (newCategoryName && newCategoryName.trim() !== "") {
        createNewCategory(uid, newCategoryName.trim());
      } else {
        console.log("Nothing was entered");
      }
    });
  }

  function appendCategoryName(uid, categoryName) {
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


  // function to create a new category in firebase
  function createNewCategory(uid, categoryName) {
    // Create a new collection with entered category name
    db.collection('Recipes').doc(uid).collection(categoryName).doc('count').set({
      count: 0
    }).then(function () {
      console.log("category created with id:", categoryName);
      // Append the category name to the categories array
      appendCategoryName(uid, categoryName);
      // Reload the page to display the new categorys
      location.reload();
    }).catch(function (error) {
      console.error("error adding new document: ", error);
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

    categoryCollectionId =
      // Add click event listener to redirect to the category page
      categoryDiv.addEventListener('click', () => {
        window.location.href = `/each_category.html?collectionId=` + category; // Redirect to respective category page
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