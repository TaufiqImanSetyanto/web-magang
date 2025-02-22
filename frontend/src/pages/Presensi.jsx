import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import { ChevronDownIcon, ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import Loading from "../components/Loading";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../components/HandleNotif";
import Spinner from "../components/Spinner";

export default function Presensi() {
  const { user } = useAuth();
  const userId = user._id;
  const [location, setLocation] = useState();
  const [officeLocation, setOfficeLocation] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingCheckOut, setLoadingCheckOut] = useState(false);
  const [jadwal, setJadwal] = useState("");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString("id-ID"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString("id-ID"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const fetchOffice = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/data/listoffice`);
        setOfficeLocation(data.office);
      } catch (error) {
        console.error("Error fetching office data:", error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            setLoadingFetch(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLoadingFetch(false);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser");
        setLoadingFetch(false);
      }
    };
    fetchOffice();
    getLocation();
  }, []);
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

  const getAddress = async (latitude, longitude) => {
    try {
      const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
      return data.results[7]?.formatted_address || "Alamat tidak ditemukan";
    } catch (error) {
      console.error("Error getting address:", error);
      return "Error saat mengambil alamat";
    }
  };

  const handleCheckIn = async () => {
    if (!jadwal) {
      handleError("Pilih jadwal terlebih dahulu");
      return;
    }
    setLoadingCheckIn(true);
    if (jadwal !== "dinas kebun" && jadwal !== "dinas luar") {
      const nearestOffice = officeLocation.reduce((prev, curr) => {
        const prevDistance = calculateDistance(location.latitude, location.longitude, prev.latitude, prev.longitude);
        const currDistance = calculateDistance(location.latitude, location.longitude, curr.latitude, curr.longitude);
        return prevDistance < currDistance ? prev : curr;
      });
      const distance = calculateDistance(location.latitude, location.longitude, nearestOffice.latitude, nearestOffice.longitude);
      if (distance > nearestOffice.allowedDistance) {
        setLoadingCheckIn(false);
        handleError("Kamu terlalu jauh dari kantor untuk check-in");
        return;
      }
    }
    try {
      const addressIn = await getAddress(location.latitude, location.longitude);
      const checkIn = {
        userId,
        jadwal,
        locationIn: location,
        addressIn,
      };
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/presensi/checkin`, checkIn);
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
      setLoadingCheckIn(false);
    }
  };

  const handleCheckOut = async () => {
    setLoadingCheckOut(true);
    if (jadwal !== "dinas kebun" && jadwal !== "dinas luar") {
      const nearestOffice = officeLocation.reduce((prev, curr) => {
        const prevDistance = calculateDistance(location.latitude, location.longitude, prev.latitude, prev.longitude);
        const currDistance = calculateDistance(location.latitude, location.longitude, curr.latitude, curr.longitude);
        return prevDistance < currDistance ? prev : curr;
      });
      const distance = calculateDistance(location.latitude, location.longitude, nearestOffice.latitude, nearestOffice.longitude);
      if (distance > nearestOffice.allowedDistance) {
        setLoadingCheckOut(false);
        handleError("Kamu terlalu jauh dari kantor untuk check-out");
        return;
      }
    }
    try {
      const addressOut = await getAddress(location.latitude, location.longitude);
      const checkOut = {
        userId,
        locationOut: location,
        addressOut,
      };
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/presensi/checkout`, checkOut);
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
      setLoadingCheckOut(false);
    }
  };
  return (
    <div>
      <h2 className="font-bold text-xl text-gray-900">Presensi</h2>
      {loadingFetch ? (
        <Loading />
      ) : (
        <div className="mb-5 space-y-2">
          <div className="sm:flex sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <p>Latitude: {location?.latitude}</p>
              <p>Longitude: {location?.longitude}</p>
            </div>
            <div className="flex self-center">
              <div className="border-2 rounded-md border-sky-500 flex gap-2 p-1 text-lg text-sky-600 font-bold">
                <div>{currentTime.split(",")[0]}</div>
                <div>{currentTime.split(",")[1]}</div>
              </div>
            </div>
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
            <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              <select
                id="jadwal"
                value={jadwal}
                onChange={(e) => setJadwal(e.target.value)}
                className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
              >
                <option value="07:00 - 15:00">07:00 - 15:00</option>
                <option value="07:00 - 12:00">07:00 - 12:00</option>
                <option value="Shift Pagi">Shift Pagi</option>
                <option value="Shift Siang">Shift Siang</option>
                <option value="Shift Malam">Shift Malam</option>
                <option value="Dinas Kebun">Dinas Kebun</option>
                <option value="Dinas Luar">Dinas Luar</option>
              </select>
              <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
            </div>
          </div>
          <div className="flex gap-2">
            <ExclamationTriangleIcon className="size-6 text-yellow-500" />
            <p className="text-yellow-500 font-bold text-sm">Hanya bisa 1 kali check-in ataupun check-out perhari</p>
          </div>
          <div className="flex space-x-10">
            <button onClick={handleCheckIn} disabled={loadingCheckIn || loadingCheckOut} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
              {loadingCheckIn ? <Spinner /> : "Check In"}
            </button>
            <button onClick={handleCheckOut} disabled={loadingCheckIn || loadingCheckOut} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
              {loadingCheckOut ? <Spinner /> : "Check Out"}
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
