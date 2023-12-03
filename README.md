# Chat App NestJS WEBSOCKET
This project using NestJS and MongoDB, with purpose of the test to build an API socket based for chating

## Features

- Login and Register
- API Chat
- Socket Based API Chat
- Guard Implementation for Websocket and API

## Installation

Clone this project then run `yarn` to install package and plugin. make sure you are installed mongoDB databases and created collection with name `chatroom`. Run this command
```bash
  cd chat-socket
  yarn
  cp .env.example .env
  yarn start:dev
```
after that you can open Postman or anything, This project will run in `http://localhost:3000` and websockets will run with same port.

To get started, please register using by POST to `/auth/register` with body data
```bash
   {
    "username": "user",
    "password": "12345678"
   }
```

## Web Socket Event and Listener
To use this project as socket based API, you need to listen and subscribe for these events.
| Event             | Description                                                                |
| ----------------- | ------------------------------------------------------------------ |
| room | Listen activity in room |
| message | Listen Message Incoming |
| createRoom | Subscribe event to create a new room |
| joinRoom | Subscribe event to join room |
| sendMessage | Subscribe event to send message in a room |
| sendPrivate | Subscribe event to send message as private chat |
| getMessage | Subscribe event to get previous message in room or private |


## API Documentation

#### Register

```http
  POST /auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. |
| `password` | `string` | **Required**. |

#### Login

```http
  POST /auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required** |
| `password` | `string` | **Required** |

## CHAT API
Put access token as bearer token
| Headers | Value     | 
| :-------- | :------- |
| `Authorization`      | `access_token` |

#### Create Room
```http
  POST /chat/create-room
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. |


#### Join Room
```http
  POST /chat/join-room
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `roomId`      | `string` | **Required**. |


#### Get Message by Room ID
```http
  GET /chat/room/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | room id. |

#### Send Message
```http
  POST /chat/send-message
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `roomId`      | `string` | room id. |
| `content`      | `string` | Text chat |

#### Send Private Message
```http
  POST /chat/send-message
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `toId`      | `string` | to user ID. |
| `content`      | `string` | Text chat |


#### Get Message
```http
  GET /chat/send-message
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `roomId`      | `string` | room id. |

#### Get Private Message
```http
  GET /chat/send-message
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `toId`      | `string` | room id. |

## Authors

- [@sadriansyah](https://github.com/sadriansyah)
