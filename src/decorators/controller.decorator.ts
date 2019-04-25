import {CONTROLLER_METADATA_KEY} from '../utils/constants';

export const Controller = (route: string): Function => {
    return (target: Function): void => {
        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, {
            route,
            target,
            type: 'json',
        }, target);
    };
};
