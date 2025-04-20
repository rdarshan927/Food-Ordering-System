package com.foodapp.delivery.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "completed_deliveries")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompletedDelivery {
    @Id
    private String id;
    private String orderId;
    private String driverId;
    private double latitude;
    private double longitude;
    private boolean isDelivered;
    private LocalDateTime completedAt;
}
