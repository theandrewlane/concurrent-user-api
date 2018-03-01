# An API For Managing Concurrent Users

* The scripts are:
    * Run the project
    ```
        npm start
    ```

    * Run the project with auto-refresh (nodemon)
    ```
        npm run dev
    ```

    * Run the tests:
    ```
        npm test
    ```

#### This is just a simple starter if you have any ideas to make it better, please feel free to open issues and send Pull Requests

#### Docker Configuration

```
docker run -p 27017:27017 --name uic-mongo -d mongo
docker run --link uic-mongo:mongo -p 8081:8081 mongo-express
```
