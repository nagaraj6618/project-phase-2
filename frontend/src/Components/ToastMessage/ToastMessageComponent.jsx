// import React from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const showErrorToast = (message) => {
//   toast.error(message, {
//     position: "top-right",
//     autoClose: 3000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//     theme: "colored",
//   });
// };

// const showSuccessToast = (message) => {
//   toast.success(message, {
//     position: "top-right",
//     autoClose: 3000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//     theme: "colored",
//   });
// };

// const showLoadingToast = (message) => {
//   toast.info(message, {
//     position: "top-right",
//     autoClose: false,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//     theme: "colored",
//   });
// };

// const ToastNotifications = () => {
//   return <ToastContainer />;
// };

// export { showErrorToast, showSuccessToast, showLoadingToast, ToastNotifications };
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  style: {
    background: "rgba(30, 30, 30, 0.8)",
    backdropFilter: "blur(10px)",
    color: "#fff",
  },
};

const showErrorToast = (message) => {
  toast.error(message, { ...toastOptions, progressStyle: { background: "red" } });
};

const showSuccessToast = (message) => {
  toast.success(message, { ...toastOptions, progressStyle: { background: "green" } });
};

const showLoadingToast = (message) => {
  toast.info(message, { ...toastOptions, autoClose: false, progressStyle: { background: "blue" } });
};

const showInfoToast = (message) => {
  toast.info(message, { ...toastOptions, progressStyle: { background: "yellow" } });
};

const ToastNotifications = () => {
  return <ToastContainer />;
};

export { showErrorToast, showSuccessToast, showLoadingToast, showInfoToast, ToastNotifications };
