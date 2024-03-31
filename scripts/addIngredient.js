document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the name from localStorage
    const name = localStorage.getItem('ingredientName');
    // Check if the name exists
    if (name) {
        // Update the placeholder with the retrieved name
        document.getElementById('ingredientName').innerText = name;
    }

    // change default form submission to handle updating db
    document.getElementById('create-ingredient-form').addEventListener('submit', function (e) {
        e.preventDefault();
        // Check for authenticated user
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in, now update Firestore with user's UID
                updateFirestore(user.uid, name);
            } else {
                console.log("No user is signed in.");
                window.location.href = 'login.html';
            }
        });
    });
});

updateFirestore = (uid, ingredientName) => {
    const fats = document.getElementById('fats').value;
    const carbs = document.getElementById('carbs').value;
    const protein = document.getElementById('protein').value;
    const calories = document.getElementById('calories').value;

    // format data to update into firestore
    let dataToUpdate = {};
    dataToUpdate[ingredientName] = {
        fat: fats,
        carbs: carbs,
        protein: protein,
        calories: calories
    };

    // update the document in firestore
    db.collection('ingredients').doc(uid).set(dataToUpdate, { merge: true })
        .then(() => {
            console.log('Document successfully updated!');
            // Optionally, provide feedback or redirect the user
        })
        .catch((error) => {
            console.error('Error updating document: ', error);
            // Handle errors, such as displaying a message to the user
        });
};