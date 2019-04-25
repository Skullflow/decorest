import { INTERCEPTOR_METADATA_KEY } from '../utils/constants';

type CreateMappingDecoratorResult = (interceptor: Function | Promise<any>) => MethodDecorator;

const createMappingDecorator = (): CreateMappingDecoratorResult => (interceptor: Function | Promise<any>)
    : MethodDecorator => {
    return (target, key, descriptor): PropertyDescriptor => {

        const args = Reflect.getMetadata(INTERCEPTOR_METADATA_KEY, target.constructor, key) || [];

        Reflect.defineMetadata(INTERCEPTOR_METADATA_KEY,
            args.concat({
                interceptor,
                method: key,
                target: target.constructor,
            }), target.constructor, key);

        return descriptor;
    };
};

/**
 * Middleware Decorator
 */
export const Interceptor = createMappingDecorator();