package com.foodapp.delivery.repository;

import com.foodapp.delivery.model.CompletedDelivery;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CompletedDeliveryRepository extends MongoRepository<CompletedDelivery, String> {
    List<CompletedDelivery> findByDriverId(String driverId);
}
