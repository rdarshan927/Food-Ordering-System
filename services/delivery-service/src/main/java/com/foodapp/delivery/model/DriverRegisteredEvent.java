package com.foodapp.delivery.model;

import lombok.Data;

@Data
public class DriverRegisteredEvent {
    private String driverId;
    private String name;
    private String email;
}
