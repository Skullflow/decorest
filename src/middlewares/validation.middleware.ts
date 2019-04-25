import * as express from 'express';
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from 'class-validator';
import { ValidationException } from '../classes';
import { ActionParamType } from "../utils/types";

const getResourceToValidate = (request: express.Request, resource: ActionParamType = ActionParamType.BODY) => {
    switch (resource) {
        case ActionParamType.BODY:
            return request.body;
        case ActionParamType.QUERY:
            return request.query;
        /*case ActionParamType.PARAMS:
            return request.params;*/
        default:
            return request.body;
    }
};

export function validation<T>(type: any, requestParam: ActionParamType = ActionParamType.BODY): express.RequestHandler {
    return (request, response, next) => {

        const resourceToValidate = getResourceToValidate(request, requestParam) || {};

        validate(plainToClass(type, resourceToValidate))
            .then((errors: ValidationError[]) => {

                if (errors.length > 0) {
                    next(new ValidationException(errors));
                } else {
                    next();
                }
            })
    }
}