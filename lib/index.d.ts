type PrimitiveTypeStrings = "string" | "number" | "boolean" | "bigint" | "undefined" | "function" | "object" | "symbol";
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
type NullableKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : null extends T[K] ? K : never;
}[keyof T];
type PropsNonNullable<T, N extends NullableKeys<T>> = T & {
    [K in N]-?: NonNullable<T[K]>;
};
type Constructor<T> = new (...args: unknown[]) => T;
type AllJSTypes = PrimitiveTypeStrings | null | undefined | Constructor<unknown>;
type ResolveAnyJSType<T extends AllJSTypes> = T extends PrimitiveTypeStrings ? PrimitiveTypes[T] : T extends null ? null : T extends undefined ? undefined : T extends Constructor<infer U> ? U : never;
export declare function assert(hasToBeTrue: boolean, msg?: string): asserts hasToBeTrue is true;
export declare function assertType<T extends AllJSTypes>(obj: unknown, expectedType: T): asserts obj is ResolveAnyJSType<T>;
export declare function assertTypeOfString(obj: unknown): asserts obj is string;
export declare function assertTypeOfNumber(obj: unknown): asserts obj is number;
export declare function assertTypeOfBoolean(obj: unknown): asserts obj is boolean;
export declare function assertTypeOfBigint(obj: unknown): asserts obj is bigint;
export declare function assertTypeOfUndefined(obj: unknown): asserts obj is undefined;
export declare function assertTypeOfFunction(obj: unknown): asserts obj is Function;
export declare function assertTypeOfObject(obj: unknown): asserts obj is object;
export declare function assertTypeOfSymbol(obj: unknown): asserts obj is symbol;
export declare function assertNull(obj: unknown): asserts obj is null;
export declare function assertInstanceOf<T>(obj: unknown, constructable: Constructor<T>): asserts obj is T;
export declare function assertUnreachable(obj: never, msg?: string): asserts obj is never;
export declare function assertPropsNonNullable<T, N extends NullableKeys<T>>(obj: T, props: N[]): asserts obj is PropsNonNullable<T, N>;
export declare function assertNonNullable<T>(obj: T): asserts obj is NonNullable<T>;
export declare function assertFiniteNumber(obj: unknown): asserts obj is number;
export {};
