import logo from "../assets/ptsgn_logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../components/HandleNotif";
import { useAuth } from "../contexts/authContext";
import Input from "../components/Input";
import Spinner from "../components/Spinner";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message, user } = data;
      if (success) {
        login(user);
        handleSuccess(message);
        if (user.role === "admin") {
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
      console.error(error);
      handleError(error.response.data.message);
    } finally {
      setLoadingSubmit(false);
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
          <Input label="NIK" name="NIK" value={NIK} onChange={handleOnChange} type="text" placeholder="Masukkan NIK" />
          <Input label="Password" name="password" value={password} onChange={handleOnChange} type="password" placeholder="Masukkan Password" />
          <div>
            <button
              type="submit"
              disabled={loadingSubmit}
              className="flex w-full justify-center rounded-md bg-sky-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-900"
            >
              {loadingSubmit ? <Spinner /> : "Masuk"}
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
