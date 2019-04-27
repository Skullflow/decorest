# deest
A minimal framework on top of express to build organized restful api.

# Table of Contents

    * [Installation](#installation)
    * [Define controllers](#define-controllers)


## Installation
1. Install package:

    `npm install --save deest`

```typescript
import { Server } from "deest";

const server: Server = new Server({
    port: process.env.port || "8080",
    validate: true
});

server.init({
    middlewares: [
        // Global express middlewares
    ],
    errorHandlers: [
        // Custom express error handlers
    ],
    controllers: [
        // Controller classes
    ],
});

server.listen(async () => {
    console.log(`Server is listening on port ${server.getPort()}`);
});
```

## Define controllers

* Create a controller:

```typescript
import { Controller, Get, Post } from "deest"

@Controller("path")
export class Controller {
    
    @Get("/subpath")
    findAll() {
        return []
    }
    
    @Post("/subpath")
    save() {
        return { message: 'resource has been saved correctlty' };
    }
    
}
```