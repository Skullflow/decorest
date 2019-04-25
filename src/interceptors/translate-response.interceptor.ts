import { isObject } from '../utils/functions';
import { Response } from 'express';

enum LangEnum {
    IT_IT = 'it-it',
    EN_US = 'en-us',
}

export const translateResponse = (item: any, response: Response): any => {

    const lang: LangEnum = response.locals.lang;

    const isArray = Array.isArray(item);

    if (!isObject(item) && !isArray) {
        return item;
    }

    // @ts-ignore
    if ('translate' in item && (item.translate instanceof Function)) {
        item.translate(lang);
        return item;
    } else if (Array.isArray(item)) {
        return item.map(element => translateResponse(element, response));
    } else if (isObject(item)) {
        const keys = Object.keys(item);
        const obj: any = {};
        keys.forEach(key => {
            // @ts-ignore
            obj[key] = translateResponse(item[key], response);
        });

        return obj;

    } else {
        return item;
    }
};
