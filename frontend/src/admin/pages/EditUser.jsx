import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../components/HandleNotif";
import Input from "../../components/Input";

export default function EditUser() {
  const { id } = useParams();
  const [listBagian, setListBagian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    username: "",
    NIK: "",
    hakCuti: {
      tahunan: 0,
      panjang: 0,
    },
    tahunCuti: {
      tahunan: "",
      panjang: "",
    },
    bagian: "",
    tahunPengangkatan: "",
  });
  useEffect(() => {
    async function fetchBagian() {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/data/listbagian`);
        setListBagian(data.bagian);
      } catch (error) {
        console.error("Error fetching bagian data:", error);
      } 
    }
    async function fetchUser() {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`);
        const { user } = data;
        setUser(user);
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBagian();
    fetchUser();
  }, [id]);
  function handleOnChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("hakCuti.")) {
      const key = name.split(".")[1];
      setUser({
        ...user,
        hakCuti: {
          ...user.hakCuti,
          [key]: Number(value),
        },
      });
    } else if (name.startsWith("tahunCuti.")) {
      const key = name.split(".")[1];
      setUser({
        ...user,
        tahunCuti: {
          ...user.tahunCuti,
          [key]: String(value),
        },
      });
    } else {
      setUser({
        ...user,
        [name]: value,
      });
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/edituser/${id}`, user);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
      handleError(error.response.data.message);
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Edit Akun</h2>
          <form onSubmit={handleSubmit} method="PUT">
            <div className="flex flex-col gap-1">
              <Input label="Nama" name="username" value={user.username} onChange={handleOnChange} type="text" />
              <Input label="NIK" name="NIK" value={user.NIK} onChange={handleOnChange} type="text" />
              <div className="mb-1">
                <label htmlFor="bagian" className="block text-sm/6 font-medium text-gray-900">
                  Bagian
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="bagian"
                    name="bagian"
                    value={user.bagian}
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
              <Input label="Tahun Pengangkatan" name="tahunPengangkatan" value={user.tahunPengangkatan} onChange={handleOnChange} type="text" />
              <Input label="Cuti Tahunan" name="hakCuti.tahunan" value={user.hakCuti.tahunan} onChange={handleOnChange} type="number" />
              <Input label="Cuti Panjang" name="hakCuti.panjang" value={user.hakCuti.panjang} onChange={handleOnChange} type="number" />
              <Input label="Tahun Cuti Tahunan" name="tahunCuti.tahunan" value={user.tahunCuti.tahunan} onChange={handleOnChange} type="text" />
              <Input label="Tahun Cuti Panjang" name="tahunCuti.panjang" value={user.tahunCuti.panjang} onChange={handleOnChange} type="text" />
              <div className="mt-4 flex justify-end">
                <button type="submit" className=" rounded-md bg-sky-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <ToastContainer />
    </>
  );
}
