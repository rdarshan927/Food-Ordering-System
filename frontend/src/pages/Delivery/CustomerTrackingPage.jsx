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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-3xl font-bold text-center">Track Your Delivery</h2>
            <p className="text-center text-blue-100 mt-1">Real-time order tracking</p>
          </div>

          {delivery ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Details
                  </h3>
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
                          On the Way
                        </>
                      )}
                    </span>
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location Guide
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Restaurant Location</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <svg className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Driver Location</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Your Location</span>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tracking Info
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your location data is updated every 5 seconds to provide accurate tracking.
                  </p>
                  {delivery.isDelivered ? (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-700">Your order has been delivered!</span>
                    </div>
                  ) : (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 animate-pulse mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-amber-700">Your order is on the way!</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="h-[600px] w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="rounded-full bg-blue-100 p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Tracking Information</h3>
              <p className="text-gray-600 max-w-md text-center">
                We're retrieving the latest information about your order. This should only take a moment.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Food Delivery System | Customer Tracking Portal
        </div>
      </div>
    </div>
  );
};

export default CustomerTrackingPage;
