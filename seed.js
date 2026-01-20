const db = require('./firebase'); // make sure path is correct
const shipments = require('./shipments.json'); // we'll place your JSON in this file

async function importShipments() {
  for (const item of shipments) {
    const shipment = {
      consignmentNo: item.consignment_no.toUpperCase(),
      origin: item.origin,
      destination: item.destination,
      status: item.status,
      expectedDelivery: item.expected_delivery,
      currentLocation: item.current_location,
      latitude: item.latitude,
      longitude: item.longitude,
      timeline: JSON.parse(item.timeline) // convert from string to array
    };

    try {
      await db.collection('shipments').add(shipment);
      console.log(`✅ Added ${shipment.consignmentNo}`);
    } catch (error) {
      console.error(`❌ Error adding ${shipment.consignmentNo}:`, error.message);
    }
  }

  console.log('🎉 Seeding complete!');
}

importShipments();
