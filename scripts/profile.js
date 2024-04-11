var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      // User is signed in, get the document of the current user
      currentUser = db.collection("users").doc(user.uid)
      currentUser.get()
        .then(userDoc => {
          //get the data fields of the user
          let userName = userDoc.data().name;
          let userAge = userDoc.data().age;
          let userHeight = userDoc.data().height;
          let userWeight = userDoc.data().weight;
          let userGender = userDoc.data().gender;
          let userGoalWeight = userDoc.data().goalWeight;

          //if the data fields are not empty om the database, then write them in to the form
          if (userName != null) {
            document.getElementById("name").innerText = userName;
            document.getElementById("nameField").value = userName;
          }
          if (userAge != null) {
            document.getElementById("age").value = userAge;
          }
          if (userHeight != null) {
            document.getElementById("height").value = userHeight;
          }
          if (userWeight != null) {
            document.getElementById("weight").value = userWeight;
          }
          if (userGoalWeight != null) {
            document.getElementById("goalWeight").value = userGoalWeight;
          }
          if (userGender != null) {
            document.getElementById("gender").value = userGender;
          }
        })
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

//call the function to run it 
populateUserInfo();

function editUserInfo() {
  //Enable the form fields
  document.getElementById('personal_info').disabled = false;
  //Add a border to the form fields for feedback
  document.querySelector('#nameField').classList.add('ring-2', 'ring-[#ffcc6d]')
  document.querySelector('#age').classList.add('ring-2', 'ring-[#ffcc6d]')
  document.querySelector('#weight').classList.add('ring-2', 'ring-[#ffcc6d]')
  document.querySelector('#height').classList.add('ring-2', 'ring-[#ffcc6d]')
  document.querySelector('#goalWeight').classList.add('ring-2', 'ring-[#ffcc6d]')
  document.querySelector('#gender').classList.add('ring-2', 'ring-[#ffcc6d]')
}

function saveUserInfo() {
  //Get the values from the form fields
  userName = document.getElementById('nameField').value;
  userAge = document.getElementById('age').value;
  userHeight = document.getElementById('height').value;
  userWeight = document.getElementById('weight').value;
  userGoalWeight = document.getElementById('goalWeight').value;
  userGender = document.getElementById('gender').value;

  currentUser.update({
    name: userName,
    age: userAge,
    height: userHeight,
    weight: userWeight,
    goalWeight: userGoalWeight,
    gender: userGender
  }).then(() => {
    console.log("User info updated");
    window.location.href = "overview.html"; //redirect to overview page
  })
  document.getElementById('personal_info').disabled = true; //disable the form fields
}      