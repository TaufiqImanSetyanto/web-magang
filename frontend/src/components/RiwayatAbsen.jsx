import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "../utils/UserAbsenThemeTable";
import Loading from "./Loading";

export default function RiwayatAbsen() {
  const { user } = useAuth();
  const userId = user?._id;
  const [loading, setLoading] = useState(true);
  const [listRiwayatAbsen, setListRiwayatAbsen] = useState([]);
  const data = { nodes: listRiwayatAbsen };
  const theme = useTheme(getTheme);
  useEffect(() => {
    async function fetchAbsen() {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:4000/absen/riwayatabsen/${userId}`);
        setListRiwayatAbsen(data.riwayatAbsen.reverse());
      } catch (error) {
        console.error("Error fetching absen",error);
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
                    <Cell className="capitalize">{absen.jadwal}</Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      ) : (
        <p className="text-gray-600">Tidak ada data absen.</p>
      )}
    </>
  );
}
