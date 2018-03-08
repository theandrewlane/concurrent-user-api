# Eliminate User Concurrency Issues When Running Test Automation In Parallel
[![Build Status](https://travis-ci.org/theandrewlane/concurrent-user-api.svg?branch=master)](https://travis-ci.org/theandrewlane/concurrent-user-api)
[![codecov](https://codecov.io/gh/theandrewlane/concurrent-user-api/branch/master/graph/badge.svg)](https://codecov.io/gh/theandrewlane/concurrent-user-api)

## Problem: 
* When running test automation in parallel, test suites which use the same operator are likely to produce false negatives.

## Solution:
* When test execution begins, an API call requesting a desired operator is made. This call returns the desired operator or a similar operator based on availability. When a test suite fails or completes, a subsequent API call is made restting the operator's availibility.
* The API keeps track of operator availability via a MongoDB backend
* Each ```operator``` document must contain an ```operator_type_id```. The API uses this property to find similar operators when the desired operator is not available.
* Every ```operator_type_id``` specified in the ```operator``` collection must exist in ```operator_type``` collection. This is a foreign key constraint.

<hr>

### Operator Schema:

```
  operator_id: {
    type: String,
    maxlength: 60,
    index: true,
    trim: true,
    unique: true,
    required: true
  },
  operator_type_id: {
    type: String,
    maxlength: 60,
    required: true
  },
  password: {
    type: String,
    maxlength: 60,
    trim: true,
    default: 'Tester01'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
```


### Operator_Type Schema:

```
 _id: String,
  source_system: {
    type: String,
    maxlength: 60
  },
  communications: {
    type: Boolean,
    default: true
  },
  type_description: {
    type: String,
    maxlength: 120
  }
```

### Recommended Database Viewer - [mongo-express](https://hub.docker.com/_/mongo-express/)
* Assumption: A docker monogodb instance called api-mongo is already running.
```
docker run --link api-mongo:mongo -p 8081:8081 mongo-express
```

<hr>

* Project Quick Start:

    * Spin up A MongoDB (docker is easiest! 🤓)
    ```
    docker run -p 52001:27017 --name api-mongo -d mongo
    ```
    
    * Install Dependencies
    ```
    yarn
    ```
    
    * Start the API server
    ```
    npm start
    ```

    * Run the API in dev mode (watches for changes)
    ```
    npm run dev
    ```

    * Run Mocha tests:
    ```
    npm test
    ```
    
