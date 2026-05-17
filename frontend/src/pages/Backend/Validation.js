function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function checkPasswordStrength(password) {
  let score = 0;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*_'"|,.?]/.test(password)) score++;

  switch (score) {
    case 1:
      return "Weak";
    case 2:
      return "Moderate";
    case 3:
      return "Strong";
    default:
      return "Very Weak";
  }
}

function Validate(values) {
  const errors = {};

  // Empty checks
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.email.trim()) errors.email = "Email is required";
  if (!values.password) errors.password = "Password is required";
  if (!values.confirmPassword) errors.confirmPassword = "Confirm password is required";
  
  // Name validation
  if (!values.name.trim()) {
    errors.name = "Name is required";
  } 
  else if (values.name.length < 6 || values.name.length > 20) {
    errors.name = "Length of name should be between 6 and 20 characters";
  }


  // Email validation
  if (values.email && !validateEmail(values.email)) {
    errors.email = "Invalid email format";
  }

  // Password confirmation
  if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // Password strength
  if (values.password) {
    const strength = checkPasswordStrength(values.password);
    if (strength === "Weak" || strength === "Very Weak") {
      errors.password = "Your password is too weak!";
    } else if (strength === "Moderate") {
      errors.password = "Your password is okay, but could be stronger.";
    }
  }

  return errors;
}

export default Validate;
