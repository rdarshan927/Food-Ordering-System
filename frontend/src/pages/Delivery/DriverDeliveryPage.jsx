// Install these first:
// npm install react-leaflet leaflet
// Add `@import 'leaflet/dist/leaflet.css';` in index.css or App.css

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DriverDeliveryPage = ({ driverId }) => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [delivery, setDelivery] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch assigned delivery on mount
  useEffect(() => {
    availableDeliveries();
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          fetch('http://localhost:8081/api/delivery/update-location', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
             },
            body: JSON.stringify({ driverId, latitude, longitude }),
          });
          console.log("happening");
        },
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true }
      );
    }, 1000); // 🔁 update every 5 seconds

    return () => clearInterval(intervalId); // Cleanup
  }, [driverId]);

  const availableDeliveries = () => {
    fetch(`http://localhost:8081/api/delivery/by-driver/${driverId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDelivery(data))
      .catch(err => console.error('Failed to load delivery', err));
  };

  const markAsDelivered = () => {
    fetch(`http://localhost:8081/api/delivery/mark-delivered/${driverId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => alert('Delivery marked as delivered!'))
      .catch(() => alert('Failed to update delivery status.'));

    availableDeliveries();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 className='text-red-600'>Driver Delivery Page</h2>

      {delivery ? (
        <div>
          <p><strong>Order ID:</strong> {delivery.orderId}</p>
          <p><strong>Status:</strong> {delivery.isDelivered ? 'Delivered' : 'In Progress'}</p>

          <div style={{ height: '400px', width: '100%', marginTop: '1rem' }}>
            <MapContainer center={[location.latitude, location.longitude]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>You are here</Popup>
              </Marker>
              <Marker position={[delivery.latitude, delivery.longitude]}>
                <Popup>Delivery Destination</Popup>
              </Marker>
            </MapContainer>
          </div>

          {!delivery.isDelivered && (
            <button onClick={markAsDelivered} style={{ marginTop: '1rem' }}>
              Mark as Delivered
            </button>
          )}
          
        </div>
      ) : (
        <p>No delivery assigned.</p>
      )}
    </div>
  );
};

export default DriverDeliveryPage;
