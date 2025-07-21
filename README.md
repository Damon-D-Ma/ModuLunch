# ModuLunch


## Installations:
- Install [Docker](https://www.docker.com/) (look up the appropriate setup for your OS)
- Install project dependencies:
  
  **Linux:**
```bash
        sudo apt install npm
        npm install node
        npm install express
        npm install mongoose
```

## Building:
```bash
        docker compose up --build
```



## Other:
**Shutting Down Dev Server Properly (if you have issues with ports still in use):**

**Linux:**
```bash
    docker ps
    # find the container id
    docker stop [CONTAINER ID HERE]
```

## If your changes are not reflecting in the build and need to do a clean and rebuild:
```bash
docker compose down --volumes --remove-orphans # NOTE: THIS WILL WIPE YOUR DB, ONLY USE IF YOU NEED TO REMOVE EVERYTHING
docker compose build --no-cache # Use this rebuild
docker compose up
```

## Accessing the MongoDB Database in the shell:
After running the docker compose up command, you can check the MongoDB database by running:
```bash
mongosh MONGODB_URI # This will connect you to the MongoDB shell
# MONGODB_URI should be replaced with your actual MongoDB URI in your `.env` file
```
For more information on how to use the MongoDB shell, refer to the [MongoDB Shell Documentation](https://www.mongodb.com/docs/mongodb-shell/).


