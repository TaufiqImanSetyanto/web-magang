import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import profile from "../../assets/profile.png";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [allUser, setAllUser] = useState();
  useEffect(() => {
    async function fetchAllUser() {
      try {
        const { data } = await axios.get("http://localhost:4000/admin/alluser");
        const { allUser } = data;
        setAllUser(allUser);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllUser();
  }, []);
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-4">List Karyawan</h2>
      <div className="md:py-2 px-4 md:px-8 md:m-4 shadow-md">
        {loading ? (
          <Loading />
        ) : (
          <ul className="divide-y divide-gray-300">
            {allUser.map((user) => (
              <li key={user._id} className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <img alt="" src={profile} className="size-12 flex-none self-center rounded-full bg-gray-50" />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm/6 font-semibold text-gray-950">{user.username}</p>
                    <p className="text-xs/3 font-semibold text-gray-700">{user.bagian}</p>
                    <p className="mt-1 truncate text-xs/5 text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link to={`edituser/${user._id}`}>
                    <PencilIcon className="size-5 m-1" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
