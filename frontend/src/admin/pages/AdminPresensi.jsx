import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "../../utils/AdminPresensiThemeTable";
import Loading from "../../components/Loading";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { listBagian } from "../../utils/Bagian";
import Pagination from "../../components/Pagination";

export default function AdminPresensi() {
  const [presensiList, setPresensiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBagian, setFilterBagian] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const filteredPresensiList = presensiList.filter((presensi) => {
    return (filterBagian ? presensi.userId.bagian === filterBagian : true) && (filterTanggal ? presensi.date === filterTanggal : true);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredPresensiList.slice(indexOfFirstData, indexOfLastData);

  const totalData = filteredPresensiList.length;
  const totalPages = Math.ceil(totalData / dataPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const data = { nodes: currentData };
  const theme = useTheme(getTheme);
  useEffect(() => {
    async function fetchPresensi() {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/listpresensi`);
        setPresensiList(data.presensi.reverse());
      } catch (error) {
        console.error("Error fetching presensi list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPresensi();
  }, []);
  return (
    <>
      <h2 className="font-bold text-xl text-gray-900">Riwayat Presensi</h2>
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
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="col-start-2 row-start-1 appearance-none rounded-md bg-white py-1 pr-1 pl-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
          />
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : presensiList.length > 0 ? (
        <Table data={data} theme={theme} layout={{ fixedHeader: true, custom: true, horizontalScroll: true }}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Nama</HeaderCell>
                  <HeaderCell>Bagian</HeaderCell>
                  <HeaderCell>Check In</HeaderCell>
                  <HeaderCell>Check Out</HeaderCell>
                  <HeaderCell>Hari</HeaderCell>
                  <HeaderCell>Tanggal</HeaderCell>
                  <HeaderCell>Jadwal</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {tableList.map((presensi) => (
                  <Row key={presensi._id} item={presensi}>
                    <Cell>{presensi.userId.username}</Cell>
                    <Cell>{presensi.userId.bagian}</Cell>
                    <Cell>{presensi.checkInTime}</Cell>
                    <Cell>{presensi.checkOutTime}</Cell>
                    <Cell>{presensi.day}</Cell>
                    <Cell>{presensi.date}</Cell>
                    <Cell>{presensi.jadwal}</Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      ) : (
        <p className="text-gray-600">Tidak ada data presensi.</p>
      )}
      <Pagination indexOfFirstData={indexOfFirstData} indexOfLastData={indexOfLastData} totalData={totalData} totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} />
    </>
  );
}
