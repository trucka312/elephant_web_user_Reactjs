import { toast } from "react-toastify";

const success = (message) => {
  toast.success(message, {
    delay: 0,
    pauseOnHover: false,
    autoComplete: 200,
  });
};
const error = (message) => {
  toast.error(message, {
    delay: 0,
    pauseOnHover: false,
    autoComplete: 200,
  });
};
const warning = (message) => {
  toast.warning(message, {
    delay: 0,
    pauseOnHover: false,
    autoComplete: 200,
  });
};
export const alerts = {
  success,
  error,
  warning
};
