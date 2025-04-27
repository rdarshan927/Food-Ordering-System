package com.foodapp.delivery.controller;

import com.foodapp.delivery.model.Delivery;
import com.foodapp.delivery.model.LocationDTO;
import com.foodapp.delivery.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping("/update-location")
    public ResponseEntity<String> updateDriverLocation(@RequestBody LocationDTO dto) {
        deliveryService.updateLocation(dto);
        return ResponseEntity.ok("Location updated!");
    }

//    @PostMapping("/create")
//    public ResponseEntity<String> createDelivery(@RequestParam String orderId,
//                                                 @RequestParam double latitude,
//                                                 @RequestParam double longitude) {
//        deliveryService.createDelivery(orderId, latitude, longitude);
//        return ResponseEntity.ok("Delivery created!");
//    }
    @PostMapping("/create")
    public ResponseEntity<String> createDelivery(@RequestParam String orderId,
                                                 @RequestParam String userId,
                                                 @RequestParam double shopLatitude,
                                                 @RequestParam double shopLongitude,
                                                 @RequestParam double destinationLatitude,
                                                 @RequestParam double destinationLongitude
                                                ) {
        if (userId == null || userId.isEmpty()) {
            throw new RuntimeException("User ID is required 1");
        }
        deliveryService.createDelivery(orderId, userId, shopLatitude, shopLongitude, destinationLatitude, destinationLongitude);
        return ResponseEntity.ok("Delivery created!");
    }



    @PostMapping("/mark-delivered/{driverId}")
    public ResponseEntity<String> markAsDelivered(@PathVariable String driverId) {
        deliveryService.markAsDelivered(driverId);
        return ResponseEntity.ok("Delivery marked as delivered");
    }

    @GetMapping("/by-driver/{driverId}")
    public ResponseEntity<Delivery> getDeliveryByDriver(@PathVariable String driverId) {
        if (driverId == null || driverId.isEmpty()) {
            throw new RuntimeException("User ID is required");
        }
        Delivery delivery = deliveryService.getDeliveryByDriver(driverId);
        if (delivery == null) {
            throw new RuntimeException("User ID is required");
        }
        return ResponseEntity.ok(delivery);
    }

    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<Delivery> getDeliveryByOrderId(@PathVariable String orderId, @RequestParam String userId) {
        Delivery delivery = deliveryService.getDeliveryByOrderId(orderId, userId);
        return ResponseEntity.ok(delivery);
    }
}