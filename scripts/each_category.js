// set global variable to call in other functions from local storage and set recipe name up 
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the value from local storage
  const recipeCatName = localStorage.getItem('selectedCategory');

  // Set the text content of the element with ID "recipeCategory"
  if (recipeCatName) {
    document.getElementById("recipeCategory").innerText = recipeCatName;
  }
});

function fetchAndDisplayRecipes(uid) {
  // Read the categories array from the UID document under 'Recipes' collection
  db.collection('Recipes').doc(uid).collection(recipeCatName).get().then(doc => {
    if (doc.exists) {
      var recipesDataArray = doc.data().recipeCatName;
      console.log(recipesDataArray);

      // Fetch and read the 'count' document from each corresponding category collection
      recipesDataArray.forEach(recipeName => {
        db.collection('Recipes').doc(uid).collection(recipeCatName).doc('count').get()
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

async function displayMenuInfo() {
  const uid = await fetchUID();
  let params = new URL(window.location.href); //get URL of search bar
  let ID = params.searchParams.get("collectionId"); //get value for key "id"
  console.log(ID);
  db.collection("Recipes")
    .doc(uid)
    .collection(ID)
    .get()
    .then((menuList) => {
      menuList.forEach((doc) => {
        if (doc.id === "count") return;

        menuName = doc.id
        calorie = doc.data().totalCalorie
        menuCard = document.getElementById("recipeContainer")
        menuCard.innerHTML += `<div class="flex w-full mx-auto border-2 border-gray-300 shadow-md rounded-full mt-2 mb-5 p-4 text-center">
            <div class="w-3/4">
                <p class="text-3xl font-bold mb-2">${menuName}</p>
                <p class="text-sm text-gray-500">0g Protein | 0g Carb | 0g Fat</p>
            </div>
            <div class="flex items-center">
                <p class="text-gray-800 text-lg font-semibold">${calorie}</p>
                <img src="/images/kcal_icon.svg" alt="" class="size-20">
            </div>
        </div>`
      })

      menuId =
        // Add click event listener to redirect to the category page
        menuCard.addEventListener('click', () => {
          window.location.href = `/each_menu.html?categoryId=${ID}&menuId=${menuName}`; // Redirect to respective category page
        });
    });
}
displayMenuInfo();
