import { NotFoundException } from "../classes/NotFoundException.class";
import * as express from "express";
import { validation, formatLanguage } from "../middlewares";
import { MetadataBuilder } from "./metadata-builder";
import { ActionMetadata, ControllerMetadata, ParamMetadata } from "../metadata";
import { ICallbackArgs, IInitServerProps, IServerProps } from "../utils/interfaces";
import { ActionParamType, MiddlewareHandler, RequestMethod } from "../utils/types";
import { useContainer } from "./container";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Container } from "typedi";
import { ValidationException } from '../classes';

/**
 * Default server props
 */
const defaultServerProps: IServerProps = {
    port: "8080",
    validate: true,
    useTypeDi: true,
};

/**
 * Class that handle server creation
 */
export class Server {

    /**
     * Inject decorated action parameter
     */
    private static async handleParameter({ type, paramType }: ParamMetadata, args: ICallbackArgs): Promise<any> {

        if (type === ActionParamType.REQUEST) {
            return args.request;
        }
        if (type === ActionParamType.RESPONSE) {
            return args.response;
        }
        if (type === ActionParamType.LANG) {
            return args.response.locals.lang;
        }

        let param;

        if (type === ActionParamType.BODY) {
            param = args.request.body;
        }
        if (type === ActionParamType.QUERY) {
            param = args.request.query;
        }
        if (type === ActionParamType.PARAMS) {
            param = args.request.params;
        }
        if (type === ActionParamType.USER) {
            if (!args.request.user) throw new Error('Request user is undefined')
            param = args.request.user;
        }

        if (!param) {
            throw new Error('Could not find parameter to inject')
        }

        const transformed = plainToClass(paramType, param);
        const errors = await validate(transformed, {
            whitelist: true
        })

        if (errors.length > 0) {
            throw new ValidationException(errors)
        }

        return transformed;
    }

    /**
     * Once the action is called, handle results
     */
    private static handleResults(results: any, actionMetadata: ActionMetadata, args: ICallbackArgs): void {
        // Check if headers are already sent.
        // This is useful if action inject the response object
        if (args.response.headersSent) {
            return args.next();
        }

        // If results is undefined or null, throw not found exeption
        if (results === undefined || results === null) {
            throw new NotFoundException();
        }

        // Send results and call middleware triggered after the action
        args.response.json(results);
        args.next();
    }

    public app: express.Application;
    private readonly port: string;
    private metadataBuilder: MetadataBuilder;
    private controllers: ControllerMetadata[] = [];
    private readonly validate: boolean;

    constructor(args: IServerProps = defaultServerProps) {

        // Use typedi container
        if (args.useTypeDi) {
            useContainer(Container);
        }

        this.port = args.port;
        this.app = express();
        this.validate = args.validate;
        this.metadataBuilder = new MetadataBuilder();

    }

    public getPort(): string {
        return this.port;
    }

    /**
     * Register controllers, actions and middlewares
     */
    public init(args: IInitServerProps): void {
        this.initMiddlewares(args.middlewares);
        this.initControllers(args.controllers);
        this.initErrorHandlers(args.errorHandlers);
    }

    /**
     * Attach server to specific port
     */
    public async listen(cb: Function): Promise<void> {
        this.app.listen(this.port, () => cb());
    }
    /**
     *  Init global middlewares
     */
    private initMiddlewares(middlewares: any[] = []): void {

        // Push default middlewares
        this.app.use(formatLanguage);

        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }

    /**
     * Init global handler
     */
    private initErrorHandlers(errorHandlers: any[] = []): void {
        errorHandlers.forEach(errorHandler => {
            this.app.use(errorHandler);
        });
    }


    /*************************************
     *  BUILD WEB SERVER USING METADATA  *
     *************************************/

    /**
     * Build controller metadata and register actions
     */
    private initControllers(controllers: Function[]): void {
        // Create controllers metadata
        this.controllers = this.metadataBuilder.createControllers(controllers);
        // For each controller metadata, register and execute defined actions
        this.controllers.forEach(controller => {
            // Create instance on server building phase
            // Not in router handling
            console.log("Controller:", controller.instance);
            // For each controller, create an express Router
            const router = express.Router();
            controller.actions.forEach(action => {
                // register every route handler inside controller
                this.registerAction(action, router, (args: ICallbackArgs) => {
                    // execute action logic when a route is being called
                    const promise = this.executeAction(controller.instance, action, args);
                });
            });
            this.app.use(controller.route, router);
        });
    }

    /**
     * Configure express Router and set request handler callback
     */
    private registerAction(action: ActionMetadata, router: express.Router, cb: Function): void {
        const routeHandler = (
            request: express.Request,
            response: express.Response,
            next: express.NextFunction): Function => {
            return cb({ request, response, next });
        };

        const handlers = [
            ...this.injectPredictedActionMiddlewares(action),
            ...this.registerActionMiddlewares(action),
            routeHandler,
        ];

        switch (action.httpMethod) {
            case RequestMethod.GET:
                // @ts-ignore
                router.get(action.route, handlers);
                break;
            case RequestMethod.POST:
                // @ts-ignore
                router.post(action.route, handlers);
                break;
            case RequestMethod.PATCH:
                // @ts-ignore
                router.post(action.route, handlers);
                break;
            case RequestMethod.PUT:
                // @ts-ignore
                router.post(action.route, handlers);
                break;
            case RequestMethod.DELETE:
                // @ts-ignore
                router.post(action.route, handlers);
                break;
            default:
                throw new Error("Method action is not defined");
        }

    }

    /**
     * Register middlewares for a specific action
     */
    private registerActionMiddlewares(action: ActionMetadata): Function[] {
        const middlewares: MiddlewareHandler[] = [];
        action.middlewares.forEach(middleware => {
            middlewares.push(middleware.middleware as MiddlewareHandler);
        });
        return middlewares;
    }

    /**
     * Predict action middlewares based on injected params
     */
    private injectPredictedActionMiddlewares(action: ActionMetadata): Function[] {
        const middlewares: MiddlewareHandler[] = [];
        action.params.forEach((param: ParamMetadata) => {
            if (this.validate) {
                if (param.type === ActionParamType.BODY || param.type === ActionParamType.QUERY) {
                    middlewares.push(validation(param.paramType, param.type));
                }
            }
        });
        return middlewares;
    }

    /**
     * Prepare and execute an action
     */
    private async executeAction(controllerInstance: any, actionMetadata: ActionMetadata, args: ICallbackArgs)
        : Promise<void> {
        // Prepare and sort parameters to inject on this route handler
        let params = actionMetadata.params
            .sort((param1, param2) => param1.index - param2.index)

        const promises = params
            .map(async (param) => Server.handleParameter(param, args));

        params = await Promise.all(promises);

        try {
            // Call the action and return some results
            let results = await controllerInstance[actionMetadata.method].apply(controllerInstance, params);

            /**
             * Creates interceptors from the given "use interceptors"
             */
            for (const interceptorMetadata of actionMetadata.interceptors) {
                results = await interceptorMetadata.interceptor(results, args.response);
            }

            Server.handleResults(results, actionMetadata, args);
        } catch (err) {
            // If something goes wrong, call the error handler
            args.next(err);
        }
    }
}
