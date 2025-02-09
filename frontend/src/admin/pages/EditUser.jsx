import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import { listBagian } from "../../utils/Bagian";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

export default function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState({
    username: "",
    email: "",
    hakCuti: {
      tahunan: 0,
      panjang: 0,
    },
    bagian: "",
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get(`http://localhost:4000/admin/edituser/${id}`);
        const { user } = data;
        setUser(user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
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
      console.log(user)
      await axios.put(`http://localhost:4000/admin/edituser/${id}`, user);
    } catch (error) {
      console.log(error);
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
            <div className="flex flex-col">
              <div className="mb-1">
                <label htmlFor="username" className="mb-2 block text-sm/6 font-medium text-gray-900">
                  Nama
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleOnChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                  required
                />
              </div>
              <div className="mb-1">
                <label htmlFor="email" className="mb-2 block text-sm/6 font-medium text-gray-900">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleOnChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                  required
                />
              </div>
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
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
                </div>
              </div>
              <div className="mb-1">
                <label htmlFor="cutitahunan" className="mb-2 block text-sm/6 font-medium text-gray-900">
                  Cuti Tahunan
                </label>
                <input
                  id="cutitahunan"
                  type="number"
                  name="hakCuti.tahunan"
                  value={user.hakCuti.tahunan}
                  onChange={handleOnChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                  required
                />
              </div>
              <div className="mb-1">
                <label htmlFor="cutipanjang" className="mb-2 block text-sm/6 font-medium text-gray-900">
                  Cuti Panjang
                </label>
                <input
                  id="cutipanjang"
                  type="number"
                  name="hakCuti.panjang"
                  value={user.hakCuti.panjang}
                  onChange={handleOnChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                  required
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" className=" rounded-md bg-sky-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
