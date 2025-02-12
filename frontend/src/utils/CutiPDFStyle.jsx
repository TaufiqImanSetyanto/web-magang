import { StyleSheet } from "@react-pdf/renderer";
export const styles = StyleSheet.create({
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