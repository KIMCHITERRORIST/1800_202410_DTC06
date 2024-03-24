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
  let category = params.searchParams.get("categoryId"); //get value for key "id"
  let menu = params.searchParams.get("menuId"); //get value for key "id"
  console.log(menu);

  db.collection("Recipes")
    .doc(uid)
    .collection(category)
    .doc(menu)
    .collection("ingredients")
    .get()
    .then((ingredientList) => {
      ingredientList.forEach((doc) => {
        if (doc.id === "count") return;

        ingredientName = doc.id
        calorie = doc.data().calorie
        quantity = doc.data().quantity
        menuCard = document.getElementById("menuContainer")
        menuCard.innerHTML += `<div class="flex w-full mx-auto border-2 border-gray-300 shadow-md rounded-full mt-2 mb-5 p-4 text-center">
            <div class="w-3/4">
                <p class="text-3xl font-bold mb-2">${ingredientName}</p>
                <p class="text-sm text-gray-500">Quantity: ${quantity}</p>
            </div>
            <div class="flex items-center">
                <p class="text-gray-800 text-lg font-semibold">${calorie}</p>
                <img src="/images/kcal_icon.svg" alt="" class="size-20">
            </div>
        </div>`
      })
    });

  container.insertBefore(categoryDiv, container.firstChild);
}
displayMenuInfo();