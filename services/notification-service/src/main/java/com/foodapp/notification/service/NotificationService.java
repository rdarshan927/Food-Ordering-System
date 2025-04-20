package com.foodapp.notification.service;

import com.foodapp.notification.model.NotificationRequest;
import com.foodapp.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.management.Notification;
import java.time.LocalDateTime;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, JavaMailSender mailSender) {
        this.notificationRepository = notificationRepository;
        this.mailSender = mailSender;
    }

    public void send(NotificationRequest request) {
        // 1. Save in DB
        Notification notification = new Notification();
        notification.setRecipient(request.getRecipient());
        notification.setMessage(request.getMessage());
        notification.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notification);

        // 2. Send Email
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(request.getRecipient());
        email.setSubject("New Notification");
        email.setText(request.getMessage());
        mailSender.send(email);

        System.out.println("Notification sent to " + request.getRecipient());
    }
}
