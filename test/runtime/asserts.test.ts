import { group, test, mustThrow, mustNotThrow } from "./testing";
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

group("assert", () => {
    group("should not throw", () => {
        test("when condition is true", () => {
            mustNotThrow(() => assert(true));
            mustNotThrow(() => assert(1 === 1));
            mustNotThrow(() => assert(Boolean(1)));
        });
    });

    group("should throw", () => {
        test("when condition is false", () => {
            mustThrow(() => assert(false));
            // @ts-expect-error: TypeScript would not allow 1 === 2
            mustThrow(() => assert(1 === 2));
        });

        test("with custom message", () => {
            mustThrow(() => assert(false, "custom message"), /custom message/);
        });
    });
});

group("assertType", () => {
    group("with primitive type strings", () => {
        group("should not throw", () => {
            test('for "string" with string value', () => {
                mustNotThrow(() => assertType("hello", "string"));
                mustNotThrow(() => assertType("", "string"));
            });

            test('for "number" with number value', () => {
                mustNotThrow(() => assertType(42, "number"));
                mustNotThrow(() => assertType(0, "number"));
                mustNotThrow(() => assertType(-1, "number"));
                mustNotThrow(() => assertType(NaN, "number"));
                mustNotThrow(() => assertType(Infinity, "number"));
            });

            test('for "boolean" with boolean value', () => {
                mustNotThrow(() => assertType(true, "boolean"));
                mustNotThrow(() => assertType(false, "boolean"));
            });

            test('for "bigint" with bigint value', () => {
                mustNotThrow(() => assertType(123n, "bigint"));
                mustNotThrow(() => assertType(0n, "bigint"));
            });

            test('for "undefined" with undefined value', () => {
                mustNotThrow(() => assertType(undefined, "undefined"));
            });

            test('for "function" with function value', () => {
                mustNotThrow(() => assertType(() => {}, "function"));
                mustNotThrow(() => assertType(function () {}, "function"));
                mustNotThrow(() => assertType(Date, "function"));
                mustNotThrow(() => assertType(class {}, "function"));
            });

            test('for "object" with object value', () => {
                mustNotThrow(() => assertType({}, "object"));
                mustNotThrow(() => assertType([], "object"));
                mustNotThrow(() => assertType(new Date(), "object"));
                mustNotThrow(() => assertType(null, "object"));
            });

            test('for "symbol" with symbol value', () => {
                mustNotThrow(() => assertType(Symbol("test"), "symbol"));
            });
        });

        group("should throw", () => {
            test('for "string" with non-string value', () => {
                mustThrow(() => assertType(new String("test"), "string"));
                mustThrow(() => assertType(42, "string"));
                mustThrow(() => assertType(null, "string"));
                mustThrow(() => assertType(undefined, "string"));
            });

            test('for "number" with non-number value', () => {
                mustThrow(() => assertType(new Number(42), "number"));
                mustThrow(() => assertType("42", "number"));
                mustThrow(() => assertType(42n, "number"));
                mustThrow(() => assertType(undefined, "number"));
            });

            test('for "boolean" with non-boolean value', () => {
                mustThrow(() => assertType(new Boolean(true), "boolean"));
                mustThrow(() => assertType(1, "boolean"));
                mustThrow(() => assertType("true", "boolean"));
                mustThrow(() => assertType(undefined, "boolean"));
            });

            test('for "bigint" with non-bigint value', () => {
                mustThrow(() => assertType(123, "bigint"));
                mustThrow(() => assertType(undefined, "bigint"));
            });

            test('for "function" with non-function value', () => {
                mustThrow(() => assertType({}, "function"));
                mustThrow(() => assertType(undefined, "function"));
            });
        });
    });

    group("with null and undefined", () => {
        test("should not throw for null with null", () => {
            mustNotThrow(() => assertType(null, null));
        });

        test("should throw for non-null with null", () => {
            mustThrow(() => assertType("null", null));
            mustThrow(() => assertType(NaN, null));
            mustThrow(() => assertType(undefined, null));
        });

        test("should not throw for undefined with undefined", () => {
            mustNotThrow(() => assertType(undefined, undefined));
        });

        test("should throw for non-undefined with undefined", () => {
            mustThrow(() => assertType(null, undefined));
            mustThrow(() => assertType(NaN, undefined));
            mustThrow(() => assertType("undefined", undefined));
        });
    });

    group("with constructors", () => {
        test("should not throw for instance of class", () => {
            mustNotThrow(() => assertType(new Date(), Date));
            mustNotThrow(() => assertType(new Error(), Error));
            mustNotThrow(() => assertType([], Array));
            mustNotThrow(() => assertType({}, Object));
            mustNotThrow(() => assertType(/test/, RegExp));
        });

        test("should throw for non-instance", () => {
            mustThrow(() => assertType({}, Date));
            mustThrow(() => assertType("2026-01-01", Date));
            mustThrow(() => assertType(null, Object));
        });

        test("should work with custom classes", () => {
            class CustomClass {}
            mustNotThrow(() => assertType(new CustomClass(), CustomClass));
            mustThrow(() => assertType({}, CustomClass));
        });

        test("should handle inheritance", () => {
            class Parent {}
            class Child extends Parent {}
            const child = new Child();
            mustNotThrow(() => assertType(child, Parent));
            mustNotThrow(() => assertType(child, Child));
            const parent = new Parent();
            mustNotThrow(() => assertType(parent, Parent));
            mustThrow(() => assertType(parent, Child));
        });
    });
});

group("assertArrayType", () => {
    group("should not throw", () => {
        test("for array of strings", () => {
            mustNotThrow(() => assertArrayType([""], "string"));
            mustNotThrow(() => assertArrayType(["a", "b", "c"], "string"));
        });

        test("for array of numbers", () => {
            mustNotThrow(() => assertArrayType([1, 2, 3], "number"));
            mustNotThrow(() => assertArrayType([0, -1, NaN, Infinity], "number"));
        });

        test("for empty array", () => {
            mustNotThrow(() => assertArrayType([], "string"));
            mustNotThrow(() => assertArrayType([], "number"));
        });

        test("for array of class instances", () => {
            mustNotThrow(() => assertArrayType([new Date(), new Date()], Date));
        });

        test("for array of null", () => {
            mustNotThrow(() => assertArrayType([null, null], null));
        });

        test("for array of undefined", () => {
            mustNotThrow(() => assertArrayType([undefined, undefined], undefined));
        });
    });

    group("should throw", () => {
        test("for mixed type array", () => {
            const stringsAndNumbers = [1, "a", 2];
            mustThrow(() => assertArrayType(stringsAndNumbers, "number"));
            mustThrow(() => assertArrayType(stringsAndNumbers, "string"));
        });

        test("for sparse array", () => {
            const sparse = [1, 2, 3];
            delete sparse[1]; // [1, empty, 3]
            mustThrow(() => assertArrayType(sparse, "number"), /sparse/);
        });

        test("with an error message specifying the first wrong index", () => {
            mustThrow(() => assertArrayType([1, 2, "oops", 4, "oh"], "number"), /index 2/);
            const sparse = [1, 2, 3];
            delete sparse[1]; // [1, empty, 3]
            mustThrow(() => assertArrayType(sparse, "number"), /index 1/);
        });
    });
});

group("assertTupleTypes", () => {
    group("should not throw", () => {
        test("for matching tuple types", () => {
            mustNotThrow(() => assertTupleTypes(
                    [1, 1n, "a", undefined, null, new Date()],
                    ["number", "bigint", "string", undefined, null, Date]
                ));
        });

        test("for empty tuple", () => {
            mustNotThrow(() => assertTupleTypes([], []));
        });
    });

    group("should throw", () => {
        test("for length mismatch", () => {
            const oneTuple = [1];
            mustThrow(() => assertTupleTypes(oneTuple, ["number", "number"]), /length mismatch.*?expected 2.*?got 1/);
            const threeTuple = [1, 2, 3];
            mustThrow(() => assertTupleTypes(threeTuple, ["number", "number"]), /length mismatch.*?expected 2.*?got 3/);
        });

        test("for type mismatch at specific index", () => {
            mustThrow(() => assertTupleTypes([1, 2], ["number", "string"]), /index 1/);
        });

        test("for sparse tuple", () => {
            const sparseTuple = [1, 2, 3];
            delete sparseTuple[1]; // [1, empty, 3]
            mustThrow(() => assertTupleTypes(sparseTuple, ["number", "number", "number"]), /index 1/);
            // [1, empty, 3] != [1, 3]
            mustThrow(() => assertTupleTypes(sparseTuple, ["number", "number"]), /length mismatch/);
        });
    });
});

group("assertTypeOfString", () => {
    test("should not throw for string", () => {
        mustNotThrow(() => assertTypeOfString("hello"));
        mustNotThrow(() => assertTypeOfString(""));
    });

    test("should throw for non-string", () => {
        mustThrow(() => assertTypeOfString(new String("hello")));
        mustThrow(() => assertTypeOfString(42));
        mustThrow(() => assertTypeOfString(null));
        mustThrow(() => assertTypeOfString(undefined));
    });
});

group("assertTypeOfNumber", () => {
    test("should not throw for number", () => {
        mustNotThrow(() => assertTypeOfNumber(42));
        mustNotThrow(() => assertTypeOfNumber(0));
        mustNotThrow(() => assertTypeOfNumber(NaN));
        mustNotThrow(() => assertTypeOfNumber(Infinity));
    });

    test("should throw for non-number", () => {
        mustThrow(() => assertTypeOfNumber(new Number(42)));
        mustThrow(() => assertTypeOfNumber(42n));
        mustThrow(() => assertTypeOfNumber("42"));
        mustThrow(() => assertTypeOfNumber(undefined));
    });
});

group("assertTypeOfBoolean", () => {
    test("should not throw for boolean", () => {
        mustNotThrow(() => assertTypeOfBoolean(true));
        mustNotThrow(() => assertTypeOfBoolean(false));
    });

    test("should throw for non-boolean", () => {
        mustThrow(() => assertTypeOfBoolean(new Boolean(true)));
        mustThrow(() => assertTypeOfBoolean(1));
        mustThrow(() => assertTypeOfBoolean("true"));
        mustThrow(() => assertTypeOfBoolean(undefined));
    });
});

group("assertTypeOfBigint", () => {
    test("should not throw for bigint", () => {
        mustNotThrow(() => assertTypeOfBigint(123n));
        mustNotThrow(() => assertTypeOfBigint(0n));
        mustNotThrow(() => assertTypeOfBigint(-1n));
    });

    test("should throw for non-bigint", () => {
        mustThrow(() => assertTypeOfBigint(123));
        mustThrow(() => assertTypeOfBigint("123"));
        mustThrow(() => assertTypeOfBigint(undefined));
    });
});

group("assertTypeOfUndefined", () => {
    test("should not throw for undefined", () => {
        mustNotThrow(() => assertTypeOfUndefined(undefined));
    });

    test("should throw for non-undefined", () => {
        mustThrow(() => assertTypeOfUndefined(null));
        mustThrow(() => assertTypeOfUndefined("undefined"));
        mustThrow(() => assertTypeOfUndefined(0));
        mustThrow(() => assertTypeOfUndefined(false));
        mustThrow(() => assertTypeOfUndefined(Symbol(undefined)));
    });
});

group("assertTypeOfFunction", () => {
    test("should not throw for function", () => {
        mustNotThrow(() => assertTypeOfFunction(() => {}));
        mustNotThrow(() => assertTypeOfFunction(function () {}));
        mustNotThrow(() => assertTypeOfFunction(class {}));
        mustNotThrow(() => assertTypeOfFunction(Date));
        mustNotThrow(() => assertTypeOfFunction(new Function("return 42")));
    });

    test("should throw for non-function", () => {
        mustThrow(() => assertTypeOfFunction({}));
        mustThrow(() => assertTypeOfFunction("function"));
        mustThrow(() => assertTypeOfFunction(undefined));
    });
});

group("assertTypeOfObject", () => {
    test("should not throw for object", () => {
        mustNotThrow(() => assertTypeOfObject({}));
        mustNotThrow(() => assertTypeOfObject([]));
        mustNotThrow(() => assertTypeOfObject(new Object()));
        mustNotThrow(() => assertTypeOfObject(new Date()));
        mustNotThrow(() => assertTypeOfObject(null));
    });

    test("should throw for non-object", () => {
        mustThrow(() => assertTypeOfObject("object"));
        mustThrow(() => assertTypeOfObject(42));
        mustThrow(() => assertTypeOfObject(() => {}));
        mustThrow(() => assertTypeOfObject(new Function("return 42")));
        mustThrow(() => assertTypeOfObject(undefined));
    });
});

group("assertTypeOfSymbol", () => {
    test("should not throw for symbol", () => {
        mustNotThrow(() => assertTypeOfSymbol(Symbol("test")));
        mustNotThrow(() => assertTypeOfSymbol(Symbol.iterator));
        mustNotThrow(() => assertTypeOfSymbol(Symbol(undefined)));
    });

    test("should throw for non-symbol", () => {
        mustThrow(() => assertTypeOfSymbol(() => Symbol("test")));
        mustThrow(() => assertTypeOfSymbol("symbol"));
        mustThrow(() => assertTypeOfSymbol({}));
        mustThrow(() => assertTypeOfSymbol(undefined));
    });
});

group("assertNull", () => {
    test("should not throw for null", () => {
        mustNotThrow(() => assertNull(null));
    });

    test("should throw for non-null", () => {
        mustThrow(() => assertNull(undefined));
        mustThrow(() => assertNull(""));
        mustThrow(() => assertNull("null"));
        mustThrow(() => assertNull(0));
        mustThrow(() => assertNull(NaN));
        mustThrow(() => assertNull(0n));
        mustThrow(() => assertNull(false));
        mustThrow(() => assertNull({}));
    });
});

group("assertInstanceOf", () => {
    test("should not throw for valid instance", () => {
        mustNotThrow(() => assertInstanceOf({}, Object));
        mustNotThrow(() => assertInstanceOf(new Date(), Date));
        mustNotThrow(() => assertInstanceOf(new Error(), Error));
        mustNotThrow(() => assertInstanceOf([], Array));
    });

    test("should handle inheritance", () => {
        class Parent {}
        class Child extends Parent {}
        const child = new Child();
        mustNotThrow(() => assertInstanceOf(child, Parent));
        mustNotThrow(() => assertInstanceOf(child, Child));
        const parent = new Parent();
        mustNotThrow(() => assertInstanceOf(parent, Parent));
        mustThrow(() => assertInstanceOf(parent, Child));
    });

    test("should throw for non-instance", () => {
        mustThrow(() => assertInstanceOf({}, Date));
        mustThrow(() => assertInstanceOf("2026-01-01", Date));
        mustThrow(() => assertInstanceOf(null, Object));
    });

    test("should throw with descriptive error", () => {
        mustThrow(() => assertInstanceOf({}, Date), /Date/);
        mustThrow(() => assertInstanceOf("", Object), /Object/);
        class CustomClass {}
        mustThrow(() => assertInstanceOf(new Date(), CustomClass), /CustomClass/);
    });
});

group("assertIsTuple", () => {
    group("should not throw", () => {
        test("for array matching expected length", () => {
            // casting because otherwise TypeScript doesn't allow a tuple of known length to be passed
            mustNotThrow(() => assertIsTuple([1, 2] as number[], 2));
            mustNotThrow(() => assertIsTuple(["a"] as string[], 1));
            mustNotThrow(() => assertIsTuple([1, 2, 3, 4, 5] as number[], 5));
        });

        test("for empty array with length 0", () => {
            mustNotThrow(() => assertIsTuple([] as unknown[], 0));
        });
    });

    group("should throw", () => {
        test("for array shorter than expected", () => {
            mustThrow(() => assertIsTuple([1] as number[], 2), /expected length 2.*?has length 1/i);
        });

        test("for array longer than expected", () => {
            mustThrow(() => assertIsTuple([1, 2, 3] as number[], 2), /expected length 2.*?has length 3/i);
        });

        test("for sparse array", () => {
            const sparse = [1, 2, 3];
            delete sparse[1];
            mustThrow(() => assertIsTuple(sparse, 3), /sparse.*?index 1/i);
        });
    });
});

group("assertUnreachable", () => {
    test("should throw when called", () => {
        // This function should only be called if there's a type error somewhere
        // So it should always throw at runtime
        mustThrow(() => assertUnreachable("unreachable" as never));
    });

    test("should include value and type info in error", () => {
        mustThrow(() => assertUnreachable("myValue" as never), /string.*?myValue/);
        mustThrow(() => assertUnreachable(new Date() as never), /Date/);
        mustThrow(() => assertUnreachable((() => {}) as never), /Function/);
        mustThrow(() => assertUnreachable(null as never), /null/);
        mustThrow(() => assertUnreachable(undefined as never), /undefined/);
    });

    test("should include custom message", () => {
        mustThrow(() => assertUnreachable("myValue" as never, "Custom error message"), /Custom error message/);
    });
});

group("assertNonNullable", () => {
    group("should not throw", () => {
        test("for non-null values", () => {
            mustNotThrow(() => assertNonNullable(""));
            mustNotThrow(() => assertNonNullable(0));
            mustNotThrow(() => assertNonNullable(false));
            mustNotThrow(() => assertNonNullable({}));
            mustNotThrow(() => assertNonNullable([]));
        });
    });

    group("should throw", () => {
        test("for null", () => {
            mustThrow(() => assertNonNullable(null), /null/);
        });

        test("for undefined", () => {
            mustThrow(() => assertNonNullable(undefined), /undefined/);
        });
    });
});

group("assertPropsNonNullable", () => {
    type TestObject = { a: string | undefined | null, b?: number };

    group("should not throw", () => {
        test("for object with non-null checked props", () => {
            const obj: TestObject = { a: "hello"};
            mustNotThrow(() => assertPropsNonNullable(obj, ["a"]));
        });

        test("for empty propKeys array", () => {
            const obj: TestObject = { a: undefined };
            mustNotThrow(() => assertPropsNonNullable(obj, []));
        });
    });

    group("should throw", () => {
        test("for null property value", () => {
            const obj: TestObject = { a: null, b: 42 };
            mustThrow(() => assertPropsNonNullable(obj, ["a"]), /a/);
        });

        test("for undefined property value", () => {
            const obj: TestObject = { a: undefined };
            mustThrow(() => assertPropsNonNullable(obj, ["a"]), /a/);
        });

        test("for missing property", () => {
            const obj: TestObject = { a: "" };
            mustThrow(() => assertPropsNonNullable(obj, ["b"]), /b.*?not present/);
        });
    });
});

group("assertArrayNonNullable", () => {
    group("should not throw", () => {
        test("for array without null or undefined", () => {
            mustNotThrow(() => assertArrayNonNullable([1, 2, 3]));
            mustNotThrow(() => assertArrayNonNullable(["a", "b"]));
            mustNotThrow(() => assertArrayNonNullable([0, "", false, Date, new Date(), {}, []]));
        });

        test("for empty array", () => {
            mustNotThrow(() => assertArrayNonNullable([]));
        });
    });

    group("should throw", () => {
        test("for array containing null", () => {
            mustThrow(() => assertArrayNonNullable([1, null, 3]), /null.*?index 1/i);
        });

        test("for array containing undefined", () => {
            mustThrow(() => assertArrayNonNullable([1, undefined, 3]), /undefined.*?index 1/i);
        });

        test("for sparse array", () => {
            const sparse = [1, 2, 3];
            delete sparse[1];
            mustThrow(() => assertArrayNonNullable(sparse), /sparse.*?index 1/i);
        });
    });
});

group("assertTupleNonNullable", () => {
    group("should not throw", () => {
        test("for tuple without null or undefined", () => {
            const tuple: [number, string, boolean, Date, object, unknown[]]
                = [0, "", false, new Date(), {}, []];
            mustNotThrow(() => assertTupleNonNullable(tuple));
        });
    });

    group("should throw", () => {
        test("for tuple containing null", () => {
            const tuple: [number, null] = [1, null];
            mustThrow(() => assertTupleNonNullable(tuple), /null.*?index 1/i);
        });

        test("for tuple containing undefined", () => {
            const tuple: [number, undefined] = [1, undefined];
            mustThrow(() => assertTupleNonNullable(tuple), /undefined.*?index 1/i);
        });

        test("for sparse tuple", () => {
            const tuple: [number, number, number] = [1, 2, 3];
            // @ts-expect-error - TypeScript is trying to protect us from invalidating the tuple type
            delete tuple[1];
            mustThrow(() => assertTupleNonNullable(tuple), /sparse.*?index 1/i);
        });
    });
});

group("assertFiniteNumber", () => {
    group("should not throw", () => {
        test("for finite numbers", () => {
            mustNotThrow(() => assertFiniteNumber(42));
            mustNotThrow(() => assertFiniteNumber(0));
            mustNotThrow(() => assertFiniteNumber(-1));
            mustNotThrow(() => assertFiniteNumber(3.14));
            mustNotThrow(() => assertFiniteNumber(Number.MAX_VALUE));
            mustNotThrow(() => assertFiniteNumber(Number.MIN_VALUE));
        });
    });

    group("should throw", () => {
        test("for NaN", () => {
            mustThrow(() => assertFiniteNumber(NaN), /NaN/);
        });

        test("for Infinity", () => {
            mustThrow(() => assertFiniteNumber(Infinity), /Infinity/);
            mustThrow(() => assertFiniteNumber(-Infinity), /-Infinity/);
        });

        test("for non-number types", () => {
            mustThrow(() => assertFiniteNumber("42"), /string/);
            mustThrow(() => assertFiniteNumber(42n), /bigint/);
            mustThrow(() => assertFiniteNumber(new Number(42)), /Number/);
            mustThrow(() => assertFiniteNumber(null), /null/);
            mustThrow(() => assertFiniteNumber(undefined), /undefined/);
        });
    });
});
