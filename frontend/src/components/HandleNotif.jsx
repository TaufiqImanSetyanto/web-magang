import { toast } from "react-toastify";

export const handleError = (err) =>
  toast.error(err, {
    position: "top-right",
  });
export const handleSuccess = (msg) =>
  toast.success(msg, {
    position: "top-right",
  });
