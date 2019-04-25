import {ActionMetadata} from "../action-metadata";

export interface IControllerMetadataArgs {
    target: Function,
    route: string,
    type: "json",
    actionMetadata: ActionMetadata
}