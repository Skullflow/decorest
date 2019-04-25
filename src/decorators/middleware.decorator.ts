import { MIDDLEWARE_METADATA_KEY } from '../utils/constants';

const createMappingDecorator = (): Function => (
    middleware: Function,
): MethodDecorator => {
    return (target, key, descriptor): PropertyDescriptor => {

        const args = Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, target.constructor, key) || [];

        Reflect.defineMetadata(MIDDLEWARE_METADATA_KEY,
            args.concat({
                middleware,
                method: key,
                target: target.constructor,
            }), target.constructor, key);

        return descriptor;
    };
};

/**
 * Middleware Decorator
 */
export const Middleware = createMappingDecorator();