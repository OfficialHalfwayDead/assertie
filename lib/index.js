function getNameOfExpectedType(expectedType) {
    if (expectedType === null)
        return "null";
    if (expectedType === undefined)
        return "undefined";
    if (typeof expectedType === "string")
        return expectedType;
    return expectedType.name;
}
export function getTypeNameOfUnknown(obj) {
    if (obj === null)
        return "null";
    if (obj === undefined)
        return "undefined";
    try {
        if (obj instanceof obj.constructor
            && obj.constructor.name !== "Function") {
            // I'd like function to match the primitive name "function"
            // because that's how the asserts are written.
            return obj.constructor.name;
        }
    }
    finally {
        return typeof obj;
    }
}
function isType(obj, expectedType) {
    if (typeof obj === expectedType)
        return true;
    const reducedExpectedType = expectedType;
    if (obj === reducedExpectedType)
        return true;
    const remainingOption = expectedType;
    if (obj instanceof remainingOption)
        return true;
    return false;
}
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
    if (!isType(obj, expectedType))
        throw new AssertionError(`Provided object was not of type ${getNameOfExpectedType(expectedType)}. Was: ${getTypeNameOfUnknown(obj)}, value: ${obj}`);
}
/**
 * Asserts that all elements of the provided array are of the expected type. It ensures that the array is not sparse (even when the expectedType is undefined).
 * @param arr - The array to assert.
 * @param expectedType - The expected type of individual items. JS primitive types, null, undefined, and constructable types are supported.
 */
export function assertArrayType(arr, expectedType) {
    if (!import.meta.env.DEV)
        return;
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr))
            throw new AssertionError(`Array to assert type of was sparse with a missing item at index ${i}`);
        const item = arr[i];
        if (!isType(item, expectedType))
            throw new AssertionError(`Provided array had item at index ${i} not of type ${getNameOfExpectedType(expectedType)}. Was: ${getTypeNameOfUnknown(item)}, value: ${item}`);
    }
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
export function assertNull(obj) {
    if (!import.meta.env.DEV)
        return;
    if (obj !== null)
        throw new AssertionError(`Provided object was not null. Was: ${obj}`);
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
export function assertPropsNonNullable(obj, propKeys) {
    if (!import.meta.env.DEV)
        return;
    for (const propKey of propKeys) {
        if (obj[propKey] === null || obj[propKey] === undefined)
            throw new AssertionError(`Provided object prop ${String(propKey)} should've been non-null but was: ${obj[propKey]}`);
    }
}
/**
 * Asserts that all elements of the provided array are neither null nor undefined.
 * @param arr - The array to assert.
 */
export function assertArrayNonNullable(arr) {
    if (!import.meta.env.DEV)
        return;
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr))
            throw new AssertionError(`Provided array should've been non-null but was sparse with a missing item at index ${i}`);
        const item = arr[i];
        if (item === null)
            throw new AssertionError(`Provided array should've been non-null but had an item with value null at index ${i}`);
        if (item === undefined)
            throw new AssertionError(`Provided array should've been non-null but had an undefined item at index ${i}`);
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
