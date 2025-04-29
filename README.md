# Task Manager App
A secure and user-friendly Task Manager web application built with Node.js, Express, MongoDB, and JWT Authentication. This app allows users to register, log in, and manage tasks with full CRUD functionality — all personalized to the logged-in user.

## Overview
This full-stack application is designed to help users organize their daily tasks. It includes authentication, session handling, and a clean, dynamic interface using EJS templating. Every user has their own task dashboard and secure access to their task list.

## Features
### User Authentication
Secure login and registration using JWT tokens stored in cookies.

### Task Management
Users can create, read, update, delete, and mark tasks as complete.

### Session Expiry Handling
Notifies the user when their session (JWT) expires and prompts them to log in again.

### Personalized Dashboard
Displays a greeting such as “Hello, username!” and shows only the user’s tasks.

### EJS Templating Engine
Dynamic page rendering with a consistent layout across the app.

### MongoDB Integration
Stores users and tasks in a MongoDB database using Mongoose.

## Tech Stack

Frontend - HTML, CSS, EJS Templating

Backend -	Node.js, Express.js

Database -	MongoDB, Mongoose

Auth -	JWT (JSON Web Token), Cookie-parser
