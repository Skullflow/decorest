# deest
A minimal framework on top of express to build organized restful api.

# Table of Contents
* [Installation](#installation)
* [Define controllers](#define-controllers)
* [Arguments decorators](#arguments-decorator)


## Installation
1. Install package:

    `npm install --save deest`

```typescript
import { Server } from "deest";

const server: Server = new Server({
    port: process.env.port || "8080",
    /**
     * This is used to validate body and query parameters 
     * with class-validator
     * @see https://github.com/typestack/class-validator
     */
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

server.listen(() => {
    console.log(`Server is listening on port ${server.getPort()}`);
});
```

## Define controllers

* Create a controller:

```typescript
import { Controller, Get, Post, Put, Patch, Delete } from "deest"

@Controller("/users")
export class UserController {
    
    @Get()
    findAll() {
        return []
    }
    
    @Post()
    save() {
        return { message: 'user has been saved' };
    }
    
    @Put()
    save() {
        return { message: 'user has been updated' };
    }
    
    @Patch()
    save() {
        return { message: 'user has been updated' };
    }
    
    @Delete()
    save() {
        return { message: 'user has been deleted' };
    }
}
```

## Arguments decorators

TDB...

