#!/bin/bash
set -e

# Set your container registry here (e.g., Docker Hub username or private registry URL)
REGISTRY="rdarshan927"

# Build and tag images
services=("order-service" "payment-service" "restaurant-service" "usermanagement-service" "delivery-service" "notification-service")
frontend="frontend"

echo "Building $frontend..."
docker build -t $REGISTRY/food-ordering-system-$frontend:latest -f /mnt/new_volume/Projects/Academic/Food-Ordering-System/$frontend/Dockerfile /mnt/new_volume/Projects/Academic/Food-Ordering-System/$frontend

echo "Pushing $frontend..."
docker push $REGISTRY/food-ordering-system-$frontend:latest

for service in "${services[@]}"; do
  echo "Building $service..."
  
#   if [ "$service" = "delivery-service" ]; then
#     # Build Java application with Maven
#     (cd /mnt/new_volume/Projects/Academic/Food-Ordering-System/services/delivery-service && ./mvn clean package -DskipTests)
#   fi
    if [ "$service" = "delivery-service" ]; then
    # Build Java application with Maven
    (cd /mnt/new_volume/Projects/Academic/Food-Ordering-System/services/delivery-service && mvn clean package -DskipTests)
    fi

  
  docker build -t $REGISTRY/food-ordering-system-$service:latest -f /mnt/new_volume/Projects/Academic/Food-Ordering-System/services/$service/Dockerfile /mnt/new_volume/Projects/Academic/Food-Ordering-System/services/$service
  
  # Push to registry
  echo "Pushing $service to registry..."
  docker push $REGISTRY/food-ordering-system-$service:latest
done

echo "All images built and pushed successfully!"