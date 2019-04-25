import {
    CONTROLLER_METADATA_KEY,
    ACTION_METADATA_KEY,
    PARAM_METADATA_KEY,
    MIDDLEWARE_METADATA_KEY, INTERCEPTOR_METADATA_KEY,
} from '../utils/constants';

import {
    IControllerMetadataArgs,
    IActionMetadataArgs,
    IParamMetadataArgs, IMiddlewareMetadataArgs, IInterceptorMetadataArgs,
} from '../metadata/args';

import {
    MiddlewareMetadata,
    InterceptorMetadata,
    ControllerMetadata,
    ActionMetadata,
    ParamMetadata,
} from '../metadata';

/*
 * Retrieve controller metadata
 */
export class MetadataBuilder {

    private static getControllerMetadata(target: Function): ControllerMetadata {
        const controllerMetadata: IControllerMetadataArgs = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
        return new ControllerMetadata(controllerMetadata);
    }

    public createControllers(targets: Function[]): ControllerMetadata[] {
        return targets.map(target => {
            const controller = MetadataBuilder.getControllerMetadata(target);
            const actions = this.getActionsMetadata(target);
            actions.forEach(action => {
                action.setMiddlewares(this.getMiddlewaresMetadata(target, action.method));
                action.setInterceptor(this.getInterceptorsMetadata(target, action.method));
                action.setParams(this.getParamsMetadata(target, action.method));
            });
            controller.setActions(actions);
            return controller;
        });

    }

    private getParamsMetadata(target: Function, key: string): ParamMetadata[] {
        const paramMetadata: IParamMetadataArgs[] =
            Reflect.getMetadata(PARAM_METADATA_KEY, target, key) || [];
        return paramMetadata.map(param => new ParamMetadata(param));
    }

    private getActionsMetadata(target: Function): ActionMetadata[] {
        const actionMetadata: IActionMetadataArgs[] =
            Reflect.getMetadata(ACTION_METADATA_KEY, target);
        return actionMetadata.map(action => new ActionMetadata(action));
    }

    private getMiddlewaresMetadata(target: Function, key: string): MiddlewareMetadata[] {
        const middlewareMetadata: IMiddlewareMetadataArgs[] =
            Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, target, key) || [];
        return middlewareMetadata.map(middleware => new MiddlewareMetadata(middleware));
    }

    private getInterceptorsMetadata(target: Function, key: string): InterceptorMetadata[] {
        const interceptorMetadata: IInterceptorMetadataArgs[] =
            Reflect.getMetadata(INTERCEPTOR_METADATA_KEY, target, key) || [];
        return interceptorMetadata.map(interceptor => new InterceptorMetadata(interceptor));
    }
}
