import { IControllerMetadataArgs } from './args';
import { ActionMetadata } from './action-metadata';
import { getFromContainer } from '../core';

export class ControllerMetadata {
    public target: Function;
    public route: string;
    public type: 'json';
    public actions: ActionMetadata[] = [];

    constructor(args: IControllerMetadataArgs) {
        this.target = args.target;
        this.route = args.route;
        this.type = args.type;
    }

    public setActions(actions: ActionMetadata[]): void {
        this.actions = actions;
    }

    /**
     * Gets instance of the controller.
     */
    get instance(): any {
        return getFromContainer(this.target);
    }

}
