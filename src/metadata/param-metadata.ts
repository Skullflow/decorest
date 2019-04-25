import { ActionParamType } from '../utils/types';
import { IParamMetadataArgs } from './args';

export class ParamMetadata {

    public target: Function;
    public method: string;
    public name: string;
    public paramType: any;
    public index: number;
    public type: ActionParamType;

    constructor(args: IParamMetadataArgs) {
        this.target = args.target;
        this.method = args.method;
        this.name = args.name;
        this.paramType = args.paramType;
        this.index = args.index;
        this.type = args.type;
    }
}
