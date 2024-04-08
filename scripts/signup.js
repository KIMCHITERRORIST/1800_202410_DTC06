const auth = firebase.auth();

// Handling the form submission
document.getElementById('signup-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  // Get user inputs
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const name = document.getElementById('signup-name').value; // Assuming this is "Last Name First Name" format
  const categories = []
  // Create a new user with the provided email and password
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User account created successfully
      const user = userCredential.user;

      // Add user info to Firestore
      db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        Date: firebase.firestore.FieldValue.serverTimestamp()
        // Additional default information
      })

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
          // Redirect the user or show a success message
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error("Error adding new user to firestore: ", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Show error message to the user
      alert("Error creating user: " + errorMessage);
    });
});
