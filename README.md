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
```
docker compose down --volumes --remove-orphans
docker compose build --no-cache
docker compose up
```