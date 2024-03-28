const auth = firebase.auth();

// Handling the form submission
document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  // Get user inputs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Perform the sign-in operation
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {

      console.log("Logged in as:", userCredential.user.email);
      window.location.href = 'user_info.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Display error message to the user
      alert("Error: " + errorCode + errorMessage);
    });
});
