export const validateEmail = (email) => {
  if (email === "") return true;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const regex = /^\+?[0-9]{10}$/;

  return regex.test(phoneNumber);
};

export const validateReferralPhoneNumber = (referralPhoneNumber) => {
  if (referralPhoneNumber === "") return true;
  const regex = /^\+?[0-9]{10,15}$/;

  return regex.test(referralPhoneNumber);
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) return false;

  return true;
};
