import {
    assert,
    assertType,
    assertArrayType,
    assertTupleTypes,
    assertTypeOfString,
    assertTypeOfNumber,
    assertTypeOfBoolean,
    assertTypeOfBigint,
    assertTypeOfUndefined,
    assertTypeOfFunction,
    assertTypeOfObject,
    assertTypeOfSymbol,
    assertNull,
    assertInstanceOf,
    assertIsTuple,
    assertUnreachable,
    assertNonNullable,
    assertPropsNonNullable,
    assertArrayNonNullable,
    assertTupleNonNullable,
    assertFiniteNumber,
} from "../../src/index";

/* ==================== assert ==================== */

{ // narrows boolean to true
    const x: boolean = true as boolean;
    // @ts-expect-error
    let _true: true = x;
    assert(x);
    _true = x;
}

/* ==================== assertType ==================== */

{ // narrows unknown to string with string literal
    const x: unknown = "test";
    // @ts-expect-error
    let _string: string = x;
    assertType(x, "string");
    _string = x;
}
{ // narrows unknown to number with string literal
    const x: unknown = 42;
    // @ts-expect-error
    let _number: number = x;
    assertType(x, "number");
    _number = x;
}
{ // narrows unknown to boolean with string literal
    const x: unknown = true;
    // @ts-expect-error
    let _boolean: boolean = x;
    assertType(x, "boolean");
    _boolean = x;
}
{ // narrows unknown to bigint with string literal
    const x: unknown = 123n;
    // @ts-expect-error
    let _bigint: bigint = x;
    assertType(x, "bigint");
    _bigint = x;
}
{ // narrows unknown to undefined with string literal
    const x: unknown = undefined;
    // @ts-expect-error
    let _undefined: undefined = x;
    assertType(x, "undefined");
    _undefined = x;
}
{ // narrows unknown to function with string literal
    const x: unknown = () => {};
    // @ts-expect-error
    x();
    assertType(x, "function");
    x();
}
{ // narrows unknown to object with string literal
    const x: unknown = {};
    // @ts-expect-error
    let _object: object = x;
    assertType(x, "object");
    _object = x;
}
{ // narrows unknown to symbol with string literal
    const x: unknown = Symbol("test");
    // @ts-expect-error
    let _symbol: symbol = x;
    assertType(x, "symbol");
    _symbol = x;
}
{ // narrows unknown to null with null literal
    const x: unknown = null;
    // @ts-expect-error
    let _null: null = x;
    assertType(x, null);
    _null = x;
}
{ // narrows unknown to undefined with undefined literal
    const x: unknown = undefined;
    // @ts-expect-error
    let _undefined: undefined = x;
    assertType(x, undefined);
    _undefined = x;
}
{ // narrows unknown to class instance with constructor
    const x: unknown = new Date();
    // @ts-expect-error
    let _date: Date = x;
    assertType(x, Date);
    _date = x;
}
{ // narrows unknown to custom class instance
    class CustomClass {
        constructor(_: string) {}
    }
    const x: unknown = new CustomClass("test");
    // @ts-expect-error
    let _custom: CustomClass = x;
    assertType(x, CustomClass);
    _custom = x;
}
{ // narrows unknown to abstract class instance
    abstract class BaseClass {
        abstract label: string;
    }
    class ConcreteClass extends BaseClass {
        label = "ok";
    }
    const x: unknown = new ConcreteClass();
    // @ts-expect-error
    let _base: BaseClass = x;
    assertType(x, BaseClass);
    _base = x;
}

/* ==================== assertArrayType ==================== */

{ // narrows unknown[] to string[]
    const arr: unknown[] = ["a", "b"];
    // @ts-expect-error
    let _strings: string[] = arr;
    assertArrayType(arr, "string");
    _strings = arr;
}
{ // narrows unknown[] to number[]
    const arr: unknown[] = [1, 2, 3];
    // @ts-expect-error
    let _numbers: number[] = arr;
    assertArrayType(arr, "number");
    _numbers = arr;
}
{ // narrows (string | number)[] to number[]
    const arr: (string | number)[] = [1, 2, 3];
    // @ts-expect-error
    let _numbers: number[] = arr;
    assertArrayType(arr, "number");
    _numbers = arr;
}
{ // narrows unknown[] to Date[]
    const arr: unknown[] = [new Date(), new Date()];
    // @ts-expect-error
    let _dates: Date[] = arr;
    assertArrayType(arr, Date);
    _dates = arr;
}
{ // narrows unknown[] to null[]
    const arr: unknown[] = [null, null];
    // @ts-expect-error
    let _nulls: null[] = arr;
    assertArrayType(arr, null);
    _nulls = arr;
}

/* ==================== assertTupleTypes ==================== */

{ // narrows tuple to specific types
    const tuple: [unknown, unknown] = [1, "a"];
    // @ts-expect-error
    let _tuple: [number, string] = tuple;
    assertTupleTypes(tuple, ["number", "string"]);
    _tuple = tuple;
}
{ // narrows array to tuple with specific types
    const arr: unknown[] = [1, "a", true];
    // @ts-expect-error
    let _tuple: [number, string, boolean] = arr;
    assertTupleTypes(arr, ["number", "string", "boolean"]);
    _tuple = arr;
}
{ // narrows tuple with null and undefined
    const tuple: [unknown, unknown] = [null, undefined];
    // @ts-expect-error
    let _tuple: [null, undefined] = tuple;
    assertTupleTypes(tuple, [null, undefined]);
    _tuple = tuple;
}
{ // narrows tuple with class constructor
    const tuple: [unknown, unknown] = [new Date(), new Error()];
    // @ts-expect-error
    let _tuple: [Date, Error] = tuple;
    assertTupleTypes(tuple, [Date, Error]);
    _tuple = tuple;
}
{ // narrows mixed primitive and class tuple
    const tuple: [unknown, unknown, unknown] = [1, "str", new Date()];
    // @ts-expect-error
    let _tuple: [number, string, Date] = tuple;
    assertTupleTypes(tuple, ["number", "string", Date]);
    _tuple = tuple;
}

/* ==================== assertTypeOfString ==================== */

{ // narrows unknown to string
    const x: unknown = "test";
    // @ts-expect-error
    let _string: string = x;
    assertTypeOfString(x);
    _string = x;
}
{ // narrows union to string
    const x: string | number = "test" as string | number;
    // @ts-expect-error
    let _string: string = x;
    assertTypeOfString(x);
    _string = x;
}

/* ==================== assertTypeOfNumber ==================== */

{ // narrows unknown to number
    const x: unknown = 42;
    // @ts-expect-error
    let _number: number = x;
    assertTypeOfNumber(x);
    _number = x;
}
{ // narrows union to number
    const x: string | number = 42 as string | number;
    // @ts-expect-error
    let _number: number = x;
    assertTypeOfNumber(x);
    _number = x;
}

/* ==================== assertTypeOfBoolean ==================== */

{ // narrows unknown to boolean
    const x: unknown = true;
    // @ts-expect-error
    let _boolean: boolean = x;
    assertTypeOfBoolean(x);
    _boolean = x;
}
{ // narrows union to boolean
    const x: string | boolean = false as string | boolean;
    // @ts-expect-error
    let _boolean: boolean = x;
    assertTypeOfBoolean(x);
    _boolean = x;
}

/* ==================== assertTypeOfBigint ==================== */

{ // narrows unknown to bigint
    const x: unknown = 123n;
    // @ts-expect-error
    let _bigint: bigint = x;
    assertTypeOfBigint(x);
    _bigint = x;
}
{ // narrows union to bigint
    const x: string | bigint = 123n as string | bigint;
    // @ts-expect-error
    let _bigint: bigint = x;
    assertTypeOfBigint(x);
    _bigint = x;
}

/* ==================== assertTypeOfUndefined ==================== */

{ // narrows unknown to undefined
    const x: unknown = undefined;
    // @ts-expect-error
    let _undefined: undefined = x;
    assertTypeOfUndefined(x);
    _undefined = x;
}
{ // narrows union to undefined
    const x: string | undefined = undefined as string | undefined;
    // @ts-expect-error
    let _undefined: undefined = x;
    assertTypeOfUndefined(x);
    _undefined = x;
}

/* ==================== assertTypeOfFunction ==================== */

{ // narrows unknown to function
    const x: unknown = () => {};
    // @ts-expect-error
    x();
    assertTypeOfFunction(x);
    x();
    // Ensure it narrows to () => unknown not () => any
    // @ts-expect-error
    const res: string = x();
}
{ // narrows union to function
    type X = string | ((arg: string) => string);
    const x: X = ((arg: string) => arg) as X;
    // @ts-expect-error
    x("test");
    assertTypeOfFunction(x);
    x("test");
    // TypeScript 4.7.0 only narrows to () => {} or (args: any[]) => {}
    // It would allow x(123), even though it's not a string => string,
    // so there is a test in latest.test.ts that tests narrowing to specific function
}

/* ==================== assertTypeOfObject ==================== */

{ // narrows unknown to object
    const x: unknown = {};
    // @ts-expect-error
    let _object: object = x;
    assertTypeOfObject(x);
    _object = x;
}
{ // narrows union to specific object
    type X = string | { a: string };
    const x: X = { a: "test" } as X;
    // @ts-expect-error
    let _object: { a: string } = x;
    // @ts-expect-error
    let _str: string = x.a;
    assertTypeOfObject(x);
    _object = x;
    _str = x.a;
}

/* ==================== assertTypeOfSymbol ==================== */

{ // narrows unknown to symbol
    const x: unknown = Symbol("test");
    // @ts-expect-error
    let _symbol: symbol = x;
    assertTypeOfSymbol(x);
    _symbol = x;
}
{ // narrows union to symbol
    const x: string | symbol = Symbol("test") as string | symbol;
    // @ts-expect-error
    let _symbol: symbol = x;
    assertTypeOfSymbol(x);
    _symbol = x;
}

/* ==================== assertNull ==================== */

{ // narrows unknown to null
    const x: unknown = null;
    // @ts-expect-error
    let _null: null = x;
    assertNull(x);
    _null = x;
}
{ // narrows union to null
    const x: string | null = null as string | null;
    // @ts-expect-error
    let _null: null = x;
    assertNull(x);
    _null = x;
}

/* ==================== assertInstanceOf ==================== */

{ // narrows unknown to Date
    const x: unknown = new Date();
    // @ts-expect-error
    let _date: Date = x;
    assertInstanceOf(x, Date);
    _date = x;
}
{ // narrows unknown to Error
    const x: unknown = new Error("test");
    // @ts-expect-error
    let _error: Error = x;
    assertInstanceOf(x, Error);
    _error = x;
}
{ // narrows unknown to custom class
    class MyClass {
        constructor(_: string) {}
    }
    const x: unknown = new MyClass("test");
    // @ts-expect-error
    let _myClass: MyClass = x;
    assertInstanceOf(x, MyClass);
    _myClass = x;
}
{ // narrows unknown to abstract base class
    abstract class BaseClass {
        abstract label: string;
    }
    class ConcreteClass extends BaseClass {
        label = "ok";
    }
    const x: unknown = new ConcreteClass();
    // @ts-expect-error
    let _base: BaseClass = x;
    assertInstanceOf(x, BaseClass);
    _base = x;
}
{ // narrows Node to HTMLElement
    const x: Node = new HTMLElement();
    // @ts-expect-error
    let _element: HTMLElement = x;
    assertInstanceOf(x, HTMLElement);
    _element = x;
}

/* ==================== assertIsTuple ==================== */

{ // narrows number[] array to tuple
    const arr: number[] = [1, 2];
    // @ts-expect-error
    let _tuple: [number, number] = arr;
    assertIsTuple(arr, 2);
    _tuple = arr;
    arr[1];
    // @ts-expect-error
    arr[2];
}
{ // narrows string array to tuple
    const arr: string[] = ["a", "b", "c"];
    // @ts-expect-error
    let _tuple: [string, string, string] = arr;
    assertIsTuple(arr, 3);
    _tuple = arr;
    arr[2];
    // @ts-expect-error
    arr[3];
}
{ // narrows boolean array to tuple
    const arr: boolean[] = [true];
    // @ts-expect-error
    let _tuple: [boolean] = arr;
    assertIsTuple(arr, 1);
    _tuple = arr;
    arr[0];
    // @ts-expect-error
    arr[1];
}
{ // narrows mixed array to tuple
    const arr: (number | string)[] = [1, "a"];
    // @ts-expect-error
    let _tuple: [number | string, number | string] = arr;
    assertIsTuple(arr, 2);
    _tuple = arr;
    arr[1];
    // @ts-expect-error
    arr[2];
}

/* ==================== assertUnreachable ==================== */

{ // accepts never type after exhaustive switch
    type State = "a" | "b";
    let state: State = "a" as State;

    switch (state) {
        case "a": {
            const _a: "a" = state;
            break;
        }
        case "b": {
            const _b: "b" = state;
            break;
        }
        default: {
            assertUnreachable(state);
        }
    }
}
{ // errors when switch is not exhaustive
    type State = "a" | "b";
    let state: State = "a" as State;

    switch (state) {
        case "a": {
            const _a: "a" = state;
            break;
        }
        default: {
            // @ts-expect-error
            assertUnreachable(state);
        }
    }
}

/* ==================== assertNonNullable ==================== */

{ // removes null from union
    const x: string | null = "test" as string | null;
    // @ts-expect-error
    let _string: string = x;
    assertNonNullable(x);
    _string = x;
}
{ // removes undefined from union
    const x: string | undefined = "test" as string | undefined;
    // @ts-expect-error
    let _string: string = x;
    assertNonNullable(x);
    _string = x;
}
{ // removes null and undefined from union
    const x: string | null | undefined = "test" as string | null | undefined;
    // @ts-expect-error
    let _string: string = x;
    assertNonNullable(x);
    _string = x;
}
{ // resolves complex union types
    type X = number | string | null | undefined;
    const x: X = 42 as X;
    // @ts-expect-error
    let _value: number | string = x;
    assertNonNullable(x);
    _value = x;
}

/* ==================== assertPropsNonNullable ==================== */

{ // narrows optional property to required
    const obj: { a?: string; b: number } = { a: "test", b: 1 };
    // @ts-expect-error
    let _a: string = obj.a;
    assertPropsNonNullable(obj, ["a"]);
    _a = obj.a;
}
{ // narrows nullable property to non-nullable
    const obj: { a: string | null; b: number } = { a: "test", b: 1 };
    // @ts-expect-error
    let _a: string = obj.a;
    assertPropsNonNullable(obj, ["a"]);
    _a = obj.a;
}
{ // narrows multiple properties
    const obj: { a?: string; b: number | null; c: boolean } = {
        a: "test",
        b: 1,
        c: true,
    };
    // @ts-expect-error
    let _a: string = obj.a;
    // @ts-expect-error
    let _b: number = obj.b;
    assertPropsNonNullable(obj, ["a", "b"]);
    _a = obj.a;
    _b = obj.b;
    const _c: boolean = obj.c;
}
{ // leaves non-asserted props with original types
    const obj: { a?: string; b: number | null } = { a: "test", b: null };
    // @ts-expect-error
    let _a: string = obj.a;
    assertPropsNonNullable(obj, ["a"]);
    _a = obj.a;
    // @ts-expect-error
    const _b: number = obj.b;
}

/* ==================== assertArrayNonNullable ==================== */

{ // removes null from array element type
    const arr: (string | null)[] = ["a", "b"];
    // @ts-expect-error
    let _strings: string[] = arr;
    assertArrayNonNullable(arr);
    _strings = arr;
}
{ // removes undefined from array element type
    const arr: (string | undefined)[] = ["a", "b"];
    // @ts-expect-error
    let _strings: string[] = arr;
    assertArrayNonNullable(arr);
    _strings = arr;
}
{ // removes both null and undefined
    const arr: (number | null | undefined)[] = [1, 2, 3];
    // @ts-expect-error
    let _numbers: number[] = arr;
    assertArrayNonNullable(arr);
    _numbers = arr;
}
{ // resolves complex union element types
    const arr: (string | number | null | undefined)[] = [1, "a"];
    // @ts-expect-error
    let _nonNulls: (string | number)[] = arr;
    assertArrayNonNullable(arr);
    _nonNulls = arr;
}

/* ==================== assertTupleNonNullable ==================== */

{ // removes null from tuple element types
    const tuple: [string | null, number | null] = ["a", 1];
    // @ts-expect-error
    let _tuple: [string, number] = tuple;
    assertTupleNonNullable(tuple);
    _tuple = tuple;
}
{ // removes undefined from tuple element types
    const tuple: [string | undefined, number | undefined] = ["a", 1];
    // @ts-expect-error
    let _tuple: [string, number] = tuple;
    assertTupleNonNullable(tuple);
    _tuple = tuple;
}
{ // removes both null and undefined from tuple
    const tuple: [string | null | undefined, number | null | undefined] = ["a", 1];
    // @ts-expect-error
    let _tuple: [string, number] = tuple;
    assertTupleNonNullable(tuple);
    _tuple = tuple;
}
{ // handles mixed element types in tuple
    const tuple: [string | null, number, boolean | undefined] = ["a", 1, true];
    // @ts-expect-error
    let _tuple: [string, number, boolean] = tuple;
    assertTupleNonNullable(tuple);
    _tuple = tuple;
}

/* ==================== assertFiniteNumber ==================== */

{ // narrows unknown to number
    const x: unknown = 42;
    // @ts-expect-error
    let _number: number = x;
    assertFiniteNumber(x);
    _number = x;
}
{ // narrows union to number
    const x: string | number = 42 as string | number;
    // @ts-expect-error
    let _number: number = x;
    assertFiniteNumber(x);
    _number = x;
}
