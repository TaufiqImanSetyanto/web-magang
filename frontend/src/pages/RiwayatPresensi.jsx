import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "../utils/UserPresensiThemeTable";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";

export default function RiwayatPresensi() {
  const { user } = useAuth();
  const userId = user?._id;
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [listRiwayatPresensi, setListRiwayatPresensi] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = listRiwayatPresensi.slice(indexOfFirstData, indexOfLastData);

  const totalData = listRiwayatPresensi.length;
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
        setLoadingFetch(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/presensi/riwayatpresensi/${userId}`);
        setListRiwayatPresensi(data.riwayatPresensi.reverse());
      } catch (error) {
        console.error("Error fetching presensi", error);
      } finally {
        setLoadingFetch(false);
      }
    }
    fetchPresensi();
  }, [userId]);
  return (
    <>
      <h2 className="font-bold text-xl text-gray-900">Riwayat Presensi</h2>
      {loadingFetch ? (
        <Loading />
      ) : listRiwayatPresensi.length > 0 ? (
        <Table data={data} theme={theme} layout={{ fixedHeader: true, custom: true, horizontalScroll: true }}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Hari</HeaderCell>
                  <HeaderCell>Tanggal</HeaderCell>
                  <HeaderCell>Jadwal</HeaderCell>
                  <HeaderCell>Check In</HeaderCell>
                  <HeaderCell>Check Out</HeaderCell>
                  <HeaderCell>Alamat In</HeaderCell>
                  <HeaderCell>Alamat Out</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {tableList.map((presensi) => (
                  <Row key={presensi._id} item={presensi}>
                    <Cell>{presensi.day}</Cell>
                    <Cell>{presensi.date}</Cell>
                    <Cell className="capitalize">{presensi.jadwal}</Cell>
                    <Cell>{presensi.checkInTime}</Cell>
                    <Cell>{presensi.checkOutTime}</Cell>
                    <Cell>{presensi.addressIn}</Cell>
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
