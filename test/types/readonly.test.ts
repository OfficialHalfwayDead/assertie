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

{ // Preserves function signature readonly array on union after narrowing
    function fn(numbers: readonly number[]): readonly number[] {
        return [...numbers];
    }
    type Fn = typeof fn;
    const union: Fn | string = fn as Fn | string;
    assertType(union, "function");
    const rdonly: readonly number[] = [1, 2];
    const res = union(rdonly);
    // @ts-expect-error
    res[0] = 3;
}
{ // Preserves object readonly properties on union after narrowing
    let obj: { readonly a: string } | string = { a: "test" } as { readonly a: string } | string;
    assertType(obj, "object");
    // @ts-expect-error
    obj.a = "new";
}
{ // Preserves readonly array after narrowing
    const arr: readonly number[] | string = [1, 2] as readonly number[] | string;
    assertType(arr, "object");
    // @ts-expect-error
    arr.push(3);
    // @ts-expect-error
    arr[0] = 4;
}

/* ==================== assertArrayType ==================== */

{ // Preserves readonly when narrowing elements
    const arr: readonly (string | number)[] = ["a", "b"] as readonly (string | number)[];
    // @ts-expect-error
    let _string: string = arr[0];
    assertArrayType(arr, "string");
    // read access ok after narrowing
    _string = arr[0];
    // @ts-expect-error
    arr.push("c");
    // @ts-expect-error
    arr[0] = "d";
}
{ // Preserves mutability when narrowing elements
    const arr: (string | number)[] = ["a", "b"] as (string | number)[];
    assertArrayType(arr, "string");
    arr.push("c");
    arr[0] = "d";
    // @ts-expect-error
    arr.push(1);
}
{ // Narrows readonly unknown[] to readonly T[]
    const arr: readonly unknown[] = ["a", "b"] as readonly unknown[];
    // @ts-expect-error
    let _string: string = arr[0];
    assertArrayType(arr, "string");
    // read access ok after narrowing
    _string = arr[0];
    // @ts-expect-error
    arr.push("c");
    // @ts-expect-error
    arr[0] = "d";
}
{ // Narrows mutable unknown[] to mutable T[]
    const arr: unknown[] = ["a", "b"] as unknown[];
    assertArrayType(arr, "string");
    arr.push("c");
    arr[0] = "d";
}

/* ==================== assertTupleTypes ==================== */

{ // Preserves readonly when narrowing tuple elements
    const tuple: readonly [string | number] = ["a"] as readonly [string | number];
    // @ts-expect-error
    let _string: string = tuple[0];
    assertTupleTypes(tuple, ["string"]);
    // read access ok after narrowing
    _string = tuple[0];
    // @ts-expect-error
    tuple[0] = "b";
}
{ // Preserves mutability when narrowing tuple elements
    const tuple: [string | number] = ["a"] as [string | number];
    assertTupleTypes(tuple, ["string"]);
    tuple[0] = "b";
    // @ts-expect-error
    tuple[0] = 1;
}
{ // Narrows readonly tuple of unknowns
    const tuple: readonly [unknown, unknown] = ["a", 1] as readonly [unknown, unknown];
    // @ts-expect-error
    let number: number = tuple[1];
    assertTupleTypes(tuple, ["string", "number"]);
    // read access ok after narrowing
    number = tuple[1];
    // @ts-expect-error
    tuple[1] = 2;
}
{ // Narrows mutable tuple of unknowns
    const tuple: [unknown, unknown] = ["a", 1] as [unknown, unknown];
    assertTupleTypes(tuple, ["string", "number"]);
    tuple[0] = "b";
    tuple[1] = 2;
}

/* ==================== assertTypeOfFunction ==================== */

{ // Preserves readonly array on union after narrowing
    function fn(numbers: readonly number[]): readonly number[] {
        return [...numbers];
    }
    type Fn = typeof fn;
    const union: Fn | string = fn as Fn | string;
    assertTypeOfFunction(union);
    const rdonly: readonly number[] = [1, 2];
    const res = union(rdonly);
    // @ts-expect-error
    res[0] = 3;
}

/* ==================== assertArrayNonNullable ==================== */

{ // Preserves readonly when removing nulls
    const arr: readonly (string | null)[] = ["a"] as readonly (string | null)[];
    // @ts-expect-error
    let _string: string = arr[0];
    assertArrayNonNullable(arr);
    // read access ok after narrowing
    _string = arr[0];
    // @ts-expect-error
    arr.push("b");
    // @ts-expect-error
    arr[0] = "c";
}
{ // Preserves mutability when removing nulls
    const arr: (string | null)[] = ["a"] as (string | null)[];
    assertArrayNonNullable(arr);
    arr.push("b");
    arr[0] = "c";
}

/* ==================== assertTupleNonNullable ==================== */

{ // Preserves readonly when removing nulls from tuple
    const tuple: readonly [string | null, number | undefined] = ["a", 1] as readonly [string | null, number | undefined];
    // @ts-expect-error
    let _string: string = tuple[0];
    assertTupleNonNullable(tuple);
    // read access ok after narrowing
    _string = tuple[0];
    // @ts-expect-error
    tuple[0] = "b";
}
{ // Preserves mutability when removing nulls from tuple
    const tuple: [string | null, number | undefined] = ["a", 1] as [string | null, number | undefined];
    assertTupleNonNullable(tuple);
    tuple[0] = "b";
    tuple[1] = 2;
}

/* ==================== assertPropsNonNullable ==================== */

{ // Preserves readonly on properties
    const obj: { readonly a?: string; b: number | null } = { a: "test", b: 1 } as { readonly a?: string; b: number  | null};
    // @ts-expect-error
    let _string: string = obj.a;
    assertPropsNonNullable(obj, ["a", "b"]);
    // read access ok after narrowing
    _string = obj.a;
    // @ts-expect-error
    obj.a = "new";
    // other property not readonly
    obj.b = 2;
}

/* ==================== assertIsTuple ==================== */

{ // Preserves readonly on array narrowing to tuple
    const arr: readonly number[] = [1, 2] as readonly number[];
    assertIsTuple(arr, 2);
    // read access ok after narrowing
    arr[0];
    // @ts-expect-error
    arr[2]; // ensure it did actually narrow
    // @ts-expect-error
    arr[0] = 3; // ensure it's still readonly
}
{ // Preserves mutability on array narrowing to tuple
    const arr: number[] = [1, 2] as number[];
    assertIsTuple(arr, 2);
    // @ts-expect-error
    arr[2]; // ensure it did actually narrow
    arr[0] = 3; // ensure it's mutable
}

/* ==================== assertTypeOfObject ==================== */

{ // Preserves readonly properties in union narrowing
    const obj: { readonly x: string; y: number } | string = { x: "a", y: 1 } as { readonly x: string; y: number } | string;
    assertTypeOfObject(obj);
    // @ts-expect-error
    obj.x = "b";
    obj.y = 2;
}

/* ==================== assertNonNullable ==================== */

{ // Preserves readonly on array union
    const arr: readonly number[] | null = [1, 2] as readonly number[] | null;
    // @ts-expect-error
    let _number: number = arr[0];
    assertNonNullable(arr);
    _number = arr[0];
    // @ts-expect-error
    arr.push(3);
    // @ts-expect-error
    arr[0] = 4;
}
{ // Preserves mutability on array union
    const arr: number[] | null = [1, 2] as number[] | null;
    assertNonNullable(arr);
    arr.push(3);
    arr[0] = 4;
}
