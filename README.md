# assertie

Debug assertions for TypeScript, auto tree-shaken by vite for production.

Why? Because asserts are simple to read and safer than casting. As programmers, we sometimes make wrong assumptions. Use them when you know something is guaranteed to be true, and assertie will make sure it actually is in dev builds.

```ts
import { assertInstanceOf } from "assertie";
...

const original = document.getElementById("probably-mounted");

// If the element isn’t found, we exit here.
// Asserts are not meant for validating uncertain values.
if (original === null) return;

// cloneNode returns type Node, but we know it will always
// be an HTMLElement, because `original` was one.
const clone = original.cloneNode(true);
assertInstanceOf(clone, HTMLElement);
// Unlike casting, the assert will throw if you were mistaken,
// or if someone accidentally changed const original = document;
clone.innerText = "No `as` cast needed! 0 overhead in production.";
```

## Installation

```bash
npm i -D assertie
```

If you're getting errors when using the package, it's likely because your TypeScript targets are too low:

```json
// tsconfig.json
{
    "compilerOptions": {
        "target": "ES6", // minimum
        "module": "ES2020", // minimum
        "types": ["vite/client"] // may be needed depending on your setup
    }
}
```

By default, vite will tree-shake the functions for production, but make sure you haven't specifically disabled it in your vite config:

```ts
// vite.config.ts
const config: UserConfig = {
    build: {
        rollupOptions: {
            treeshake: true,
        },
    },
};
```

## Usage

### Basic assert

```ts
import { assert } from "assertie";

const a = "yup";
assert(a === "yup", "optional text if assertion fails");

// You get type narrowing from assertie's assertions
const x: boolean = true;
assert(x);
const y: true = x; // no error
```

### Type assertion

```ts
import { assertType } from "assertie";

// assertType can take null, undefined, a class/constructable 
// or a primitive JS type string (e.g., "number")
assertType(1, "number");
assertType(() => {}, "function");
assertType(undefined, "undefined");
assertType(undefined, undefined);
assertType(null, null);
assertType(new Date(), Date);

// Use type assertions to replace all your type casts
const value: unknown = "yup";
const bad: string = value as string;
assertType(value, "string");
const good: string = value; // no `as` needed
```

You don't need to use strings to narrow primitives. There are specific functions for specific types if you prefer that.

```ts
assertTypeOfString("yup");
assertTypeOfNumber(123);
assertTypeOfBoolean(true);
assertTypeOfBigint(123n);
assertTypeOfUndefined(undefined);
assertNull(null); // different because typeof null === "object"
assertTypeOfFunction(() => {});
assertTypeOfObject({});
assertTypeOfSymbol(Symbol("yup"));
assertInstanceOf(new Date(), Date);
```

### Asserting non-null

Sometimes you'll find yourself in a situation where you know from the calling context that a hoisted variable is not `null` or `undefined`, but TypeScript doesn't.

```ts
let hoisted: string | null | undefined = null;

const f =  () => {
    assertNonNullable(hoisted);
    // vs.
    if (hoisted === null || hoisted === undefined) {
        return;
    }

    console.log(hoisted.toUpperCase());
};

hoisted = "yup";
f();
```

There are multiple ways in which an assert is better in this specific case:

1. Making the code intention clear. `f` was never meant to only run its body some of the time. It is always supposed to work. But the if statement was required to make the compiler happy.
2. The assert will throw an error in dev if the case that should never happen does happen. Without the assert, any potential behavior change due to `hoisted` not being set is more likely to go unnoticed.
3. It's a little shorter, mainly if you have to check null and undefined and maybe have prettier rules for { brackets } on if statements.
4. The assert will be removed in production, so there's no overhead. If that makes you uncomfortable, you can just can still put the if statement below the assert and reap the benefits of the first two points.

```ts
// Sometimes not your entire object is null
const obj: {
    a?: string,
    b: string,
    c: number | null
} = {
    a: "yeah",
    b: "yup",
    c: 123,
};
// Pass an array of all keys to check
assertPropsNonNullable(obj, ["a", "c"]);
const safeObj = obj;
// typeof safeObj === { a: string, b: string, c: number }
```

The reason an array is needed here is because undefined properties may not be present in `Object.keys`, so the caller needs to provide all keys to check. Don't worry about the safety, though. If you forget to pass a key, its type will remain nullable after the assert and TypeScript will not consider it safe to access.

### Asserting unreachable code

The unreachable assertion will

1. ensure switch/if statements are exhaustive at compile time.
2. throw an error at runtime if TypeScript types are inaccurate.

```ts
const x: "a" | "b" = "a";

switch (x) {
    case "a":
        break;
    case "b":
        break;
    default:
        assertUnreachable(x);
}
```

If you were to extend `x`'s type to include `"c"`, TypeScript would not compile anymore because `assertUnreachable` only accepts values of type `never`, but the type in the default case would be `"c"`.

### Other utils

For now, there is only one:

```ts
assertFiniteNumber(123);
// Ensures passed value is typeof number and isFinite(num)
// DO NOT USE FOR INPUT VALIDATION OF USER PROVIDED VALUES!
```

Can prevent `NaN` propagation and accidental infinities in calculations. Also useful for string-to-number conversions when you expect **valid** number strings:

```ts
const str = "CustomObject123";
const numStr = str.substring(11); // oops "t123"
const num = Number(numStr); // NaN
assertFiniteNumber(num); // throws
arr[num] = "yup" // disaster averted
```
