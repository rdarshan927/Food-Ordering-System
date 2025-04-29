// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { useParams } from 'react-router-dom';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import redIconUrl from '../../assets/marker-red.png';
// import greenIconUrl from '../../assets/marker-green.webp';
// import blueIconUrl from '../../assets/marker-blue.webp';

// const redIcon = new L.Icon({
//   iconUrl: redIconUrl,
//   shadowUrl: markerShadow,
//   iconSize: [35, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

// const greenIcon = new L.Icon({
//   iconUrl: greenIconUrl,
//   shadowUrl: markerShadow,
//   iconSize: [35, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

// const blueIcon = new L.Icon({
//   iconUrl: blueIconUrl,
//   shadowUrl: markerShadow,
//   iconSize: [35, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

// // Fix icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// const CustomerTrackingPage = () => {
//   const [delivery, setDelivery] = useState(null);
//   const token = localStorage.getItem("token");
//   const { orderId } = useParams();

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//         fetch(`http://localhost:8081/api/delivery/by-order/${orderId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//         })
//         .then(res => res.json())
//         .then(data => setDelivery(data))
//         .catch(err => console.error('Failed to fetch delivery data', err));

//     }, 5000);

//     return () => clearInterval(intervalId);
//   }, [orderId]);

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold text-blue-600 mb-4">Track Your Delivery</h2>

//       {delivery ? (
//         <div className="bg-white p-4 rounded shadow-lg">
//           <div className="mb-2">
//             <p><strong>Order ID:</strong> {delivery.orderId}</p>
//             <p><strong>Status:</strong> <span className={delivery.isDelivered ? 'text-green-600' : 'text-yellow-500'}>
//               {delivery.isDelivered ? 'Delivered' : 'On the Way'}
//             </span></p>
//           </div>

//           <div className="h-[600px] w-full rounded overflow-hidden mb-4 border">
//             <MapContainer
//               center={[delivery.destinationLatitude, delivery.destinationLongitude]}
//               zoom={15}
//               className="h-full w-full"
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; OpenStreetMap contributors'
//               />
//               <Marker position={[delivery.shopLatitude, delivery.shopLongitude]} icon={greenIcon}>
//                 <Popup>Shop Location</Popup>
//               </Marker>
//               <Marker position={[delivery.destinationLatitude, delivery.destinationLongitude]} icon={blueIcon}>
//                 <Popup>Your Location</Popup>
//               </Marker>
//               <Marker position={[delivery.driverLatitude, delivery.driverLongitude]} icon={redIcon}>
//                 <Popup>Driver Current Location</Popup>
//               </Marker>
//             </MapContainer>
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-600">Tracking info not available for this order.</p>
//       )}
//     </div>
//   );
// };

// export default CustomerTrackingPage;
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useParams } from 'react-router-dom';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import redIconUrl from '../../assets/marker-red.png';
import greenIconUrl from '../../assets/marker-green.webp';
import blueIconUrl from '../../assets/marker-blue.webp';

const redIcon = new L.Icon({
  iconUrl: redIconUrl,
  shadowUrl: markerShadow,
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const greenIcon = new L.Icon({
  iconUrl: greenIconUrl,
  shadowUrl: markerShadow,
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const blueIcon = new L.Icon({
  iconUrl: blueIconUrl,
  shadowUrl: markerShadow,
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const DriverLabelIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="background: red; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-bottom: 2px;">
        Driver
      </div>
      <img src="${redIconUrl}" style="width: 35px; height: 41px;" />
    </div>
  `,
  iconSize: [35, 41],
  iconAnchor: [17, 41],
});

const ShopLabelIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="background: green; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-bottom: 2px;">
        Shop
      </div>
      <img src="${greenIconUrl}" style="width: 35px; height: 41px;" />
    </div>
  `,
  iconSize: [35, 41],
  iconAnchor: [17, 41],
});

const YourLabelIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="background: blue; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-bottom: 2px;">
        You
      </div>
      <img src="${blueIconUrl}" style="width: 35px; height: 41px;" />
    </div>
  `,
  iconSize: [35, 41],
  iconAnchor: [17, 41],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CustomerTrackingPage = () => {
  const [delivery, setDelivery] = useState(null);
  const token = localStorage.getItem("token");
  const { orderId } = useParams();
  const userId = localStorage.getItem("userId");

  const mapRef = useRef();

  useEffect(() => {
    console.log(userId, orderId);
    const intervalId = setInterval(() => {
      fetch(`http://localhost:8081/api/delivery/by-order/${orderId}?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          console.log('Fetched data:', data);
          setDelivery(data);  
        })
        .catch(err => console.error('Failed to fetch delivery data', err));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [orderId, userId, token]);

  useEffect(() => {
    if (delivery && mapRef.current) {
      const bounds = [
        [delivery.shopLatitude, delivery.shopLongitude],
        [delivery.destinationLatitude, delivery.destinationLongitude],
        [delivery.driverLatitude, delivery.driverLongitude]
      ];

      mapRef.current.fitBounds(bounds);
    }
  }, [delivery]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 py-10 px-4">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">📦 Track Your Delivery</h2>

        {delivery ? (
          <>
            <div className="mb-6 text-center">
              <p className="text-lg font-medium text-gray-700">
                <strong className="text-blue-700">Order ID:</strong> {delivery.orderId}
              </p>
              <p className="text-lg font-medium text-gray-700">
                <strong className="text-blue-700">Status:</strong>{' '}
                <span className={delivery.isDelivered ? 'text-green-600' : 'text-yellow-500'}>
                  {delivery.isDelivered ? 'Delivered ✅' : 'On the Way 🚚'}
                </span>
              </p>
            </div>

            <div className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-300 shadow">
              <MapContainer
                center={[delivery.destinationLatitude, delivery.destinationLongitude]}
                zoom={15}
                className="h-full w-full"
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                {delivery.shopLatitude && delivery.shopLongitude && (
                  <Marker position={[delivery.shopLatitude, delivery.shopLongitude]} icon={ShopLabelIcon}>
                    <Popup>Shop Location</Popup>
                  </Marker>
                )}

                {delivery.destinationLatitude && delivery.destinationLongitude && (
                  <Marker position={[delivery.destinationLatitude, delivery.destinationLongitude]} icon={YourLabelIcon}>
                    <Popup>Your Location</Popup>
                  </Marker>
                )}

                {delivery.driverLatitude && delivery.driverLongitude && (
                  <Marker position={[delivery.driverLatitude, delivery.driverLongitude]} icon={DriverLabelIcon}>
                    <Popup>Driver Current Location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center text-lg">Tracking info not available for this order.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerTrackingPage;
