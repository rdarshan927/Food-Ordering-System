//package com.foodapp.delivery.controller;
//
//import com.foodapp.delivery.model.Delivery;
//import com.foodapp.delivery.model.LocationDTO;
//import com.foodapp.delivery.service.DeliveryService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/delivery")
//@RequiredArgsConstructor
//public class DeliveryController {
//    private final DeliveryService deliveryService;
//
//    // 🔥 NEW endpoint: create a delivery
//    @PostMapping("/create")
//    public ResponseEntity<String> createDelivery(@RequestBody Delivery delivery) {
//        deliveryService.createDelivery(delivery);
//        return ResponseEntity.ok("Delivery created!");
//    }
//
//    @PostMapping("/update-location")
//    public ResponseEntity<String> updateDriverLocation(@RequestBody LocationDTO dto) {
//        deliveryService.updateLocation(dto);
//        return ResponseEntity.ok("Location updated!");
//    }
//
//    @PostMapping("/mark-delivered/{driverId}")
//    public ResponseEntity<String> markAsDelivered(@PathVariable String driverId) {
//        deliveryService.markAsDelivered(driverId);
//        return ResponseEntity.ok("Marked as delivered");
//    }
//}

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

    @PostMapping("/create")
    public ResponseEntity<String> createDelivery(@RequestParam String orderId,
                                                 @RequestParam double latitude,
                                                 @RequestParam double longitude) {
        deliveryService.createDelivery(orderId, latitude, longitude);
        return ResponseEntity.ok("Delivery created!");
    }

    @PostMapping("/mark-delivered/{driverId}")
    public ResponseEntity<String> markAsDelivered(@PathVariable String driverId) {
        deliveryService.markAsDelivered(driverId);
        return ResponseEntity.ok("Delivery marked as delivered");
    }

    @GetMapping("/by-driver/{driverId}")
    public ResponseEntity<Delivery> getDeliveryByDriver(@PathVariable String driverId) {
        Delivery delivery = deliveryService.getDeliveryByDriver(driverId);
        return ResponseEntity.ok(delivery);
    }

}