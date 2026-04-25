const form = document.getElementById('signUpForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function checkPasswordStrength(password) {
    let score = 0;

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        score++;
    }
    if (/\d/.test(password)) {
        score++;
    }
    if (/[!@#$%^&*_'"|,.?]/.test(password)) {
        score++;
    }

    switch(score) {
        case 1: return "Weak";
        case 2: return "Moderate";
        case 3: return "Strong";
        default: return "Very Weak";
    }
}

nameInput.addEventListener('input', () => {
    const name = nameInput.value.trim();
    nameError.innerHTML = '';
    
    if (name === '') {
        nameError.innerHTML = '<span style="color:red;">*Name is required.</span>';
    } 
    else if (name.length < 6 || name.length > 20) {
        nameError.innerHTML = '<span style="color:red;">*Username length must be 6-20 characters!</span>';
    }
});

emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    emailError.innerHTML = '';
    
    if (email === '') {
        emailError.innerHTML = '<span style="color:red;">*Email is required.</span>';
    } 
    else if (!validateEmail(email)) {
        emailError.innerHTML = '<span style="color:red;">*Invalid Email</span>';
    }
});

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    passwordError.innerHTML = '';
    
    if (password === '') 
        passwordError.innerHTML = '<span style="color:red;">*Password is required.</span>'; 
    else if (password.length < 8 || password.length > 20) 
        passwordError.innerHTML = '<span style="color:red;">*Password length must be 8-20 characters!</span>';
    else {
        const strength = checkPasswordStrength(password);
        const strengthLower = strength.toLowerCase();
        
        if (strengthLower === "weak" || strengthLower === "very weak") 
            passwordError.innerHTML = `<span style="color:red;">*Your password is ${strength}!</span>`; 
        else if (strengthLower === "moderate") 
            passwordError.innerHTML = `<span style="color:orange;">*Your password is ${strength}!</span>`;
        else if (strengthLower === "strong") 
            passwordError.innerHTML = `<span style="color:green;">*Your password is ${strength}!</span>`;       
    }
    
    if (confirmInput.value) validateConfirmPassword();
});

confirmInput.addEventListener('input', () => {
    validateConfirmPassword();
});

function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    confirmError.innerHTML = '';
    
    if (confirmPassword === '') {
        confirmError.innerHTML = '<span style="color:red;">*Please confirm your password.</span>';
    } 
    else if (password !== confirmPassword) {
        confirmError.innerHTML = '<span style="color:red;">*Passwords do not match.</span>';
    }
}


form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    
    let isValid = true;
    
    nameError.innerHTML = '';
    emailError.innerHTML = '';
    passwordError.innerHTML = '';
    confirmError.innerHTML = '';
    
    if (name === '') {
        nameError.innerHTML = '<span style="color:red;">*Name is required.</span>';
        isValid = false;
    } 
    else if (name.length < 6 || name.length > 20) {
        nameError.innerHTML = '<span style="color:red;">*Username length must be 6-20 characters!</span>';
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        emailError.innerHTML = '<span style="color:red;">*Invalid Email</span>';
        isValid = false;
    }
    
    if (password.length < 8 || password.length > 20) {
        passwordError.innerHTML = '<span style="color:red;">*Password length must be 8-20 characters!</span>';
        isValid = false;
    }
    
    const strength = checkPasswordStrength(password);
    if (strength.toLowerCase() === "weak" || strength.toLowerCase() === "very weak") {
        passwordError.innerHTML = `<span style="color:red;">*Your password is ${strength}!</span>`;
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        confirmError.innerHTML = '<span style="color:red;">*Passwords do not match.</span>';
        isValid = false;
    }
    
    if (isValid) {
        const response = await fetch("/api/users/subscribers/register",  {
            method : "POST", 
            headers: {
            "Content-Type": "application/json"
            },
            body : JSON.stringify({username: name, email, password})
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || "Account Creation Failed!");
            return;
        }

        const data = await response.json();
        alert(data.message || "Account Created Successfully!");
        window.location.href = "/login.html";
    }
});

// ─── Google OAuth ───────────────────────────────────────────────────────────

function triggerGoogleSignIn() {
    // Programmatically trigger the hidden Google sign-in flow
    google.accounts.id.prompt();
}

async function handleCredentialResponse(response) {
    try {
        const res = await fetch("/api/users/subscribers/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.credential }),
            credentials: "include"
        });

        if (res.ok) {
            window.location.replace("/");
        } else {
            const data = await res.json();
            alert(data.message || "Google Sign-Up failed. Please try again.");
        }
    } catch (err) {
        console.error("Google Sign-Up Error:", err);
        alert("Something went wrong. Please try again.");
    }
}