import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import profile from "../../assets/profile.png";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import Pagination from "../../components/Pagination";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../components/HandleNotif";
import Spinner from "../../components/Spinner";

export default function ListUser() {
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [allUser, setAllUser] = useState([]);
  const [listBagian, setListBagian] = useState([]);
  const [filterBagian, setFilterBagian] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const filteredUser = allUser.filter((user) => {
    return (filterBagian ? user.bagian === filterBagian : true) && (filterRole ? user.role === filterRole : true);
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
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  useEffect(() => {
    async function fetchBagian() {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/data/listbagian`);
        setListBagian(data.bagian);
      } catch (error) {
        console.error("Error fetching bagian data:", error);
      }
    }
    async function fetchAllUser() {
      try {
        setLoadingFetch(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/alluser`);
        const { allUser } = data;
        setAllUser(allUser);
      } catch (error) {
        console.error("Error fetching all user", error);
      } finally {
        setLoadingFetch(false);
      }
    }
    fetchBagian();
    fetchAllUser();
  }, []);

  async function handleDelete(id) {
    try {
      setLoadingDelete(true);
      const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/deleteuser/${id}`);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
      } else {
        handleError(message);
      }
      setOpen(false);
    } catch (error) {
      console.log(error);
      handleError(error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  }
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900">List Karyawan</h2>
      <div>
        <h3 className="block text-md/6 font-medium text-gray-900">Filter</h3>
        <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          <select
            value={filterBagian}
            onChange={(e) => setFilterBagian(e.target.value)}
            className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
          >
            <option value={""}>Bagian</option>
            {listBagian.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="col-start-2 row-start-1 appearance-none rounded-md bg-white py-1 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
          >
            <option value={""}>Role</option>
            <option value="user">Karyawan</option>
            <option value="asisten">Asisten</option>
            <option value="manajer">Manajer</option>
          </select>
          <ChevronDownIcon className="pointer-events-none col-start-2 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
        </div>
      </div>
      <div className="md:py-2 px-6  md:m-4 shadow-md">
        {loadingFetch ? (
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
                    <div className="flex flex-col gap-3 justify-end">
                      <Link to={`edituser/${data._id}`}>
                        <PencilIcon className="size-5 m-1" />
                      </Link>
                      <div className=" cursor-pointer"
                        onClick={() => {
                          setSelectedUser(data._id);
                          setOpen(true);
                        }}
                      >
                        <TrashIcon className="size-5 m-1" />
                      </div>
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
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                      Konfirmasi Penghapusan Akun
                    </DialogTitle>
                    <p className="mt-2 text-sm text-gray-600">Apakah Anda yakin ingin akun ini?</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedUser)}
                  disabled={loadingDelete}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-800 sm:ml-3 sm:w-auto"
                >
                  {loadingDelete ? <Spinner /> : "Ya, Hapus"}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <ToastContainer />
    </>
  );
}
