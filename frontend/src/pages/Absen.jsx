import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import RiwayatAbsen from "../components/RiwayatAbsen";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Loading from "../components/Loading";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../components/HandleNotif";

export default function Absen() {
  const { user } = useAuth();
  const userId = user._id;
  const [location, setLocation] = useState();
  const [loading, setLoading] = useState(true);
  const [jadwal, setJadwal] = useState("shift pagi");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
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

  const officeLocation = {
    latitude: -6.926224, 
    longitude: 109.562998, 
  };
  const allowedDistance = 1000; 
  // Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3;
    const lati1 = toRad(lat1);
    const lati2 = toRad(lat2);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lati1) * Math.cos(lati2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
  };

  const handleCheckIn = async () => {
    const distance = calculateDistance(location.latitude, location.longitude, officeLocation.latitude, officeLocation.longitude);
    if (distance > allowedDistance) {
      handleError("Kamu terlalu jauh dari kantor untuk check-in");
      return;
    }
    try {
      const checkIn = {
        userId,
        jadwal,
        locationIn: location,
      };
      const { data } = await axios.post("http://localhost:4000/absen/checkin", checkIn);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error(error);
      handleError(error.response.data.message);
    }
  };

  const handleCheckOut = async () => {
    const distance = calculateDistance(location.latitude, location.longitude, officeLocation.latitude, officeLocation.longitude);
    if (distance > allowedDistance) {
      handleError("Kamu terlalu jauh dari kantor untuk check-out");
      return;
    }
    try {
      const checkOut = {
        userId,
        locationOut: location,
      };
      const { data } = await axios.post("http://localhost:4000/absen/checkout", checkOut);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error(error);
      handleError(error.response.data.message);
    }
  };
  return (
    <div>
      <h2 className="font-bold text-xl text-gray-900">Absen</h2>
      {loading ? (
        <Loading />
      ) : (
        <div className="mb-5 space-y-2">
          <div>
            <p>Latitude: {location?.latitude}</p>
            <p>Longitude: {location?.longitude}</p>
          </div>
          {location && (
            <iframe
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "10px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${location.latitude},${location.longitude}`}
            ></iframe>
          )}
          <div className="flex gap-2">
            <label htmlFor="jadwal" className="py-2 font-medium">
              Jadwal:
            </label>
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
      <ToastContainer />
    </div>
  );
}
