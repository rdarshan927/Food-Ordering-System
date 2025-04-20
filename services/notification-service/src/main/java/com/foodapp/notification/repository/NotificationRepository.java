package com.foodapp.notification.repository;

import org.springframework.stereotype.Repository;

import javax.management.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
