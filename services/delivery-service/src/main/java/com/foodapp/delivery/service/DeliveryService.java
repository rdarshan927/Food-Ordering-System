//package com.foodapp.delivery.service;
//
//import com.foodapp.delivery.model.Delivery;
//import com.foodapp.delivery.model.LocationDTO;
//import com.foodapp.delivery.repository.DeliveryRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class DeliveryService {
//    private final DeliveryRepository deliveryRepo;
//
//    public void createDelivery(Delivery delivery) {
//        deliveryRepo.save(delivery);
//    }
//
//    public void updateLocation(LocationDTO location) {
//        Delivery delivery = deliveryRepo.findByDriverId(location.getDriverId())
//                .orElseThrow(() -> new RuntimeException("Driver not assigned to any delivery!"));
//        delivery.setLatitude(location.getLatitude());
//        delivery.setLongitude(location.getLongitude());
//        deliveryRepo.save(delivery);
//    }
//
//    public void markAsDelivered(String driverId) {
//        Delivery delivery = deliveryRepo.findByDriverId(driverId)
//                .orElseThrow(() -> new RuntimeException("No delivery found for driver"));
//        delivery.setDelivered(true);
//        deliveryRepo.save(delivery);
//    }
//
//}

package com.foodapp.delivery.service;

import com.foodapp.delivery.model.CompletedDelivery;
import com.foodapp.delivery.model.Delivery;
import com.foodapp.delivery.model.DriverLocation;
import com.foodapp.delivery.model.LocationDTO;
import com.foodapp.delivery.repository.CompletedDeliveryRepository;
import com.foodapp.delivery.repository.DeliveryRepository;
import com.foodapp.delivery.repository.DriverLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryRepository deliveryRepo;
    private final DriverLocationRepository driverLocationRepo;
    private final CompletedDeliveryRepository completedDeliveryRepo; // 👈 add this

//    public void updateLocation(LocationDTO location) {
//        // Always update driver location
//        DriverLocation driverLoc = driverLocationRepo.findById(location.getDriverId())
//                .orElse(new DriverLocation(location.getDriverId(), location.getLatitude(), location.getLongitude(), true));
//        driverLoc.setLatitude(location.getLatitude());
//        driverLoc.setLongitude(location.getLongitude());
//        driverLocationRepo.save(driverLoc);
//
//        // If driver is currently delivering, update delivery too
//        deliveryRepo.findByDriverId(location.getDriverId()).ifPresent(delivery -> {
//            delivery.setLatitude(location.getLatitude());
//            delivery.setLongitude(location.getLongitude());
//            deliveryRepo.save(delivery);
//        });
//    }
    public void updateLocation(LocationDTO location) {
        // Update driver location (separate from delivery)
        DriverLocation driverLoc = driverLocationRepo.findById(location.getDriverId())
                .orElse(new DriverLocation(location.getDriverId(), location.getLatitude(), location.getLongitude(), true));

        driverLoc.setLatitude(location.getLatitude());
        driverLoc.setLongitude(location.getLongitude());
        driverLocationRepo.save(driverLoc);

        // ✅ Update only the *active* delivery (not completed ones)
        deliveryRepo.findByDriverIdAndIsDeliveredFalse(location.getDriverId())
                .ifPresent(delivery -> {
                    delivery.setLatitude(location.getLatitude());
                    delivery.setLongitude(location.getLongitude());
                    deliveryRepo.save(delivery);
                });
    }

    public void createDelivery(String orderId, double lat, double lon) {
        List<DriverLocation> availableDrivers = driverLocationRepo.findByIsAvailableTrue();

        if (availableDrivers.isEmpty()) throw new RuntimeException("No available drivers!");

        DriverLocation nearest = null;
        double minDist = Double.MAX_VALUE;

        for (DriverLocation d : availableDrivers) {
            double dist = calculateDistance(lat, lon, d.getLatitude(), d.getLongitude());
            if (dist < minDist) {
                minDist = dist;
                nearest = d;
            }
        }

        if (nearest != null) {
            Delivery delivery = new Delivery(null, orderId, nearest.getDriverId(), lat, lon, false);
            deliveryRepo.save(delivery);

            nearest.setAvailable(false);
            driverLocationRepo.save(nearest);
        }
    }

//    public void markAsDelivered(String driverId) {
//        Delivery delivery = deliveryRepo.findByDriverId(driverId)
//                .orElseThrow(() -> new RuntimeException("No delivery assigned to this driver"));
//        delivery.setDelivered(true);
//        deliveryRepo.save(delivery);
//
//        driverLocationRepo.findById(driverId).ifPresent(driver -> {
//            driver.setAvailable(true);
//            driverLocationRepo.save(driver);
//        });
//    }
public void markAsDelivered(String driverId) {
    Delivery delivery = deliveryRepo.findByDriverId(driverId)
            .orElseThrow(() -> new RuntimeException("No delivery assigned to this driver"));

    // Archive to completed_deliveries
    CompletedDelivery completed = new CompletedDelivery(
            delivery.getId(),
            delivery.getOrderId(),
            delivery.getDriverId(),
            delivery.getLatitude(),
            delivery.getLongitude(),
            true,
            LocalDateTime.now()
    );
    completedDeliveryRepo.save(completed);

    // Remove from active deliveries
    deliveryRepo.delete(delivery);

    // Mark driver as available again
    driverLocationRepo.findById(driverId).ifPresent(driver -> {
        driver.setAvailable(true);
        driverLocationRepo.save(driver);
    });
}


    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

//    public Delivery getDeliveryByDriver(String driverId) {
//        return deliveryRepo.findByDriverId(driverId)
//                .orElseThrow(() -> new RuntimeException("No delivery assigned to this driver"));
//    }
    public Delivery getDeliveryByDriver(String driverId) {
        return deliveryRepo.findByDriverIdAndIsDeliveredFalse(driverId)
                .orElseThrow(() -> new RuntimeException("No active delivery assigned to this driver"));
    }

}