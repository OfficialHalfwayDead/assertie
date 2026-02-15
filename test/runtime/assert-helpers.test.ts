import { group, test, mustEqual, mustBeTrue, mustBeFalse } from "./testing";
import {
    getNameOfExpectedType,
    getTypeNameOfUnknown,
    isType,
} from "../../src/assert-helpers";

group("getNameOfExpectedType", () => {
    group("primitive type strings", () => {
        test("returns the string itself for all primitive type strings", () => {
            mustEqual(getNameOfExpectedType("string"), "string");
            mustEqual(getNameOfExpectedType("number"), "number");
            mustEqual(getNameOfExpectedType("boolean"), "boolean");
            mustEqual(getNameOfExpectedType("bigint"), "bigint");
            mustEqual(getNameOfExpectedType("undefined"), "undefined");
            mustEqual(getNameOfExpectedType("function"), "function");
            mustEqual(getNameOfExpectedType("object"), "object");
            mustEqual(getNameOfExpectedType("symbol"), "symbol");
        });
    });

    group("null and undefined literals", () => {
        test('returns "null" for null', () => {
            mustEqual(getNameOfExpectedType(null), "null");
        });

        test('returns "undefined" for undefined', () => {
            mustEqual(getNameOfExpectedType(undefined), "undefined");
        });
    });

    group("constructor functions", () => {
        test("returns class name for built-in constructors", () => {
            mustEqual(getNameOfExpectedType(Date), "Date");
            mustEqual(getNameOfExpectedType(Error), "Error");
            mustEqual(getNameOfExpectedType(Array), "Array");
            mustEqual(getNameOfExpectedType(Object), "Object");
            mustEqual(getNameOfExpectedType(Function), "Function");
            mustEqual(getNameOfExpectedType(RegExp), "RegExp");
            mustEqual(getNameOfExpectedType(Map), "Map");
            mustEqual(getNameOfExpectedType(Set), "Set");
            mustEqual(getNameOfExpectedType(WeakMap), "WeakMap");
            mustEqual(getNameOfExpectedType(WeakSet), "WeakSet");
            mustEqual(getNameOfExpectedType(Promise), "Promise");
            mustEqual(getNameOfExpectedType(ArrayBuffer), "ArrayBuffer");
            mustEqual(getNameOfExpectedType(Uint8Array), "Uint8Array");
            mustEqual(getNameOfExpectedType(Int32Array), "Int32Array");
            mustEqual(getNameOfExpectedType(Float64Array), "Float64Array");
        });

        test("returns class name for error subclasses", () => {
            mustEqual(getNameOfExpectedType(TypeError), "TypeError");
            mustEqual(getNameOfExpectedType(RangeError), "RangeError");
            mustEqual(getNameOfExpectedType(SyntaxError), "SyntaxError");
            mustEqual(getNameOfExpectedType(ReferenceError), "ReferenceError");
            mustEqual(getNameOfExpectedType(URIError), "URIError");
        });

        test("returns class name for named custom classes", () => {
            class MyCustomClass {}
            class AnotherClass {}
            class VeryLongClassNameThatIsDescriptive {}

            mustEqual(getNameOfExpectedType(MyCustomClass), "MyCustomClass");
            mustEqual(getNameOfExpectedType(AnotherClass), "AnotherClass");
            mustEqual(getNameOfExpectedType(VeryLongClassNameThatIsDescriptive), "VeryLongClassNameThatIsDescriptive");
        });

        test("returns class name for class expressions", () => {
            const NamedExpression = class InnerName {};
            const AnonymousExpression = class {};

            // Named class expression uses the inner name
            mustEqual(getNameOfExpectedType(NamedExpression), "InnerName");
            // Anonymous class expression has empty or generated name
            mustEqual(getNameOfExpectedType(AnonymousExpression), "AnonymousExpression");
        });

        test("returns class name for extended classes", () => {
            class Parent {}
            class Child extends Parent {}
            class GrandChild extends Child {}

            mustEqual(getNameOfExpectedType(Parent), "Parent");
            mustEqual(getNameOfExpectedType(Child), "Child");
            mustEqual(getNameOfExpectedType(GrandChild), "GrandChild");
        });

        test("returns class name for classes extending built-ins", () => {
            class MyArray extends Array {}
            class MyError extends Error {}
            class MyMap extends Map {}

            mustEqual(getNameOfExpectedType(MyArray), "MyArray");
            mustEqual(getNameOfExpectedType(MyError), "MyError");
            mustEqual(getNameOfExpectedType(MyMap), "MyMap");
        });
    });
});

group("getTypeNameOfUnknown", () => {
    group("null and undefined", () => {
        test('returns "null" for null', () => {
            mustEqual(getTypeNameOfUnknown(null), "null");
        });

        test('returns "undefined" for undefined', () => {
            mustEqual(getTypeNameOfUnknown(undefined), "undefined");
        });
    });

    group("primitives", () => {
        test('returns "string" for strings', () => {
            mustEqual(getTypeNameOfUnknown("hello"), "string");
            mustEqual(getTypeNameOfUnknown(""), "string");
            mustEqual(getTypeNameOfUnknown("🎉"), "string");
        });

        test('returns "number" for numbers', () => {
            mustEqual(getTypeNameOfUnknown(42), "number");
            mustEqual(getTypeNameOfUnknown(0), "number");
            mustEqual(getTypeNameOfUnknown(-1), "number");
            mustEqual(getTypeNameOfUnknown(3.14), "number");
            mustEqual(getTypeNameOfUnknown(NaN), "number");
            mustEqual(getTypeNameOfUnknown(Infinity), "number");
            mustEqual(getTypeNameOfUnknown(-Infinity), "number");
            mustEqual(getTypeNameOfUnknown(-0), "number");
        });

        test('returns "boolean" for booleans', () => {
            mustEqual(getTypeNameOfUnknown(true), "boolean");
            mustEqual(getTypeNameOfUnknown(false), "boolean");
        });

        test('returns "bigint" for bigints', () => {
            mustEqual(getTypeNameOfUnknown(0n), "bigint");
            mustEqual(getTypeNameOfUnknown(123n), "bigint");
            mustEqual(getTypeNameOfUnknown(-456n), "bigint");
            mustEqual(getTypeNameOfUnknown(99999999999999999999999999999999999n), "bigint");
        });

        test('returns "symbol" for symbols', () => {
            mustEqual(getTypeNameOfUnknown(Symbol("test")), "symbol");
            mustEqual(getTypeNameOfUnknown(Symbol.for("global")), "symbol");
            mustEqual(getTypeNameOfUnknown(Symbol.iterator), "symbol");
            mustEqual(getTypeNameOfUnknown(Symbol.toStringTag), "symbol");
        });
    });

    group("functions", () => {
        test('returns correct type name for all function types', () => {
            mustEqual(getTypeNameOfUnknown(() => {}), "Function");
            mustEqual(getTypeNameOfUnknown(function () {}), "Function");
            mustEqual(getTypeNameOfUnknown(function named() {}), "Function");
            mustEqual(getTypeNameOfUnknown(async () => {}), "AsyncFunction");
            mustEqual(getTypeNameOfUnknown(async function () {}), "AsyncFunction");
            mustEqual(getTypeNameOfUnknown(function* () {}), "GeneratorFunction");
            mustEqual(getTypeNameOfUnknown(async function* () {}), "AsyncGeneratorFunction");
        });

        test('returns "Function" for class constructors', () => {
            mustEqual(getTypeNameOfUnknown(class {}), "Function");
            mustEqual(getTypeNameOfUnknown(class Named {}), "Function");
            mustEqual(getTypeNameOfUnknown(Date), "Function");
            mustEqual(getTypeNameOfUnknown(Array), "Function");
        });

        test('returns "Function" for bound functions', () => {
            const fn = function () {};
            const bound = fn.bind(null);
            mustEqual(getTypeNameOfUnknown(bound), "Function");
        });

        test('returns "Function" for Function constructor result', () => {
            mustEqual(getTypeNameOfUnknown(new Function("return 42")), "Function");
        });
    });

    group("objects - plain", () => {
        test('returns "Object" for plain objects', () => {
            mustEqual(getTypeNameOfUnknown({}), "Object");
            mustEqual(getTypeNameOfUnknown({ a: 1 }), "Object");
        });

        test('returns "Object" for Object.create(null)', () => {
            mustEqual(getTypeNameOfUnknown(Object.create(null)), "Object");
        });

        test('returns "Object" for Proxied object', () => {
            const proxy = new Proxy({}, {});
            mustEqual(getTypeNameOfUnknown(proxy), "Object");
        });

    });

    group("objects - special", () => {
        test('returns "Array" for arrays', () => {
            mustEqual(getTypeNameOfUnknown([]), "Array");
            mustEqual(getTypeNameOfUnknown([1, 2, 3]), "Array");
        });

        test('returns constructor names for class instances', () => {
            class MyClass {}
            mustEqual(getTypeNameOfUnknown(new MyClass()), "MyClass");
        });

        test('returns constructor names for built-in object instances', () => {
            mustEqual(getTypeNameOfUnknown(new Date()), "Date");
            mustEqual(getTypeNameOfUnknown(new Error()), "Error");
            mustEqual(getTypeNameOfUnknown(new Map()), "Map");
            mustEqual(getTypeNameOfUnknown(new Set()), "Set");
            mustEqual(getTypeNameOfUnknown(new WeakMap()), "WeakMap");
            mustEqual(getTypeNameOfUnknown(new WeakSet()), "WeakSet");
            mustEqual(getTypeNameOfUnknown(/regex/), "RegExp");
            mustEqual(getTypeNameOfUnknown(new ArrayBuffer(8)), "ArrayBuffer");
            mustEqual(getTypeNameOfUnknown(new Uint8Array(8)), "Uint8Array");
        });

        test('returns "Promise" for a resolved promise', () => {
            mustEqual(getTypeNameOfUnknown(Promise.resolve()), "Promise");
        });

        test('returns constructor names for boxed primitives', () => {
            mustEqual(getTypeNameOfUnknown(new String("hello")), "String");
            mustEqual(getTypeNameOfUnknown(new Number(42)), "Number");
            mustEqual(getTypeNameOfUnknown(new Boolean(true)), "Boolean");
        });
    });

    group("edge cases", () => {
        test("frozen and sealed objects", () => {
            mustEqual(getTypeNameOfUnknown(Object.freeze({})), "Object");
            mustEqual(getTypeNameOfUnknown(Object.seal({})), "Object");
            mustEqual(getTypeNameOfUnknown(Object.freeze([1, 2, 3])), "Array");
            mustEqual(getTypeNameOfUnknown(Object.seal([1, 2, 3])), "Array");
        });

        test("arguments object", () => {
            function getArgs(_1: number, _2: number) {
                // arguments is an array-like object, not an actual array
                return arguments; // contains the function args: [_1, _2]
            }
            mustEqual(getTypeNameOfUnknown(getArgs(1, 2)), "Object");
        });

        test("generator and async iterator objects", () => {
            function* gen() {
                yield 1;
            }
            async function* asyncGen() {
                yield 1;
            }
            mustEqual(getTypeNameOfUnknown(gen()), "Generator");
            mustEqual(getTypeNameOfUnknown(asyncGen()), "AsyncGenerator");
            const result = gen().next();
            mustEqual(getTypeNameOfUnknown(result), "Object");
            mustEqual(getTypeNameOfUnknown(result.value), "number");
            const asyncResult = asyncGen().next();
            mustEqual(getTypeNameOfUnknown(asyncResult), "Promise");
        });
    });
});

group("isType", () => {
    group("primitive type strings - matching", () => {
        test('returns true for "string" with strings', () => {
            mustBeTrue(isType("hello", "string"));
            mustBeTrue(isType("", "string"));
            mustBeTrue(isType("🎉", "string"));
            mustBeTrue(isType(`template ${1 + 1}`, "string"));
        });

        test('returns true for "number" with numbers', () => {
            mustBeTrue(isType(42, "number"));
            mustBeTrue(isType(0, "number"));
            mustBeTrue(isType(-1, "number"));
            mustBeTrue(isType(3.14, "number"));
            mustBeTrue(isType(NaN, "number"));
            mustBeTrue(isType(Infinity, "number"));
            mustBeTrue(isType(-Infinity, "number"));
            mustBeTrue(isType(-0, "number"));
            mustBeTrue(isType(Number.MAX_VALUE, "number"));
            mustBeTrue(isType(Number.MIN_VALUE, "number"));
            mustBeTrue(isType(Number.EPSILON, "number"));
        });

        test('returns true for "boolean" with booleans', () => {
            mustBeTrue(isType(true, "boolean"));
            mustBeTrue(isType(false, "boolean"));
        });

        test('returns true for "bigint" with bigints', () => {
            mustBeTrue(isType(0n, "bigint"));
            mustBeTrue(isType(123n, "bigint"));
            mustBeTrue(isType(-456n, "bigint"));
            mustBeTrue(isType(99999999999999999999n, "bigint"));
        });

        test('returns true for "undefined" with undefined', () => {
            mustBeTrue(isType(undefined, "undefined"));
            mustBeTrue(isType(undefined, undefined));
        });

        test('returns true for "null" with null', () => {
            mustBeTrue(isType(null, null));
        });

        test('returns true for "function" with functions', () => {
            mustBeTrue(isType(() => {}, "function"));
            mustBeTrue(isType(function () {}, "function"));
            mustBeTrue(isType(function named() {}, "function"));
            mustBeTrue(isType(async () => {}, "function"));
            mustBeTrue(isType(function* () {}, "function"));
            mustBeTrue(isType(async function* () {}, "function"));
            const bound = (function () {}).bind(null);
            mustBeTrue(isType(bound, "function"));
        });
        
        test('returns true for "function" with class constructors', () => {
            mustBeTrue(isType(class {}, "function"));
            mustBeTrue(isType(Date, "function"));
        });

        test('returns true for "object" with objects', () => {
            mustBeTrue(isType({}, "object"));
            mustBeTrue(isType([], "object"));
            mustBeTrue(isType(null, "object"));
            mustBeTrue(isType(new Date(), "object"));
            mustBeTrue(isType(/regex/, "object"));
            mustBeTrue(isType(Promise.resolve(), "object"));
        });

        test('returns true for "symbol" with symbols', () => {
            mustBeTrue(isType(Symbol("test"), "symbol"));
            mustBeTrue(isType(Symbol.for("global"), "symbol"));
            mustBeTrue(isType(Symbol.iterator, "symbol"));
        });
    });

    group("primitive type strings - mismatching", () => {
        test('returns false for "string" with non-strings', () => {
            mustBeFalse(isType(42, "string"));
            mustBeFalse(isType(true, "string"));
            mustBeFalse(isType(null, "string"));
            mustBeFalse(isType(undefined, "string"));
            mustBeFalse(isType({}, "string"));
            mustBeFalse(isType(Symbol("x"), "string"));
            mustBeFalse(isType(new String("boxed"), "string"));
        });

        test('returns false for "number" with non-numbers', () => {
            mustBeFalse(isType("42", "number"));
            mustBeFalse(isType(true, "number"));
            mustBeFalse(isType(null, "number"));
            mustBeFalse(isType(123n, "number"));
            mustBeFalse(isType(new Number(42), "number"));
        });

        test('returns false for "boolean" with non-booleans', () => {
            mustBeFalse(isType(0, "boolean"));
            mustBeFalse(isType(1, "boolean"));
            mustBeFalse(isType("true", "boolean"));
            mustBeFalse(isType(null, "boolean"));
            mustBeFalse(isType(new Boolean(true), "boolean"));
        });

        test('returns false for "bigint" with non-bigints', () => {
            mustBeFalse(isType(123, "bigint"));
            mustBeFalse(isType("123", "bigint"));
            mustBeFalse(isType(Object(123n), "bigint"));
        });

        test('returns false for "undefined" with non-undefined', () => {
            mustBeFalse(isType(null, "undefined"));
            mustBeFalse(isType("", "undefined"));
            mustBeFalse(isType(0, "undefined"));
            mustBeFalse(isType(false, "undefined"));
            mustBeFalse(isType({}, "undefined"));
            mustBeFalse(isType(null, undefined));
            mustBeFalse(isType("", undefined));
            mustBeFalse(isType(0, undefined));
            mustBeFalse(isType(false, undefined));
            mustBeFalse(isType({}, undefined));
        });

        test("returns false for null with non-null", () => {
            mustBeFalse(isType(undefined, null));
            mustBeFalse(isType("", null));
            mustBeFalse(isType(0, null));
            mustBeFalse(isType(false, null));
            mustBeFalse(isType({}, null));
        });

        test('returns false for "function" with non-functions', () => {
            mustBeFalse(isType("", "function"));
            mustBeFalse(isType({}, "function"));
            mustBeFalse(isType([], "function"));
            mustBeFalse(isType(new Date(), "function"));
        });

        test('returns false for "object" with non-objects', () => {
            mustBeFalse(isType("string", "object"));
            mustBeFalse(isType(42, "object"));
            mustBeFalse(isType(42n, "object"));
            mustBeFalse(isType(true, "object"));
            mustBeFalse(isType(undefined, "object"));
            mustBeFalse(isType(() => {}, "object"));
            mustBeFalse(isType(Symbol("x"), "object"));
        });

        test('returns false for "symbol" with non-symbols', () => {
            mustBeFalse(isType("symbol", "symbol"));
            mustBeFalse(isType({}, "symbol"));
            mustBeFalse(isType(Object(Symbol("boxed")), "symbol"));
        });
    });

    group("constructors - instanceof checks", () => {
        test("returns true for instances of built-in classes", () => {
            mustBeTrue(isType(new Date(), Date));
            mustBeTrue(isType(new Error(), Error));
            mustBeTrue(isType(new TypeError(), TypeError));
            mustBeTrue(isType([], Array));
            mustBeTrue(isType({}, Object));
            mustBeTrue(isType(/regex/, RegExp));
            mustBeTrue(isType(new Map(), Map));
            mustBeTrue(isType(new Set(), Set));
            mustBeTrue(isType(new WeakMap(), WeakMap));
            mustBeTrue(isType(new WeakSet(), WeakSet));
            mustBeTrue(isType(Promise.resolve(), Promise));
            mustBeTrue(isType(new ArrayBuffer(8), ArrayBuffer));
            mustBeTrue(isType(new Uint8Array(8), Uint8Array));
        });

        test("returns true for instances of custom classes", () => {
            class MyClass {}
            mustBeTrue(isType(new MyClass(), MyClass));
        });

        test("returns true for all function types with Function", () => {
            mustBeTrue(isType(() => {}, Function));
            mustBeTrue(isType(async () => {}, Function));
            mustBeTrue(isType(function* () {}, Function));
            mustBeTrue(isType(async function* () {}, Function));
            mustBeTrue(isType(class {}, Function));
            const bound = (function () {}).bind(null);
            mustBeTrue(isType(bound, Function));
        });

        test("returns false for non-instances", () => {
            mustBeFalse(isType({}, Date));
            mustBeFalse(isType({}, Array));
            mustBeFalse(isType([], Map));
            mustBeFalse(isType(new Date(), Error));

            class MyClass {}
            mustBeFalse(isType({}, MyClass));
        });

        test("returns true when item IS the constructor itself", () => {
            mustBeTrue(isType(Date, Date));
            mustBeTrue(isType(Array, Array));

            class MyClass {}
            mustBeTrue(isType(MyClass, MyClass));
        });

        test("inheritance chain works correctly", () => {
            class A {}
            class B extends A {}
            class C extends B {}

            const c = new C();
            mustBeTrue(isType(c, C));
            mustBeTrue(isType(c, B));
            mustBeTrue(isType(c, A));
            mustBeTrue(isType(c, Object));
            
            const b = new B();
            mustBeTrue(isType(b, B));
            mustBeTrue(isType(b, A));
            mustBeFalse(isType(b, C));
        });

        test("extended built-in classes", () => {
            class MyArray extends Array {}
            class MyError extends Error {}
            class MyMap extends Map {}

            const arr = new MyArray();
            const err = new MyError();
            const map = new MyMap();

            mustBeTrue(isType(arr, MyArray));
            mustBeTrue(isType(arr, Array));
            mustBeTrue(isType(err, MyError));
            mustBeTrue(isType(err, Error));
            mustBeTrue(isType(map, MyMap));
            mustBeTrue(isType(map, Map));
        });
    });

    group("edge cases", () => {
        test("class alias is identical", () => {
            class MyClass {}
            const instance = new MyClass();

            const OtherClass = MyClass;
            const otherInstance = new OtherClass();

            mustBeTrue(isType(instance, MyClass));
            mustBeTrue(isType(instance, OtherClass));
            mustBeTrue(isType(otherInstance, MyClass));
            mustBeTrue(isType(otherInstance, OtherClass));
        });

        test("Symbol.hasInstance override", () => {
            class AlwaysTrue {
                static [Symbol.hasInstance]() {
                    return true;
                }
            }
            class AlwaysFalse {
                static [Symbol.hasInstance]() {
                    return false;
                }
            }

            // isType uses instanceof which respects Symbol.hasInstance
            mustBeTrue(isType("not an instance", AlwaysTrue));
            mustBeFalse(isType(new AlwaysFalse(), AlwaysFalse));
            mustBeFalse(isType("other", AlwaysFalse));
        });

        group("Proxy objects", () => {
            test("Proxy of object is still object", () => {
                const proxy = new Proxy({}, {});
                mustBeTrue(isType(proxy, "object"));
                mustBeTrue(isType(proxy, Object));
            });

            test("Proxy of function is still function", () => {
                const proxy = new Proxy(() => {}, {});
                mustBeTrue(isType(proxy, "function"));
            });

            test("Proxy of class instance maintains instanceof", () => {
                class MyClass {}
                const proxy = new Proxy(new MyClass(), {});
                mustBeTrue(isType(proxy, MyClass));
            });

            test("Proxy of array is instanceof Array", () => {
                const proxy = new Proxy([1, 2, 3], {});
                mustBeTrue(isType(proxy, Array));
            });
        });

        test("Object.create(null) is typeof object but not instanceof Object", () => {
            const nullProto = Object.create(null);
            mustBeTrue(isType(nullProto, "object"));
            mustBeFalse(isType(nullProto, Object));
            mustBeFalse(isType(nullProto, null));
        });

        test("TypedArrays are NOT instanceof Array", () => {
            mustBeFalse(isType(new Uint8Array(8), Array));
            mustBeTrue(isType(new Int32Array(8), Int32Array));
            mustBeTrue(isType(new Float64Array(8), Float64Array));
            mustBeTrue(isType(new ArrayBuffer(8), ArrayBuffer));
        });

        test("arguments object is object but not Array", () => {
            function getArgs(_1: number, _2: number) {
                // arguments is an array-like object, not an actual array
                return arguments; // contains the function args: [_1, _2]
            }
            const args = getArgs(1, 2);
                mustBeTrue(isType(args, Object));
                mustBeFalse(isType(args, Array));
        });
    });
});