# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the jar file into the container at /app
COPY target/delivery-service-0.0.1-SNAPSHOT.jar delivery-service.jar

# Expose the port the app runs on
EXPOSE 8081

# Run the jar file when the container starts
ENTRYPOINT ["java", "-jar", "delivery-service.jar"]
