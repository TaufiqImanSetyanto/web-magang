import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "../utils/UserAbsenThemeTable";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";

export default function RiwayatAbsen() {
  const { user } = useAuth();
  const userId = user?._id;
  const [loading, setLoading] = useState(true);
  const [listRiwayatAbsen, setListRiwayatAbsen] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = listRiwayatAbsen.slice(indexOfFirstData, indexOfLastData);

  const totalData = listRiwayatAbsen.length;
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
    async function fetchAbsen() {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/absen/riwayatabsen/${userId}`);
        setListRiwayatAbsen(data.riwayatAbsen.reverse());
      } catch (error) {
        console.error("Error fetching absen", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAbsen();
  }, [userId]);
  return (
    <>
      <h2 className="font-bold text-xl text-gray-900">Riwayat Absen</h2>
      {loading ? (
        <Loading />
      ) : listRiwayatAbsen.length > 0 ? (
        <Table data={data} theme={theme} layout={{ fixedHeader: true, custom: true, horizontalScroll: true }}>
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Check In</HeaderCell>
                  <HeaderCell>Check Out</HeaderCell>
                  <HeaderCell>Hari</HeaderCell>
                  <HeaderCell>Tanggal</HeaderCell>
                  <HeaderCell>Jadwal</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {tableList.map((absen) => (
                  <Row key={absen._id} item={absen}>
                    <Cell>{absen.checkInTime}</Cell>
                    <Cell>{absen.checkOutTime}</Cell>
                    <Cell>{absen.day}</Cell>
                    <Cell>{absen.date}</Cell>
                    <Cell>{absen.jadwal}</Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      ) : (
        <p className="text-gray-600">Tidak ada data absen.</p>
      )}
      <Pagination indexOfFirstData={indexOfFirstData} indexOfLastData={indexOfLastData} totalData={totalData} totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} />
    </>
  );
}
