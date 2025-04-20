import { useEffect } from "react";

const DriverDashboard = () => {
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        fetch("http://localhost:8081/api/delivery/update-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: "driver007", // Replace this dynamically based on logged-in user
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div>
      <h1>Driver Dashboard</h1>
      <p>Tracking your location...</p>
    </div>
  );
};

export default DriverDashboard;
