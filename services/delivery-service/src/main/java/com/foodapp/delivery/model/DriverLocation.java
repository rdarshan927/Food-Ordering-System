package com.foodapp.delivery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//import lombok.*;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "driver_locations")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverLocation {
    @Id
    private String driverId;
    private double latitude;
    private double longitude;
    private boolean isAvailable;
}