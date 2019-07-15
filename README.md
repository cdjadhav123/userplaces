# Nearby search by user location API

Web service to manage and store nearby places API data on user and location level.

## Getting started

 1. clone the project. 
 2. npm install. 
 3. Setup env provided. 
 4. You are good to go

## REST API's

 - **Add User** - [POST] -> {{app-url}} / users
 - **Get All Users** - [GET] -> {{app-url}} / users
 - **Login user** - [POST] -> {{app-url}} / users
 - **Search Places** - [POST] -> {{app-url}} / places

## Add User

Before starting with the project we need to add user to database.
***For example*** : Send a post request with parameters

| Key        | Value           
| ------------- |:-------------:|
| name    | chetan 
| password      | 123456      

## Get All Users
You can also get all users created
****Note* : Only admin can access this route.***

> **Login Credentials for admin:**

| Key        | Value           
| ------------- |:-------------:|
| name    | admin 
| password      | admin123

Once admin is logged in **Provide Bearer token** and hit the **Get All Users route**

## Login user

Login a user once created sending a post request with a below parameters

| Key        | Value           
| ------------- |:-------------:|
| name    | *username* 
| password      | *password*   

Once logged-in response you with receive a **Bearer Token** which is needed to access nearby places route.

> **Info** - JWT token is used for authorization

## Search Places

This API will provide you with the near buy places with respect to user location. So, you need to provide **user location** and the **place to search** near by.
For example:

| Key        | Value           
| ------------- |:-------------:|
| location    | *Florida* 
| searchParam      | *Restaurant*   

> **Note:** Don't forget to provide **Bearer token in Authorization headers** of the logged in user

This API will also store the user specific search records in DB as well.

## Modules used
- **express** -  is the popular Node framework
- **mongoose** - is how we interact with our MongoDB database
- **morgan** - will log requests to the console so we can see what is happening
- **body-parser** - will let us get parameters from our POST requests
- **jsonwebtoken** - is how we create and verify our JSON Web Tokens
- **follow-redirects** - Drop-in replacement for Nodes http and https that automatically follows redirects.
- **nodemon** - node.js based applications by automatically restarting the node application when file changes in the directory are detected.
- **dotenv** - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
- **bcrypt** - A library to help you hash passwords.
