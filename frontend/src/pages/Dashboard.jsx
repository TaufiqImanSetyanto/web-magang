import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import Loading from "../components/Loading"
import { statusColors } from "../utils/StatusColors";

export default function Dashboard() {
  const { user } = useAuth();
  const userId = user?._id;
  const [cutiList, setCutiList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchCuti() {
      try {
        setLoading(true)
        const { data } = await axios.get(`http://localhost:4000/cuti/riwayatcuti/${userId}`);
        setCutiList(data.cuti.reverse());
      } catch (error) {
        console.error("Error fetching cuti list:", error);
      } finally {
        setLoading(false)
      }
    }
    fetchCuti();
  }, [userId]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:col-start-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center mb-3">
        <p className="text-lg font-semibold text-gray-950">Sisa hak cuti</p>
        <p className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded text-white bg-sky-600 mr-2">Tahunan : {user.hakCuti.tahunan} Hari</p>
        <p className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded text-white bg-sky-600 mr-2">Panjang : {user.hakCuti.panjang} Hari</p>
      </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Riwayat Cuti</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <Loading/> :(
        cutiList.length > 0 ? (
          cutiList.map((cuti) => (
            <div key={cuti._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <p className="text-lg font-semibold text-gray-950 capitalize">{cuti.jenisCuti}</p>
              <p className="text-gray-600 text-sm">Dari: {new Date(cuti.startDate).toLocaleDateString()}</p>
              <p className="text-gray-600 text-sm">Sampai: {new Date(cuti.endDate).toLocaleDateString()}</p>
              <p className="text-gray-800 mt-2 text-sm">Alasan: {cuti.reason}</p>
              <div className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full text-white bg-sky-600 mr-2">{cuti.daysRequested} Hari</div>
              <div className={`inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full text-white capitalize ${statusColors[cuti.status]}`}>{cuti.status}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Tidak ada data cuti.</p>
        ))}
      </div>
    </div>
  );
}
