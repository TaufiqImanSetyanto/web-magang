import logo from "../assets/ptsgn_logo.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../components/HandleNotif";
import { useAuth } from "../contexts/authContext";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Input from "../components/Input";

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [listBagian, setListBagian] = useState([]);
  useEffect(()=>{
    const fetchBagian = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/data/listbagian`);
        setListBagian(data.bagian);
      } catch (error) {
        console.error("Error fetching bagian data:", error);
      }
    }
    fetchBagian()
  },[])
  const [inputValue, setInputValue] = useState({
    username: "",
    NIK: "",
    bagian: "Keuangan & Umum",
    password: "",
  });
  const { NIK, password, bagian, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message, user } = data;
      if (success) {
        login(user);
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
        setInputValue({
          ...inputValue,
          NIK: "",
          password: "",
          bagian: "Keuangan & Umum",
          username: "",
        });
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error(error);
      handleError(error.response.data.message);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="PT SGN" src={logo} className="mx-auto h-24 w-auto" />
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">Daftar akun</h2>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} method="POST" className="space-y-2">
          <Input label="Nama" name="username" value={username} onChange={handleOnChange} type="text" placeholder="Masukkan username" />
          <Input label="NIK" name="NIK" value={NIK} onChange={handleOnChange} type="text" placeholder="Masukkan NIK" />
          <div>
            <label htmlFor="bagian" className="block text-sm/6 font-medium text-gray-900">
              Bagian
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="bagian"
                name="bagian"
                value={bagian}
                onChange={handleOnChange}
                className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
              >
                {listBagian.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              
              </select>
              <ChevronDownIcon aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
            </div>
          </div>
          <Input label="Password" name="password" value={password} onChange={handleOnChange} type="password" placeholder="Masukkan Password" />
          <div>
            <button
              type="submit"
              className="mt-7 flex w-full justify-center rounded-md bg-sky-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-900"
            >
              Daftar
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm/6 text-gray-500">
          Sudah punya akun?{" "}
          <Link to={"/login"} className="font-semibold text-sky-700 hover:text-sky-600">
            Masuk
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
