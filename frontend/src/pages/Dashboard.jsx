import { useAuth } from "../contexts/authContext";
import axios from "axios";
import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../components/HandleNotif";
import Information from "../components/Information";
import Input from "../components/Input";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const { user } = useAuth();
  const id = user?._id;
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const { oldPassword, newPassword } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleChangePassword = async () => {
    try {
      setLoadingSubmit(true);
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth/changepassword/${id}`, {
        oldPassword,
        newPassword,
      });
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error(error);
      handleError(error.response.data.message);
    } finally {
      setLoadingSubmit(false);
      setInputValue({
        ...inputValue,
        oldPassword: "",
        newPassword: "",
      });
    }
  };
  return (
    <>
      <div>
        <h2 className="font-bold text-xl text-gray-900">Profile</h2>
        <div>
          <div className="divide-y divide-gray-300">
            <Information first="Nama Lengkap" second={user.username} />
            <Information first="NIK" second={user.NIK} />
            <Information first="Bagian" second={user.bagian.name} />
            <Information first="Tahun Pengangkatan" second={user.tahunPengangkatan} />
            <Information first={`Hak Cuti Tahunan ${user.tahunCuti.tahunan}`} second={user.hakCuti.tahunan} />
            <Information first={`Hak Cuti Panjang ${user.tahunCuti.panjang}`} second={user.hakCuti.panjang} />
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <div className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                <button
                  onClick={() => setOpen(true)}
                  className=" rounived-md bg-sky-800 px-3 py-2 text-sm font-semibold rounded text-white shadow-xs hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Ganti Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={() => {}} className="relative z-10">
        <DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto items-center">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidiven rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ganti Password</h2>
                <Input label="Password Lama" name="oldPassword" value={oldPassword} onChange={handleOnChange} type="text" />
                <Input label="Password Baru" name="newPassword" value={newPassword} onChange={handleOnChange} type="text" />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={loadingSubmit}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  {loadingSubmit ? <Spinner/> : "Ganti Password"}
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
