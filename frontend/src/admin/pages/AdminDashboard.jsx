import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import profile from "../../assets/profile.png";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { listBagian } from "../../utils/Bagian";
import Pagination from "../../components/Pagination";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [allUser, setAllUser] = useState([]);
  const [filterBagian, setFilterBagian] = useState("");
  const filteredUser = allUser.filter((user) => {
    return filterBagian ? user.bagian === filterBagian : true;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredUser.slice(indexOfFirstData, indexOfLastData);

  const totalData = filteredUser.length;
  const totalPages = Math.ceil(totalData / dataPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    async function fetchAllUser() {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/alluser`);
        const { allUser } = data;
        setAllUser(allUser);
      } catch (error) {
        console.error("Error fetching all user", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllUser();
  }, []);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900">List Karyawan</h2>
      <div>
        <h3 className="block text-md/6 font-medium text-gray-900">Filter</h3>
        <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
          <select
            value={filterBagian}
            onChange={(e) => setFilterBagian(e.target.value)}
            className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
          >
            <option value={""}>Bagian</option>
            {listBagian.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
        </div>
      </div>
      <div className="md:py-2 px-6  md:m-4 shadow-md">
        {loading ? (
          <Loading />
        ) : (
          <>
            <ul className="divide-y divide-gray-300">
              {currentData.length > 0 ? (
                currentData.map((data) => (
                  <li key={data._id} className="flex justify-between gap-x-6 py-5">
                    <div className="flex min-w-0 gap-x-4">
                      <img alt="" src={profile} className="size-12 flex-none self-center rounded-full bg-gray-50" />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm/6 font-semibold text-gray-950">{data.username}</p>
                        <p className="text-xs/3 font-semibold text-gray-700">{data.bagian}</p>
                        <p className="mt-1 truncate text-xs/5 text-gray-500">{data.NIK}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Link to={`edituser/${data._id}`}>
                        <PencilIcon className="size-5 m-1" />
                      </Link>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">Tidak ada data user.</p>
              )}
            </ul>
            <Pagination indexOfFirstData={indexOfFirstData} indexOfLastData={indexOfLastData} totalData={totalData} totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} />
          </>
        )}
      </div>
    </>
  );
}
