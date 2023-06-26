export const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };
  
  export const validatePassword = (value) => {
    return value.length >= 6;
  };