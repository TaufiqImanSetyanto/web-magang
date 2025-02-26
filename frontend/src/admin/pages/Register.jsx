import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../components/HandleNotif";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Input from "../../components/Input";
import Spinner from "../../components/Spinner";

function Register() {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [listBagian, setListBagian] = useState([]);
  useEffect(() => {
    const fetchBagian = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/data/listbagian`);
        setListBagian(data.bagian);
      } catch (error) {
        console.error("Error fetching bagian data:", error);
      }
    };
    fetchBagian();
  }, []);
  const [inputValue, setInputValue] = useState({
    username: "",
    NIK: "",
    bagian: "",
    role: "user",
    password: "",
  });
  const { NIK, password, bagian, username, role } = inputValue;
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
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setInputValue({
          ...inputValue,
          NIK: "",
          password: "",
          bagian: "",
          role: "user",
          username: "",
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
    <div>
      <h2 className="text-xl font-bold text-gray-900">Register</h2>
      <div className="mt-2 ">
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
                required
                className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
              >
                <option value={""}>Bagian</option>
                {listBagian.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
            </div>
          </div>
          <div className="mb-1">
            <label htmlFor="role" className="block text-sm/6 font-medium text-gray-900">
              Role
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="role"
                name="role"
                value={role}
                onChange={handleOnChange}
                required
                className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
              >
                <option value="user">User</option>
                <option value="asisten">Asisten</option>
                <option value="manajer">Manajer</option>
              </select>
              <ChevronDownIcon aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
            </div>
          </div>
          <Input label="Password" name="password" value={password} onChange={handleOnChange} type="password" placeholder="Masukkan Password" />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={loadingSubmit}
              className="rounded-md bg-sky-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-900"
            >
              {loadingSubmit ? <Spinner /> : "Daftar"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
