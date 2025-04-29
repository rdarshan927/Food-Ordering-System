navigator.geolocation.watchPosition(
  (position) => {
    fetch("http://localhost:8081/api/delivery/update-location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        driverId: "driver123",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
    });
  }
);
