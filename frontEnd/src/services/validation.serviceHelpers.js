const required = (value) => {
  if (!value) {
    return "This field is required!";
  }
};

const validEmail = (value) => {
  if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
    return "Invalid email!";
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return "The username must be between 3 and 20 characters!";
  }
};

const vpassword = (value) => {
  if (!value) {
    return "Password is required!";
  }
  if (value.length < 8) {
    return "Password must be at least 8 characters long!";
  }
  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter!";
  }
  if (!/[0-9]/.test(value)) {
    return "Password must contain at least one number!";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)!';
  }
};

const validationService = {
  required,
  validEmail,
  vusername,
  vpassword,
};

export default validationService;
