# ModuLunch


## Setup Steps (For dev)
1. Install [Docker](https://www.docker.com/) (look up the appropriate setup for your OS)
2. In the `modulunch` directory run the following commands:
    ```
        docker build -t modulunch . # you will need to run this every time you change code and want the image to reflect the changes
        docker run -p 3000:3000 modulunch # starts a new container mapping port 3000 on my local machine to port 3000 in the docker container
    ```
    **NOTE:** For whatever reason if you have an image with the same name, you can change it, It doesn't matter what you decide to name the image.

    If you accidentally ctrl+c to terminate the app, you may get an issue where port 3000 is still in use, you can kill it with:
    **Linux:**
    ```
        sudo lsof -i :3000 # we need to get the pid of the process using this port
        sudo kill -9 [PID HERE] # kill the process
    ```
    If this still does not work, you may need to restart docker, then try to run the container again:
    ```
    sudo systemctl restart docker
    ```


## Shutting Down Dev Server Properly:
**Linux:**
```
    docker ps
    # find the container id
    docker stop [CONTAINER ID HERE]
```