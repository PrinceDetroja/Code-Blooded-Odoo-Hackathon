// ----------- SIGNUP FORM VALIDATION -----------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    alert("Signup successful!");
    signupForm.reset();
  });
}

// ----------- LOGIN FORM HANDLER -----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    alert("Login successful!");
    loginForm.reset();
  });
}
