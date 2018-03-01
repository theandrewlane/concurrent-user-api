# An API For Managing Concurrent Users
[![Build Status](https://travis-ci.org/theandrewlane/concurrent-user-api.svg?branch=master)](https://travis-ci.org/theandrewlane/concurrent-user-api)
[![codecov](https://codecov.io/gh/theandrewlane/concurrent-user-api/branch/master/graph/badge.svg)](https://codecov.io/gh/theandrewlane/concurrent-user-api)

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
