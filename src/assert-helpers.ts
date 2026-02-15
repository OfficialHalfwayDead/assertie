import { AllJSTypes, ResolveAnyJSType, PrimitiveTypeStrings } from "./types";

/**
 * Gets the display name of an expected type for error messages.
 * @param {AllJSTypes} expectedType - The expected type value.
 * @returns {string} The normalized name of the expected type.
 */
export function getNameOfExpectedType(expectedType: AllJSTypes): string {
    if (expectedType === null) return "null";
    if (expectedType === undefined) return "undefined";
    if (typeof expectedType === "string") return expectedType;
    return expectedType.name;
}

/**
 * Gets the runtime type name of an unknown item for error messages.
 * @param {unknown} item - The item whose runtime type name should be determined.
 * @returns {string} The runtime type name of item.
 */
export function getTypeNameOfUnknown(item: unknown): string {
    if (item === null) return "null";
    const type = typeof item;
    switch (type) {
        case "object":
        case "function":
            try {
                const unsafe: any = item; // We are using try catch for the fail cases
                if (unsafe instanceof unsafe.constructor) {
                    return unsafe.constructor.name;
                }
            } catch {
            }
            const typeStr = Object.prototype.toString.call(item);
            return typeStr.slice(8, -1); // "[object Type]" -> "Type"
        default:
            return type;
    }
}

/**
 * Checks whether the provided item is of the expectedType.
 * @param {unknown} item - The item to check.
 * @param {AllJSTypes} expectedType - The expected type to check against.
 * @returns {boolean} `true` if item's type matches expectedType.
 */
export function isType<T extends AllJSTypes>(item: unknown, expectedType: T): item is ResolveAnyJSType<T> {
    if (typeof item === expectedType) return true; // correct primitive type
    // Now, if the expectedType is a PrimitiveTypeString,
    // the item is guaranteed to be of the wrong type since it didn't match the typeof check above
    if (typeof expectedType === "string") return false;
    const expectedUndefNullOrConstructor = expectedType as Exclude<typeof expectedType, PrimitiveTypeStrings>;

    // The type restriction on T guarantees that item is now either undefined, null, or a constructor
    if (item === expectedUndefNullOrConstructor) return true; // correct undefined, null, or constructor of itself
    // i.e. const MyType = Date; isType(Date, Date) && isType(MyType, Date) are both true
    if (expectedUndefNullOrConstructor === null || expectedUndefNullOrConstructor === undefined) return false;
    const expectedConstructor = expectedType as Exclude<typeof expectedUndefNullOrConstructor, null | undefined>;

    // Lastly, check if the item is an instance of the provided constructor
    if (item instanceof expectedConstructor) return true;

    return false;
}
