/* eslint-disable react/prop-types */
import { Page, Text, View, Document, Image, Line, Svg, StyleSheet } from "@react-pdf/renderer";
import logo from "../assets/ptsgn_logo.png";
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Times-Roman",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    marginLeft: -50,
    width: 50,
    alignSelf: "center",
    marginBottom: 5,
  },
  companySection: {
    marginTop: 5,
    fontSize: 15,
    flexDirection: "column",
    justifyContent: "center",
  },
  subCompanyName: {
    marginBottom: 5,
    alignSelf: "center",
  },
  line: {
    width: 530,
    height: 10,
    marginTop: -20,
  },
  title: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    textDecoration: "underline",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    fontSize: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dot: {
    flexDirection: "column",
    width: "10%",
  },
  column: {
    flexDirection: "column",
    width: "100%",
  },
  center: {
    textAlign: "center",
  },
  gap: {
    marginVertical: 30,
  },
  approvedBox: {
    marginRight: 20,
    width: 90,
    alignSelf: "flex-end",
    color: "green",
    padding: 10,
    fontSize: 12,
    border: 1,
    borderColor: "green",
    textAlign: "center",
  },
});

export const CutiPDF = ({ cuti, user }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.image} />
          <View style={styles.companySection}>
            <Text>PT SINERGI GULA NUSANTARA</Text>
            <Text style={styles.subCompanyName}>PG. SRAGI</Text>
          </View>
        </View>
        <Svg style={styles.line}>
          <Line x1="0" y1="0" x2="800" y2="0" strokeWidth={2} stroke="rgb(0,0,0)" />
        </Svg>
        <Text style={styles.title}>SURAT PERMOHONAN CUTI</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text>Nama</Text>
              <Text>Bagian</Text>
            </View>
            <View style={styles.dot}>
              <Text>:</Text>
              <Text>:</Text>
            </View>
            <View style={styles.column}>
              <Text>{user.username}</Text>
              <Text>{user.bagian.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text>Tanggal permohonan cuti</Text>
            </View>
            <View style={styles.dot}>
              <Text>:</Text>
            </View>
            <View style={styles.column}>
              {cuti.dates.map((date) => (
                <Text key={date.id}>{date.date}</Text>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text>Jenis cuti yang diambil</Text>
            </View>
            <View style={styles.dot}>
              <Text>:</Text>
            </View>
            <View style={styles.column}>
              <Text style={{ textTransform: "capitalize" }}>{cuti.jenisCuti}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text>Sisa hak cuti</Text>
              <Text>Tahunan {user.tahunCuti.tahunan}</Text>
              <Text>Panjang {user.tahunCuti.panjang}</Text>
            </View>
            <View style={styles.dot}>
              <Text> </Text>
              <Text>:</Text>
              <Text>:</Text>
            </View>
            <View style={styles.column}>
              <Text> </Text>
              <Text>{cuti.sisaCuti.tahunan} Hari</Text>
              <Text>{cuti.sisaCuti.panjang} Hari</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text>Alasan</Text>
            </View>
            <View style={styles.dot}>
              <Text>:</Text>
            </View>
            <View style={styles.column}>
              <Text>{cuti.reason}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}></View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.center}>Manajer</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.center}>Asisten</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.center}>Diwakilkan Kepada</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.center}>Pemohon</Text>
            </View>
          </View>
        </View>
        <View style={styles.gap}></View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.center}>{cuti.manajer}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.center}>{cuti.asisten}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.center}>{cuti.diwakilkan}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.center}>{user.username}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
