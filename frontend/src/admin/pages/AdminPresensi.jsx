import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "../../utils/AdminPresensiThemeTable";
import Loading from "../../components/Loading";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Pagination from "../../components/Pagination";
import * as XLSX from "xlsx";

export default function AdminPresensi() {
  const [presensiList, setPresensiList] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [listBagian, setListBagian] = useState([]);
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
    async function fetchBagian() {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/data/listbagian`);
        setListBagian(data.bagian);
      } catch (error) {
        console.error("Error fetching bagian data:", error);
      }
    }
    async function fetchPresensi() {
      try {
        setLoadingFetch(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/listpresensi`);
        setPresensiList(data.presensi.reverse());
      } catch (error) {
        console.error("Error fetching presensi list:", error);
      } finally {
        setLoadingFetch(false);
      }
    }
    fetchBagian();
    fetchPresensi();
  }, []);

  const handleDownload = () => {
    const headers = [
      { header: "Nama", key: "userId.username" },
      { header: "Bagian", key: "userId.bagian" },
      { header: "Hari", key: "day" },
      { header: "Tanggal", key: "date" },
      { header: "Jadwal", key: "jadwal" },
      { header: "Check In", key: "checkInTime" },
      { header: "Latitude In", key: "locationIn.latitude" },
      { header: "Longitude In", key: "locationIn.longitude" },
      { header: "Lokasi In", key: "addressIn" },
      { header: "Check Out", key: "checkOutTime" },
      { header: "Latitude Out", key: "locationOut.latitude" },
      { header: "Longitude Out", key: "locationOut.longitude" },
      { header: "Lokasi Out", key: "addressOut" },
    ];

    const dataWithHeaders = filteredPresensiList.map((item) => {
      const newItem = {};
      headers.forEach(({ header, key }) => {
        const keys = key.split(".");
        newItem[header] = keys.reduce((acc, curr) => acc && acc[curr], item);
      });
      return newItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataWithHeaders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Presensi");
    XLSX.writeFile(workbook, "presensi.xlsx");
  };

  return (
    <>
      <h2 className="font-bold text-xl text-gray-900">Riwayat Presensi</h2>
      <div>
        <h3 className="block text-md/6 font-medium text-gray-900">Filter</h3>
        <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 ">
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
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="col-start-2 row-start-1 appearance-none rounded-md bg-white py-1 pr-1 pl-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
          />
          <div className="col-start-6 flex justify-end row-start-1">
            <button onClick={handleDownload} className="hover:cursor-pointer hover:bg-sky-700 py-0.5 px-3 text-white bg-sky-800 rounded text-sm">
              Download
            </button>
          </div>
        </div>
      </div>
      {loadingFetch ? (
        <Loading />
      ) : presensiList.length > 0 ? (
        <Table data={data} theme={theme} layout={{ fixedHeader: true, custom: true, horizontalScroll: true }}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Nama</HeaderCell>
                  <HeaderCell>Bagian</HeaderCell>
                  <HeaderCell>Hari</HeaderCell>
                  <HeaderCell>Tanggal</HeaderCell>
                  <HeaderCell>Jadwal</HeaderCell>
                  <HeaderCell>Check In</HeaderCell>
                  <HeaderCell>Lokasi In</HeaderCell>
                  <HeaderCell>Check Out</HeaderCell>
                  <HeaderCell>Lokasi Out</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {tableList.map((presensi) => (
                  <Row key={presensi._id} item={presensi}>
                    <Cell>{presensi.userId.username}</Cell>
                    <Cell>{presensi.userId.bagian}</Cell>
                    <Cell>{presensi.day}</Cell>
                    <Cell>{presensi.date}</Cell>
                    <Cell>{presensi.jadwal}</Cell>
                    <Cell>{presensi.checkInTime}</Cell>
                    <Cell>{presensi.addressIn}</Cell>
                    <Cell>{presensi.checkOutTime}</Cell>
                    <Cell>{presensi.addressOut}</Cell>
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
