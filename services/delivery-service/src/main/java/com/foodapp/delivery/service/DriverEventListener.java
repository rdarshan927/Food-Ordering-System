package com.foodapp.delivery.service;

import com.foodapp.delivery.config.RabbitMQConfig;
import com.foodapp.delivery.model.DriverLocation;
import com.foodapp.delivery.model.DriverRegisteredEvent;
import com.foodapp.delivery.repository.DriverLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverEventListener {

    private final DriverLocationRepository driverLocationRepo;

    @RabbitListener(queues = RabbitMQConfig.DRIVER_REGISTERED_QUEUE)
    public void handleDriverRegistered(DriverRegisteredEvent event) {
        // Only add if doesn't exist
        driverLocationRepo.findById(event.getDriverId()).orElseGet(() -> {
            DriverLocation newDriver = new DriverLocation(
                    event.getDriverId(),
                    0.0,
                    0.0,
                    true
            );
            return driverLocationRepo.save(newDriver);
        });

        System.out.println("New driver registered and added to DriverLocation: " + event.getDriverId());
    }
}
