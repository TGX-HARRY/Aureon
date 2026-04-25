async function validateForm(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    const response = await fetch("/api/users/subscribers/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        });
    const data = await response.json();
    if (response.ok) {
        window.location.replace("/"); 
    } 
    else {
        errorMessage.innerHTML = '<span style="color:red;">*Invalid email or password.</span>';
    }
}

function triggerGoogleSignIn() {
    google.accounts.id.prompt();
}

async function handleCredentialResponse(response) {
    try {
        const body = { token: response.credential };
        const res = await fetch("/api/users/subscribers/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            credentials: "include"
        });

        if (res.ok) {
            window.location.replace("/");
        } else {
            console.error("Google Login Failed");
            document.getElementById('error-message').innerHTML = '<span style="color:red;">*Google Sign-In failed.</span>';
        }
    } catch (err) {
        console.error("Error during Google Login:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", validateForm);
});