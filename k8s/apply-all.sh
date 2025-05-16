#!/bin/bash
set -e

echo "Creating namespace..."
kubectl apply -f /mnt/new_volume/Projects/Academic/Food-Ordering-System/k8s/namespace.yaml

echo "Creating ConfigMaps and Secrets..."
kubectl apply -f /mnt/new_volume/Projects/Academic/Food-Ordering-System/k8s/configmaps/
kubectl apply -f /mnt/new_volume/Projects/Academic/Food-Ordering-System/k8s/secrets/

echo "Creating PersistentVolumeClaims..."
kubectl apply -f /mnt/new_volume/Projects/Academic/Food-Ordering-System/k8s/volumes/

echo "Creating Services..."
kubectl apply -f /mnt/new_volume/Projects/Academic/Food-Ordering-System/k8s/services/

echo "Creating Deployments..."
kubectl apply -f /mnt/new_volume/Projects/Academic/Food-Ordering-System/k8s/deployments/

echo "Creating Ingress..."
kubectl apply -f /mnt/new_volume/Projects/Academic/Food-Ordering-System/k8s/ingress/

echo "All resources created successfully!"