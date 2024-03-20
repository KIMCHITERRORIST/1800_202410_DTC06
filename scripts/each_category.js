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

async function displayCategoryInfo() {
  const uid = await fetchUID();
  let params = new URL(window.location.href); //get URL of search bar
  let ID = params.searchParams.get("colId"); //get value for key "id"
  console.log(ID);

  db.collection("Recipes")
    .doc(uid)
    .collection(ID)
    .get()
    .then((menuList) => {
      menuList.forEach((doc) => {
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
    });
}
displayCategoryInfo();