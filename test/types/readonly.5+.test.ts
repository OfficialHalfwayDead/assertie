import {
    assertArrayType,
    assertTupleTypes,
    assertArrayNonNullable,
    assertTupleNonNullable,
    assertPropsNonNullable,
    assertIsTuple,
    assertTypeOfObject,
    assertNonNullable,
    assertTypeOfFunction,
    assertType,
} from "../../src/index";

/* ==================== assertType ==================== */

{ // Preserves function signature readonly obj parameters on union after narrowing
    function fn(obj: { readonly a: string }): { readonly b: string, c: string } {
        return { b: obj.a, c: obj.a };
    }
    type Fn = typeof fn;
    const union: Fn | string = fn as Fn | string;
    assertType(union, "function");
    const rdonly: { readonly a: string } = { a: "test" };
    const res = union(rdonly);
    // @ts-expect-error
    res.b = "new";
    res.c = "new";
}

/* ==================== assertTypeOfFunction ==================== */

{ // Preserves readonly obj parameters on union after narrowing
    function fn(obj: { readonly a: string }): { readonly b: string, c: string } {
        return { b: obj.a, c: obj.a };
    }
    type Fn = typeof fn;
    const union: Fn | string = fn as Fn | string;
    assertTypeOfFunction(union);
    const rdonly: { readonly a: string } = { a: "test" };
    const res = union(rdonly);
    // @ts-expect-error
    res.b = "new";
    res.c = "new";
}