const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./firebase"); // Firebase setup

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("."));

// Serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/tracking.html", (req, res) => {
  res.sendFile(path.join(__dirname, "tracking.html"));
});

// Admin users (hardcoded)
const adminUsers = [
  { username: "Vikas", password: "Vikas" },
  { username: "Anshul", password: "Anshul" },
  { username: "Sujal", password: "Sujal" },
  { username: "Rahil", password: "Rahil" },
];

// API: Track shipment
app.post("/api/track", async (req, res) => {
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

    const shipment = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    res.json({ success: true, shipment });
  } catch (error) {
    console.error("Error tracking shipment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API: Admin login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const isValidUser = adminUsers.some(
    (user) => user.username === username && user.password === password
  );

  if (isValidUser) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});

// API: Update or create shipment
app.post("/api/admin/update", async (req, res) => {
  try {
    const {
      consignmentNo,
      origin,
      destination,
      dispatchDate,
      currentLocation,
      status,
      expectedDelivery,
      timeline,
    } = req.body;

    if (
      !consignmentNo ||
      !origin ||
      !destination ||
      !dispatchDate ||
      !currentLocation ||
      !status ||
      !expectedDelivery ||
      !timeline
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const snapshot = await db
      .collection("shipments")
      .where("consignmentNo", "==", consignmentNo.toUpperCase())
      .limit(1)
      .get();

    let docRef;
    let shipmentData;

    const newEntry = {
      location: currentLocation,
      time: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      description: `Location updated: ${currentLocation}`,
      completed: true,
    };

    if (snapshot.empty) {
      // New shipment
      shipmentData = {
        consignmentNo: consignmentNo.toUpperCase(),
        origin,
        destination,
        status,
        dispatchDate,
        expectedDelivery,
        currentLocation,
        latitude: 23.5937, // default
        longitude: 78.9629,
        timeline: [newEntry],
      };
      docRef = await db.collection("shipments").add(shipmentData);
    } else {
      // Update existing
      docRef = snapshot.docs[0].ref;
      const oldData = snapshot.docs[0].data();
      shipmentData = {
        ...oldData,
        origin,
        destination,
        status,
        dispatchDate,
        expectedDelivery,
        currentLocation,
        timeline: [...oldData.timeline, newEntry],
      };
      await docRef.set(shipmentData);
    }

    res.json({
      success: true,
      message: "Shipment saved",
      shipment: shipmentData,
    });
  } catch (error) {
    console.error("Error updating shipment:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// API: Get all shipments
app.get("/api/admin/shipments", async (req, res) => {
  try {
    const snapshot = await db.collection("shipments").get();
    const shipments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ success: true, shipments });
  } catch (error) {
    console.error("Error getting shipments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("🔐 Admin Users:");
  adminUsers.forEach(({ username }) => console.log(`- ${username}`));
});
