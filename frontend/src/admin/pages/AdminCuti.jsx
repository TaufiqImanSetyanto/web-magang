import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import { statusColors } from "../../utils/StatusColors";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "../../utils/AdminThemeTable";

export default function AdminCuti() {
  const [cutiPendingList, setCutiPendingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const data = { nodes: cutiPendingList };
  const theme = useTheme(getTheme);
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
                      <div className="grid grid-flow-col gap-2">
                        <button onClick={() => handleDecision(cuti._id, "accepted")} className={`hover:cursor-pointer hover:bg-green-600 hover:text-white border rounded text-sm  ${statusColors["accepted"]}`}>
                          Accept
                        </button>
                        <button onClick={() => handleDecision(cuti._id, "rejected")} className={`hover:cursor-pointer hover:bg-red-600 hover:text-white border rounded text-sm  ${statusColors["rejected"]}`}>
                          Reject
                        </button>
                      </div>{" "}
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      ) : (
        <p className="text-gray-600">Tidak ada data pengajuan cuti.</p>
      )}
    </div>
  );
}
