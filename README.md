
# API Documentation

## Table of Contents
- [Overview](#overview)
- [Endpoints](#endpoints)
  - [API Gateway](#api-gateway)
    - [/signup](#signup)
    - [/submit-questionnaire](#submit-questionnaire)
  - [Microservices](#microservices)
    - [Login Microservice](#login-microservice)
      - [POST /login](#post-login)
      - [POST /signup](#post-signup)
      - [POST /submit-questionnaire](#post-submit-questionnaire)
    - [Outfit Microservice](#outfit-microservice)
      - [GET /outfits](#get-outfits)
      - [GET /outfits/check/:points](#get-outfitscheckpoints)
      - [GET /outfits/:id](#get-outfitsid)

---

## Overview
This API consists of an API Gateway and two microservices: Login Microservice and Outfit Microservice. The API Gateway acts as a central router, forwarding requests to the appropriate microservices. 

- **Login Microservice**: Handles user authentication, registration, and questionnaire submissions.
- **Outfit Microservice**: Provides outfit inventory and filtering based on user points.

---

## Endpoints

### API Gateway

#### **`/signup`**
- **Method**: `POST`
- **Description**: Proxies requests to the Login Microservice to register new users.
- **Target Microservice**: `login_microservice`
- **Path Rewrite**: `^/signup` → `/`

#### **`/submit-questionnaire`**
- **Method**: `POST`
- **Description**: Proxies requests to the Login Microservice to submit user questionnaires.
- **Target Microservice**: `login_microservice`
- **Path Rewrite**: `^/submit-questionnaire` → `/submit-questionnaire`

---

### Microservices

#### Login Microservice

##### **`POST /login`**
- **Description**: Authenticates a user using their email and password.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - `200 OK`: Successful login with user details (excluding the password).
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid email or password.
- **Example Response**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "completedQuestionnaire": true
    }
  }
  ```

##### **`POST /signup`**
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - `201 Created`: User successfully registered.
  - `400 Bad Request`: Missing required fields.
  - `409 Conflict`: User with the provided email already exists.
- **Example Response**:
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "completedQuestionnaire": false
    }
  }
  ```

##### **`POST /submit-questionnaire`**
- **Description**: Submits a user’s water usage questionnaire.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "showerTimes": 7,
    "showerDuration": 10,
    "toiletFlushes": 5,
    "laundryLoads": 3,
    "newClothesFrequency": 2,
    "recycledClothes": true,
    "meatConsumption": 4,
    "waterUsage": 150
  }
  ```
- **Response**:
  - `201 Created`: Questionnaire submitted successfully.
  - `400 Bad Request`: Missing required fields.
  - `404 Not Found`: User not found.
  - `400 Bad Request`: Questionnaire already submitted.
- **Example Response**:
  ```json
  {
    "message": "Questionnaire submitted successfully.",
    "questionnaire": {
      "showerTimes": 7,
      "showerDuration": 10,
      "toiletFlushes": 5,
      "laundryLoads": 3,
      "newClothesFrequency": 2,
      "recycledClothes": true,
      "meatConsumption": 4,
      "waterUsage": 150,
      "submittedAt": "2024-12-01T12:34:56Z"
    },
    "total": 150
  }
  ```

---

#### Outfit Microservice

##### **`GET /outfits`**
- **Description**: Retrieves a list of all outfits from the inventory.
- **Response**:
  - `200 OK`: Returns all outfits.
- **Example Response**:
  ```json
  [
    {
      "id": "1",
      "type": "Shirt",
      "name": "Casual Tee",
      "price": 20
    },
    {
      "id": "2",
      "type": "Pants",
      "name": "Jeans",
      "price": 50
    }
  ]
  ```

##### **`GET /outfits/check/:points`**
- **Description**: Retrieves a list of outfits that can be afforded with the provided points.
- **URL Parameter**:
  - `points` (integer): The user's available points.
- **Response**:
  - `200 OK`: Returns affordable outfits.
  - `400 Bad Request`: Invalid points value.
- **Example Response**:
  ```json
  [
    {
      "id": "1",
      "type": "Shirt",
      "name": "Casual Tee",
      "price": 20
    }
  ]
  ```

##### **`GET /outfits/:id`**
- **Description**: Retrieves an outfit by its ID.
- **URL Parameter**:
  - `id` (string): The ID of the outfit.
- **Response**:
  - `200 OK`: Returns the outfit details.
  - `404 Not Found`: Outfit not found.
- **Example Response**:
  ```json
  {
    "id": "1",
    "type": "Shirt",
    "name": "Casual Tee",
    "price": 20
  }
  ```

---

## Additional Notes
- **Database**: The API uses `lowdb` for storing data in a `db.json` file. Ensure the file structure is consistent across all services.
- **Error Handling**: Services include basic error handling but could benefit from centralized logging for better debugging.
- **Authentication**: The API currently has no authentication or authorization mechanisms. Consider adding middleware for secure routes.
