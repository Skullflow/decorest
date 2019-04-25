import {RequestMethod} from '../../utils/types';

export interface IActionMetadataArgs {
    route: string;
    target: Function;
    returnType: any;
    method: string;
    httpMethod: RequestMethod;
}
