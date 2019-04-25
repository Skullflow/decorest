import {ACTION_METADATA_KEY} from '../utils/constants';
import {RequestMethod} from '../utils/types';

export interface IRequestMappingMetadata {
    route?: string | string[];
    httpMethod?: RequestMethod;
}

const defaultMetadata = {
    route: '/',
    httpMethod: RequestMethod.GET,
};


export const RequestMapping = (metadata: IRequestMappingMetadata = defaultMetadata): MethodDecorator => {

    const route = metadata.route || '/';
    const httpMethod = metadata.httpMethod || RequestMethod.GET;

    return (target, method, descriptor): PropertyDescriptor => {

        const returnType = Reflect.getMetadata('design:returntype', target, method);
        const args = Reflect.getMetadata(ACTION_METADATA_KEY, target.constructor) || [];

        Reflect.defineMetadata(
            ACTION_METADATA_KEY,
            args.concat({
                route,
                returnType,
                method,
                httpMethod,
                target: target.constructor,
            }),
            target.constructor,
        );

        return descriptor;
    };
};

const createMappingDecorator = (httpMethod: RequestMethod): Function => (
    route?: string,
): MethodDecorator => RequestMapping({ route, httpMethod });

/**
 * Request method decorators
 */
export const Get = createMappingDecorator(RequestMethod.GET);
export const Post = createMappingDecorator(RequestMethod.POST);
export const Patch = createMappingDecorator(RequestMethod.PATCH);
export const Put = createMappingDecorator(RequestMethod.PUT);
export const Delete = createMappingDecorator(RequestMethod.DELETE);