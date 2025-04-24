package com.foodapp.notification.model;

public class NotificationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipient;
    private String message;
    private LocalDateTime timestamp;

    public String getMessage() {
        return "hi";
    }

    public String getChannel() {
        return "hello";
    }

    public String getRecipient() {
        return "man!";
    }

    // Getters & Setters
}
