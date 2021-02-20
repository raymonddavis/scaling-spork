export default class MissingSporkError extends Error {
    constructor(classNames: string[]) {
        const message = `One or more classes has not been registered as a spork. ${classNames.join(
            ', ',
        )}`;
        super(message);
    }
}
