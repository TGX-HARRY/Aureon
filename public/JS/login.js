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

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", validateForm);
});