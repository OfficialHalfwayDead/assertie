import { getNameOfExpectedType, getTypeNameOfUnknown, isType } from "./assert-helpers";
/**
 * Error thrown by all assertie assertions when they fail.
 */
export class AssertieError extends Error {
    constructor(msg) {
        super(`Assertion failed: ${msg}`);
        this.name = AssertieError.name;
    }
}
/**
 * Asserts that the provided boolean is true.
 * @param {boolean} hasToBeTrue - The boolean to assert.
 * @param {string} msg - The message of the Error if the assertion fails.
 * @throws {AssertieError} if the assertion fails.
 */
export function assert(hasToBeTrue, msg = "No specific message provided.") {
    if (!import.meta.env.DEV)
        return;
    if (!hasToBeTrue)
        throw new AssertieError(msg);
}
/**
 * Asserts that the provided item is of the expectedType.
 * @param {unknown} item - The item which ought to be of the expectedType.
 * @param {AllJSTypes} expectedType - The expected type of the item. JS primitive types, null, undefined, and constructable types are supported. JS primitive types are passed as the string they return from typeof, e.g., "number".
 * @throws {AssertieError} if the type isn't as expected.
 */
export function assertType(item, expectedType) {
    if (!import.meta.env.DEV)
        return;
    if (!isType(item, expectedType))
        throw new AssertieError(`Provided object was not of type ${getNameOfExpectedType(expectedType)}. Was: ${getTypeNameOfUnknown(item)}, value: ${item}`);
}
export function assertArrayType(arr, expectedType) {
    if (!import.meta.env.DEV)
        return;
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr))
            throw new AssertieError(`Array to assert type of was sparse with a missing item at index ${i}`);
        const item = arr[i];
        if (!isType(item, expectedType))
            throw new AssertieError(`Provided array had item at index ${i} not of type ${getNameOfExpectedType(expectedType)}. Was: ${getTypeNameOfUnknown(item)}, value: ${item}`);
    }
}
export function assertTupleTypes(arrayOrTuple, expectedTypes) {
    if (!import.meta.env.DEV)
        return;
    if (arrayOrTuple.length !== expectedTypes.length) {
        throw new AssertieError(`Provided tuple length mismatch: expected ${expectedTypes.length}, but got ${arrayOrTuple.length}`);
    }
    for (let i = 0; i < expectedTypes.length; i++) {
        if (!(i in arrayOrTuple))
            throw new AssertieError(`Provided tuple was sparse with a missing item at required index ${i}`);
        const item = arrayOrTuple[i];
        if (!isType(item, expectedTypes[i])) {
            throw new AssertieError(`Provided tuple had item at index ${i} not of type ${getNameOfExpectedType(expectedTypes[i])}. Was: ${getTypeNameOfUnknown(item)}, value: ${item}`);
        }
    }
}
/**
 * Asserts that the provided item is of type string.
 * @param {unknown} item - The item which ought to be of type string.
 * @throws {AssertieError} if the type isn't string.
 */
export function assertTypeOfString(item) {
    if (!import.meta.env.DEV)
        return;
    if (typeof item !== "string")
        throw new AssertieError(`Provided item was not of type string. Was: ${getTypeNameOfUnknown(item)}`);
}
/**
 * Asserts that the provided item is of type number.
 * @param {unknown} item - The item which ought to be of type number.
 * @throws {AssertieError} if the type isn't number.
 */
export function assertTypeOfNumber(item) {
    if (!import.meta.env.DEV)
        return;
    if (typeof item !== "number")
        throw new AssertieError(`Provided item was not of type number. Was: ${getTypeNameOfUnknown(item)}`);
}
/**
 * Asserts that the provided item is of type boolean.
 * @param {unknown} item - The item which ought to be of type boolean.
 * @throws {AssertieError} if the type isn't boolean.
 */
export function assertTypeOfBoolean(item) {
    if (!import.meta.env.DEV)
        return;
    if (typeof item !== "boolean")
        throw new AssertieError(`Provided item was not of type boolean. Was: ${getTypeNameOfUnknown(item)}`);
}
/**
 * Asserts that the provided item is of type bigint.
 * @param {unknown} item - The item which ought to be of type bigint.
 * @throws {AssertieError} if the type isn't bigint.
 */
export function assertTypeOfBigint(item) {
    if (!import.meta.env.DEV)
        return;
    if (typeof item !== "bigint")
        throw new AssertieError(`Provided item was not of type bigint. Was: ${getTypeNameOfUnknown(item)}`);
}
/**
 * Asserts that the provided item is of type undefined.
 * @param {unknown} item - The item which ought to be of type undefined.
 * @throws {AssertieError} if the type isn't undefined.
 */
export function assertTypeOfUndefined(item) {
    if (!import.meta.env.DEV)
        return;
    if (typeof item !== "undefined")
        throw new AssertieError(`Provided item was not of type undefined. Was: ${getTypeNameOfUnknown(item)}`);
}
/**
 * Asserts that the provided item is of type function.
 * @param {unknown} item - The item which ought to be of type function.
 * @throws {AssertieError} if the type isn't function.
 */
export function assertTypeOfFunction(item) {
    if (!import.meta.env.DEV)
        return;
    if (typeof item !== "function")
        throw new AssertieError(`Provided item was not of type function. Was: ${getTypeNameOfUnknown(item)}`);
}
/**
 * Asserts that the provided item is of type object.
 * @param {unknown} item - The item which ought to be of type object.
 * @throws {AssertieError} if the type isn't object.
 */
export function assertTypeOfObject(item) {
    if (!import.meta.env.DEV)
        return;
    if (typeof item !== "object")
        throw new AssertieError(`Provided item was not of type object. Was: ${getTypeNameOfUnknown(item)}`);
}
/**
 * Asserts that the provided item is of type symbol.
 * @param {unknown} item - The item which ought to be of type symbol.
 * @throws {AssertieError} if the type isn't symbol.
 */
export function assertTypeOfSymbol(item) {
    if (!import.meta.env.DEV)
        return;
    if (typeof item !== "symbol")
        throw new AssertieError(`Provided item was not of type symbol. Was: ${getTypeNameOfUnknown(item)}`);
}
/**
 * Asserts that the provided item is null.
 * @param {unknown} item - The item which ought to be null.
 * @throws {AssertieError} if the value isn't null.
 */
export function assertNull(item) {
    if (!import.meta.env.DEV)
        return;
    if (item !== null)
        throw new AssertieError(`Provided item was not null. Was type: ${getTypeNameOfUnknown(item)}, value: ${item}`);
}
/**
 * Asserts that the provided item is an instance of the provided constructor.
 * @param {unknown} item - The item which ought to be an instance of the constructor.
 * @param {Constructor<T>} constructor - Anything that can be after an instanceof operator.
 * @throws {AssertieError} if item instanceof constructor is false.
 */
export function assertInstanceOf(item, constructor) {
    if (!import.meta.env.DEV)
        return;
    if (!(item instanceof constructor))
        throw new AssertieError(`Provided item was not of type ${constructor.name} but was type: ${getTypeNameOfUnknown(item)}, value: ${item}`);
}
export function assertIsTuple(arr, expectedLength) {
    if (!import.meta.env.DEV)
        return;
    if (arr.length !== expectedLength) {
        throw new AssertieError(`Provided array is not a tuple of expected length ${expectedLength}. It has length ${arr.length}.`);
    }
    for (let i = 0; i < expectedLength; i++) {
        if (!(i in arr))
            throw new AssertieError(`Provided tuple is sparse and therefore not a tuple. Index ${i} is missing.`);
    }
}
/**
 * Used to assert that code can never be reached. Pass a value which has already been checked for all types that should be possible. If the range of possible values increases, TypeScript will throw an error at compile time because the value won't be of type never.
 * @param {never} item - An exhausted value, of which all cases are accounted for in other branches of the code, such as at the end of a switch statement.
 * @param {string} msg - Override the default error message. Even if you do, the error message will include the value and type of item.
 * @throws {AssertieError} if at runtime the function call was reached. This should only happen if TypeScript types are inaccurate somewhere.
 */
export function assertUnreachable(item, msg = "Unreachable code of type never was reached. TypeScript types are inaccurate somewhere.") {
    if (!import.meta.env.DEV)
        return;
    throw new AssertieError(msg + `\nValue of type never was actually of type: ${getTypeNameOfUnknown(item)}, value: ${item}`);
}
/**
 * Asserts that the provided item is neither null nor undefined.
 * @param {unknown} item - The item which ought to be non-null.
 * @throws {AssertieError} if the item is null or undefined.
 */
export function assertNonNullable(item) {
    if (!import.meta.env.DEV)
        return;
    if (item === undefined || item === null)
        throw new AssertieError(`Provided item should've been non-null but was: ${item}`);
}
/**
 * Asserts that the provided object has non-null values for the properties passed as keys in the propKeys array.
 * @param {object} obj - The object which ought to have the properties.
 * @param {NullableKeys<T>} propKeys - An array of the stringified keys of the properties which ought to be non-null in the object.
 * @throws {AssertieError} if any of the properties was null, undefined, or not present in the object.
 */
export function assertPropsNonNullable(obj, propKeys) {
    if (!import.meta.env.DEV)
        return;
    for (const propKey of propKeys) {
        if (!(propKey in obj))
            throw new AssertieError(`Provided object prop ${String(propKey)} should've been non-null but was not present at all.`);
        if (obj[propKey] === null || obj[propKey] === undefined)
            throw new AssertieError(`Provided object prop ${String(propKey)} should've been non-null but was: ${obj[propKey]}`);
    }
}
export function assertArrayNonNullable(arr) {
    if (!import.meta.env.DEV)
        return;
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr))
            throw new AssertieError(`Provided array should've been non-null but was sparse with a missing item at index ${i}`);
        const item = arr[i];
        if (item === null)
            throw new AssertieError(`Provided array should've been non-null but had an item with value null at index ${i}`);
        if (item === undefined)
            throw new AssertieError(`Provided array should've been non-null but had an undefined item at index ${i}`);
    }
}
export function assertTupleNonNullable(tuple) {
    if (!import.meta.env.DEV)
        return;
    for (let i = 0; i < tuple.length; i++) {
        if (!(i in tuple))
            throw new AssertieError(`Provided tuple should've been non-null but is sparse. Index ${i} is missing.`);
        if (tuple[i] === null)
            throw new AssertieError(`Provided tuple should've been non-null but had an item with value null at index ${i}`);
        if (tuple[i] === undefined)
            throw new AssertieError(`Provided tuple should've been non-null but had an undefined item at index ${i}`);
    }
}
/**
 * Asserts that the provided item is a finite number. Use to prevent NaN propagation.
 * @param {unknown} item - The item which ought to be a finite number.
 * @throws {AssertieError} if the item is not of type number, or isFinite(item) is false, i.e., if the item is NaN, Infinity, or -Infinity.
 */
export function assertFiniteNumber(item) {
    if (!import.meta.env.DEV)
        return;
    if (typeof item !== "number")
        throw new AssertieError(`Provided item was not of type number. Was: ${getTypeNameOfUnknown(item)}`);
    if (!isFinite(item))
        throw new AssertieError(`Provided number was not finite. Was: ${item}`);
}
