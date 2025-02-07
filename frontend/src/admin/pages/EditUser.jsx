import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

export default function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState({
    username: "",
    email: "",
    hakCuti: {
      tahunan: 0,
      panjang: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get(`http://localhost:4000/admin/edituser/${id}`);
        const { user } = data;
        console.log(user);
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
              <div className="mb-4">
                <label htmlFor="username" className="mb-2 block text-sm/6 font-medium text-gray-900">
                  Nama
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleOnChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm/6 font-medium text-gray-900">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleOnChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cutitahunan" className="mb-2 block text-sm/6 font-medium text-gray-900">
                  Cuti Tahunan
                </label>
                <input
                  id="cutitahunan"
                  type="number"
                  name="hakCuti.tahunan"
                  value={user.hakCuti.tahunan}
                  onChange={handleOnChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cutipanjang" className="mb-2 block text-sm/6 font-medium text-gray-900">
                  Cuti Panjang
                </label>
                <input
                  id="cutipanjang"
                  type="number"
                  name="hakCuti.panjang"
                  value={user.hakCuti.panjang}
                  onChange={handleOnChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-400 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                  required
                />
              </div>
              <div className="flex justify-end">
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
