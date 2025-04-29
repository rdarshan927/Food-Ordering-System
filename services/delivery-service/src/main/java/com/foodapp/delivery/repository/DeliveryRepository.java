package com.foodapp.delivery.repository;

import com.foodapp.delivery.model.Delivery;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DeliveryRepository extends MongoRepository<Delivery, String> {
    Optional<Delivery> findByDriverId(String driverId);
    Optional<Delivery> findByOrderId(String orderId);
    Optional<Delivery> findByOrderIdAndUserId(String orderId, String userId);
}
