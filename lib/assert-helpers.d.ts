import { AllJSTypes, ResolveAnyJSType } from "./types";
/**
 * Gets the display name of an expected type for error messages.
 * @param {AllJSTypes} expectedType - The expected type value.
 * @returns {string} The normalized name of the expected type.
 */
export declare function getNameOfExpectedType(expectedType: AllJSTypes): string;
/**
 * Gets the runtime type name of an unknown item for error messages.
 * @param {unknown} item - The item whose runtime type name should be determined.
 * @returns {string} The runtime type name of item.
 */
export declare function getTypeNameOfUnknown(item: unknown): string;
/**
 * Checks whether the provided item is of the expectedType.
 * @param {unknown} item - The item to check.
 * @param {AllJSTypes} expectedType - The expected type to check against.
 * @returns {boolean} `true` if item's type matches expectedType.
 */
export declare function isType<T extends AllJSTypes>(item: unknown, expectedType: T): item is ResolveAnyJSType<T>;
