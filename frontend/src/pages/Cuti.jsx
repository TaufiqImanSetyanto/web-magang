import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../components/HandleNotif";
import Input from "../components/Input";
import Spinner from "../components/Spinner";

export default function Cuti() {
  const { user } = useAuth();
  const userId = user?._id;
  const username = user?.username;
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [dates, setDates] = useState([{ id: Date.now(), date: "" }]);
  const [inputValue, setInputValue] = useState({
    jenisCuti: "tahunan",
    reason: "",
    diwakilkan: "",
  });
  const { jenisCuti, reason, diwakilkan } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const handleDateChange = (id, value) => {
    setDates(dates.map((item) => (item.id === id ? { ...item, date: value } : item)));
  };

  const handleAddDate = () => {
    setDates([...dates, { id: Date.now(), date: "" }]);
  };

  const handleRemoveDate = (id) => {
    setDates(dates.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cuti/ambilcuti`, {
        userId,
        username,
        dates,
        jenisCuti,
        reason,
        diwakilkan,
      });
      const { message, success } = data;
      if (success) {
        handleSuccess(message);
        setInputValue({
          ...inputValue,
          jenisCuti: "tahunan",
          reason: "",
          diwakilkan: "",
        });
        setDates([{ id: Date.now(), date: "" }]);
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
    <>
      <h2 className="font-bold text-xl text-gray-900">Permohonan Cuti</h2>
      <form onSubmit={handleSubmit} method="POST">
        <div className="border-b border-gray-900/10 pb-6">
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-4">
            <div className="sm:col-span-4 flex">
              <div className="">
                <label htmlFor="dates" className="block text-sm/6 font-medium text-gray-900">
                  Tanggal Cuti
                </label>
                {dates.map((item, index) => (
                  <div key={item.id}>
                    <div className="grid grid-cols-6 items-center gap-2 mt-2">
                      <input
                        type="date"
                        id="dates"
                        value={item.date}
                        onChange={(e) => handleDateChange(item.id, e.target.value)}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6 col-span-5"
                        required
                      />
                      {index > 0 && (
                        <button type="button" onClick={() => handleRemoveDate(item.id)} className="col-span-1 bg-red-500 text-white py-0.5 px-2 rounded">
                          -
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={handleAddDate} className="bg-green-500 text-white py-0.5 px-2 rounded mt-2">
                  +
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="jeniscuti" className="block text-sm/6 font-medium text-gray-900">
                Jenis Cuti
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="jeniscuti"
                  name="jenisCuti"
                  value={jenisCuti}
                  onChange={handleOnChange}
                  className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
                >
                  <option value={"tahunan"}>Tahunan</option>
                  <option value={"panjang"}>Panjang</option>
                </select>
                <ChevronDownIcon aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
              </div>
            </div>
            <div className="sm:col-span-5">
              <Input label="Alasan" name="reason" value={reason} onChange={handleOnChange} type="text" placeholder="Masukkan alasan cuti" />
            </div>
            <div className="sm:col-span-5">
              <Input label="Diwakilkan" name="diwakilkan" value={diwakilkan} onChange={handleOnChange} type="text" placeholder="Diwakilkan kepada" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            disabled={loadingSubmit}
            type="submit"
            className="rounded-md bg-sky-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            {loadingSubmit ? <Spinner /> : <div>Submit</div>}
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
