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

// set uid to global variable to call in other functions
const userUID = await fetchUID();
console.log(userUID);

// fetch and display created recipe page. 
async function fetchAndDisplayUserRecipe(userUID) {
    const newRecipe = db.collection('Recipes').doc(userUID).get()
}
