export interface ISporkClass<T extends object> {
    new (...args: any[]): T;
}
