import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { getTheme } from "../../utils/AdminCutiThemeTable";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { CutiPDF } from "../../utils/CutiPDF";

export default function RiwayatCuti() {
  const [cutiList, setCutiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterJenis, setFilterJenis] = useState("");
  const [filterTahun, setFilterTahun] = useState("");

  const filteredCutiList = cutiList.filter((cuti) => {
    const tahunCuti = new Date(cuti.dates[0]?.date).getFullYear().toString();
    return (filterJenis ? cuti.jenisCuti.split(' ')[0] === filterJenis : true) && (filterTahun ? tahunCuti === filterTahun : true);
  });

  const data = { nodes: filteredCutiList };
  const theme = useTheme(getTheme);
  useEffect(() => {
    async function fetchCuti() {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:4000/admin/riwayatcuti`);
        setCutiList(data.acceptedCuti.reverse());
      } catch (error) {
        console.error("Error fetching cuti list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCuti();
  }, []);

  async function handleDownloadCutiPDF(cuti) {
    try {
      const { data } = await axios.get(`http://localhost:4000/admin/user/${cuti.userId}`);
      const { user } = data;
      const blob = await pdf(<CutiPDF cuti={cuti} user={user} />).toBlob();
      saveAs(blob, `Permohonancuti_${cuti.username}_${cuti.dates[0]?.date}.pdf`);
    } catch (error) {
      console.error("Gagal mengunduh PDF:", error);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Riwayat Cuti yang di Setujui</h2>
      <div>
        <h3 className="block text-md/6 font-medium text-gray-900">Filter</h3>
        <div className="mt-1 grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
          >
            <option value={""}>Jenis</option>
            <option value={"tahunan"}>Tahunan</option>
            <option value={"panjang"}>Panjang</option>
          </select>
          <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(e.target.value)}
            className="col-start-2 row-start-1 appearance-none rounded-md bg-white py-1 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
          >
            <option value={""}>Tahun</option>
            {[...new Set(cutiList.map((cuti) => new Date(cuti.dates[0]?.date).getFullYear().toString()))].map((tahun) => (
              <option key={tahun} value={tahun}>
                {tahun}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none col-start-2 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : cutiList.length > 0 ? (
        <Table data={data} theme={theme} layout={{ fixedHeader: true, custom: true, horizontalScroll: true }}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Nama</HeaderCell>
                  <HeaderCell>Jenis Cuti</HeaderCell>
                  <HeaderCell>Tanggal</HeaderCell>
                  <HeaderCell>Alasan</HeaderCell>
                  <HeaderCell>Durasi</HeaderCell>
                  <HeaderCell>Aksi</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {tableList.map((cuti) => (
                  <Row key={cuti._id} item={cuti}>
                    <Cell>{cuti.username}</Cell>
                    <Cell className="capitalize">{cuti.jenisCuti}</Cell>
                    <Cell>
                      {cuti.dates.map((date) => (
                        <div key={date.id}>{new Date(date.date).toLocaleDateString()}</div>
                      ))}
                    </Cell>
                    <Cell>{cuti.reason}</Cell>
                    <Cell>{cuti.daysRequested} Hari</Cell>
                    <Cell>
                      <button onClick={() => handleDownloadCutiPDF(cuti)} className="hover:cursor-pointer hover:bg-sky-700 py-0.5 px-3 text-white bg-sky-800 rounded text-sm">
                        Download PDF
                      </button>
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      ) : (
        <p className="text-gray-600">Tidak ada data cuti.</p>
      )}
    </div>
  );
}
