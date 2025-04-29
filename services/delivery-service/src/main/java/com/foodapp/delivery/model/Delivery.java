package com.foodapp.delivery.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//import lombok.*;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "deliveries")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Delivery {
    @Id
    private String id;

    private String orderId;
    private String driverId;
    private String userId;

    private double shopLatitude;
    private double shopLongitude;

    // Customer’s delivery destination
    private double destinationLatitude;
    private double destinationLongitude;

    // Driver's current location
    private double driverLatitude;
    private double driverLongitude;

    private boolean isDelivered;
}
