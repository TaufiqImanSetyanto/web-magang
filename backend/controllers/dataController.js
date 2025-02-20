const { Bagian, Office } = require("../models/dataModel");

async function listBagian(req, res) {
  try {
    const bagian = await Bagian.find();
    if (!bagian) {
      res.status(404).json({ message: "Bagian not found" });
    }
    res.status(200).json({ success: true, bagian });
  } catch (error) {
    console.log(error);
  }
}
async function listOffice(req,res) {
  try {
    const office = await Office.find();
    if (!office) {
      res.status(404).json({ message: "Office not found" });
    }
    res.status(200).json({ success: true, office });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listBagian, listOffice };