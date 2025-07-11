import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DriverDashboard = () => {
  const { driverId: urlDriverId } = useParams();
  const [statusMessage, setStatusMessage] = useState("Initializing location tracking...");
  const [locationStatus, setLocationStatus] = useState("initializing");
  const [errorMessage, setErrorMessage] = useState(null);
  const [driverId, setDriverId] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch driver's deliveries
  const fetchDeliveries = async () => {
    if (!driverId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/delivery/by-driver/${driverId}`, {
        headers: { 'Authorization': `Bearer ${token || ""}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle both array and single object responses
        if (data && !Array.isArray(data) && data.orderId) {
          setDeliveries([data]); // Convert single delivery to array
        } else if (Array.isArray(data)) {
          setDeliveries(data);
        } else {
          setDeliveries([]);
        }
      } else if (response.status === 404) {
        // No deliveries found is a normal state
        setDeliveries([]);
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch deliveries", error);
      setErrorMessage(`Failed to load deliveries: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get driver ID from URL params, localStorage, or use default
    const storedDriverId = urlDriverId || localStorage.getItem("driverId") || "driver007";
    setDriverId(storedDriverId);
    localStorage.setItem("driverId", storedDriverId); // Store for consistency
    
  }, [urlDriverId]);

  useEffect(() => {
    if (!driverId) return;
    
    // Fetch deliveries initially
    fetchDeliveries();
    
    // Set up location tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocationStatus("active");
        setStatusMessage("Location tracking active");
        setErrorMessage(null);
        
        fetch("http://localhost:8081/api/delivery/update-location", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}` 
          },
          body: JSON.stringify({
            driverId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          return response.json();
        }).then(() => {
          setStatusMessage("Location updated successfully");
        }).catch((error) => {
          console.error("Failed to update location:", error);
          setErrorMessage(`Failed to update location: ${error.message}`);
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus("error");
        
        let errorMsg = "Unable to retrieve location.";
        switch(error.code) {
          case 1: // PERMISSION_DENIED
            errorMsg += " Please enable location services in your browser.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMsg += " Position information is unavailable.";
            break;
          case 3: // TIMEOUT
            errorMsg += " The request to get location timed out.";
            break;
          default:
            errorMsg += " An unknown error occurred.";
        }
        
        setErrorMessage(errorMsg);
        setStatusMessage("Location tracking failed");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    // Set up periodic refresh of deliveries
    const intervalId = setInterval(fetchDeliveries, 15000); // refresh every 15 seconds

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
      setStatusMessage("Location tracking stopped");
    };
  }, [driverId, token]);

  const getStatusIcon = () => {
    switch (locationStatus) {
      case "active":
        return "✅";
      case "error":
        return "❌";
      default:
        return "⏳";
    }
  };

  const goToDeliveryPage = () => {
    navigate(`/driver/${driverId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
         style={{
           backgroundImage: 'url(https://images.unsplash.com/photo-1508973374857-bc92fba7b2f9?auto=format&fit=crop&w=1400&q=80)',
         }}>
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">Driver Dashboard</h1>
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Location Status</h2>
          <div className={`p-4 rounded-lg mb-4 ${
            locationStatus === 'active' ? 'bg-green-100' : 
            locationStatus === 'error' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <div className="flex items-center">
              <span className="text-2xl mr-2">{getStatusIcon()}</span>
              <p className="text-lg font-medium">{statusMessage}</p>
            </div>
            {errorMessage && (
              <p className="text-red-600 font-medium mt-2 pl-8">{errorMessage}</p>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Deliveries</h2>
            <button 
              onClick={fetchDeliveries}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-gray-600">Loading deliveries...</p>
            </div>
          ) : deliveries.length > 0 ? (
            <div className="space-y-4">
              {deliveries.map((delivery, index) => (
                <div key={index} className="border p-4 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium">Order #{delivery.orderId}</span>
                    <span className={`px-2 py-1 rounded text-xs ${delivery.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {delivery.isDelivered ? 'Delivered' : 'In Progress'}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">From:</span> 
                      <span className="ml-1">Restaurant</span>
                    </div>
                    <div>
                      <span className="text-gray-600">To:</span> 
                      <span className="ml-1">Customer</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/driver/${driverId}/delivery/${delivery.orderId || delivery.id}`)}
                    className="mt-3 px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 text-sm font-medium"
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No active deliveries at the moment</p>
              <p className="text-sm text-gray-400 mt-1">New orders will appear here</p>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <button 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors text-white rounded-xl font-semibold"
              onClick={goToDeliveryPage}
            >
              View Delivery Map
            </button>
          </div>
        </div>
        
        <div className="text-center text-gray-700">
          <p>Driver ID: <span className="font-semibold">{driverId}</span></p>
          <p className="text-sm mt-2">Make sure location services are enabled on your device</p>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
