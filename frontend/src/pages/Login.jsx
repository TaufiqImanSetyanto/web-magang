import logo from "../assets/ptsgn_logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../contexts/authContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    NIK: "",
    password: "",
  });
  const { NIK, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-center",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-center",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/auth/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message, user } = data;
      if (success) {
        login(user);
        handleSuccess(message);
        if(user.role === "admin"){
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
        setInputValue({
          ...inputValue,
          NIK: "",
          password: "",
        });
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="PT SGN" src={logo} className="mx-auto h-24 w-auto" />
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Masuk ke akun anda</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
          <div>
            <label htmlFor="NIK" className="block text-sm/6 font-medium text-gray-900">
              NIK
            </label>
            <div className="mt-2">
              <input
                id="NIK"
                name="NIK"
                type="text"
                required
                value={NIK}
                placeholder="Masukkan NIK"
                onChange={handleOnChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                placeholder="Masukkan password"
                onChange={handleOnChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-sky-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-900"
            >
              Masuk
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm/6 text-gray-500">
          Belum punya akun?{" "}
          <Link to={"/register"} className="font-semibold text-sky-700 hover:text-sky-600">
            Buat akun disini
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
