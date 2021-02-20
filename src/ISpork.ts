export interface ISpork<T extends object> {
    new (...args: any[]): T;
}
