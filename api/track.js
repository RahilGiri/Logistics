// handler.js or pages/api/shipment.js (if Next.js)
const db = require("./firebase"); // adjust path to your firebase.js

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { consignmentNo } = req.body;
    if (!consignmentNo) {
      return res.status(400).json({ error: "Consignment number is required" });
    }

    const snapshot = await db
      .collection("shipments")
      .where("consignmentNo", "==", consignmentNo.toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    const shipmentDoc = snapshot.docs[0];
    const shipment = { id: shipmentDoc.id, ...shipmentDoc.data() };

    res.status(200).json(shipment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
