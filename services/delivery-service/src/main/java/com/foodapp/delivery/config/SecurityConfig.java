package com.foodapp.delivery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // disable CSRF for APIs
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/delivery/create").permitAll()
                        .requestMatchers("/api/delivery/update-location").permitAll() // 👈 Public
                        .requestMatchers("/api/delivery/mark-delivered/**").permitAll()
                        .requestMatchers("/api/delivery/by-driver/**").permitAll()
                        .requestMatchers("/api/delivery/by-order/**").permitAll()
                        .anyRequest().authenticated() // Others need auth
                )
                .httpBasic(Customizer.withDefaults()); // Or use JWT later

        return http.build();
    }
}
