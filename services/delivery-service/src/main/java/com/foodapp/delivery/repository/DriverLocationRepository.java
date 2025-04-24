package com.foodapp.delivery.repository;

import com.foodapp.delivery.model.DriverLocation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DriverLocationRepository extends MongoRepository<DriverLocation, String> {
    List<DriverLocation> findByIsAvailableTrue();
}
