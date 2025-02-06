import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import { statusColors } from "../../utils/StatusColors";

export default function AdminCuti() {
  const [cutiPendingList, setCutiPendingList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchCutiPending() {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:4000/admin/listcuti");
        setCutiPendingList(data.cutiPending.reverse());
      } catch (error) {
        console.error("Error fetching cuti list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCutiPending();
  }, []);
  async function handleDecision(id, status) {
    try {
      await axios.put(`http://localhost:4000/admin/kelolacuti/${id}`, { status });
      setCutiPendingList((prev) => prev.filter((cuti) => cuti._id !== id));
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Kelola Cuti</h2>
      {loading ? (
        <Loading />
      ) : cutiPendingList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cutiPendingList.map((cuti) => (
            <div key={cuti._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 grid grid-cols-2">
              <div>
                <p className="text-lg font-semibold text-gray-950">{cuti.username}</p>
                <p className="text-gray-900 mb-2 text-md capitalize">Jenis cuti: {cuti.jenisCuti}</p>
                <p className="text-gray-600 text-sm">Dari: {new Date(cuti.startDate).toLocaleDateString()}</p>
                <p className="text-gray-600 text-sm">Sampai: {new Date(cuti.endDate).toLocaleDateString()}</p>
                <p className="text-gray-800 mt-2 text-sm">Alasan: {cuti.reason}</p>
                <div className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full text-white bg-sky-600 mr-2">{cuti.daysRequested} Hari</div>
              </div>
              <div className="flex flex-col justify-end">
                <div className="text-center">
                  <p className="font-medium">Aksi</p>
                  <button
                    onClick={() => handleDecision(cuti._id, "accepted")}
                    className={`hover:cursor-pointer hover:bg-green-700 inline-block mt-3 mr-3 px-3 py-1 text-xs font-medium rounded-full text-white capitalize ${statusColors["accepted"]}`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecision(cuti._id, "rejected")}
                    className={`hover:cursor-pointer hover:bg-red-700 inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full text-white capitalize ${statusColors["rejected"]}`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Tidak ada data pengajuan cuti.</p>
      )}
    </div>
  );
}
