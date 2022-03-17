# Private Lessons/Courses LMS API

## Techs:

- Node.js/ExpressJS
- Socket.IO
- PassportJS
- MongoDB/Mongoose
- Redis
- Google Cloud Storage (Firebase Admin SDK)
- Firebase Cloud Messaging (FCM)
- SendGrid
- Sentry
- Postman
- Docker
- Documented with JsDoc

## Application Structure:

      Router <-> Authorization <-> Validations <-> Controllers <-> Services <-> Models (ORM)

## Features:

An overview of the LMS API.

> **Note:** This is not all the API endpints but the most important features. A postman documentaion is available at the end of this document.

- **Authentication & Authorization:**

  - Sessions handling with express-session using Redis as a session store
  - Facebook authentication OAuth2.0
  - PassportJS for authentication
  - Signup
  - Login
  - Logout
  - Forgot Password
  - Password Reset

- **User Management:**

  - Roles
    - _Role 1:_ Student
    - _Role 2:_ Assistant
    - _Role 3:_ Instructor
  - User Profile
  - User Profile Update
  - Filter/Search Users
  - Handle FCM Tokens and topics

- **Grades:**

  - Create Grade
  - Get Grades

- **Lessons:**

  - Create Lesson
  - Update Lesson
  - Delete Lesson
  - Publish/Unpublish Lesson and send notifications & emails to students
  - Attend Lesson
  - Filter/Search Lessons
  - Attend Lessons By access codes
  - Stream videos with the Node.js server to prevent file link access

- **Quizes:**

  - Create Quiz
  - Update Quiz
  - Delete Quiz
  - Publish/Unpublish Quiz and send notifications & emails to students
  - Filter/Search Quizes
  - Take Quizzes By access codes

- **Access codes:**

  - Create Access Codes for grades
  - Access Codes Types (Lessons - Quizzes)
  - Track admin actions (generate access codes) by role 3 (Instructor)

- **Realtime chat with admins**

  - Ask/Chat with admins about lessons if attended
  - Redis Pub/Sub as a Socket.IO Adapter for horizontal scaling (multiple servers communication)
  - Dependency Injection for Socket.IO structure

- **Notification/Email Service**

  - SendGrid as an Email service
  - Firebase Cloud Messaging (FCM) as a Notification service
  - Node.js EventEmitter Pub/Sub as a Notification service emitter

## About the APP:

- **App Scaling:**

  The app is scalable horizontally and can be deployed to multiple servers and/or multiple instances as it is stateless and WebSockets servers communicate through redis to preserve state.

- **Database Performance:**

  Due to the fact that the app load will be mainly from reads so I could use indexes freely so I used sutible indexes like compound indexes & text indexes for the database queries/sorts and I could track query optimizer usage by MongoDB Compass Explain plain and Apply what I've learned in the MongoDB Performance course from MongoDB University.

- **File Upload:**

  - Multer as a streaming middleware between client and Google Cloud Storage as I built a custom storage class and factory for it for uploading profile pictures
  - Google Cloud Storage Signed URLs for uploading lessons/videos

- **Logging:**

  - Logging with WinstonJS
  - Error Reporting with Sentry
  - Logging Requests with Morgan

- **Error Handling:**

  - Error Handling with @Hapi/Boom for error responses
  - Custom middleware for sending error responses
  - Asyncronous error catching with a wrapped function for all controllers
  - Report unexpected errors to sentry

- **Security:**

  - Rate Limiting with Token Bucket Algorithm (Redis as Token Store)
  - XSS Protection (HelmetJS)
  - CORS Protection

- **Code Style:**

  - Code Style with Prettier
  - Hsuky & lint-staged as a pre-commit hook to automatically format code using prettier

## Postman Documentaion

- Postman collection for the API endpoints:
  - [Download](.github\LMS_API.postman_collection)
- Postman collection for the Socket.IO events:
  - Unavilable as WebSockets at postman is still in beta version and can't be exported
