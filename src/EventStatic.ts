import {Base} from "./Base";

export interface EventStatic<T extends Base> {
    _staticType: Symbol

    new(...args:any[]): T
}
