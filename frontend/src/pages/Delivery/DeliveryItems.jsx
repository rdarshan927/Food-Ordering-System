import { useEffect } from "react";

const DeliveryItems = () => {
    navigator.geolocation.watchPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Driver location:", latitude, longitude);

        // Send to backend
        fetch("http://localhost:8081/api/delivery/update-location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            driverId: "driver007",
            latitude,
            longitude,
        }),
        });
    },
    (error) => console.error("Geolocation error:", error),
    {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
    }
    );
}