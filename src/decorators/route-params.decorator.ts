import { PARAM_METADATA_KEY } from '../utils/constants';
import { ActionParamType } from '../utils/types';

const createMappingDecorator = (param: string): Function =>
    (): ParameterDecorator => {
        return (target, key, index): void => {

            const paramTypes = Reflect.getMetadata('design:paramtypes', target, key);

            if (paramTypes && paramTypes[index]) {
                // Push and sort params
                const args = Reflect.getMetadata(PARAM_METADATA_KEY, target.constructor, key) || [];

                Reflect.defineMetadata(
                    PARAM_METADATA_KEY,
                    args.concat({
                        target: target.constructor,
                        type: param,
                        method: key,
                        index,
                        paramType: paramTypes[index],
                    }).sort((a: any, b: any) => a.index - b.index),
                    target.constructor,
                    key,
                );
            }

        };
    };

export function Body(): ParameterDecorator {
    return createMappingDecorator(ActionParamType.BODY)();
}

export function Query(): ParameterDecorator {
    return createMappingDecorator(ActionParamType.QUERY)();
}

export function Request(): ParameterDecorator {
    return createMappingDecorator(ActionParamType.REQUEST)();
}

export function Response(): ParameterDecorator {
    return createMappingDecorator(ActionParamType.RESPONSE)();
}

export function Params(): ParameterDecorator {
    return createMappingDecorator(ActionParamType.PARAMS)();
}

export function Lang(): ParameterDecorator {
    return createMappingDecorator(ActionParamType.LANG)();
}

export function User(): ParameterDecorator {
    return createMappingDecorator(ActionParamType.USER)();
}
