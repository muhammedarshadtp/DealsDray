// Import validator library


const alphanumValid = (name) => {
    const nameRegex = /^(?! )[A-Za-z0-9 ]*(?<! )$/;
    return name.trim() !== '' && nameRegex.test(name);
};

const onlyNumbers = (str) => {
    const numbersOnlyRegex = /^[0-9]+$/; // Allow only numbers
    return numbersOnlyRegex.test(str);
};


const isValidMobile = (mobile) => {
    return /^[0-9]{10}$/.test(mobile); // Validate mobile number (10 digits)
};

const isValidDesignation = (designation) => {
    const designationRegex = /^[a-zA-Z\s]+$/; // Only allow letters and spaces
    return designationRegex.test(designation);
};
const validateEmail = (email) => {
    // Basic email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const AlphaOnly = (input) => {
    const regex = /^[a-zA-Z]+$/; // Only allow letters
    return input.length > 0 && regex.test(input);
};

const isFutureDate = (selectedDate) => {
    const selectedDateTime = new Date(selectedDate);
    const currentDate = new Date();
    return selectedDateTime > currentDate;
};

module.exports = {
    alphanumValid,
    onlyNumbers,
    validateEmail,
    isValidMobile,
    isValidDesignation,
    AlphaOnly,
    isFutureDate,
};
