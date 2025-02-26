declare type Tuple<T, N extends number, A extends unknown[] = []> = A["length"] extends N ? A : Tuple<T, N, [...A, T]>;
declare type PrimitiveTypes = {
    "string": string;
    "number": number;
    "boolean": boolean;
    "bigint": bigint;
    "undefined": undefined;
    "function": Function;
    "object": object;
    "symbol": symbol;
};
declare type PrimitiveTypeStrings = keyof PrimitiveTypes;
declare type NullableKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : null extends T[K] ? K : never;
}[keyof T];
declare type PropsNonNullable<T, N extends NullableKeys<T>> = T & {
    [K in N]-?: NonNullable<T[K]>;
};
declare type Constructor<T> = new (...args: any[]) => T;
declare type AllJSTypes = PrimitiveTypeStrings | null | undefined | Constructor<unknown>;
declare type ResolveAnyJSType<T extends AllJSTypes> = T extends PrimitiveTypeStrings ? PrimitiveTypes[T] : T extends null ? null : T extends undefined ? undefined : T extends Constructor<infer U> ? U : never;
/**
 * Asserts that the provided boolean is true.
 * @param {boolean} hasToBeTrue - The boolean to assert.
 * @param {string} msg - The message of the Error if the assertion fails.
 * @throws {AssertionError} if the assertion fails.
 */
export declare function assert(hasToBeTrue: boolean, msg?: string): asserts hasToBeTrue is true;
/**
 * Asserts that the provided object is of the expectedType.
 * @param {unknown} item - The object which ought to be of the expectedType.
 * @param {AllJSTypes} expectedType - The expected type of the object. JS primitive types, null, undefined, and constructable types are supported. JS primitive types are passed as the string they return from typeof, e.g., "number".
 * @throws {AssertionError} if the type isn't as expected.
 */
export declare function assertType<T extends AllJSTypes>(item: unknown, expectedType: T): asserts item is ResolveAnyJSType<T>;
/**
 * Asserts that all elements of the provided array are of the expected type. It ensures that the array is not sparse (even when the expectedType is undefined).
 * @param {unknown[]} arr - The array which ought to be an array of the expectedType, i.e. expectedType: "number" => arr: number[]
 * @param {AllJSTypes} expectedType - The expected type of individual items. JS primitive types, null, undefined, and constructable types are supported.
 * @throws {AssertionError} if the type isn't as expected.
 */
export declare function assertArrayType<T extends AllJSTypes>(arr: unknown[], expectedType: T): asserts arr is ResolveAnyJSType<T>[];
/**
 * Asserts that the array or tuple has the expected types at each index.
 * @param {unknown[] | [unknown, ...]} arrayOrTuple - The tuple which ought to be an array of the length and types.
 * @param {[AllJSTypes, ...]} expectedTypes - A tuple of expected types of individual items, e.g., expectedTypes = ["number", "string", Date] => arrayOrTuple: [number, string, Date]. The individual entries can be JS primitive types, null, undefined, and constructors.
 * @throws {AssertionError} if the type of any element of the tuple isn't as expected.
 */
export declare function assertTupleTypes<T extends readonly AllJSTypes[], U extends {
    [K in keyof T]: unknown;
} | (number extends U["length"] ? unknown[] : never)>(arrayOrTuple: U, expectedTypes: readonly [...T]): asserts arrayOrTuple is U & {
    [K in keyof T]: ResolveAnyJSType<T[K]>;
};
/**
 * Asserts that the provided item is of type string.
 * @param {unknown} item - The item which ought to be of type string.
 * @throws {AssertionError} if the type isn't string.
 */
export declare function assertTypeOfString(item: unknown): asserts item is string;
/**
 * Asserts that the provided item is of type number.
 * @param {unknown} item - The item which ought to be of type number.
 * @throws {AssertionError} if the type isn't number.
 */
export declare function assertTypeOfNumber(item: unknown): asserts item is number;
/**
 * Asserts that the provided item is of type boolean.
 * @param {unknown} item - The item which ought to be of type boolean.
 * @throws {AssertionError} if the type isn't boolean.
 */
export declare function assertTypeOfBoolean(item: unknown): asserts item is boolean;
/**
 * Asserts that the provided item is of type bigint.
 * @param {unknown} item - The item which ought to be of type bigint.
 * @throws {AssertionError} if the type isn't bigint.
 */
export declare function assertTypeOfBigint(item: unknown): asserts item is bigint;
/**
 * Asserts that the provided item is of type undefined.
 * @param {unknown} item - The item which ought to be of type undefined.
 * @throws {AssertionError} if the type isn't undefined.
 */
export declare function assertTypeOfUndefined(item: unknown): asserts item is undefined;
/**
 * Asserts that the provided item is of type function.
 * @param {unknown} item - The item which ought to be of type function.
 * @throws {AssertionError} if the type isn't function.
 */
export declare function assertTypeOfFunction(item: unknown): asserts item is Function;
/**
 * Asserts that the provided item is of type object.
 * @param {unknown} item - The item which ought to be of type object.
 * @throws {AssertionError} if the type isn't object.
 */
export declare function assertTypeOfObject(item: unknown): asserts item is object;
/**
 * Asserts that the provided item is of type symbol.
 * @param {unknown} item - The item which ought to be of type symbol.
 * @throws {AssertionError} if the type isn't symbol.
 */
export declare function assertTypeOfSymbol(item: unknown): asserts item is symbol;
/**
 * Asserts that the provided item is null.
 * @param {unknown} item - The item which ought to be null.
 * @throws {AssertionError} if the value isn't null.
 */
export declare function assertNull(item: unknown): asserts item is null;
/**
 * Asserts that the provided item is an instance of the provided constructor.
 * @param {unknown} item - The item which ought to be an instance of the constructor.
 * @param {Constructor<T>} constructor - Anything that can be after an instanceof operator.
 * @throws {AssertionError} if item instanceof constructor is false.
 */
export declare function assertInstanceOf<T>(item: unknown, constructor: Constructor<T>): asserts item is T;
/**
 * Asserts that the provided array is a tuple of exactly the expected length.
 * @param {unknown[]} arr - The array which ought to be a tuple.
 * @param {number} expectedLength - The exact expected length of the tuple.
 * @throws {AssertionError} if the array isn't of the expected length or is sparse.
 */
export declare function assertIsTuple<T extends number extends T["length"] ? unknown[] : never, N extends number>(arr: [...T], expectedLength: N): asserts arr is T & Tuple<T[number], N>;
/**
 * Used to assert that code can never be reached. Pass a value which has already been checked for all types that should be possible. If the range of possible values increases, TypeScript will throw an error at compile time because the value won't be of type never.
 * @param {never} item - An exhausted value, of which all cases are accounted for in other branches of the code, such as at the end of a switch statement.
 * @param {string} msg - Override the default error message. Even if you do, the error message will include the value and type of item.
 * @throws {AssertionError} if at runtime the function call was reached. This should only happen if TypeScript types are inaccurate somewhere.
 */
export declare function assertUnreachable(item: never, msg?: string): asserts item is never;
/**
 * Asserts that the provided item is neither null nor undefined.
 * @param {unknown} item - The item which ought to be non-null.
 * @throws {AssertionError} if the item is null or undefined.
 */
export declare function assertNonNullable<T>(item: T): asserts item is NonNullable<T>;
/**
 * Asserts that the provided object has non-null values for the properties passed as keys in the propKeys array.
 * @param {object} obj - The object which ought to have the properties.
 * @param {NullableKeys<T>} propKeys - An array of the stringified keys of the properties which ought to be non-null in the object.
 * @throws {AssertionError} if any of the properties was null, undefined, or not present in the object.
 */
export declare function assertPropsNonNullable<T extends object, N extends NullableKeys<T>>(obj: T, propKeys: N[]): asserts obj is PropsNonNullable<T, N>;
/**
 * Asserts that all elements of the provided array are neither null nor undefined, or not present.
 * @param {unknown[]} arr - The array which ought to be non-sparse, and have only non-null elements.
 * @throws {AssertionError} if any of the elements was null, undefined, or not present in the array.
 */
export declare function assertArrayNonNullable<T>(arr: T[]): asserts arr is NonNullable<T>[];
/**
 * Asserts that the provided tuple has non-null values for all elements. This function does not take a length. So if you want to assert that the typescript tuple type is of the correct length, call @see assertIsTuple first.
 * @param {[unknown, ...]} tuple - The tuple which ought to have only non-null values.
 * @throws {AssertionError} if any of the elements was null, undefined, or an index not present in the tuple.
 */
export declare function assertTupleNonNullable<T extends number extends T["length"] ? never : unknown[]>(tuple: T): asserts tuple is {
    [K in keyof T]: NonNullable<T[K]>;
};
/**
 * Asserts that the provided item is a finite number. Use to prevent NaN propagation.
 * @param {unknown} item - The item which ought to be a finite number.
 * @throws {AssertionError} if the item is not of type number, or isFinite(item) is false, i.e., if the item is NaN, Infinity, or -Infinity.
 */
export declare function assertFiniteNumber(item: unknown): asserts item is number;
export {};
