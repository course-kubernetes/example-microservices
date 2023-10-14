docker stop esempiomicro
docker container prune
docker run --name esempiomicro -d -e MONGO_HOST=host.docker.internal -e MONGO_PORT=27017 -p 81:3000 example-books-microservice-mongo:1.2 