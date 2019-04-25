import { Response } from 'express';
import {classToPlain} from 'class-transformer';
import {isObject} from '../utils/functions';

export const serializeResponse = (results: any, response: Response): any => {
    const isArray = Array.isArray(results);

    console.log("entrato in transform");

    if (!isObject(results) && !isArray) {
        return results;
    }

    return isArray
        ? (results).map((item: any) => transformToPlain(item))
        : transformToPlain(results);
};

const transformToPlain = (plainOrClass: any): any => {
    return classToPlain(plainOrClass);
    /*return plainOrClass && plainOrClass.constructor !== Object
        ? classToPlain(plainOrClass)
        : plainOrClass;*/
};

