import {IInterceptorMetadataArgs} from './args';

export class InterceptorMetadata {

    public target: Function;
    public method: string;
    public interceptor: Function;

    constructor(args: IInterceptorMetadataArgs) {
        this.target = args.target;
        this.method = args.method;
        this.interceptor = args.interceptor;
    }
}
