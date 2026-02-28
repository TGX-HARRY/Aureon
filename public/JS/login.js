async function validateForm(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    const response = await fetch("/api/users/customers/login", {
        method: "POST",   
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log(data);
    if (data && data.sessionData) {
        localStorage.setItem("sessionData", JSON.stringify(data.sessionData));
        // setInterval(()=> {
        //     console.log("15 sec wait for updation of storage")
        // }, 15000);
        window.location.href = "/";
    } else {
        errorMessage.innerHTML = '<span style="color:red;">*Invalid email or password.</span>';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", validateForm);
});