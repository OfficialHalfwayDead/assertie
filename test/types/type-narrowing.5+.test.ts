// Tests for improved type narrowing in TypeScript 5.0+ only
import { assertType, assertTypeOfFunction } from "../../src/index";

{ // assertType narrows union to specific function
    type X = string | ((arg: string) => string);
    const x: X = ((arg: string) => arg) as X;
    // @ts-expect-error
    let _res: string = x("test");
    assertType(x, "function");
    _res = x("test");

    // @ts-expect-error
    x(123);
    // These don't error on TypeScript < 5.0
    // because it only narrows unions to () => {} or (args: any[]) => {}
    // @ts-expect-error
    const _res2: number = x("test");
}

{ // assertTypeOfFunction narrows union to specific function
    type X = string | ((arg: string) => string);
    const x: X = ((arg: string) => arg) as X;
    // @ts-expect-error
    let _res: string = x("test");
    assertTypeOfFunction(x);
    _res = x("test");

    // @ts-expect-error
    x(123);
    // @ts-expect-error
    const _res2: number = x("test");
}