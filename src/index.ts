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

class AssertionError extends Error {
    constructor(msg: string) {
        super(`Assertion failed: ${msg}`);
        this.name = AssertionError.name;
    }
}

type Constructor<T> = new (...args: unknown[]) => T;
type AllJSTypes = PrimitiveTypeStrings | null | undefined | Constructor<unknown>;
type ResolveAnyJSType<T extends AllJSTypes> = T extends PrimitiveTypeStrings ? PrimitiveTypes[T]
    : T extends null ? null : T extends undefined ? undefined
    : T extends Constructor<infer U> ? U : never;


export function assert(hasToBeTrue: boolean, msg: string = "No specific message provided."): asserts hasToBeTrue is true {
    if (!import.meta.env.DEV) return;
    if (!hasToBeTrue) throw new AssertionError(msg);
}

export function assertType<T extends AllJSTypes>(obj: unknown, expectedType: T): asserts obj is ResolveAnyJSType<T> {
    if (!import.meta.env.DEV) return;

    if (typeof obj === expectedType) return;
    const reducedExpectedType = expectedType as Exclude<typeof expectedType, PrimitiveTypeStrings>;

    if (obj === reducedExpectedType) return;
    const remainingOption = expectedType as Exclude<typeof reducedExpectedType, null | undefined>;

    if (obj instanceof remainingOption) return;
    
    throw new AssertionError(`Provided object was not of type ${(typeof expectedType !== "string") ? expectedType?.name : expectedType ?? expectedType}. Was: ${(obj === null) ? "null" : obj?.constructor?.name ?? typeof obj}, value: ${obj}`);
}

export function assertTypeofString(obj: unknown): asserts obj is string {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "string") throw new AssertionError(`Provided object was not of type string. Was: ${typeof obj}`);
}

export function assertTypeofNumber(obj: unknown): asserts obj is number {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "number") throw new AssertionError(`Provided object was not of type number. Was: ${typeof obj}`);
}

export function assertTypeofBoolean(obj: unknown): asserts obj is boolean {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "boolean") throw new AssertionError(`Provided object was not of type boolean. Was: ${typeof obj}`);
}

export function assertTypeofBigint(obj: unknown): asserts obj is bigint {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "bigint") throw new AssertionError(`Provided object was not of type bigint. Was: ${typeof obj}`);
}

export function assertTypeofUndefined(obj: unknown): asserts obj is undefined {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "undefined") throw new AssertionError(`Provided object was not of type undefined. Was: ${typeof obj}`);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function assertTypeofFunction(obj: unknown): asserts obj is Function {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "function") throw new AssertionError(`Provided object was not of type function. Was: ${typeof obj}`);
}

export function assertTypeofObject(obj: unknown): asserts obj is object {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "object") throw new AssertionError(`Provided object was not of type object. Was: ${typeof obj}`);
}

export function assertTypeofSymbol(obj: unknown): asserts obj is symbol {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "symbol") throw new AssertionError(`Provided object was not of type symbol. Was: ${typeof obj}`);
}

export function assertInstanceOf<T>(obj: unknown, constructable: Constructor<T>): asserts obj is T {
    if (!import.meta.env.DEV) return;
    if (!(obj instanceof constructable)) throw new AssertionError(`Provided object was not of type ${constructable.name} but was type: ${(obj === null) ? "null" : obj?.constructor?.name ?? typeof obj}, value: ${obj}`);
}

export function assertUnreachable(obj: never, msg: string = "Unreachable code of type never was reached. TypeScript types are inaccurate somewhere."): asserts obj is never {
    if (!import.meta.env.DEV) return;
    throw new AssertionError(msg);
}

export function assertPropsNonNullable<T, N extends NullableKeys<T>>(obj: T, props: N[]): asserts obj is PropsNonNullable<T, N> {
    if (!import.meta.env.DEV) return;
    for (const prop of props) {
        if (obj[prop] === null || obj[prop] === undefined)
            throw new AssertionError(`Provided object prop ${String(prop)} should've been non-null but was: ${obj[prop]}`);
    }
}

export function assertNonNullable<T>(obj: T): asserts obj is NonNullable<T> {
    if (!import.meta.env.DEV) return;
    if (obj === undefined || obj === null) throw new AssertionError(`Provided object should've been non-null but was: ${obj}`);
}

export function assertFiniteNumber(obj: unknown): asserts obj is number {
    if (!import.meta.env.DEV) return;
    if (typeof obj !== "number") throw new AssertionError(`Provided object was not of type number. Was: ${typeof obj}`);
    if (!isFinite(obj)) throw new AssertionError(`Provided number was not finite. Was: ${obj}`);
}
