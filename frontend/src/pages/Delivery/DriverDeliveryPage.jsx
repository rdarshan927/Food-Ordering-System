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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-red-600 text-white p-5">
            <h2 className="text-3xl font-bold text-center">Driver Delivery Dashboard</h2>
            <p className="text-center text-gray-100 mt-1">Real-time delivery tracking</p>
          </div>
          
          {delivery ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Details</h3>
                  <p className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{delivery.orderId}</span>
                  </p>
                  <p className="flex justify-between pt-2">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${delivery.isDelivered ? 'text-green-600' : 'text-amber-500'} flex items-center`}>
                      {delivery.isDelivered ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Delivered
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          In Progress
                        </>
                      )}
                    </span>
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Delivery Location</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Customer Location
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Restaurant Location
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Tracking</h3>
                  <p className="text-sm text-gray-600 mb-2">Your current location is automatically updating every 5 seconds.</p>
                  {!delivery.isDelivered && (
                    <button
                      onClick={markAsDelivered}
                      className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg font-medium shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
              
              <div className="h-[600px] w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 text-lg font-medium">No delivery assigned at the moment.</p>
              <p className="text-gray-500 mt-2">Please check back later or contact dispatch.</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Food Delivery System | Driver Portal
        </div>
      </div>
    </div>
  );
};

export default DriverDeliveryPage;
