import * as express from "express";

export interface IServerProps {
    port: string;
    validate: boolean,
    useTypeDi: boolean,
}

export interface IInitServerProps {
    middlewares: any[],
    errorHandlers: any[]
    controllers: any[],
}

export interface ICallbackArgs {
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
}