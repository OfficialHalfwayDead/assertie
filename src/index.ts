type PrimitiveTypeStrings = "string" | "number" | "boolean" | "bigint" | "undefined" | "function" | "object" | "symbol";
type PrimitiveTypes = {
    "string": string,
    "number": number,
    "boolean": boolean,
    "bigint": bigint,
    "undefined": undefined,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    "function": Function,
    "object": object,
    "symbol": symbol
}

type NullableKeys<T> = { 
    [K in keyof T]-?: undefined extends T[K] ? K : null extends T[K] ? K : never 
}[keyof T];

type PropsNonNullable<T, N extends NullableKeys<T>> =  T & { [K in N]-?: NonNullable<T[K]> };


type Constructor<T> = new (...args: unknown[]) => T;
type AllJSTypes = PrimitiveTypeStrings | null | undefined | Constructor<unknown>;
type ResolveAnyJSType<T extends AllJSTypes> = T extends PrimitiveTypeStrings ? PrimitiveTypes[T]
    : T extends null ? null : T extends undefined ? undefined
    : T extends Constructor<infer U> ? U : never;


function getNameOfExpectedType(expectedType: AllJSTypes): string {
    if (expectedType === null) return "null";
    if (expectedType === undefined) return "undefined";
    if (typeof expectedType === "string") return expectedType;
    return expectedType.name;
}

export function getTypeNameOfUnknown(obj: unknown): string {
    if (obj === null) return "null";
    if (obj === undefined) return "undefined";
    try {
        if (obj instanceof obj.constructor
            && obj.constructor.name !== "Function") {
            // I'd like function to match the primitive name "function"
            // because that's how the asserts are written.
            return obj.constructor.name;
        }
    } finally {
        return typeof obj;
    }
}

function isType<T extends AllJSTypes>(obj: unknown, expectedType: T): boolean {
    if (typeof obj === expectedType) return true;
    const reducedExpectedType = expectedType as Exclude<typeof expectedType, PrimitiveTypeStrings>;

    if (obj === reducedExpectedType) return true;
    const remainingOption = expectedType as Exclude<typeof reducedExpectedType, null | undefined>;

    if (obj instanceof remainingOption) return true;

    return false;
}


class AssertionError extends Error {
    constructor(msg: string) {
        super(`Assertion failed: ${msg}`);
        this.name = AssertionError.name;
    }
}


export function assert(hasToBeTrue: boolean, msg: string = "No specific message provided."): asserts hasToBeTrue is true {
    if (!import.meta.env.DEV) return;
    if (!hasToBeTrue) throw new AssertionError(msg);
}

export function assertType<T extends AllJSTypes>(obj: unknown, expectedType: T): asserts obj is ResolveAnyJSType<T> {
    if (!import.meta.env.DEV) return;
    if (!isType(obj, expectedType))
        throw new AssertionError(`Provided object was not of type ${getNameOfExpectedType(expectedType)}. Was: ${getTypeNameOfUnknown(obj)}, value: ${obj}`);
}

/**
 * Asserts that all elements of the provided array are of the expected type. It ensures that the array is not sparse (even when the expectedType is undefined).
 * @param arr - The array to assert.
 * @param expectedType - The expected type of individual items. JS primitive types, null, undefined, and constructable types are supported.
 */
export function assertArrayType<T extends AllJSTypes>(arr: unknown[], expectedType: T): asserts arr is ResolveAnyJSType<T>[] {
    if (!import.meta.env.DEV) return;
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr))
            throw new AssertionError(`Array to assert type of was sparse with a missing item at index ${i}`);
        const item = arr[i];
        if (!isType(item, expectedType))
            throw new AssertionError(`Provided array had item at index ${i} not of type ${getNameOfExpectedType(expectedType)}. Was: ${getTypeNameOfUnknown(item)}, value: ${item}`);
    }
}

export function assertTypeOfString(obj: unknown): asserts obj is string {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "string") throw new AssertionError(`Provided object was not of type string. Was: ${getTypeNameOfUnknown(obj)}`);
}

export function assertTypeOfNumber(obj: unknown): asserts obj is number {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "number") throw new AssertionError(`Provided object was not of type number. Was: ${getTypeNameOfUnknown(obj)}`);
}

export function assertTypeOfBoolean(obj: unknown): asserts obj is boolean {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "boolean") throw new AssertionError(`Provided object was not of type boolean. Was: ${getTypeNameOfUnknown(obj)}`);
}

export function assertTypeOfBigint(obj: unknown): asserts obj is bigint {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "bigint") throw new AssertionError(`Provided object was not of type bigint. Was: ${getTypeNameOfUnknown(obj)}`);
}

export function assertTypeOfUndefined(obj: unknown): asserts obj is undefined {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "undefined") throw new AssertionError(`Provided object was not of type undefined. Was: ${getTypeNameOfUnknown(obj)}`);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function assertTypeOfFunction(obj: unknown): asserts obj is Function {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "function") throw new AssertionError(`Provided object was not of type function. Was: ${getTypeNameOfUnknown(obj)}`);
}

export function assertTypeOfObject(obj: unknown): asserts obj is object {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "object") throw new AssertionError(`Provided object was not of type object. Was: ${getTypeNameOfUnknown(obj)}`);
}

export function assertTypeOfSymbol(obj: unknown): asserts obj is symbol {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "symbol") throw new AssertionError(`Provided object was not of type symbol. Was: ${getTypeNameOfUnknown(obj)}`);
}

export function assertNull(obj: unknown): asserts obj is null {
    if (!import.meta.env.DEV) return;
    if (obj !== null) throw new AssertionError(`Provided object was not null. Was: ${obj}`);
}

export function assertInstanceOf<T>(obj: unknown, constructable: Constructor<T>): asserts obj is T {
    if (!import.meta.env.DEV) return;
    if (!(obj instanceof constructable)) throw new AssertionError(`Provided object was not of type ${constructable.name} but was type: ${getTypeNameOfUnknown(obj)}, value: ${obj}`);
}

export function assertUnreachable(obj: never, msg: string = "Unreachable code of type never was reached. TypeScript types are inaccurate somewhere."): asserts obj is never {
    if (!import.meta.env.DEV) return;
    throw new AssertionError(msg);
}

export function assertPropsNonNullable<T, N extends NullableKeys<T>>(obj: T, propKeys: N[]): asserts obj is PropsNonNullable<T, N> {
    if (!import.meta.env.DEV) return;
    for (const propKey of propKeys) {
        if (obj[propKey] === null || obj[propKey] === undefined)
            throw new AssertionError(`Provided object prop ${String(propKey)} should've been non-null but was: ${obj[propKey]}`);
    }
}

/**
 * Asserts that all elements of the provided array are neither null nor undefined.
 * @param arr - The array to assert.
 */
export function assertArrayNonNullable<T>(arr: T[]): asserts arr is NonNullable<T>[] {
    if (!import.meta.env.DEV) return;
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

export function assertNonNullable<T>(obj: T): asserts obj is NonNullable<T> {
    if (!import.meta.env.DEV) return;
    if (obj === undefined || obj === null) throw new AssertionError(`Provided object should've been non-null but was: ${obj}`);
}

export function assertFiniteNumber(obj: unknown): asserts obj is number {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "number") throw new AssertionError(`Provided object was not of type number. Was: ${getTypeNameOfUnknown(obj)}`);
    if (!isFinite(obj)) throw new AssertionError(`Provided number was not finite. Was: ${obj}`);
}
