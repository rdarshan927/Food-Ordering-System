// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// // import './fix-leaflet-icons'; // or wherever the file is located///


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


// // Override default icon paths
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });


// const DriverDeliveryPage = ({ driverId }) => {
//   const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
//   const [delivery, setDelivery] = useState(null);
//   const token = localStorage.getItem("token");

//   // Fetch assigned delivery once on mount
//   useEffect(() => {
//     availableDeliveries();
//   }, []);

//   // Periodically update driver location
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//           console.log('hello');

//           fetch('http://localhost:8081/api/delivery/update-location', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ driverId, latitude, longitude }),
//           });
//         },
//         (error) => console.error('Location error:', error),
//         { enableHighAccuracy: true }
//       );
//     }, 5000);

//     return () => clearInterval(intervalId);
//   }, [driverId]);

//   const availableDeliveries = () => {
//     fetch(`http://localhost:8081/api/delivery/by-driver/${driverId}`, {
//       headers: { 'Authorization': `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(data => setDelivery(data))
//       .catch(err => console.error('Failed to load delivery', err));
//   };

//   const markAsDelivered = () => {
//     fetch(`http://localhost:8081/api/delivery/mark-delivered/${driverId}`, {
//       method: 'POST',
//       headers: { 'Authorization': `Bearer ${token}` }
//     })
//       .then(() => {
//         alert('Delivery marked as delivered!');
//         setDelivery(prev => ({ ...prev, isDelivered: true }));
//       })
//       .catch(() => alert('Failed to update delivery status.'));
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold text-red-600 mb-4">Driver Delivery Page</h2>

//       {delivery ? (
//         <div className="bg-white p-4 rounded shadow-lg">
//           <div className="mb-2">
//             <p><strong>Order ID:</strong> {delivery.orderId}</p>
//             <p><strong>Status:</strong> <span className={delivery.isDelivered ? 'text-green-600' : 'text-yellow-500'}>
//               {delivery.isDelivered ? 'Delivered' : 'In Progress'}
//             </span></p>
//           </div>

//           <div className="h-[600px] w-full rounded overflow-hidden mb-4 border">
//             {location.latitude !== 0 && location.longitude !== 0 && (
//               <MapContainer
//                 center={[location.latitude, location.longitude]}
//                 zoom={15}
//                 className="h-full w-full"
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; OpenStreetMap contributors'
//                 />
//                 <Marker position={[delivery.shopLatitude, delivery.shopLongitude]} icon={greenIcon}>
//                   <Popup>Shop Location</Popup>
//                 </Marker>
//                 <Marker position={[delivery.destinationLatitude, delivery.destinationLongitude]} icon={blueIcon}>
//                   <Popup>Customer (Delivery Destination)</Popup>
//                 </Marker>
//                 <Marker position={[delivery.driverLatitude, delivery.driverLongitude]} icon={redIcon}>
//                   <Popup>Driver Location</Popup>
//                 </Marker>
//               </MapContainer>
//             )}
//           </div>

//           {!delivery.isDelivered && (
//             <button
//               onClick={markAsDelivered}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//             >
//               Mark as Delivered
//             </button>
//           )}
//         </div>
//       ) : (
//         <p className="text-gray-600">No delivery assigned.</p>
//       )}
//     </div>
//   );
// };

// export default DriverDeliveryPage;
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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


const CustomerLabelIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="background: blue; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-bottom: 2px;">
        Customer
      </div>
      <img src="${blueIconUrl}" style="width: 35px; height: 41px;" />
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

const DriverLabelIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="background: red; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-bottom: 2px;">
        You
      </div>
      <img src="${redIconUrl}" style="width: 35px; height: 41px;" />
    </div>
  `,
  iconSize: [35, 41],
  iconAnchor: [17, 41],
});

// Override default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DriverDeliveryPage = ({ driverId }) => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [delivery, setDelivery] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    availableDeliveries();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("running!");
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
        },
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true }
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [driverId]);

  const availableDeliveries = () => {
    fetch(`http://localhost:8081/api/delivery/by-driver/${driverId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      // .then(data => setDelivery(data))
      .then(data => {
          console.log('Fetched data:', data);
          setDelivery(data);  

        })
      .catch(err => console.error('Failed to load delivery', err));
  };

  const markAsDelivered = () => {
    fetch(`http://localhost:8081/api/delivery/mark-delivered/${driverId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        alert('Delivery marked as delivered!');
        setDelivery(prev => ({ ...prev, isDelivered: true }));
      })
      .catch(() => alert('Failed to update delivery status.'));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1508973374857-bc92fba7b2f9?auto=format&fit=crop&w=1400&q=80)',
      }}
    >
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">Driver Delivery Dashboard</h2>

        {delivery ? (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="mb-4">
              <p className="text-lg font-semibold"><strong>Order ID:</strong> {delivery.orderId}</p>
              <p className="text-lg font-semibold">
                <strong>Status:</strong>{' '}
                <span className={delivery.isDelivered ? 'text-green-600' : 'text-yellow-500'}>
                  {delivery.isDelivered ? 'Delivered' : 'In Progress'}
                </span>
              </p>
            </div>

            <div className="h-[600px] w-full rounded-xl overflow-hidden mb-6 border-2 border-gray-300">
              {location.latitude !== 0 && location.longitude !== 0 && (
                <MapContainer
                  center={[location.latitude, location.longitude]}
                  zoom={15}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <Marker position={[delivery.shopLatitude, delivery.shopLongitude]} icon={ShopLabelIcon}>
                    <Popup>Shop Location</Popup>
                  </Marker>
                  <Marker position={[delivery.destinationLatitude, delivery.destinationLongitude]} icon={CustomerLabelIcon}>
                    <Popup>Customer (Delivery Destination)</Popup>
                  </Marker>
                  <Marker position={[delivery.driverLatitude, delivery.driverLongitude]} icon={DriverLabelIcon}>
                    <Popup>Driver Location</Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>

            {!delivery.isDelivered && (
              <button
                onClick={markAsDelivered}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-xl font-semibold"
              >
                Mark as Delivered
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-700 text-lg font-medium text-center">No delivery assigned.</p>
        )}
      </div>
    </div>
  );
};

export default DriverDeliveryPage;
