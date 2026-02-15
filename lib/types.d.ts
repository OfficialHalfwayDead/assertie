export type UnknownFunction = (...args: any[]) => unknown;
export type Constructor<T> = abstract new (...args: any[]) => T;
export type PrimitiveTypes = {
    "string": string;
    "number": number;
    "boolean": boolean;
    "bigint": bigint;
    "undefined": undefined;
    "function": UnknownFunction;
    "object": object;
    "symbol": symbol;
};
export type PrimitiveTypeStrings = keyof PrimitiveTypes;
export type NullableKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : null extends T[K] ? K : never;
}[keyof T];
export type PropsNonNullable<T, N extends NullableKeys<T>> = T & {
    [K in N]-?: NonNullable<T[K]>;
};
export type AllJSTypes = PrimitiveTypeStrings | null | undefined | Constructor<unknown>;
export type ResolveAnyJSType<T extends AllJSTypes> = T extends PrimitiveTypeStrings ? PrimitiveTypes[T] : T extends null ? null : T extends undefined ? undefined : T extends Constructor<infer U> ? U : never;
export type ResolveTuple<T extends readonly AllJSTypes[], U> = U & {
    [K in keyof T]: ResolveAnyJSType<T[K]>;
};
export type ResolveReadonlyTuple<T extends readonly AllJSTypes[], U> = U & {
    readonly [K in keyof T]: ResolveAnyJSType<T[K]>;
};
export type Tuple<T, N extends number, A extends unknown[] = []> = A["length"] extends N ? A : Tuple<T, N, [...A, T]>;
export type ReadonlyTuple<T, N extends number, A extends readonly unknown[] = readonly []> = A["length"] extends N ? A : ReadonlyTuple<T, N, readonly [...A, T]>;
