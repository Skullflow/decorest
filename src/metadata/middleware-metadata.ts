import { IMiddlewareMetadataArgs } from './args';

export class MiddlewareMetadata {

    public target: Function;
    public method: string;
    public middleware: Function;

    constructor(args: IMiddlewareMetadataArgs) {
        this.target = args.target;
        this.method = args.method;
        this.middleware = args.middleware;
    }
}
