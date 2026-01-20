const db = require("./firebase"); // your firebase config and initialization

async function verifyShipments() {
  try {
    const snapshot = await db.collection("shipments").get();
    if (snapshot.empty) {
      console.log("No shipments found!");
      return;
    }
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (err) {
    console.error("Error fetching shipments:", err);
  }
}

verifyShipments();
