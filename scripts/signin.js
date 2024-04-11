const auth = firebase.auth();

document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission
  // Get user inputs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Perform the sign-in operation
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User signed in successfully
      console.log("Logged in as:", userCredential.user.email);
      window.location.href = 'user_info.html';
    })
    // Login error handling
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: " + errorCode + errorMessage);
    });
});
