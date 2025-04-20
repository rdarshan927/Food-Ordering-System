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
    private double latitude;
    private double longitude;
    private boolean isDelivered;
}
