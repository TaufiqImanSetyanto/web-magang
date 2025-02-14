import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import RiwayatAbsen from "../components/RiwayatAbsen";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Loading from "../components/Loading";

export default function Absen() {
  const { user } = useAuth();
  const userId = user._id;
  const [location, setLocation] = useState();
  const [loading, setLoading] = useState(true);
  const [jadwal, setJadwal] = useState("shift pagi");
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      setLoading(false);
    }
  }, []);

  const handleCheckIn = async () => {
    try {
      const checkIn = {
        userId,
        jadwal,
        locationIn: location,
      };
      const { data } = await axios.post("http://localhost:4000/absen/checkin", checkIn);
      console.log(data.absen);
    } catch (error) {
      console.error("Error during check-in:", error);
    }
  };
  const handleCheckOut = async () => {
    try {
      const checkOut = {
        userId,
        locationOut: location,
      };
      const { data } = await axios.post("http://localhost:4000/absen/checkout", checkOut);
      console.log(data.absen);
    } catch (error) {
      console.error("Error during check-out:", error);
    }
  };
  return (
    <div>
      <h2 className="font-bold text-xl text-gray-900">Absen</h2>
      {loading ? (
        <Loading />
      ) : (
        <div className="mb-5">
          <div>
            <p>
              Latitude: {location?.latitude}
            </p>
            <p>
              Longitude: {location?.longitude}
            </p>
          </div>
          <div className="flex gap-2">
            <label htmlFor="jadwal" className="py-2 font-medium">Jadwal:</label>
            <div className="mt-1 mb-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              <select
                id="jadwal"
                value={jadwal}
                onChange={(e) => setJadwal(e.target.value)}
                className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
              >
                <option value="shift pagi">Shift Pagi</option>
                <option value="shift siang">Shift Siang</option>
                <option value="shift malam">Shift Malam</option>
              </select>
              <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
            </div>
          </div>
          <div className="flex space-x-10">
            <button onClick={handleCheckIn} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
              Check In
            </button>
            <button onClick={handleCheckOut} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
              Check Out
            </button>
          </div>
        </div>
      )}
      <RiwayatAbsen />
    </div>
  );
}
