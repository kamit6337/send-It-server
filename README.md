# SendIt

<p>It's a Full Stack Social Media Web App build in MERN Stack including real-time communications</p>

[Preview](https://amit-general-bucket.s3.ap-south-1.amazonaws.com/videos/send-it.mp4)

Docker Image : [kamit6337/sendit-server](https://hub.docker.com/repository/docker/kamit6337/sendit-server/general)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech](#tech)
- [Running](#running)

## Description

This is a social media website like Twitter where you can post, like, reply post and share post and also chat with members.

## Features

- using Passport.js for Google-Oauth login
- login with email and password with OTP verification
- protect routes and data though express middleware
- use Socket.io web-sockets for real-time communications
- AWS S3 for multimedia data storage
- use s3-request-presigner package to prevent unnecessary load on server
- global error handling at one place : globalErrorHandler.js
- cookie is created to maintain user session
- Dockerise this Nodejs server, run Dokcer image in any system
- unit test using jest for all api endpoints

## Tech

<ul>
<li>Node JS</li>
<li>Express JS</li>
<li>MongoDB - <i>NoSQL database to store user data</i></li>
<li>Socket.io - <i>web-socket for real time communications</i></li>
<li>Nodemailer - <i>send OTP to email for verification</i></li>
<li>AWS S3 - <i>store multimedia data effectively</i></li>
<li>Jest and Supertest - <i>testing API endpoints and data fetching from Database</i></li>
</ul>

## Running

To run this server locally using Docker Image :

- install Docker Desktop from [Docker website](https://www.docker.com/products/docker-desktop) and start to run in background
- create a folder in desktop, open this folder in VS Code
- create a .env file
- copy .env.example file variables from above and paste in .env file
- start filling all environment variables

### All environment variables is necessary except EXPIRES_IN, SENTRY_DSN, REDIS_URL to run smoothly and see all functionality

- open VS Code terminal

```
docker run --env-file .env -p 8000:8000 kamit6337/sendit-server
```

- server started on http://localhost:8000
- check by go to url: http://localhost:8000, you will get a response means server is working fine
