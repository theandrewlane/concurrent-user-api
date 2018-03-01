# An API For Managing Concurrent Users

* Project Quick Start:

    * Spin up A MongoDB
    ```
    docker run -p 27017:27017 --name uic-mongo -d mongo

    ```
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

## Mongo Express DB View

```
docker run --link uic-mongo:mongo -p 8081:8081 mongo-express
```
