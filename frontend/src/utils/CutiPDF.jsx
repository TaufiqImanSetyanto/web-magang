/* eslint-disable react/prop-types */
import { Page, Text, View, Document, Image, Line, Svg } from "@react-pdf/renderer";
import logo from "../assets/ptsgn_logo.png";
import {styles} from "./CutiPDF";

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
              <Text>{user.bagian}</Text>
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
                <Text key={date.id}>{new Date(date.date).toLocaleDateString()}</Text>
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
              <Text>{user.hakCuti.tahunan} Hari</Text>
              <Text>{user.hakCuti.panjang} Hari</Text>
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
        <View style={styles.approvedBox}>
          <Text>DISETUJUI</Text>
        </View>
      </Page>
    </Document>
  );
};
