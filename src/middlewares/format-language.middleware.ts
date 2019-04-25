import { NextFunction, Request, Response } from 'express';

export function formatLanguage(request: Request, response: Response, next: NextFunction) {

    const arrayLang = [
        'it-it',
        'en-us',
    ];

    const langHeader = request.get('Accept-Language');

    if(langHeader) {
        if(arrayLang.includes(langHeader)) {
            response.locals.lang = langHeader;
            return next();
        } else {
            // Check if Accept-Language is like 'it' or 'en'
            for (const lang of arrayLang) {
                const splitted = lang.split('-');
                if (splitted[0] === langHeader) {
                    response.locals.lang = lang;
                    return next();
                }
            }
        }
    }

    response.locals.lang = 'it-it';

    return next();
}