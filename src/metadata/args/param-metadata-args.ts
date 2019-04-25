import { ActionParamType } from "../../utils/types";

export interface IParamMetadataArgs {
    target: Function;
    method: string;
    index: number;
    type: ActionParamType;
    name: string;
    paramType: any;
}