for service in */ ; do
  docker build -t rdarshan927/${service%/}:latest ./$service
done
