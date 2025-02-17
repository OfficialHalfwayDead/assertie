class AssertionError extends Error {
    constructor(msg) {
        super(`Assertion failed: ${msg}`);
        this.name = AssertionError.name;
    }
}
export function assert(hasToBeTrue, msg = "No specific message provided.") {
    if (!import.meta.env.DEV)
        return;
    if (!hasToBeTrue)
        throw new AssertionError(msg);
}
export function assertType(obj, expectedType) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj === expectedType)
        return;
    const reducedExpectedType = expectedType;
    if (obj === reducedExpectedType)
        return;
    const remainingOption = expectedType;
    if (obj instanceof remainingOption)
        return;
    throw new AssertionError(`Provided object was not of type ${(typeof expectedType !== "string") ? expectedType?.name : expectedType ?? expectedType}. Was: ${(obj === null) ? "null" : obj?.constructor?.name ?? typeof obj}, value: ${obj}`);
}
export function assertTypeOfString(obj) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj !== "string")
        throw new AssertionError(`Provided object was not of type string. Was: ${typeof obj}`);
}
export function assertTypeOfNumber(obj) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj !== "number")
        throw new AssertionError(`Provided object was not of type number. Was: ${typeof obj}`);
}
export function assertTypeOfBoolean(obj) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj !== "boolean")
        throw new AssertionError(`Provided object was not of type boolean. Was: ${typeof obj}`);
}
export function assertTypeOfBigint(obj) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj !== "bigint")
        throw new AssertionError(`Provided object was not of type bigint. Was: ${typeof obj}`);
}
export function assertTypeOfUndefined(obj) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj !== "undefined")
        throw new AssertionError(`Provided object was not of type undefined. Was: ${typeof obj}`);
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function assertTypeOfFunction(obj) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj !== "function")
        throw new AssertionError(`Provided object was not of type function. Was: ${typeof obj}`);
}
export function assertTypeOfObject(obj) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj !== "object")
        throw new AssertionError(`Provided object was not of type object. Was: ${typeof obj}`);
}
export function assertTypeOfSymbol(obj) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj !== "symbol")
        throw new AssertionError(`Provided object was not of type symbol. Was: ${typeof obj}`);
}
export function assertInstanceOf(obj, constructable) {
    if (!import.meta.env.DEV)
        return;
    if (!(obj instanceof constructable))
        throw new AssertionError(`Provided object was not of type ${constructable.name} but was type: ${(obj === null) ? "null" : obj?.constructor?.name ?? typeof obj}, value: ${obj}`);
}
export function assertUnreachable(obj, msg = "Unreachable code of type never was reached. TypeScript types are inaccurate somewhere.") {
    if (!import.meta.env.DEV)
        return;
    throw new AssertionError(msg);
}
export function assertPropsNonNullable(obj, props) {
    if (!import.meta.env.DEV)
        return;
    for (const prop of props) {
        if (obj[prop] === null || obj[prop] === undefined)
            throw new AssertionError(`Provided object prop ${String(prop)} should've been non-null but was: ${obj[prop]}`);
    }
}
export function assertNonNullable(obj) {
    if (!import.meta.env.DEV)
        return;
    if (obj === undefined || obj === null)
        throw new AssertionError(`Provided object should've been non-null but was: ${obj}`);
}
export function assertFiniteNumber(obj) {
    if (!import.meta.env.DEV)
        return;
    if (typeof obj !== "number")
        throw new AssertionError(`Provided object was not of type number. Was: ${typeof obj}`);
    if (!isFinite(obj))
        throw new AssertionError(`Provided number was not finite. Was: ${obj}`);
}
