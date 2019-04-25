import { IActionMetadataArgs } from '../metadata/args';
import { ParamMetadata } from './param-metadata';
import { RequestMethod } from '../utils/types';
import { MiddlewareMetadata } from './middleware-metadata';
import { InterceptorMetadata } from './interceptor-metadata';

export class ActionMetadata {
    public target: Function;
    public method: string;
    public httpMethod: RequestMethod;
    public route: string;
    public params: ParamMetadata[] = [];
    public middlewares: MiddlewareMetadata[] = [];
    public interceptors: InterceptorMetadata[] = [];

    constructor(args: IActionMetadataArgs) {
        this.target = args.target;
        this.route = args.route;
        this.method = args.method;
        this.httpMethod = args.httpMethod;
    }

    public setParams(params: ParamMetadata[]): void {
        this.params = params;
    }

    public setMiddlewares(middlewares: MiddlewareMetadata[]): void {
        this.middlewares = middlewares;
    }

    public setInterceptor(interceptors: InterceptorMetadata[]): void {
        this.interceptors = interceptors;
    }

}
