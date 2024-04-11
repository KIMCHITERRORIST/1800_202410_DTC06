const auth = firebase.auth();

document.getElementById('signup-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get user inputs
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const name = document.getElementById('signup-name').value;
  const categories = []

  // Create a new user with the entered email and password
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

      // User account created successfully
      const user = userCredential.user;

      // Add basic user info to Firestore
      db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        Date: firebase.firestore.FieldValue.serverTimestamp()
        // Additional default information
      })

      // Create UID documents in each collection for each user
      // Add default categories to the recipes collection
      db.collection("Recipes").doc(user.uid).collection("Breakfast").doc("count").set({ count: 0 });
      db.collection("Recipes").doc(user.uid).collection("Lunch").doc("count").set({ count: 0 });
      db.collection("Recipes").doc(user.uid).collection("Dinner").doc("count").set({ count: 0 });
      db.collection("Recipes").doc(user.uid).set({ categories: ["Breakfast", "Lunch", "Dinner"] });

      db.collection("exercises").doc(user.uid).set({})
      db.collection("calories").doc(user.uid).set({})
      db.collection("ingredients").doc(user.uid).set({})
      db.collection("meals").doc(user.uid).set({})

        .then(() => {
          console.log("New user added to firestore");
          // Redirect the user to login page
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error("Error adding new user to firestore: ", error);
        });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert("Error creating user: " + errorMessage);
    });
});
