#!/bin/bash
set -e

# Your Docker Hub username
REGISTRY="rdarshan927"

# Loop through all deployment files and update the image references
for file in /mnt/new_volume/Projects/Academic/Food-Ordering-System/k8s/deployments/*.yaml; do
  echo "Updating image reference in $file..."
  
  # Extract the service name from the filename (e.g., frontend-deployment.yaml -> frontend)
  service_name=$(basename "$file" | sed 's/-deployment.yaml//')
  
  # Update the image reference
  if [ "$service_name" = "frontend" ]; then
    # For frontend outside the services directory
    sed -i "s|image: food-ordering-system/frontend:latest|image: $REGISTRY/food-ordering-system-frontend:latest|g" "$file"
  else
    # For services in the services directory
    sed -i "s|image: food-ordering-system/$service_name:latest|image: $REGISTRY/food-ordering-system-$service_name:latest|g" "$file"
  fi
  
  echo "Updated $file"
done

echo "All deployment files updated!"