import * as express from "express";

export type MiddlewareHandler = ((req: express.Request, res: express.Response, next: express.NextFunction) => any);

export enum ActionParamType {
    REQUEST = 'request',
    RESPONSE = 'response',
    BODY = 'body',
    QUERY = 'query',
    LANG = 'lang',
    PARAMS = 'params',
    USER = 'user',
}

export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    PUT = 'put',
    DELETE = 'delete'
}