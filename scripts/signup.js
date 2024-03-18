const auth = firebase.auth();

// Handling the form submission
document.getElementById('signup-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  // Get user inputs
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const name = document.getElementById('signup-name').value; // Assuming this is "Last Name First Name" format

  // Create a new user with the provided email and password
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User account created successfully
      const user = userCredential.user;

      // Add user info to Firestore
      db.collection("users").doc(user.uid).set({
        name: na,
        email: email,
        // Additional default information
        country: "Canada",
        school: "BCIT"
        ds
      })
        .then(() => {
          console.log("New user added to firestore");
          // Redirect the user or show a success message
          window.location.href = 'login.html';
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
