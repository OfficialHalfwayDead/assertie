// Creates a tuple of length N with all elements of type T
type Tuple<T, N extends number, A extends unknown[] = []> =
    A["length"] extends N ? A : Tuple<T, N, [...A, T]>;

type PrimitiveTypes = {
    "string": string;
    "number": number;
    "boolean": boolean;
    "bigint": bigint;
    "undefined": undefined;
    "function": Function;
    "object": object;
    "symbol": symbol;
};
type PrimitiveTypeStrings = keyof PrimitiveTypes;

type NullableKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : null extends T[K] ? K : never;
}[keyof T];

type PropsNonNullable<T, N extends NullableKeys<T>> = T & {
    [K in N]-?: NonNullable<T[K]>;
};

type Constructor<T> = new (...args: any[]) => T;

type AllJSTypes = PrimitiveTypeStrings | null | undefined | Constructor<unknown>;

type ResolveAnyJSType<T extends AllJSTypes> = T extends 
    | PrimitiveTypeStrings ? PrimitiveTypes[T]
    : T extends null ? null
    : T extends undefined ? undefined
    : T extends Constructor<infer U> ? U
    : never;

function getNameOfExpectedType(expectedType: AllJSTypes): string {
    if (expectedType === null) return "null";
    if (expectedType === undefined) return "undefined";
    if (typeof expectedType === "string") return expectedType;
    return expectedType.name;
}

function getTypeNameOfUnknown(item: unknown): string {
    if (item === null) return "null";
    if (item === undefined) return "undefined";
    try {
        if (item instanceof item.constructor && item.constructor.name !== "Function") {
            // I'd like function to match the primitive name "function"
            // because that's how the asserts are written.
            return item.constructor.name;
        }
    } finally {
        return typeof item;
    }
}

function isType<T extends AllJSTypes>(item: unknown, expectedType: T): item is ResolveAnyJSType<T> {
    if (typeof item === expectedType) return true;
    const reducedExpectedType = expectedType as Exclude<typeof expectedType, PrimitiveTypeStrings>;

    if (item === reducedExpectedType) return true;
    const remainingOption = expectedType as Exclude<typeof reducedExpectedType, null | undefined>;

    if (item instanceof remainingOption) return true;

    return false;
}

class AssertionError extends Error {
    constructor(msg: string) {
        super(`Assertion failed: ${msg}`);
        this.name = AssertionError.name;
    }
}

/**
 * Asserts that the provided boolean is true.
 * @param {boolean} hasToBeTrue - The boolean to assert.
 * @param {string} msg - The message of the Error if the assertion fails.
 * @throws {AssertionError} if the assertion fails.
 */
export function assert(
    hasToBeTrue: boolean,
    msg: string = "No specific message provided."
): asserts hasToBeTrue is true {
    if (!import.meta.env.DEV) return;
    if (!hasToBeTrue) throw new AssertionError(msg);
}

/**
 * Asserts that the provided object is of the expectedType.
 * @param {unknown} item - The object which ought to be of the expectedType.
 * @param {AllJSTypes} expectedType - The expected type of the object. JS primitive types, null, undefined, and constructable types are supported. JS primitive types are passed as the string they return from typeof, e.g., "number".
 * @throws {AssertionError} if the type isn't as expected.
 */
export function assertType<T extends AllJSTypes>(
    item: unknown,
    expectedType: T
): asserts item is ResolveAnyJSType<T> {
    if (!import.meta.env.DEV) return;
    if (!isType(item, expectedType))
        throw new AssertionError(
            `Provided object was not of type ${getNameOfExpectedType(
                expectedType
            )}. Was: ${getTypeNameOfUnknown(item)}, value: ${item}`
        );
}

/**
 * Asserts that all elements of the provided array are of the expected type. It ensures that the array is not sparse (even when the expectedType is undefined).
 * @param {unknown[]} arr - The array which ought to be an array of the expectedType, i.e. expectedType: "number" => arr: number[]
 * @param {AllJSTypes} expectedType - The expected type of individual items. JS primitive types, null, undefined, and constructable types are supported.
 * @throws {AssertionError} if the type isn't as expected.
 */
export function assertArrayType<T extends AllJSTypes>(
    arr: unknown[],
    expectedType: T
): asserts arr is ResolveAnyJSType<T>[] {
    if (!import.meta.env.DEV) return;
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr))
            throw new AssertionError(
                `Array to assert type of was sparse with a missing item at index ${i}`
            );
        const item = arr[i];
        if (!isType(item, expectedType))
            throw new AssertionError(
                `Provided array had item at index ${i} not of type ${getNameOfExpectedType(
                    expectedType
                )}. Was: ${getTypeNameOfUnknown(item)}, value: ${item}`
            );
    }
}

/**
 * Asserts that the array or tuple has the expected types at each index.
 * @param {unknown[] | [unknown, ...]} arrayOrTuple - The tuple which ought to be an array of the length and types.
 * @param {[AllJSTypes, ...]} expectedTypes - A tuple of expected types of individual items, e.g., expectedTypes = ["number", "string", Date] => arrayOrTuple: [number, string, Date]. The individual entries can be JS primitive types, null, undefined, and constructors.
 * @throws {AssertionError} if the type of any element of the tuple isn't as expected.
 */
export function assertTupleTypes<
    T extends readonly AllJSTypes[],
    U extends
        | { [K in keyof T]: unknown } // [...unknown] matching length of [...T]
        | (number extends U["length"] ? unknown[] : never) // Array with compile time unknown length
>(
    arrayOrTuple: U,
    expectedTypes: readonly [...T]
): asserts arrayOrTuple is U & { [K in keyof T]: ResolveAnyJSType<T[K]> } {
    if (!import.meta.env.DEV) return;
    if (arrayOrTuple.length !== expectedTypes.length) {
        throw new AssertionError(
            `Provided tuple length mismatch: expected ${expectedTypes.length}, but got ${arrayOrTuple.length}`
        );
    }
    for (let i = 0; i < expectedTypes.length; i++) {
        if (!(i in arrayOrTuple))
            throw new AssertionError(
                `Provided tuple was sparse with a missing item at required index ${i}`
            );
        const item = arrayOrTuple[i];
        if (!isType(item, expectedTypes[i])) {
            throw new AssertionError(
                `Provided tuple had item at index ${i} not of type ${getNameOfExpectedType(
                    expectedTypes[i]
                )}. Was: ${getTypeNameOfUnknown(item)}, value: ${item}`
            );
        }
    }
}

/**
 * Asserts that the provided item is of type string.
 * @param {unknown} item - The item which ought to be of type string.
 * @throws {AssertionError} if the type isn't string.
 */
export function assertTypeOfString(item: unknown): asserts item is string {
    if (!import.meta.env.DEV) return;
    if (typeof item !== "string")
        throw new AssertionError(
            `Provided item was not of type string. Was: ${getTypeNameOfUnknown(item)}`
        );
}

/**
 * Asserts that the provided item is of type number.
 * @param {unknown} item - The item which ought to be of type number.
 * @throws {AssertionError} if the type isn't number.
 */
export function assertTypeOfNumber(item: unknown): asserts item is number {
    if (!import.meta.env.DEV) return;
    if (typeof item !== "number")
        throw new AssertionError(
            `Provided item was not of type number. Was: ${getTypeNameOfUnknown(item)}`
        );
}

/**
 * Asserts that the provided item is of type boolean.
 * @param {unknown} item - The item which ought to be of type boolean.
 * @throws {AssertionError} if the type isn't boolean.
 */
export function assertTypeOfBoolean(item: unknown): asserts item is boolean {
    if (!import.meta.env.DEV) return;
    if (typeof item !== "boolean")
        throw new AssertionError(
            `Provided item was not of type boolean. Was: ${getTypeNameOfUnknown(item)}`
        );
}

/**
 * Asserts that the provided item is of type bigint.
 * @param {unknown} item - The item which ought to be of type bigint.
 * @throws {AssertionError} if the type isn't bigint.
 */
export function assertTypeOfBigint(item: unknown): asserts item is bigint {
    if (!import.meta.env.DEV) return;
    if (typeof item !== "bigint")
        throw new AssertionError(
            `Provided item was not of type bigint. Was: ${getTypeNameOfUnknown(item)}`
        );
}

/**
 * Asserts that the provided item is of type undefined.
 * @param {unknown} item - The item which ought to be of type undefined.
 * @throws {AssertionError} if the type isn't undefined.
 */
export function assertTypeOfUndefined(item: unknown): asserts item is undefined {
    if (!import.meta.env.DEV) return;
    if (typeof item !== "undefined")
        throw new AssertionError(
            `Provided item was not of type undefined. Was: ${getTypeNameOfUnknown(item)}`
        );
}

/**
 * Asserts that the provided item is of type function.
 * @param {unknown} item - The item which ought to be of type function.
 * @throws {AssertionError} if the type isn't function.
 */
export function assertTypeOfFunction(item: unknown): asserts item is Function {
    if (!import.meta.env.DEV) return;
    if (typeof item !== "function")
        throw new AssertionError(
            `Provided item was not of type function. Was: ${getTypeNameOfUnknown(item)}`
        );
}

/**
 * Asserts that the provided item is of type object.
 * @param {unknown} item - The item which ought to be of type object.
 * @throws {AssertionError} if the type isn't object.
 */
export function assertTypeOfObject(item: unknown): asserts item is object {
    if (!import.meta.env.DEV) return;
    if (typeof item !== "object")
        throw new AssertionError(
            `Provided item was not of type object. Was: ${getTypeNameOfUnknown(item)}`
        );
}

/**
 * Asserts that the provided item is of type symbol.
 * @param {unknown} item - The item which ought to be of type symbol.
 * @throws {AssertionError} if the type isn't symbol.
 */
export function assertTypeOfSymbol(item: unknown): asserts item is symbol {
    if (!import.meta.env.DEV) return;
    if (typeof item !== "symbol")
        throw new AssertionError(
            `Provided item was not of type symbol. Was: ${getTypeNameOfUnknown(item)}`
        );
}

/**
 * Asserts that the provided item is null.
 * @param {unknown} item - The item which ought to be null.
 * @throws {AssertionError} if the value isn't null.
 */
export function assertNull(item: unknown): asserts item is null {
    if (!import.meta.env.DEV) return;
    if (item !== null)
        throw new AssertionError(
            `Provided item was not null. Was type: ${getTypeNameOfUnknown(item)}, value: ${item}`
        );
}

/**
 * Asserts that the provided item is an instance of the provided constructor.
 * @param {unknown} item - The item which ought to be an instance of the constructor.
 * @param {Constructor<T>} constructor - Anything that can be after an instanceof operator.
 * @throws {AssertionError} if item instanceof constructor is false.
 */
export function assertInstanceOf<T>(item: unknown, constructor: Constructor<T>): asserts item is T {
    if (!import.meta.env.DEV) return;
    if (!(item instanceof constructor))
        throw new AssertionError(
            `Provided item was not of type ${constructor.name} but was type: ${getTypeNameOfUnknown(
                item
            )}, value: ${item}`
        );
}

/**
 * Asserts that the provided array is a tuple of exactly the expected length.
 * @param {unknown[]} arr - The array which ought to be a tuple.
 * @param {number} expectedLength - The exact expected length of the tuple.
 * @throws {AssertionError} if the array isn't of the expected length or is sparse.
 */
export function assertIsTuple<
    T extends number extends T["length"] ? unknown[] : never,
    N extends number
>(arr: [...T], expectedLength: N): asserts arr is T & Tuple<T[number], N> {
    if (!import.meta.env.DEV) return;
    if (arr.length !== expectedLength) {
        throw new AssertionError(
            `Provided array is not a tuple of expected length ${expectedLength}. It has length ${arr.length}.`
        );
    }
    for (let i = 0; i < expectedLength; i++) {
        if (!(i in arr))
            throw new AssertionError(
                `Provided tuple is sparse and therefore not a tuple. Index ${i} is missing.`
            );
    }
}

/**
 * Used to assert that code can never be reached. Pass a value which has already been checked for all types that should be possible. If the range of possible values increases, TypeScript will throw an error at compile time because the value won't be of type never.
 * @param {never} item - An exhausted value, of which all cases are accounted for in other branches of the code, such as at the end of a switch statement.
 * @param {string} msg - Override the default error message. Even if you do, the error message will include the value and type of item.
 * @throws {AssertionError} if at runtime the function call was reached. This should only happen if TypeScript types are inaccurate somewhere.
 */
export function assertUnreachable(
    item: never,
    msg: string = "Unreachable code of type never was reached. TypeScript types are inaccurate somewhere."
): asserts item is never {
    if (!import.meta.env.DEV) return;
    throw new AssertionError(
        msg +
            `\nValue of type never was actually of type: ${getTypeNameOfUnknown(
                item
            )}, value: ${item}`
    );
}

/**
 * Asserts that the provided item is neither null nor undefined.
 * @param {unknown} item - The item which ought to be non-null.
 * @throws {AssertionError} if the item is null or undefined.
 */
export function assertNonNullable<T>(item: T): asserts item is NonNullable<T> {
    if (!import.meta.env.DEV) return;
    if (item === undefined || item === null)
        throw new AssertionError(`Provided item should've been non-null but was: ${item}`);
}

/**
 * Asserts that the provided object has non-null values for the properties passed as keys in the propKeys array.
 * @param {object} obj - The object which ought to have the properties.
 * @param {NullableKeys<T>} propKeys - An array of the stringified keys of the properties which ought to be non-null in the object.
 * @throws {AssertionError} if any of the properties was null, undefined, or not present in the object.
 */
export function assertPropsNonNullable<T extends object, N extends NullableKeys<T>>(
    obj: T,
    propKeys: N[]
): asserts obj is PropsNonNullable<T, N> {
    if (!import.meta.env.DEV) return;
    for (const propKey of propKeys) {
        if (!(propKey in obj))
            throw new AssertionError(
                `Provided object prop ${String(
                    propKey
                )} should've been non-null but was not present at all.`
            );
        if (obj[propKey] === null || obj[propKey] === undefined)
            throw new AssertionError(
                `Provided object prop ${String(propKey)} should've been non-null but was: ${
                    obj[propKey]
                }`
            );
    }
}

/**
 * Asserts that all elements of the provided array are neither null nor undefined, or not present.
 * @param {unknown[]} arr - The array which ought to be non-sparse, and have only non-null elements.
 * @throws {AssertionError} if any of the elements was null, undefined, or not present in the array.
 */
export function assertArrayNonNullable<T>(arr: T[]): asserts arr is NonNullable<T>[] {
    if (!import.meta.env.DEV) return;
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr))
            throw new AssertionError(
                `Provided array should've been non-null but was sparse with a missing item at index ${i}`
            );
        const item = arr[i];
        if (item === null)
            throw new AssertionError(
                `Provided array should've been non-null but had an item with value null at index ${i}`
            );
        if (item === undefined)
            throw new AssertionError(
                `Provided array should've been non-null but had an undefined item at index ${i}`
            );
    }
}

/**
 * Asserts that the provided tuple has non-null values for all elements. This function does not take a length. So if you want to assert that the typescript tuple type is of the correct length, call @see assertIsTuple first.
 * @param {[unknown, ...]} tuple - The tuple which ought to have only non-null values.
 * @throws {AssertionError} if any of the elements was null, undefined, or an index not present in the tuple.
 */
export function assertTupleNonNullable<T extends number extends T["length"] ? never : unknown[]>(
    tuple: T
): asserts tuple is { [K in keyof T]: NonNullable<T[K]> } {
    if (!import.meta.env.DEV) return;
    for (let i = 0; i < tuple.length; i++) {
        if (!(i in tuple))
            throw new AssertionError(
                `Provided tuple should've been non-null but is sparse. Index ${i} is missing.`
            );
        if (tuple[i] === null)
            throw new AssertionError(
                `Provided tuple should've been non-null but had an item with value null at index ${i}`
            );
        if (tuple[i] === undefined)
            throw new AssertionError(
                `Provided tuple should've been non-null but had an undefined item at index ${i}`
            );
    }
}


/**
 * Asserts that the provided item is a finite number. Use to prevent NaN propagation.
 * @param {unknown} item - The item which ought to be a finite number.
 * @throws {AssertionError} if the item is not of type number, or isFinite(item) is false, i.e., if the item is NaN, Infinity, or -Infinity.
 */
export function assertFiniteNumber(item: unknown): asserts item is number {
    if (!import.meta.env.DEV) return;
    if (typeof item !== "number")
        throw new AssertionError(
            `Provided item was not of type number. Was: ${getTypeNameOfUnknown(item)}`
        );
    if (!isFinite(item)) throw new AssertionError(`Provided number was not finite. Was: ${item}`);
}
