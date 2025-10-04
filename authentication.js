// ----------- SIGNUP FORM VALIDATION -----------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    console.log({password,confirm,name,email});

    try {
        const response = await fetch('http://localhost:5500/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, confirm })
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) form.reset();

    } catch (err) {
        alert('Something went wrong!');
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